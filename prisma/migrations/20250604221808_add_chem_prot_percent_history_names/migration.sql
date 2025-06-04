/*
  Warnings:

  - You are about to drop the `ChemicalTargetEnemy` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "ChemicalTargetEnemy" DROP CONSTRAINT "ChemicalTargetEnemy_chemicalId_fkey";

-- DropTable
DROP TABLE "ChemicalTargetEnemy";

-- CreateTable
CREATE TABLE "Enemy" (
    "id" TEXT NOT NULL,
    "latinName" TEXT NOT NULL,

    CONSTRAINT "Enemy_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ChemicalToEnemy" (
    "id" TEXT NOT NULL,
    "chemicalId" TEXT NOT NULL,
    "enemyId" TEXT NOT NULL,

    CONSTRAINT "ChemicalToEnemy_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ChemProtPercentHistory" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "desiredPercentage" DOUBLE PRECISION NOT NULL,
    "sprayerVolume" DOUBLE PRECISION NOT NULL,
    "calculatedAmount" DOUBLE PRECISION NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ChemProtPercentHistory_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Enemy_latinName_key" ON "Enemy"("latinName");

-- CreateIndex
CREATE UNIQUE INDEX "ChemicalToEnemy_chemicalId_enemyId_key" ON "ChemicalToEnemy"("chemicalId", "enemyId");

-- AddForeignKey
ALTER TABLE "ChemicalToEnemy" ADD CONSTRAINT "ChemicalToEnemy_chemicalId_fkey" FOREIGN KEY ("chemicalId") REFERENCES "Chemical"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ChemicalToEnemy" ADD CONSTRAINT "ChemicalToEnemy_enemyId_fkey" FOREIGN KEY ("enemyId") REFERENCES "Enemy"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ChemProtPercentHistory" ADD CONSTRAINT "ChemProtPercentHistory_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
