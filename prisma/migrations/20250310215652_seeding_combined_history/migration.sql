-- CreateTable
CREATE TABLE "SeedingDataCombinationHistory" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "totalPrice" DOUBLE PRECISION NOT NULL,
    "isDataValid" BOOLEAN NOT NULL,

    CONSTRAINT "SeedingDataCombinationHistory_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SeedingDataCombinationHistoryPlantData" (
    "id" TEXT NOT NULL,
    "plantId" TEXT NOT NULL,
    "seedingRate" DOUBLE PRECISION NOT NULL,
    "participation" DOUBLE PRECISION NOT NULL,
    "combinedRate" DOUBLE PRECISION NOT NULL,
    "pricePerDa" DOUBLE PRECISION NOT NULL,
    "seedingDataCombinationHistoryId" TEXT,

    CONSTRAINT "SeedingDataCombinationHistoryPlantData_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "SeedingDataCombinationHistory" ADD CONSTRAINT "SeedingDataCombinationHistory_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SeedingDataCombinationHistoryPlantData" ADD CONSTRAINT "SeedingDataCombinationHistoryPlantData_plantId_fkey" FOREIGN KEY ("plantId") REFERENCES "Plant"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SeedingDataCombinationHistoryPlantData" ADD CONSTRAINT "SeedingDataCombinationHistoryPlantData_seedingDataCombinat_fkey" FOREIGN KEY ("seedingDataCombinationHistoryId") REFERENCES "SeedingDataCombinationHistory"("id") ON DELETE SET NULL ON UPDATE CASCADE;
