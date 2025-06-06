-- CreateTable
CREATE TABLE "ChemProtWorkingSolutionHistory" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "totalChemicalForAreaLiters" DOUBLE PRECISION NOT NULL,
    "totalWorkingSolutionForAreaLiters" DOUBLE PRECISION NOT NULL,
    "roughSprayerCount" DOUBLE PRECISION NOT NULL,
    "chemicalPerSprayerML" DOUBLE PRECISION NOT NULL,
    "isDataValid" BOOLEAN NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ChemProtWorkingSolutionHistory_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "ChemProtWorkingSolutionHistory" ADD CONSTRAINT "ChemProtWorkingSolutionHistory_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
