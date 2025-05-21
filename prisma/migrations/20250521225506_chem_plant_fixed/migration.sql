/*
  Warnings:

  - You are about to drop the column `pricePerDa` on the `SeedingDataCombinationHistoryPlantData` table. All the data in the column will be lost.
  - Added the required column `pricePerAcreBGN` to the `SeedingDataCombinationHistoryPlantData` table without a default value. This is not possible if the table is not empty.
  - Added the required column `totalArea` to the `SowingRateHistory` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "ChemicalType" AS ENUM ('HERBICIDE', 'INSECTICIDE', 'FUNGICIDE');

-- CreateEnum
CREATE TYPE "ChemicalApplicationStage" AS ENUM ('PRE_EMERGENT', 'PRE_EMERGENT_AFTER_SOWING_BEFORE_EMERGENCE', 'PRE_EMERGENT_BEFORE_START_OF_GROWING_SEASON', 'PRE_EMERGENT_PRE_SOWING_SEEDS_TREATMENT', 'PRE_EMERGENT_DURING_SOWING', 'POST_EMERGENT');

-- AlterTable
ALTER TABLE "SeedingDataCombinationHistoryPlantData" DROP COLUMN "pricePerDa",
ADD COLUMN     "pricePerAcreBGN" DOUBLE PRECISION NOT NULL;

-- AlterTable
ALTER TABLE "SowingRateHistory" ADD COLUMN     "totalArea" DOUBLE PRECISION NOT NULL;

-- CreateTable
CREATE TABLE "Chemical" (
    "id" TEXT NOT NULL,
    "nameKey" TEXT NOT NULL,
    "type" "ChemicalType" NOT NULL,
    "applicationStage" "ChemicalApplicationStage" NOT NULL,
    "dosage" DOUBLE PRECISION NOT NULL,
    "dosageUnit" TEXT NOT NULL,
    "maxApplications" DOUBLE PRECISION NOT NULL,
    "minIntervalBetweenApplicationsDays" DOUBLE PRECISION NOT NULL,
    "maxIntervalBetweenApplicationsDays" DOUBLE PRECISION NOT NULL,
    "quarantinePeriodDays" DOUBLE PRECISION NOT NULL,
    "pricePer1LiterBGN" DOUBLE PRECISION NOT NULL,
    "pricePerAcreBGN" DOUBLE PRECISION NOT NULL,
    "additionalInfo" TEXT NOT NULL,
    "additionalInfoNotes" TEXT NOT NULL,

    CONSTRAINT "Chemical_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PlantChemical" (
    "id" TEXT NOT NULL,
    "plantId" TEXT NOT NULL,
    "chemicalId" TEXT NOT NULL,

    CONSTRAINT "PlantChemical_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ActiveIngredient" (
    "id" TEXT NOT NULL,
    "nameKey" TEXT NOT NULL,
    "unit" TEXT NOT NULL,

    CONSTRAINT "ActiveIngredient_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ChemicalActiveIngredient" (
    "id" TEXT NOT NULL,
    "chemicalId" TEXT NOT NULL,
    "activeIngredientId" TEXT NOT NULL,
    "quantity" DOUBLE PRECISION NOT NULL,

    CONSTRAINT "ChemicalActiveIngredient_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ChemicalTargetEnemy" (
    "id" TEXT NOT NULL,
    "chemicalId" TEXT NOT NULL,
    "latinName" TEXT NOT NULL,

    CONSTRAINT "ChemicalTargetEnemy_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Chemical_nameKey_key" ON "Chemical"("nameKey");

-- CreateIndex
CREATE UNIQUE INDEX "PlantChemical_plantId_chemicalId_key" ON "PlantChemical"("plantId", "chemicalId");

-- CreateIndex
CREATE UNIQUE INDEX "ActiveIngredient_nameKey_key" ON "ActiveIngredient"("nameKey");

-- CreateIndex
CREATE UNIQUE INDEX "ChemicalActiveIngredient_chemicalId_activeIngredientId_key" ON "ChemicalActiveIngredient"("chemicalId", "activeIngredientId");

-- CreateIndex
CREATE UNIQUE INDEX "ChemicalTargetEnemy_chemicalId_latinName_key" ON "ChemicalTargetEnemy"("chemicalId", "latinName");

-- AddForeignKey
ALTER TABLE "PlantChemical" ADD CONSTRAINT "PlantChemical_plantId_fkey" FOREIGN KEY ("plantId") REFERENCES "Plant"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PlantChemical" ADD CONSTRAINT "PlantChemical_chemicalId_fkey" FOREIGN KEY ("chemicalId") REFERENCES "Chemical"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ChemicalActiveIngredient" ADD CONSTRAINT "ChemicalActiveIngredient_chemicalId_fkey" FOREIGN KEY ("chemicalId") REFERENCES "Chemical"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ChemicalActiveIngredient" ADD CONSTRAINT "ChemicalActiveIngredient_activeIngredientId_fkey" FOREIGN KEY ("activeIngredientId") REFERENCES "ActiveIngredient"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ChemicalTargetEnemy" ADD CONSTRAINT "ChemicalTargetEnemy_chemicalId_fkey" FOREIGN KEY ("chemicalId") REFERENCES "Chemical"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
