/*
  Warnings:

  - Added the required column `plantType` to the `SeedingDataCombination` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "SeedingDataCombination" ADD COLUMN     "plantType" TEXT NOT NULL;
