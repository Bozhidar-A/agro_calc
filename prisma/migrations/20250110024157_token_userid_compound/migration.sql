/*
  Warnings:

  - A unique constraint covering the columns `[token,userId]` on the table `RefreshToken` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "RefreshToken_token_userId_key" ON "RefreshToken"("token", "userId");
