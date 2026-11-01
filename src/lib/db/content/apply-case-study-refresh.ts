/**
 * Applies CASE_STUDY_REFRESH to an existing database.
 *
 *   npx tsx src/lib/db/content/apply-case-study-refresh.ts            # dry run, prints the diff
 *   npx tsx src/lib/db/content/apply-case-study-refresh.ts --apply    # writes
 *
 * Uses .env.local before .env (the local Docker database in development).
 * Refuses a non-local database unless ALLOW_PROD_CONTENT=1 is set.
 */
import { config } from "dotenv";
config({ path: [".env.local", ".env"], quiet: true });

import { PrismaClient } from "@/generated/prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import { applyCaseStudyRefresh, CASE_STUDY_REFRESH } from "@/lib/db/content/case-study-refresh";

const apply = process.argv.includes("--apply");
const url = process.env.DATABASE_URL ?? "";
const host = (() => { try { return new URL(url).hostname; } catch { return ""; } })();
const isLocal = ["localhost", "127.0.0.1", "::1"].includes(host);

if (!isLocal && process.env.ALLOW_PROD_CONTENT !== "1") {
    console.error(`Refusing to touch ${host || "an unknown host"}. Set ALLOW_PROD_CONTENT=1 to update a non-local database.`);
    process.exit(1);
}

const prisma = new PrismaClient({ adapter: new PrismaPg({ connectionString: url }) });

async function main() {
    console.log(`${apply ? "APPLY" : "DRY RUN"} against ${host}`);
    const rows = await prisma.caseStudy.findMany({
        where: { slug: { in: Object.keys(CASE_STUDY_REFRESH) } },
        select: { id: true, slug: true, title: true, summary: true, coverImage: true, body: true, status: true, publishedAt: true },
    });

    for (const row of rows) {
        const next = applyCaseStudyRefresh(row);
        const changed = (["title", "summary", "coverImage", "status", "body"] as const).filter((k) => next[k] !== row[k]);
        console.log(`- ${row.slug}: ${changed.length ? changed.join(", ") : "no change"}`);
        if (next.title !== row.title) console.log(`    title: "${row.title}" -> "${next.title}"`);
        if (next.status !== row.status) console.log(`    status: ${row.status} -> ${next.status}`);
        if (!apply || !changed.length) continue;
        await prisma.caseStudy.update({
            where: { id: row.id },
            data: {
                title: next.title,
                summary: next.summary,
                coverImage: next.coverImage,
                status: next.status,
                body: next.body,
                ...(next.status === "published" && !row.publishedAt ? { publishedAt: new Date() } : {}),
            },
        });
    }
    const missing = Object.keys(CASE_STUDY_REFRESH).filter((s) => !rows.some((r) => r.slug === s));
    if (missing.length) console.log(`not in this database: ${missing.join(", ")}`);
}

main()
    .catch((e: unknown) => { console.error(e); process.exitCode = 1; })
    .finally(() => prisma.$disconnect());
