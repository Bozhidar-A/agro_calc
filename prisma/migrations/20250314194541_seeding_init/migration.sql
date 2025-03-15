-- CreateTable
CREATE TABLE "SowingRatePlant" (
    "id" TEXT NOT NULL,
    "plantId" TEXT NOT NULL,

    CONSTRAINT "SowingRatePlant_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SowingRateCoefficientSecurity" (
    "id" TEXT NOT NULL,
    "type" TEXT NOT NULL DEFAULT 'slider',
    "unit" TEXT NOT NULL,
    "step" DOUBLE PRECISION,
    "minSliderVal" DOUBLE PRECISION,
    "maxSliderVal" DOUBLE PRECISION,
    "constValue" DOUBLE PRECISION,
    "sowingPlantId" TEXT NOT NULL,

    CONSTRAINT "SowingRateCoefficientSecurity_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SowingRateWantedPlantsPerMeterSquared" (
    "id" TEXT NOT NULL,
    "type" TEXT NOT NULL DEFAULT 'slider',
    "unit" TEXT NOT NULL,
    "step" DOUBLE PRECISION,
    "minSliderVal" DOUBLE PRECISION,
    "maxSliderVal" DOUBLE PRECISION,
    "constValue" DOUBLE PRECISION,
    "sowingPlantId" TEXT NOT NULL,

    CONSTRAINT "SowingRateWantedPlantsPerMeterSquared_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SowingRateMassPer1000g" (
    "id" TEXT NOT NULL,
    "type" TEXT NOT NULL DEFAULT 'slider',
    "unit" TEXT NOT NULL,
    "step" DOUBLE PRECISION,
    "minSliderVal" DOUBLE PRECISION,
    "maxSliderVal" DOUBLE PRECISION,
    "constValue" DOUBLE PRECISION,
    "sowingPlantId" TEXT NOT NULL,

    CONSTRAINT "SowingRateMassPer1000g_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SowingRatePurity" (
    "id" TEXT NOT NULL,
    "type" TEXT NOT NULL DEFAULT 'slider',
    "unit" TEXT NOT NULL,
    "step" DOUBLE PRECISION,
    "minSliderVal" DOUBLE PRECISION,
    "maxSliderVal" DOUBLE PRECISION,
    "constValue" DOUBLE PRECISION,
    "sowingPlantId" TEXT NOT NULL,

    CONSTRAINT "SowingRatePurity_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SowingRateGermination" (
    "id" TEXT NOT NULL,
    "type" TEXT NOT NULL DEFAULT 'slider',
    "unit" TEXT NOT NULL,
    "step" DOUBLE PRECISION,
    "minSliderVal" DOUBLE PRECISION,
    "maxSliderVal" DOUBLE PRECISION,
    "constValue" DOUBLE PRECISION,
    "sowingPlantId" TEXT NOT NULL,

    CONSTRAINT "SowingRateGermination_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SowingRateRowSpacingCm" (
    "id" TEXT NOT NULL,
    "type" TEXT NOT NULL DEFAULT 'slider',
    "unit" TEXT NOT NULL,
    "step" DOUBLE PRECISION,
    "minSliderVal" DOUBLE PRECISION,
    "maxSliderVal" DOUBLE PRECISION,
    "constValue" DOUBLE PRECISION,
    "sowingPlantId" TEXT NOT NULL,

    CONSTRAINT "SowingRateRowSpacingCm_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "SowingRatePlant_plantId_key" ON "SowingRatePlant"("plantId");

-- CreateIndex
CREATE UNIQUE INDEX "SowingRateCoefficientSecurity_sowingPlantId_key" ON "SowingRateCoefficientSecurity"("sowingPlantId");

-- CreateIndex
CREATE UNIQUE INDEX "SowingRateWantedPlantsPerMeterSquared_sowingPlantId_key" ON "SowingRateWantedPlantsPerMeterSquared"("sowingPlantId");

-- CreateIndex
CREATE UNIQUE INDEX "SowingRateMassPer1000g_sowingPlantId_key" ON "SowingRateMassPer1000g"("sowingPlantId");

-- CreateIndex
CREATE UNIQUE INDEX "SowingRatePurity_sowingPlantId_key" ON "SowingRatePurity"("sowingPlantId");

-- CreateIndex
CREATE UNIQUE INDEX "SowingRateGermination_sowingPlantId_key" ON "SowingRateGermination"("sowingPlantId");

-- CreateIndex
CREATE UNIQUE INDEX "SowingRateRowSpacingCm_sowingPlantId_key" ON "SowingRateRowSpacingCm"("sowingPlantId");

-- AddForeignKey
ALTER TABLE "SowingRatePlant" ADD CONSTRAINT "SowingRatePlant_plantId_fkey" FOREIGN KEY ("plantId") REFERENCES "Plant"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SowingRateCoefficientSecurity" ADD CONSTRAINT "SowingRateCoefficientSecurity_sowingPlantId_fkey" FOREIGN KEY ("sowingPlantId") REFERENCES "SowingRatePlant"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SowingRateWantedPlantsPerMeterSquared" ADD CONSTRAINT "SowingRateWantedPlantsPerMeterSquared_sowingPlantId_fkey" FOREIGN KEY ("sowingPlantId") REFERENCES "SowingRatePlant"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SowingRateMassPer1000g" ADD CONSTRAINT "SowingRateMassPer1000g_sowingPlantId_fkey" FOREIGN KEY ("sowingPlantId") REFERENCES "SowingRatePlant"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SowingRatePurity" ADD CONSTRAINT "SowingRatePurity_sowingPlantId_fkey" FOREIGN KEY ("sowingPlantId") REFERENCES "SowingRatePlant"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SowingRateGermination" ADD CONSTRAINT "SowingRateGermination_sowingPlantId_fkey" FOREIGN KEY ("sowingPlantId") REFERENCES "SowingRatePlant"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SowingRateRowSpacingCm" ADD CONSTRAINT "SowingRateRowSpacingCm_sowingPlantId_fkey" FOREIGN KEY ("sowingPlantId") REFERENCES "SowingRatePlant"("id") ON DELETE CASCADE ON UPDATE CASCADE;
