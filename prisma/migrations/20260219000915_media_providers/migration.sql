-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_MediaAsset" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "url" TEXT NOT NULL,
    "filename" TEXT NOT NULL,
    "mimeType" TEXT NOT NULL,
    "size" INTEGER NOT NULL DEFAULT 0,
    "width" INTEGER,
    "height" INTEGER,
    "alt" TEXT,
    "title" TEXT,
    "tags" TEXT,
    "folder" TEXT NOT NULL DEFAULT 'general',
    "provider" TEXT NOT NULL DEFAULT 'cloudinary',
    "providerFileId" TEXT,
    "providerPath" TEXT,
    "thumbnailUrl" TEXT,
    "createdBy" TEXT,
    "deleted" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "MediaAsset_createdBy_fkey" FOREIGN KEY ("createdBy") REFERENCES "User" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);
INSERT INTO "new_MediaAsset" ("alt", "createdAt", "createdBy", "deleted", "filename", "folder", "height", "id", "mimeType", "size", "tags", "title", "updatedAt", "url", "width") SELECT "alt", "createdAt", "createdBy", "deleted", "filename", "folder", "height", "id", "mimeType", "size", "tags", "title", "updatedAt", "url", "width" FROM "MediaAsset";
DROP TABLE "MediaAsset";
ALTER TABLE "new_MediaAsset" RENAME TO "MediaAsset";
CREATE INDEX "MediaAsset_folder_idx" ON "MediaAsset"("folder");
CREATE INDEX "MediaAsset_mimeType_idx" ON "MediaAsset"("mimeType");
CREATE INDEX "MediaAsset_provider_idx" ON "MediaAsset"("provider");
CREATE INDEX "MediaAsset_providerFileId_idx" ON "MediaAsset"("providerFileId");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
