-- CreateTable
CREATE TABLE "SowingRateHistory" (
    "id" TEXT NOT NULL,
    "plantId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "sowingRateSafeSeedsPerMeterSquared" DOUBLE PRECISION NOT NULL,
    "sowingRatePlantsPerDecare" DOUBLE PRECISION NOT NULL,
    "usedSeedsKgPerDecare" DOUBLE PRECISION NOT NULL,
    "internalRowHeightCm" DOUBLE PRECISION NOT NULL,
    "isDataValid" BOOLEAN NOT NULL,

    CONSTRAINT "SowingRateHistory_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "SowingRateHistory" ADD CONSTRAINT "SowingRateHistory_plantId_fkey" FOREIGN KEY ("plantId") REFERENCES "Plant"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SowingRateHistory" ADD CONSTRAINT "SowingRateHistory_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
