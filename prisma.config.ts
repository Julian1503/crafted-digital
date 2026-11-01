import { defineConfig } from "prisma/config";
import { config } from "dotenv";

// Same precedence as Next.js: .env.local (local Docker database) wins over
// .env, so Prisma CLI commands never hit production by accident.
config({ path: [".env.local", ".env"], quiet: true });

export default defineConfig({
  schema: "prisma/schema.prisma",
  migrations: {
    path: "prisma/migrations",
    seed: "tsx src/lib/db/seed.ts",
  },
  datasource: {
    url: process.env.DATABASE_URL!,
  },
});
