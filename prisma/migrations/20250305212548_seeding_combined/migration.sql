-- CreateTable
CREATE TABLE "Plant" (
    "id" TEXT NOT NULL,
    "latinName" TEXT NOT NULL,

    CONSTRAINT "Plant_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SeedingDataCombination" (
    "id" TEXT NOT NULL,
    "plantId" TEXT NOT NULL,
    "minSeedingRate" DOUBLE PRECISION NOT NULL,
    "maxSeedingRate" DOUBLE PRECISION NOT NULL,
    "priceFor1kgSeedsBGN" DOUBLE PRECISION NOT NULL,

    CONSTRAINT "SeedingDataCombination_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Plant_latinName_key" ON "Plant"("latinName");

-- CreateIndex
CREATE UNIQUE INDEX "SeedingDataCombination_plantId_key" ON "SeedingDataCombination"("plantId");

-- AddForeignKey
ALTER TABLE "SeedingDataCombination" ADD CONSTRAINT "SeedingDataCombination_plantId_fkey" FOREIGN KEY ("plantId") REFERENCES "Plant"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
