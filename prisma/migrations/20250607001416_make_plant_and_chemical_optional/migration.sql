-- DropForeignKey
ALTER TABLE "ChemProtWorkingSolutionHistory" DROP CONSTRAINT "ChemProtWorkingSolutionHistory_chemicalId_fkey";

-- DropForeignKey
ALTER TABLE "ChemProtWorkingSolutionHistory" DROP CONSTRAINT "ChemProtWorkingSolutionHistory_plantId_fkey";

-- AlterTable
ALTER TABLE "ChemProtWorkingSolutionHistory" ALTER COLUMN "chemicalId" DROP NOT NULL,
ALTER COLUMN "plantId" DROP NOT NULL;

-- AddForeignKey
ALTER TABLE "ChemProtWorkingSolutionHistory" ADD CONSTRAINT "ChemProtWorkingSolutionHistory_plantId_fkey" FOREIGN KEY ("plantId") REFERENCES "Plant"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ChemProtWorkingSolutionHistory" ADD CONSTRAINT "ChemProtWorkingSolutionHistory_chemicalId_fkey" FOREIGN KEY ("chemicalId") REFERENCES "Chemical"("id") ON DELETE SET NULL ON UPDATE CASCADE;
