/*
  Warnings:

  - Added the required column `userInfo` to the `RefreshToken` table without a default value. This is not possible if the table is not empty.

*/
-- DropIndex
DROP INDEX "RefreshToken_userId_key";

-- AlterTable
ALTER TABLE "RefreshToken" ADD COLUMN     "userInfo" TEXT NOT NULL;
