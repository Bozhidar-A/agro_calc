-- CreateTable
CREATE TABLE "ResetPassword" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "token" TEXT NOT NULL,

    CONSTRAINT "ResetPassword_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "ResetPassword_token_key" ON "ResetPassword"("token");
