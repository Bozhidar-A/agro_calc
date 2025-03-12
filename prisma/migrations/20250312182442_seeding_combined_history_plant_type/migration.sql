/*
  Warnings:

  - Added the required column `plantType` to the `SeedingDataCombinationHistoryPlantData` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "SeedingDataCombinationHistoryPlantData" ADD COLUMN     "plantType" TEXT NOT NULL;
