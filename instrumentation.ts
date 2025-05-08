import { CalculatorValueTypes } from "./lib/utils";

const dbData = {
  plants: [
    //there is some cross over but what can be seperated is seperated
    //seeding
    {
      latinName: 'Pisum sativum' // Грах (Pea)
    },
    {
      latinName: 'Glycine max' // Соя (Soybean)
    },
    {
      latinName: 'Sorghum vulgare var. tehnicum'
    },
    {
      latinName: 'Zea mays' // Царевица (Corn)
    },

    //combined
    // Legumes (бобови)
    {
      latinName: 'Medicago sativa', // Люцерна (Alfalfa)
    },
    {
      latinName: 'Trifolium stellatum', // Звездан (Star Clover)
    },
    {
      latinName: 'Trifolium pratense', // Червена детелина (Red Clover)
    },
    {
      latinName: 'Trifolium repens', // Бяла детелина (White Clover)
    },
    // Cereals (зърнени)
    {
      latinName: 'Lolium perenne', // Пасищен райграс (Perennial Ryegrass)
    },
    {
      latinName: 'Agropyron cristatum', // Гребенчат житняк (Crested Wheatgrass)
    },
    {
      latinName: 'Dactylis glomerata', // Ежова главица (Orchard Grass)
    },
    {
      latinName: 'Avenula pubescens', // Безосилеста овсига (Downy Oatgrass)
    },
    {
      latinName: 'Festuca pratensis', // Ливадна власатка (Meadow Fescue)
    },
    {
      latinName: 'Festuca rubra', // Червена власатка (Red Fescue)
    }
  ],
  SowingRateData: [
    {
      plantName: "Medicago sativa", // Alfalfa
      // coefficientSecurity: {
      //   type: "buttons",
      //   values: [0.80, 0.85, 0.90, 0.95, 0.99]
      // },
      coefficientSecurity: {
        type: CalculatorValueTypes.SLIDER,
        step: 0.01,
        unit: "",
        minSliderVal: 0.80,
        maxSliderVal: 0.99
      },
      wantedPlantsPerMeterSquared: {
        type: CalculatorValueTypes.SLIDER,
        step: 1,
        unit: "plants/m²",
        minSliderVal: 600,
        maxSliderVal: 700
      },
      massPer1000g: {
        type: CalculatorValueTypes.SLIDER,
        step: 0.1,
        unit: "g",
        minSliderVal: 1.8,
        maxSliderVal: 2.2
      },
      purity: {
        type: CalculatorValueTypes.SLIDER,
        step: 1,
        unit: "%",
        minSliderVal: 75,
        maxSliderVal: 99
      },
      germination: {
        type: CalculatorValueTypes.SLIDER,
        step: 1,
        unit: "%",
        minSliderVal: 75.0,
        maxSliderVal: 100.0
      },
      rowSpacingCm: {
        type: CalculatorValueTypes.SLIDER,
        step: 1,
        unit: "cm",
        minSliderVal: 10,
        maxSliderVal: 15
      }
    },
    {
      plantName: "Pisum sativum", // Pea
      // coefficientSecurity: {
      //   type: "buttons",
      //   values: [0.9, 0.93, 0.95, 0.97, 0.99]
      // },
      coefficientSecurity: {
        type: CalculatorValueTypes.SLIDER,
        step: 0.01,
        unit: "",
        minSliderVal: 0.90,
        maxSliderVal: 0.99
      },
      wantedPlantsPerMeterSquared: {
        type: CalculatorValueTypes.SLIDER,
        step: 1,
        unit: "plants/m²",
        minSliderVal: 300,
        maxSliderVal: 400
      },
      massPer1000g: {
        type: CalculatorValueTypes.SLIDER,
        step: 0.1,
        unit: "g",
        minSliderVal: 170,
        maxSliderVal: 230
      },
      purity: {
        type: CalculatorValueTypes.CONST,
        unit: "%",
        val: 99.0
      },
      germination: {
        type: CalculatorValueTypes.SLIDER,
        step: 1,
        unit: "%",
        minSliderVal: 75.0,
        maxSliderVal: 100.0
      },
      rowSpacingCm: {
        type: CalculatorValueTypes.CONST,
        unit: "cm",
        val: 12.5
      }
    },
    {
      plantName: "Glycine max", // Soybean
      // coefficientSecurity: {
      //   type: "buttons",
      //   values: [0.9, 0.93, 0.95, 0.97, 0.99]
      // },
      coefficientSecurity: {
        type: CalculatorValueTypes.SLIDER,
        step: 0.01,
        unit: "",
        minSliderVal: 0.90,
        maxSliderVal: 0.99
      },
      wantedPlantsPerMeterSquared: {
        type: CalculatorValueTypes.SLIDER,
        step: 1,
        unit: "plants/m²",
        minSliderVal: 30,
        maxSliderVal: 40
      },
      massPer1000g: {
        type: CalculatorValueTypes.SLIDER,
        step: 1,
        unit: "g",
        minSliderVal: 115,
        maxSliderVal: 200
      },
      purity: {
        type: CalculatorValueTypes.CONST,
        unit: "%",
        val: 99.0
      },
      germination: {
        type: CalculatorValueTypes.SLIDER,
        step: 1,
        unit: "%",
        minSliderVal: 75.0,
        maxSliderVal: 100.0
      },
      rowSpacingCm: {
        type: CalculatorValueTypes.CONST,
        unit: "cm",
        val: 70
      }
    },
    {
      plantName: "Sorghum vulgare var. tehnicum", // Industrial sorghum
      // coefficientSecurity: {
      //   type: "buttons",
      //   values: [0.9, 0.93, 0.95, 0.97, 0.99]
      // },
      coefficientSecurity: {
        type: CalculatorValueTypes.SLIDER,
        step: 0.01,
        unit: "",
        minSliderVal: 0.90,
        maxSliderVal: 0.99
      },
      wantedPlantsPerMeterSquared: {
        type: CalculatorValueTypes.SLIDER,
        step: 1,
        unit: "plants/m²",
        minSliderVal: 25,
        maxSliderVal: 35
      },
      massPer1000g: {
        type: CalculatorValueTypes.SLIDER,
        step: 1,
        unit: "g",
        minSliderVal: 16,
        maxSliderVal: 18
      },
      purity: {
        type: CalculatorValueTypes.CONST,
        unit: "%",
        val: 99.0
      },
      germination: {
        type: CalculatorValueTypes.SLIDER,
        step: 1,
        unit: "%",
        minSliderVal: 75.0,
        maxSliderVal: 100.0
      },
      rowSpacingCm: {
        type: CalculatorValueTypes.SLIDER,
        step: 1,
        unit: "cm",
        minSliderVal: 24,
        maxSliderVal: 30
      }
    },
    {
      plantName: "Zea mays", // Corn
      coefficientSecurity: {
        type: CalculatorValueTypes.SLIDER,
        step: 0.01,
        unit: "",
        minSliderVal: 0.90,
        maxSliderVal: 0.99
      },
      wantedPlantsPerMeterSquared: {
        type: CalculatorValueTypes.SLIDER,
        step: 1,
        unit: "plants/m²",
        minSliderVal: 7,
        maxSliderVal: 7.5
      },
      massPer1000g: {
        type: CalculatorValueTypes.SLIDER,
        step: 0.1,
        unit: "g",
        minSliderVal: 200,
        maxSliderVal: 300
      },
      purity: {
        type: CalculatorValueTypes.CONST,
        unit: "%",
        val: 99.0
      },
      germination: {
        type: CalculatorValueTypes.SLIDER,
        step: 1,
        unit: "%",
        minSliderVal: 75.0,
        maxSliderVal: 100.0
      },
      rowSpacingCm: {
        type: CalculatorValueTypes.CONST,
        unit: "cm",
        val: 70
      }
    }
  ],
  SeedingDataCombination: [
    // Legumes (бобови)
    {
      plantName: 'Medicago sativa',
      plantType: 'legume',
      minSeedingRate: 2.5,
      maxSeedingRate: 3,
      priceFor1kgSeedsBGN: 26,
    },
    {
      plantName: 'Trifolium stellatum',
      plantType: 'legume',
      minSeedingRate: 1.5,
      maxSeedingRate: 2,
      priceFor1kgSeedsBGN: 34.5,
    },
    {
      plantName: 'Trifolium pratense',
      plantType: 'legume',
      minSeedingRate: 2,
      maxSeedingRate: 2.5,
      priceFor1kgSeedsBGN: 29.3,
    },
    {
      plantName: 'Trifolium repens',
      plantType: 'legume',
      minSeedingRate: 2,
      maxSeedingRate: 2.5,
      priceFor1kgSeedsBGN: 35.9,
    },
    // Cereals (зърнени)
    {
      plantName: 'Lolium perenne',
      plantType: 'cereal',
      minSeedingRate: 1,
      maxSeedingRate: 2.5,
      priceFor1kgSeedsBGN: 13.8,
    },
    {
      plantName: 'Agropyron cristatum',
      plantType: 'cereal',
      minSeedingRate: 1,
      maxSeedingRate: 1.5,
      priceFor1kgSeedsBGN: 10.5,
    },
    {
      plantName: 'Dactylis glomerata',
      plantType: 'cereal',
      minSeedingRate: 0.7,
      maxSeedingRate: 1,
      priceFor1kgSeedsBGN: 19.9,
    },
    {
      plantName: 'Avenula pubescens',
      plantType: 'cereal',
      minSeedingRate: 2,
      maxSeedingRate: 2.5,
      priceFor1kgSeedsBGN: 47,
    },
    {
      plantName: 'Festuca pratensis',
      plantType: 'cereal',
      minSeedingRate: 0.8,
      maxSeedingRate: 1.2,
      priceFor1kgSeedsBGN: 22,
    },
    {
      plantName: 'Festuca rubra',
      plantType: 'cereal',
      minSeedingRate: 0.7,
      maxSeedingRate: 1,
      priceFor1kgSeedsBGN: 7.8,
    }
  ],
};



export async function register() {
  // On start up, run this function

  //check all ENVs are set
  if (!process.env.DATABASE_URL) {
    console.error('DATABASE_URL not set');
    process.exit(1);
  }

  if (!process.env.NEXT_PUBLIC_HOST_URL) {
    console.error('NEXT_PUBLIC_HOST_URL not set');
    process.exit(1);
  }

  if (!process.env.JWT_SECRET) {
    console.error('JWT_SECRET not set');
    process.exit(1);
  }

  if (!process.env.JWT_REFRESH_SECRET) {
    console.error('JWT_REFRESH_SECRET not set');
    process.exit(1);
  }

  if (!process.env.SALT_ROUNDS) {
    console.error('SALT_ROUNDS not set');
    process.exit(1);
  }

  if (!process.env.INTERNAL_API_REQUEST_SECRET) {
    console.error('INTERNAL_API_REQUEST_SECRET not set');
    process.exit(1);
  }

  //set up db
  //npx prisma migrate dev in terminal

  //seed the db
  //force to run in server mode so prisma is happy and works
  if (process.env.NEXT_RUNTIME === 'nodejs') {
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    const { prisma } = require("@/lib/prisma");


    const plantCount = await prisma.plant.count();

    //we assume if there are no plants, there is no data
    //and we seed the database
    if (plantCount === 0) {
      console.log('Seeding database...');

      for (const plant of dbData.plants) {
        await prisma.plant.create({
          data: plant,
        });
      }

      //sowing rate
      console.log('Seeding Sowing Rate...');
      for (const sowingRateData of dbData.SowingRateData) {
        const plant = await prisma.plant.findUnique({
          where: {
            latinName: sowingRateData.plantName,
          },
        });

        if (!plant) {
          console.error('Plant not found for SowingRatePlant: ', sowingRateData.plantName);
          continue;
        }

        const sowingPlant = await prisma.sowingRatePlant.create({
          data: {
            plant: {
              connect: {
                id: plant.id,
              },
            },
          },
        });

        await prisma.sowingRateCoefficientSecurity.create({
          data: {
            type: sowingRateData.coefficientSecurity.type,
            step: sowingRateData.coefficientSecurity.step,
            unit: sowingRateData.coefficientSecurity.unit,
            minSliderVal: sowingRateData.coefficientSecurity.minSliderVal,
            maxSliderVal: sowingRateData.coefficientSecurity.maxSliderVal,
            sowingPlant: { connect: { id: sowingPlant.id } },
          },
        });

        // //vals seperatly
        // for (const value of sowingRateData.coefficientSecurity.values) {
        //   await prisma.sowingRateCoefficientSecurityValue.create({
        //     data: {
        //       value,
        //       coefficientSecurity: { connect: { id: coefficientSecurity.id } },
        //     },
        //   });
        // }

        await prisma.sowingRateWantedPlantsPerMeterSquared.create({
          data: {
            type: sowingRateData.wantedPlantsPerMeterSquared.type,
            step: sowingRateData.wantedPlantsPerMeterSquared.step,
            unit: sowingRateData.wantedPlantsPerMeterSquared.unit,
            minSliderVal: sowingRateData.wantedPlantsPerMeterSquared.minSliderVal,
            maxSliderVal: sowingRateData.wantedPlantsPerMeterSquared.maxSliderVal,
            sowingPlant: {
              connect: {
                id: sowingPlant.id,
              },
            },
          },
        });

        await prisma.sowingRateMassPer1000g.create({
          data: {
            type: sowingRateData.massPer1000g.type,
            step: sowingRateData.massPer1000g.step,
            unit: sowingRateData.massPer1000g.unit,
            minSliderVal: sowingRateData.massPer1000g.minSliderVal,
            maxSliderVal: sowingRateData.massPer1000g.maxSliderVal,
            sowingPlant: {
              connect: {
                id: sowingPlant.id,
              },
            },
          },
        });

        if (sowingRateData.purity.type === 'slider') {
          await prisma.sowingRatePurity.create({
            data: {
              type: sowingRateData.purity.type,
              unit: sowingRateData.purity.unit,
              step: sowingRateData.purity.step,
              minSliderVal: sowingRateData.purity.minSliderVal,
              maxSliderVal: sowingRateData.purity.maxSliderVal,
              sowingPlant: {
                connect: {
                  id: sowingPlant.id,
                },
              },
            },
          });
        } else {
          // Const type
          await prisma.sowingRatePurity.create({
            data: {
              type: sowingRateData.purity.type,
              unit: sowingRateData.purity.unit,
              constValue: sowingRateData.purity.val,
              sowingPlant: {
                connect: {
                  id: sowingPlant.id,
                },
              },
            },
          });
        }

        await prisma.sowingRateGermination.create({
          data: {
            type: sowingRateData.germination.type,
            step: sowingRateData.germination.step,
            unit: sowingRateData.germination.unit,
            minSliderVal: sowingRateData.germination.minSliderVal,
            maxSliderVal: sowingRateData.germination.maxSliderVal,
            sowingPlant: {
              connect: {
                id: sowingPlant.id,
              },
            },
          },
        });

        if (sowingRateData.rowSpacingCm.type === 'slider') {
          await prisma.sowingRateRowSpacingCm.create({
            data: {
              type: sowingRateData.rowSpacingCm.type,
              unit: sowingRateData.rowSpacingCm.unit,
              step: sowingRateData.rowSpacingCm.step,
              minSliderVal: sowingRateData.rowSpacingCm.minSliderVal,
              maxSliderVal: sowingRateData.rowSpacingCm.maxSliderVal,
              sowingPlant: {
                connect: {
                  id: sowingPlant.id,
                },
              },
            },
          });
        } else {
          // Const type
          await prisma.sowingRateRowSpacingCm.create({
            data: {
              type: sowingRateData.rowSpacingCm.type,
              unit: sowingRateData.rowSpacingCm.unit,
              constValue: sowingRateData.rowSpacingCm.val,
              sowingPlant: {
                connect: {
                  id: sowingPlant.id,
                },
              },
            },
          });
        }

      }

      //combined
      console.log('Seeding Combined...');
      for (const seedingDataCombination of dbData.SeedingDataCombination) {
        const plant = await prisma.plant.findUnique({
          where: {
            latinName: seedingDataCombination.plantName,
          },
        });

        if (!plant) {
          console.error('Plant not found: ', seedingDataCombination.plantName);
          throw new Error('Force exit in instrumentation');
        }

        await prisma.seedingDataCombination.create({
          data: {
            plant: {
              connect: {
                id: plant.id,
              },
            },
            plantType: seedingDataCombination.plantType,
            minSeedingRate: seedingDataCombination.minSeedingRate,
            maxSeedingRate: seedingDataCombination.maxSeedingRate,
            priceFor1kgSeedsBGN: seedingDataCombination.priceFor1kgSeedsBGN,
          },
        });
      }

      console.log('Database seeded.');
    } else {
      console.log('Database already seeded.');
    }

  }
}
