/*
  Warnings:

  - Made the column `contentList` on table `Material` required. This step will fail if there are existing NULL values in that column.

*/
-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Material" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    "contentList" TEXT NOT NULL,
    "imageList" TEXT
);
INSERT INTO "new_Material" ("contentList", "createdAt", "id", "imageList", "updatedAt") SELECT "contentList", "createdAt", "id", "imageList", "updatedAt" FROM "Material";
DROP TABLE "Material";
ALTER TABLE "new_Material" RENAME TO "Material";
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
