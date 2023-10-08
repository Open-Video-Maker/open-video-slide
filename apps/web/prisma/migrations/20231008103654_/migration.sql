-- CreateTable
CREATE TABLE "Material" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    "content" TEXT NOT NULL,
    "imageList" TEXT,
    "audioId" TEXT,
    CONSTRAINT "Material_audioId_fkey" FOREIGN KEY ("audioId") REFERENCES "Audio" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Audio" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    "url" TEXT NOT NULL,
    "detail" TEXT NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "Material_audioId_key" ON "Material"("audioId");
