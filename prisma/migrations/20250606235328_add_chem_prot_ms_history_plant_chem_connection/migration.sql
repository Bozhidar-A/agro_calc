/*
  Warnings:

  - Added the required column `chemicalId` to the `ChemProtWorkingSolutionHistory` table without a default value. This is not possible if the table is not empty.
  - Added the required column `plantId` to the `ChemProtWorkingSolutionHistory` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "ChemProtWorkingSolutionHistory" ADD COLUMN     "chemicalId" TEXT NOT NULL,
ADD COLUMN     "plantId" TEXT NOT NULL;

-- AddForeignKey
ALTER TABLE "ChemProtWorkingSolutionHistory" ADD CONSTRAINT "ChemProtWorkingSolutionHistory_plantId_fkey" FOREIGN KEY ("plantId") REFERENCES "Plant"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ChemProtWorkingSolutionHistory" ADD CONSTRAINT "ChemProtWorkingSolutionHistory_chemicalId_fkey" FOREIGN KEY ("chemicalId") REFERENCES "Chemical"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
