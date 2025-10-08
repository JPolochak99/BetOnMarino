/*
  Warnings:

  - Added the required column `score` to the `UserResponse` table without a default value. This is not possible if the table is not empty.

*/
-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_UserResponse" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "name" TEXT NOT NULL,
    "answers" JSONB NOT NULL,
    "score" INTEGER NOT NULL,
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);
INSERT INTO "new_UserResponse" ("answers", "created_at", "id", "name") SELECT "answers", "created_at", "id", "name" FROM "UserResponse";
DROP TABLE "UserResponse";
ALTER TABLE "new_UserResponse" RENAME TO "UserResponse";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
