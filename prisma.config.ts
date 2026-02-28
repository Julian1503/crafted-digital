import path from "node:path";
import { defineConfig } from "prisma/config";

export default defineConfig({
  schema: "prisma/schema.prisma",
  migrations: {
    path: "prisma/migrations",
    seed: "tsx src/lib/db/seed.ts",
  },
  datasource: {
    url: `file:${path.join(__dirname, "dev.db")}`,
  },
});
