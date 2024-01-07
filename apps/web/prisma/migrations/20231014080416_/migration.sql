/*
  Warnings:

  - You are about to drop the column `audioId` on the `Material` table. All the data in the column will be lost.

*/
-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Material" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    "content" TEXT NOT NULL,
    "imageList" TEXT
);
INSERT INTO "new_Material" ("content", "createdAt", "id", "imageList", "updatedAt") SELECT "content", "createdAt", "id", "imageList", "updatedAt" FROM "Material";
DROP TABLE "Material";
ALTER TABLE "new_Material" RENAME TO "Material";
CREATE TABLE "new_Audio" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    "url" TEXT NOT NULL,
    "detail" TEXT NOT NULL,
    "materialId" TEXT,
    CONSTRAINT "Audio_materialId_fkey" FOREIGN KEY ("materialId") REFERENCES "Material" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);
INSERT INTO "new_Audio" ("createdAt", "detail", "id", "updatedAt", "url") SELECT "createdAt", "detail", "id", "updatedAt", "url" FROM "Audio";
DROP TABLE "Audio";
ALTER TABLE "new_Audio" RENAME TO "Audio";
CREATE UNIQUE INDEX "Audio_materialId_key" ON "Audio"("materialId");
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
