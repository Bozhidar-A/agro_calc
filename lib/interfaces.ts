import { User } from '@prisma/client';

//general
export interface SupportedOAuthProvider {
  name: string;
  icon: any;
  authURL: string;
  currLoc: UserGPSLoc | null;
}

export interface SupportedLang {
  code: string;
  name: string;
  flag: string;
}

export interface AuthState {
  user: any;
  isAuthenticated: boolean;
  loading: boolean;
  error: string | null;
  authType: string | null;
  showLoginToast: boolean;
}

export interface HandleOAuthLoginArgs {
  provider: 'google' | 'github';
  providerId: string;
  email: string;
  findUserByProviderId: (id: string) => Promise<User | null>;
  attachProviderIdToUser: (userId: string, providerId: string) => Promise<User>;
  createUserWithProvider: (providerId: string, email: string) => Promise<User>;
  refreshTokenUserInfo: string;
}

export interface HandleOAuthLoginResult {
  user: {
    id: string;
    email: string;
  };
  accessToken: string;
  refreshToken: string;
}

export interface OAuthClientStateCookie {
  user: {
    id: string;
    email: string;
  };
  isAuthenticated: boolean;
  loading: boolean;
  error: null;
  authType: string;
  timestamp: Date;
}

export interface ProvidersProps {
  children: React.ReactNode;
  initialAuthState?: OAuthClientStateCookie;
}

export interface LangMapInterface {
  [key: string]: {
    [key: string]: string;
  };
}

export interface TranslatorInterface {
  (key: string): string;
}

export interface ReverseGeocodeAddress {
  building?: string;
  road?: string;
  neighbourhood?: string;
  suburb?: string;
  village?: string;
  town?: string;
  city?: string;
  county?: string;
  state?: string;
  postcode?: string;
  country?: string;
  country_code?: string;
}

export interface ReverseGeocodeResult {
  place_id?: number;
  licence?: string;
  osm_type?: string;
  osm_id?: number;
  lat?: string;
  lon?: string;
  display_name?: string;
  address?: ReverseGeocodeAddress;
  boundingbox?: [string, string, string, string];
}

export interface UserGPSLoc {
  lat: number;
  lon: number;
}

export interface UserAgentNext {
  isBot: boolean;
  browser: {
    name?: string;
    version?: string;
  };
  device: {
    model?: string;
    type?: string;
    vendor?: string;
  };
  engine: {
    name?: string;
    version?: string;
  };
  os: {
    name?: string;
    version?: string;
  };
  cpu: {
    architecture?: string;
  };
}

//sowing rate interface
export interface SowingRateDBData {
  id: string;
  plant: Plant;
  coefficientSecurity: CoefficientSecurity;
  wantedPlantsPerMeterSquared: WantedPlantsPerMeterSquared;
  massPer1000g: MassPer1000g;
  purity: Purity;
  germination: Germination;
  rowSpacing: RowSpacing;
}

export interface ActivePlantDbData {
  id: string;
  latinName: string;
  plantType: string;
  minSeedingRate: number;
  maxSeedingRate: number;
  priceFor1kgSeedsBGN: number;
}

export interface Plant {
  plantId: string;
  plantLatinName: string;
}

export interface CoefficientSecurity {
  type: string; // "slider" or "const"
  unit: string;
  step?: number;
  minSliderVal?: number;
  maxSliderVal?: number;
  constValue?: number;
}

export interface WantedPlantsPerMeterSquared {
  type: string; // "slider" or "const"
  unit: string;
  step?: number;
  minSliderVal?: number;
  maxSliderVal?: number;
  constValue?: number;
}

export interface MassPer1000g {
  type: string; // "slider" or "const"
  unit: string;
  step?: number;
  minSliderVal?: number;
  maxSliderVal?: number;
  constValue?: number;
}

export interface Purity {
  type: string; // "slider" or "const"
  unit: string;
  step?: number;
  minSliderVal?: number;
  maxSliderVal?: number;
  constValue?: number;
}

export interface Germination {
  type: string; // "slider" or "const"
  unit: string;
  step?: number;
  minSliderVal?: number;
  maxSliderVal?: number;
  constValue?: number;
}

export interface RowSpacing {
  type: string; // "slider" or "const"
  unit: string;
  step?: number;
  minSliderVal?: number;
  maxSliderVal?: number;
  constValue?: number;
}

export interface BuildSowingRateRowProps<T extends Exclude<keyof SowingRateDBData, 'plant'>> {
  varName: T;
  displayName: string;
  activePlantDbData: SowingRateDBData;
  form: any;
  icon: React.ReactNode;
  translator: (key: string) => string;
  tourId: string;
}

export interface DisplayOutputRowProps {
  data: number;
  text: string;
  unit: string;
}

export interface SowingRateSaveData {
  userId: string;
  plantId: string;
  plantLatinName: string;
  sowingRateSafeSeedsPerMeterSquared: number;
  sowingRatePlantsPerAcre: number;
  usedSeedsKgPerAcre: number;
  internalRowHeightCm: number;
  totalArea: number;
  isDataValid: boolean;
}

export interface SowingRateHistory {
  id: string;
  plant: {
    latinName: string;
    id: string;
  };
  sowingRateSafeSeedsPerMeterSquared: number;
  sowingRatePlantsPerAcre: number;
  usedSeedsKgPerAcre: number;
  internalRowHeightCm: number;
  totalArea: number;
  isDataValid: boolean;
  createdAt: Date;
}

export interface SeedingDataCombinationHistory {
  id: string;
  userId: string;
  plants: {
    plant: {
      latinName: string;
    };
    plantType: string;
    seedingRate: number;
    participation: number;
    combinedRate: number;
    pricePerAcreBGN: number;
  }[];
  totalPrice: number;
  isDataValid: boolean;
  createdAt: Date;
}

//combined interface
export interface PlantCombinedDBData {
  id: string;
  latinName: string;
  plantType: string;
  minSeedingRate: number;
  maxSeedingRate: number;
  priceFor1kgSeedsBGN: number;
}

export interface SeedCombinedRowProps {
  form: any;
  name: string;
  index: number;
  dbData: any[];
}

export interface SeedCombinedSectionProps {
  name: string;
  title: string;
  maxPercentage: number;
  form: any;
  dbData: any[];
}

export interface CombinedHistoryDataPlant {
  plantLatinName: string;
  plantType: string;
  seedingRate: number;
  participation: number;
  combinedRate: number;
  pricePerAcreBGN: number;
}

export interface CombinedHistoryData {
  plants: CombinedHistoryDataPlant[];
  totalPrice: number;
  userId: string;
  isDataValid: boolean;
}

//hook combined form
export interface ActivePlantsFormData {
  plantId: string;
  plantType: string;
  seedingRate: number;
  participation: number;
  combinedRate: number;
  pricePerAcreBGN: number;
}

export interface CombinedCalcDBData {
  plants: ActivePlantsFormData[];
  totalPrice: number;
  userId: string;
  isDataValid: boolean;
}

export interface PlantCombinedDBData {
  id: string;
  latinName: string;
  plantType: string;
  minSeedingRate: number;
  maxSeedingRate: number;
  priceFor1kgSeedsBGN: number;
}

export interface CombinedFormValues {
  legume: {
    active: boolean;
    id: string;
    plantType: string;
    dropdownPlant: string;
    seedingRate: number;
    participation: number;
    seedingRateInCombination: number;
    priceSeedsPerAcreBGN: number;
  }[];
  cereal: {
    active: boolean;
    id: string;
    plantType: string;
    dropdownPlant: string;
    seedingRate: number;
    participation: number;
    seedingRateInCombination: number;
    priceSeedsPerAcreBGN: number;
  }[];
}

//chem protection
export interface ChemicalOption {
  id: string;
  nameKey: string;
  dosage: number;
  dosageUnit: string;
}
export interface ChemProtPercentFormValues {
  desiredPercentage: number;
  sprayerVolume: number;
  calculatedAmount: number;
}

export interface ChemProtPercentHistory {
  id: string;
  userId: string;
  desiredPercentage: number;
  sprayerVolume: number;
  calculatedAmount: number;
  createdAt: Date;
}

export interface ChemProtWorkingInputPlantChem {
  plant: WikiPlant;
  chemical: WikiChemical;
}

export interface ChemProtWorkingFormValues {
  chemicalPerAcreML: number;
  workingSolutionPerAcreLiters: number;
  sprayerVolumePerAcreLiters: number;
  areaToBeSprayedAcres: number;
}

export interface ChemProtWorkingSolutionBuildInputRowProps {
  varName: string;
  displayName: string;
  form: any;
  icon: React.ReactNode;
  translator: (key: string) => string;
  unit: string;
  displayValue?: string;
  id?: string;
}

export interface ChemProtWorkingToSave {
  userId: string;
  plantId: string;
  chemicalId: string;
  isDataValid: boolean;
  totalChemicalForAreaLiters: number;
  totalWorkingSolutionForAreaLiters: number;
  roughSprayerCount: number;
  chemicalPerSprayerML: number;
}

export interface ChemProtWorkingSolutionHistory {
  plant?: {
    id: string;
    latinName: string;
  } | null;
  chemical?: {
    id: string;
    nameKey: string;
  } | null;
  totalChemicalForAreaLiters: number;
  totalWorkingSolutionForAreaLiters: number;
  roughSprayerCount: number;
  chemicalPerSprayerML: number;
}

export interface RechartsTooltipProps {
  contentStyle: RechartsTooltipPropsContentStyle;
  itemStyle: RechartsTooltipPropsItemStyle;
  labelStyle: RechartsTooltipPropsLabelStyle;
  wrapperStyle: RechartsTooltipPropsWrapperStyle;
}

export interface RechartsTooltipPropsContentStyle {
  backgroundColor: string;
  border: string;
  borderRadius: string;
  padding: string;
  color: string;
  boxShadow: string;
}

export interface RechartsTooltipPropsItemStyle {
  color: string;
}

export interface RechartsTooltipPropsLabelStyle {
  color: string;
}

export interface RechartsTooltipPropsWrapperStyle {
  outline: string;
}

//wiki interface
export interface WikiBaseEntity {
  id: string;
}

export interface WikiPlant extends WikiBaseEntity {
  plantId: string;
  latinName: string;
}

export interface WikiChemical extends WikiBaseEntity {
  nameKey: string;
  type: string;
  applicationStage: string;
  dosage: number;
  dosageUnit: string;
  maxApplications: number;
  minIntervalBetweenApplicationsDays: number;
  maxIntervalBetweenApplicationsDays: number;
  quarantinePeriodDays: number;
  pricePer1LiterBGN: number;
  pricePerAcreBGN: number;
  additionalInfo?: string;
  additionalInfoNotes?: string;
  activeIngredients: WikiChemicalActiveIngredient[];
  plantUsages: {
    id: string;
    plant: WikiPlant;
  }[];
  chemicalTargetEnemies: {
    id: string;
    enemy: WikiEnemy;
  }[];
}

export interface WikiEnemy extends WikiBaseEntity {
  latinName: string;
  chemicals: WikiChemicalToEnemy[];
}

export interface WikiChemicalActiveIngredient extends WikiBaseEntity {
  chemicalId: string;
  activeIngredientId: string;
  quantity: number;
  activeIngredient: {
    id: string;
    nameKey: string;
    unit: string;
  };
}

export interface WikiChemicalToEnemy extends WikiBaseEntity {
  chemicalId: string;
  enemyId: string;
  enemy: WikiEnemy;
  chemical: WikiChemical;
}

export interface WikiPlantChemical extends WikiBaseEntity {
  plantId: string;
  chemicalId: string;
  plant: WikiPlant;
  chemical: WikiChemical;
}

export interface WikiPlantSowingRate {
  plant: WikiPlant;
  coefficientSecurity: CoefficientSecurity;
  wantedPlantsPerMeterSquared: WantedPlantsPerMeterSquared;
  massPer1000g: MassPer1000g;
  purity: Purity;
  germination: Germination;
  rowSpacing: RowSpacing;
}

export interface WikiPlantCombined {
  plant: WikiPlant;
  plantType: string;
  minSeedingRate: number;
  maxSeedingRate: number;
  priceFor1kgSeedsBGN: number;
}

export interface WikiActiveIngredient extends WikiBaseEntity {
  nameKey: string;
  unit: string;
  chemicals: {
    id: string;
    chemical: {
      id: string;
      nameKey: string;
      type: string;
      applicationStage: string;
      dosage: number;
      dosageUnit: string;
      maxApplications: number;
      minIntervalBetweenApplicationsDays: number;
      maxIntervalBetweenApplicationsDays: number;
      quarantinePeriodDays: number;
      pricePer1LiterBGN: number;
      pricePerAcreBGN: number;
      additionalInfo?: string;
      additionalInfoNotes?: string;
      plantUsages: {
        id: string;
        plant: WikiPlant;
      }[];
    };
  }[];
}

//needed for typecheck
export type IdTokenClaims = {
  sub: string;
  email: string;
  email_verified: boolean;
  name: string;
  picture: string;
};
