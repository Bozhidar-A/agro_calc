const dbData = {
  plants: [
    {
      latinName: 'Medicago sativa',
    },
    {
      latinName: 'Trifolium stellatum',
    },
    {
      latinName: 'Trifolium pratense',
    },
    {
      latinName: 'Trifolium repens',
    },
  ],
  SeedingDataCombination: [
    {
      plantName: 'Medicago sativa',
      minSeedingRate: 2.5,
      maxSeedingRate: 3,
      priceFor1kgSeedsBGN: 26,
    },
    {
      plantName: 'Trifolium stellatum',
      minSeedingRate: 1.5,
      maxSeedingRate: 2,
      priceFor1kgSeedsBGN: 34.5,
    },
    {
      plantName: 'Trifolium pratense',
      minSeedingRate: 2,
      maxSeedingRate: 2.5,
      priceFor1kgSeedsBGN: 29.3,
    },
    {
      plantName: 'Trifolium repens',
      minSeedingRate: 2,
      maxSeedingRate: 2.5,
      priceFor1kgSeedsBGN: 35.9,
    },
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
