import { hash } from 'bcryptjs';
import { prisma } from '@/lib/prisma';
import {
  AttachCredentialsToUser,
  AttachGitHubIdToUser,
  AttachGoogleIdToUser,
  CreateNewUser,
  CreateUserGitHub,
  CreateUserGoogle,
  DeleteAllRefreshTokensByUserId,
  FindRefreshToken,
  FindUserByEmail,
  FindUserByGitHubId,
  FindUserByGoogleId,
  FindUserById,
  FindUserSettingsByUserId,
  GetAllChemProtectionActiveIngredients,
  GetAllChemProtectionChemicals,
  GetAllChemProtectionEnemies,
  GetAllChemProtectionPlants,
  GetAllCombinedPlants,
  GetAllSowingPlants,
  GetChemProtectionActiveIngredientData,
  GetChemProtectionChemData,
  GetChemProtectionEnemyData,
  GetChemProtectionPlantData,
  GetChemProtWorkingSolutionHistory,
  GetChemProtWorkingSolutionInputPlantChems,
  GetCombinedHistory,
  GetCombinedInputData,
  GetCombinedPlantData,
  GetSowingHistory,
  GetSowingInputData,
  GetSowingPlantData,
  InsertCombinedHistoryEntry,
  InsertRefreshTokenByUserId,
  UpdateUserSettings,
} from '@/prisma/prisma-utils';

// Mock prisma client
jest.mock('@/lib/prisma', () => ({
  prisma: {
    user: {
      findUnique: jest.fn(),
      create: jest.fn(),
      update: jest.fn(),
    },
    refreshToken: {
      findUnique: jest.fn(),
      deleteMany: jest.fn(),
      create: jest.fn(),
    },
    userSettings: {
      findUnique: jest.fn(),
      upsert: jest.fn(),
    },
    sowingRatePlant: {
      findMany: jest.fn(),
      findUnique: jest.fn(),
    },
    sowingRateHistory: {
      findMany: jest.fn(),
      findUnique: jest.fn(),
    },
    plantChemical: {
      findMany: jest.fn(),
      findUnique: jest.fn(),
    },
    chemProtWorkingSolutionHistory: {
      findMany: jest.fn(),
      findUnique: jest.fn(),
    },
    enemy: {
      findMany: jest.fn(),
      findUnique: jest.fn(),
    },
    chemical: {
      findMany: jest.fn(),
      findUnique: jest.fn(),
    },
    activeIngredient: {
      findMany: jest.fn(),
      findUnique: jest.fn(),
    },
    seedingDataCombination: {
      findMany: jest.fn(),
      findUnique: jest.fn(),
    },
    seedingDataCombinationHistory: {
      create: jest.fn(),
      findUnique: jest.fn(),
      findMany: jest.fn(),
    },
    plant: {
      findFirst: jest.fn(),
    },
  },
}));

// Mock bcryptjs
jest.mock('bcryptjs', () => ({
  hash: jest.fn(),
}));

//mock jose
jest.mock('jose', () => ({
  SignJWT: jest.fn().mockImplementation(() => ({
    setProtectedHeader: jest.fn().mockReturnThis(),
    setExpirationTime: jest.fn().mockReturnThis(),
    sign: jest.fn().mockResolvedValue('mock-token'),
  })),
  jwtVerify: jest.fn(),
}));

describe('Prisma Utils', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('User Functions', () => {
    const mockUser = {
      id: '123',
      email: 'test@test.com',
      password: 'hashed-password',
    };

    describe('FindUserByEmail', () => {
      it('should find user by email', async () => {
        (prisma.user.findUnique as jest.Mock).mockResolvedValue(mockUser);

        const result = await FindUserByEmail('test@test.com');

        expect(result).toEqual(mockUser);
        expect(prisma.user.findUnique).toHaveBeenCalledWith({
          where: { email: 'test@test.com' },
        });
      });

      it('should return null when user not found', async () => {
        (prisma.user.findUnique as jest.Mock).mockResolvedValue(null);

        const result = await FindUserByEmail('nonexistent@test.com');

        expect(result).toBeNull();
      });
    });

    describe('FindUserById', () => {
      it('should find user by id', async () => {
        (prisma.user.findUnique as jest.Mock).mockResolvedValue(mockUser);

        const result = await FindUserById('123');

        expect(result).toEqual(mockUser);
        expect(prisma.user.findUnique).toHaveBeenCalledWith({
          where: { id: '123' },
        });
      });

      it('should return null when user not found', async () => {
        (prisma.user.findUnique as jest.Mock).mockResolvedValue(null);

        const result = await FindUserById('nonexistent');

        expect(result).toBeNull();
      });
    });

    describe('CreateNewUser', () => {
      it('should create a new user', async () => {
        (hash as jest.Mock).mockResolvedValue('hashed-password');
        (prisma.user.create as jest.Mock).mockResolvedValue(mockUser);

        const result = await CreateNewUser('test@test.com', 'password123');

        expect(result).toEqual(mockUser);
        expect(hash).toHaveBeenCalledWith('password123', expect.any(Number));
        expect(prisma.user.create).toHaveBeenCalledWith({
          data: {
            email: 'test@test.com',
            password: 'hashed-password',
          },
        });
      });
    });

    describe('AttachCredentialsToUser', () => {
      it('should attach credentials to existing user', async () => {
        (hash as jest.Mock).mockResolvedValue('hashed-password');
        (prisma.user.update as jest.Mock).mockResolvedValue(mockUser);

        const result = await AttachCredentialsToUser('123', 'test@test.com', 'password123');

        expect(result).toEqual(mockUser);
        expect(hash).toHaveBeenCalledWith('password123', expect.any(Number));
        expect(prisma.user.update).toHaveBeenCalledWith({
          where: { id: '123' },
          data: {
            email: 'test@test.com',
            password: 'hashed-password',
          },
        });
      });
    });
  });

  describe('Refresh Token Functions', () => {
    const mockRefreshToken = {
      id: 'token-123',
      token: 'refresh-token',
      userId: '123',
      expiresAt: new Date(),
    };

    describe('FindRefreshToken', () => {
      it('should find refresh token', async () => {
        (prisma.refreshToken.findUnique as jest.Mock).mockResolvedValue(mockRefreshToken);

        const result = await FindRefreshToken('refresh-token');

        expect(result).toEqual(mockRefreshToken);
        expect(prisma.refreshToken.findUnique).toHaveBeenCalledWith({
          where: { token: 'refresh-token' },
        });
      });

      it('should return null when token not found', async () => {
        (prisma.refreshToken.findUnique as jest.Mock).mockResolvedValue(null);

        const result = await FindRefreshToken('nonexistent-token');

        expect(result).toBeNull();
      });
    });

    describe('DeleteAllRefreshTokensByUserId', () => {
      it('should delete all refresh tokens for user', async () => {
        (prisma.refreshToken.deleteMany as jest.Mock).mockResolvedValue({ count: 2 });

        const result = await DeleteAllRefreshTokensByUserId('123');

        expect(result).toEqual({ count: 2 });
        expect(prisma.refreshToken.deleteMany).toHaveBeenCalledWith({
          where: { userId: '123' },
        });
      });

      it('should return undefined when no userId provided', async () => {
        const result = await DeleteAllRefreshTokensByUserId('');

        expect(result).toBeUndefined();
      });
    });

    describe('InsertRefreshTokenByUserId', () => {
      it('should insert new refresh token', async () => {
        (prisma.refreshToken.create as jest.Mock).mockResolvedValue(mockRefreshToken);

        const result = await InsertRefreshTokenByUserId('refresh-token', '123');

        expect(result).toEqual(mockRefreshToken);
        expect(prisma.refreshToken.create).toHaveBeenCalledWith({
          data: {
            token: 'refresh-token',
            userId: '123',
            expiresAt: expect.any(Date),
          },
        });
      });
    });
  });

  describe('User Settings Functions', () => {
    const mockUserSettings = {
      id: '123',
      userId: '123',
      theme: 'light',
      language: 'en',
      prefUnitOfMeasurement: 'metric',
    };

    describe('FindUserSettingsByUserId', () => {
      it('should find user settings by user id', async () => {
        (prisma.userSettings.findUnique as jest.Mock).mockResolvedValue(mockUserSettings);

        const result = await FindUserSettingsByUserId('123');

        expect(result).toEqual(mockUserSettings);
        expect(prisma.userSettings.findUnique).toHaveBeenCalledWith({
          where: { userId: '123' },
        });
      });

      it('should return null when settings not found', async () => {
        (prisma.userSettings.findUnique as jest.Mock).mockResolvedValue(null);

        const result = await FindUserSettingsByUserId('nonexistent');

        expect(result).toBeNull();
      });
    });

    describe('UpdateUserSettings', () => {
      it('should update existing user settings', async () => {
        (prisma.userSettings.upsert as jest.Mock).mockResolvedValue(mockUserSettings);

        const result = await UpdateUserSettings('123', 'dark', 'bg', 'imperial');

        expect(result).toEqual(mockUserSettings);
        expect(prisma.userSettings.upsert).toHaveBeenCalledWith({
          where: { userId: '123' },
          update: { theme: 'dark', language: 'bg', prefUnitOfMeasurement: 'imperial' },
          create: {
            userId: '123',
            theme: 'dark',
            language: 'bg',
            prefUnitOfMeasurement: 'imperial',
          },
        });
      });
    });
  });

  describe('OAuth Functions', () => {
    describe('Google OAuth', () => {
      const mockGoogleUser = {
        id: '123',
        email: 'test@test.com',
        googleId: 'google-123',
      };

      describe('FindUserByGoogleId', () => {
        it('should find user by google id', async () => {
          (prisma.user.findUnique as jest.Mock).mockResolvedValue(mockGoogleUser);

          const result = await FindUserByGoogleId('google-123');

          expect(result).toEqual(mockGoogleUser);
          expect(prisma.user.findUnique).toHaveBeenCalledWith({
            where: { googleId: 'google-123' },
          });
        });
      });

      describe('CreateUserGoogle', () => {
        it('should create new google user', async () => {
          (prisma.user.create as jest.Mock).mockResolvedValue(mockGoogleUser);

          const result = await CreateUserGoogle('google-123', 'test@test.com');

          expect(result).toEqual(mockGoogleUser);
          expect(prisma.user.create).toHaveBeenCalledWith({
            data: {
              googleId: 'google-123',
              email: 'test@test.com',
            },
          });
        });
      });

      describe('AttachGoogleIdToUser', () => {
        it('should attach google id to existing user', async () => {
          (prisma.user.update as jest.Mock).mockResolvedValue(mockGoogleUser);

          const result = await AttachGoogleIdToUser('123', 'google-123');

          expect(result).toEqual(mockGoogleUser);
          expect(prisma.user.update).toHaveBeenCalledWith({
            where: { id: '123' },
            data: { googleId: 'google-123' },
          });
        });
      });
    });

    describe('GitHub OAuth', () => {
      const mockGithubUser = {
        id: '123',
        email: 'test@test.com',
        githubId: 'github-123',
      };

      describe('FindUserByGitHubId', () => {
        it('should find user by github id', async () => {
          (prisma.user.findUnique as jest.Mock).mockResolvedValue(mockGithubUser);

          const result = await FindUserByGitHubId('github-123');

          expect(result).toEqual(mockGithubUser);
          expect(prisma.user.findUnique).toHaveBeenCalledWith({
            where: { githubId: 'github-123' },
          });
        });
      });

      describe('CreateUserGitHub', () => {
        it('should create new github user', async () => {
          (prisma.user.create as jest.Mock).mockResolvedValue(mockGithubUser);

          const result = await CreateUserGitHub('github-123', 'test@test.com');

          expect(result).toEqual(mockGithubUser);
          expect(prisma.user.create).toHaveBeenCalledWith({
            data: {
              githubId: 'github-123',
              email: 'test@test.com',
            },
          });
        });
      });

      describe('AttachGitHubIdToUser', () => {
        it('should attach github id to existing user', async () => {
          (prisma.user.update as jest.Mock).mockResolvedValue(mockGithubUser);

          const result = await AttachGitHubIdToUser('123', 'github-123');

          expect(result).toEqual(mockGithubUser);
          expect(prisma.user.update).toHaveBeenCalledWith({
            where: { id: '123' },
            data: { githubId: 'github-123' },
          });
        });
      });
    });
  });

  describe('Calculation Functions', () => {
    describe('Sowing Rate Functions', () => {
      const mockSowingData = {
        id: '123',
        plant: {
          id: 'plant-123',
          latinName: 'Test Plant',
        },
        coefficientSecurity: {
          type: 'slider',
          step: 1,
          unit: '%',
          minSliderVal: 0,
          maxSliderVal: 100,
        },
      };

      describe('GetSowingInputData', () => {
        it('should get sowing input data', async () => {
          (prisma.sowingRatePlant.findMany as jest.Mock).mockResolvedValue([mockSowingData]);

          const result = await GetSowingInputData();

          expect(result).toHaveLength(1);
          expect(result[0].plant.plantId).toBe('plant-123');
        });

        it('should throw error when no data found', async () => {
          (prisma.sowingRatePlant.findMany as jest.Mock).mockResolvedValue(null);

          await expect(GetSowingInputData()).rejects.toThrow('No seeding data found');
        });
      });

      describe('GetSowingHistory', () => {
        it('should get sowing history', async () => {
          const mockHistory = [
            {
              id: '123',
              sowingRateSafeSeedsPerMeterSquared: 100,
              plant: { latinName: 'Test Plant' },
            },
          ];
          (prisma.sowingRateHistory.findMany as jest.Mock).mockResolvedValue(mockHistory);

          const result = await GetSowingHistory();

          expect(result).toEqual(mockHistory);
        });
      });
    });

    describe('Chemical Protection Functions', () => {
      const mockChemData = {
        id: '123',
        plant: {
          id: 'plant-123',
          latinName: 'Test Plant',
        },
        chemical: {
          id: 'chem-123',
          nameKey: 'Test Chemical',
          dosage: 100,
          dosageUnit: 'ml',
        },
      };

      describe('GetChemProtWorkingSolutionInputPlantChems', () => {
        it('should get chemical protection input data', async () => {
          (prisma.plantChemical.findMany as jest.Mock).mockResolvedValue([mockChemData]);

          const result = await GetChemProtWorkingSolutionInputPlantChems();

          expect(result).toHaveLength(1);
          expect(result[0].plant.id).toBe('plant-123');
        });
      });

      describe('GetChemProtWorkingSolutionHistory', () => {
        it('should get chemical protection history', async () => {
          const mockHistory = [
            {
              id: '123',
              totalChemicalForAreaLiters: 100,
              plant: { latinName: 'Test Plant' },
            },
          ];
          (prisma.chemProtWorkingSolutionHistory.findMany as jest.Mock).mockResolvedValue(
            mockHistory
          );

          const result = await GetChemProtWorkingSolutionHistory();

          expect(result).toEqual(mockHistory);
        });
      });
    });
  });

  describe('Wiki Functions', () => {
    describe('GetAllSowingPlants', () => {
      it('should get all sowing plants', async () => {
        const mockPlants = [
          {
            plant: {
              id: 'plant-123',
              latinName: 'Test Plant',
            },
          },
        ];
        (prisma.sowingRatePlant.findMany as jest.Mock).mockResolvedValue(mockPlants);

        const result = await GetAllSowingPlants();

        expect(result).toEqual(mockPlants);
      });
    });

    describe('GetSowingPlantData', () => {
      it('should get sowing plant data', async () => {
        const mockPlantData = {
          id: 'plant-123',
          plant: {
            id: 'plant-123',
            latinName: 'Test Plant',
          },
          coefficientSecurity: {
            type: 'slider',
            step: 1,
            unit: '%',
            minSliderVal: 0,
            maxSliderVal: 100,
          },
        };
        (prisma.sowingRatePlant.findUnique as jest.Mock).mockResolvedValue(mockPlantData);

        const result = await GetSowingPlantData('plant-123');

        expect(result.plant.id).toBe('plant-123');
      });

      it('should throw error when plant not found', async () => {
        (prisma.sowingRatePlant.findUnique as jest.Mock).mockResolvedValue(null);

        await expect(GetSowingPlantData('nonexistent')).rejects.toThrow('No seeding data found');
      });
    });

    describe('GetAllChemProtectionPlants', () => {
      it('should get all chemical protection plants', async () => {
        const mockPlants = [
          {
            plant: {
              id: 'plant-123',
              latinName: 'Test Plant',
            },
          },
        ];
        (prisma.plantChemical.findMany as jest.Mock).mockResolvedValue(mockPlants);

        const result = await GetAllChemProtectionPlants();

        expect(result).toEqual(mockPlants);
      });
    });

    describe('GetChemProtectionPlantData', () => {
      it('should get chemical protection plant data', async () => {
        const mockPlantData = [
          {
            plant: {
              id: 'plant-123',
              latinName: 'Test Plant',
            },
            chemical: {
              id: 'chem-123',
              nameKey: 'Test Chemical',
              type: 'herbicide',
              applicationStage: 'pre-emergence',
              dosage: 100,
              dosageUnit: 'ml',
            },
          },
        ];
        (prisma.plantChemical.findMany as jest.Mock).mockResolvedValue(mockPlantData);

        const result = await GetChemProtectionPlantData('plant-123');

        expect(result).toEqual(mockPlantData);
      });
    });

    describe('GetAllChemProtectionEnemies', () => {
      it('should get all chemical protection enemies', async () => {
        const mockEnemies = [
          {
            id: 'enemy-123',
            latinName: 'Test Enemy',
            chemicals: [
              {
                chemical: {
                  id: 'chem-123',
                  nameKey: 'Test Chemical',
                },
              },
            ],
          },
        ];
        (prisma.enemy.findMany as jest.Mock).mockResolvedValue(mockEnemies);

        const result = await GetAllChemProtectionEnemies();

        expect(result).toEqual(mockEnemies);
      });
    });

    describe('GetChemProtectionEnemyData', () => {
      it('should get chemical protection enemy data', async () => {
        const mockEnemyData = {
          id: 'enemy-123',
          latinName: 'Test Enemy',
          chemicals: [
            {
              chemical: {
                id: 'chem-123',
                nameKey: 'Test Chemical',
                type: 'herbicide',
                applicationStage: 'pre-emergence',
                dosage: 100,
                dosageUnit: 'ml',
              },
            },
          ],
        };
        (prisma.enemy.findUnique as jest.Mock).mockResolvedValue(mockEnemyData);

        const result = await GetChemProtectionEnemyData('enemy-123');

        expect(result).toEqual(mockEnemyData);
      });
    });

    describe('GetAllChemProtectionChemicals', () => {
      it('should get all chemical protection chemicals', async () => {
        const mockChemicals = [
          {
            id: 'chem-123',
            nameKey: 'Test Chemical',
            type: 'herbicide',
            applicationStage: 'pre-emergence',
            dosage: 100,
            dosageUnit: 'ml',
          },
        ];
        (prisma.chemical.findMany as jest.Mock).mockResolvedValue(mockChemicals);

        const result = await GetAllChemProtectionChemicals();

        expect(result).toEqual(mockChemicals);
      });
    });

    describe('GetChemProtectionChemData', () => {
      it('should get chemical protection chemical data', async () => {
        const mockChemData = {
          id: 'chem-123',
          nameKey: 'Test Chemical',
          type: 'herbicide',
          applicationStage: 'pre-emergence',
          dosage: 100,
          dosageUnit: 'ml',
        };
        (prisma.chemical.findUnique as jest.Mock).mockResolvedValue(mockChemData);

        const result = await GetChemProtectionChemData('chem-123');

        expect(result).toEqual(mockChemData);
      });
    });

    describe('GetAllChemProtectionActiveIngredients', () => {
      it('should get all chemical protection active ingredients', async () => {
        const mockActiveIngredients = [
          {
            id: 'ingredient-123',
            nameKey: 'Test Ingredient',
            unit: 'g',
            chemicals: [
              {
                quantity: 100,
                chemical: {
                  id: 'chem-123',
                  nameKey: 'Test Chemical',
                },
              },
            ],
          },
        ];
        (prisma.activeIngredient.findMany as jest.Mock).mockResolvedValue(mockActiveIngredients);

        const result = await GetAllChemProtectionActiveIngredients();

        expect(result).toEqual(mockActiveIngredients);
      });
    });

    describe('GetChemProtectionActiveIngredientData', () => {
      it('should get chemical protection active ingredient data', async () => {
        const mockIngredientData = {
          id: 'ingredient-123',
          nameKey: 'Test Ingredient',
          unit: 'g',
          chemicals: [
            {
              quantity: 100,
              chemical: {
                id: 'chem-123',
                nameKey: 'Test Chemical',
              },
            },
          ],
        };
        (prisma.activeIngredient.findUnique as jest.Mock).mockResolvedValue(mockIngredientData);

        const result = await GetChemProtectionActiveIngredientData('ingredient-123');

        expect(result).toEqual(mockIngredientData);
      });
    });
  });

  describe('Combined Calculation Functions', () => {
    describe('GetCombinedInputData', () => {
      it('should get combined input data', async () => {
        const mockCombinedData = [
          {
            id: 'plant-123',
            latinName: 'Test Plant',
            plantType: 'crop',
            minSeedingRate: 10,
            maxSeedingRate: 20,
            priceFor1kgSeedsBGN: 5,
          },
        ];
        (prisma.seedingDataCombination.findMany as jest.Mock).mockResolvedValue(mockCombinedData);
        (prisma.plant.findFirst as jest.Mock).mockResolvedValue({
          id: 'plant-123',
          latinName: 'Test Plant',
        });

        const result = await GetCombinedInputData();

        expect(result).toEqual(mockCombinedData);
      });

      it('should throw error when no data found', async () => {
        (prisma.seedingDataCombination.findMany as jest.Mock).mockResolvedValue(null);

        await expect(GetCombinedInputData()).rejects.toThrow('No seeding data found');
      });
    });

    describe('InsertCombinedHistoryEntry', () => {
      it('should insert combined history entry', async () => {
        const mockCombinedData = {
          userId: 'user-123',
          totalPrice: 100,
          isDataValid: true,
          plants: [
            {
              plantId: 'plant-123',
              plantType: 'crop',
              seedingRate: 15,
              participation: 50,
              combinedRate: 7.5,
              pricePerAcreBGN: 50,
            },
          ],
        };
        const mockHistoryEntry = {
          id: 'history-123',
          ...mockCombinedData,
        };
        (prisma.seedingDataCombinationHistory.create as jest.Mock).mockResolvedValue(
          mockHistoryEntry
        );

        const result = await InsertCombinedHistoryEntry(mockCombinedData);

        expect(result).toEqual(mockHistoryEntry);
      });
    });

    describe('GetCombinedHistory', () => {
      it('should get combined history', async () => {
        const mockHistory = [
          {
            id: 'history-123',
            totalPrice: 100,
            isDataValid: true,
            createdAt: new Date(),
            plants: [
              {
                plantType: 'crop',
                seedingRate: 15,
                participation: 50,
                combinedRate: 7.5,
                pricePerAcreBGN: 50,
                plant: {
                  latinName: 'Test Plant',
                },
              },
            ],
          },
        ];
        (prisma.seedingDataCombinationHistory.findMany as jest.Mock).mockResolvedValue(mockHistory);

        const result = await GetCombinedHistory();

        expect(result).toEqual(mockHistory);
      });
    });

    describe('GetAllCombinedPlants', () => {
      it('should get all combined plants', async () => {
        const mockPlants = [
          {
            id: 'plant-123',
            plant: {
              id: 'plant-123',
              latinName: 'Test Plant',
            },
          },
        ];
        (prisma.seedingDataCombination.findMany as jest.Mock).mockResolvedValue(mockPlants);

        const result = await GetAllCombinedPlants();

        expect(result).toEqual(mockPlants);
      });
    });

    describe('GetCombinedPlantData', () => {
      it('should get combined plant data', async () => {
        const mockPlantData = {
          id: 'plant-123',
          plant: {
            id: 'plant-123',
            latinName: 'Test Plant',
          },
        };
        (prisma.seedingDataCombination.findUnique as jest.Mock).mockResolvedValue(mockPlantData);

        const result = await GetCombinedPlantData('plant-123');

        expect(result).toEqual(mockPlantData);
      });

      it('should throw error when plant not found', async () => {
        (prisma.seedingDataCombination.findUnique as jest.Mock).mockResolvedValue(null);

        await expect(GetCombinedPlantData('nonexistent')).rejects.toThrow('No combined data found');
      });
    });
  });
});
