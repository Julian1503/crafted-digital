/**
 * Creates case studies that are missing from a database. Existing rows are
 * never touched, so edits made in the admin always win.
 *
 *   npx tsx src/lib/db/content/add-case-studies.ts            # dry run, lists what would be created
 *   npx tsx src/lib/db/content/add-case-studies.ts --apply    # writes
 *
 * Uses .env.local before .env (the local Docker database in development).
 * Refuses a non-local database unless ALLOW_PROD_CONTENT=1 is set.
 */
import { config } from "dotenv";
config({ path: [".env.local", ".env"], quiet: true });

import { PrismaClient } from "@/generated/prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import { SUPPORTLEGEND_CASE_STUDY } from "@/lib/db/content/supportlegend-case-study";

const NEW_CASE_STUDIES = [SUPPORTLEGEND_CASE_STUDY];

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
    const existing = await prisma.caseStudy.findMany({
        where: { slug: { in: NEW_CASE_STUDIES.map((c) => c.slug) } },
        select: { slug: true },
    });
    const have = new Set(existing.map((r) => r.slug));

    for (const item of NEW_CASE_STUDIES) {
        if (have.has(item.slug)) {
            console.log(`- ${item.slug}: already exists, left as is`);
            continue;
        }
        // The author must exist in this database; otherwise create without one.
        const author = item.authorId ? await prisma.user.findUnique({ where: { id: item.authorId }, select: { id: true } }) : null;
        console.log(`- ${item.slug}: ${apply ? "creating" : "would create"} "${item.title}"${author ? "" : " (no author)"}`);
        if (!apply) continue;
        await prisma.caseStudy.create({ data: { ...item, authorId: author?.id ?? null } });
    }
}

main()
    .catch((e: unknown) => { console.error(e); process.exitCode = 1; })
    .finally(() => prisma.$disconnect());
