/*
  Warnings:

  - You are about to drop the column `content` on the `Material` table. All the data in the column will be lost.

*/
-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Material" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    "contentList" TEXT,
    "imageList" TEXT
);
INSERT INTO "new_Material" ("createdAt", "id", "imageList", "updatedAt") SELECT "createdAt", "id", "imageList", "updatedAt" FROM "Material";
DROP TABLE "Material";
ALTER TABLE "new_Material" RENAME TO "Material";
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
