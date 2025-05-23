
//general
export interface SupportedOAuthProvider {
    name: string;
    icon: any;
    authURL: string;
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
}

export interface LangMapInterface {
    [key: string]: {
        [key: string]: string;
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
    form: any
    name: string
    index: number
    dbData: any[]
}

export interface SeedCombinedSectionProps {
    name: string
    title: string
    maxPercentage: number
    form: any
    dbData: any[]
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