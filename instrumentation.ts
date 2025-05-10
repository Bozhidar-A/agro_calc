import { SELECTABLE_STRINGS } from "./lib/LangMap";
import { CalculatorValueTypes, ChemicalActiveIngredientDosageUnit, ChemicalApplicationStage, ChemicalDosageUnit, ChemicalType, CombinationTypes, LatinNames } from "./lib/utils";

const chemicalProtectionEnemyTargets = {
  // Балур (от семена)
  [SELECTABLE_STRINGS.CHEMICAL_PROTECTION_ENEMY_TARGET_JOHNSON_GRASS]: {
    nameKey: SELECTABLE_STRINGS.CHEMICAL_PROTECTION_ENEMY_TARGET_JOHNSON_GRASS,
  },
  // Кисела трева
  [SELECTABLE_STRINGS.CHEMICAL_PROTECTION_ENEMY_TARGET_ACID_GRASS]: {
    nameKey: SELECTABLE_STRINGS.CHEMICAL_PROTECTION_ENEMY_TARGET_ACID_GRASS,
  },
  // Кокоше просо
  [SELECTABLE_STRINGS.CHEMICAL_PROTECTION_ENEMY_TARGET_BARNYARD_GRASS]: {
    nameKey: SELECTABLE_STRINGS.CHEMICAL_PROTECTION_ENEMY_TARGET_BARNYARD_GRASS,
  },
  // Кръвно просо
  [SELECTABLE_STRINGS.CHEMICAL_PROTECTION_ENEMY_TARGET_BLOOD_MILLET]: {
    nameKey: SELECTABLE_STRINGS.CHEMICAL_PROTECTION_ENEMY_TARGET_BLOOD_MILLET,
  },
  // Кощрява
  [SELECTABLE_STRINGS.CHEMICAL_PROTECTION_ENEMY_TARGET_KNOTGRASS]: {
    nameKey: SELECTABLE_STRINGS.CHEMICAL_PROTECTION_ENEMY_TARGET_KNOTGRASS,
  },
  // Метлица
  [SELECTABLE_STRINGS.CHEMICAL_PROTECTION_ENEMY_TARGET_GREEN_BRISTLEGRASS]: {
    nameKey: SELECTABLE_STRINGS.CHEMICAL_PROTECTION_ENEMY_TARGET_GREEN_BRISTLEGRASS,
  },
  // Овчарска торбичка
  [SELECTABLE_STRINGS.CHEMICAL_PROTECTION_ENEMY_TARGET_SHEPHERD_PURSE]: {
    nameKey: SELECTABLE_STRINGS.CHEMICAL_PROTECTION_ENEMY_TARGET_SHEPHERD_PURSE,
  },
  // Тученица
  [SELECTABLE_STRINGS.CHEMICAL_PROTECTION_ENEMY_TARGET_PURSLANE]: {
    nameKey: SELECTABLE_STRINGS.CHEMICAL_PROTECTION_ENEMY_TARGET_PURSLANE,
  },
  // Черно куче грозде
  [SELECTABLE_STRINGS.CHEMICAL_PROTECTION_ENEMY_TARGET_BLACK_NIGHTSHADE]: {
    nameKey: SELECTABLE_STRINGS.CHEMICAL_PROTECTION_ENEMY_TARGET_BLACK_NIGHTSHADE,
  },
  // Видове щир
  [SELECTABLE_STRINGS.CHEMICAL_PROTECTION_ENEMY_TARGET_AMARANTH_SPECIES]: {
    nameKey: SELECTABLE_STRINGS.CHEMICAL_PROTECTION_ENEMY_TARGET_AMARANTH_SPECIES,
  },
};


const dbData = {
  plants: [
    //there is some cross over but what can be seperated is seperated
    //seeding
    {
      latinName: LatinNames.PISUM_SATIVUM // Грах (Pea)
    },
    {
      latinName: LatinNames.GLYCINE_MAX // Соя (Soybean)
    },
    {
      latinName: LatinNames.SORGHUM_VULGARE_VAR_TEHNICUM // Сорго (Sorghum)
    },
    {
      latinName: LatinNames.ZEA_MAYS // Царевица (Corn)
    },

    //combined
    // Legumes (бобови)
    {
      latinName: LatinNames.MEDICAGO_SATIVA, // Люцерна (Alfalfa)
    },
    {
      latinName: LatinNames.TRIFOLIUM_STELLATUM, // Звездан (Star Clover)
    },
    {
      latinName: LatinNames.TRIFOLIUM_PRATENSE, // Червена детелина (Red Clover)
    },
    {
      latinName: LatinNames.TRIFOLIUM_REPENS, // Бяла детелина (White Clover)
    },
    // Cereals (зърнени)
    {
      latinName: LatinNames.LOLIUM_PERENNE, // Пасищен райграс (Perennial Ryegrass)
    },
    {
      latinName: LatinNames.AGROPYRON_CRISTATUM, // Гребенчат житняк (Crested Wheatgrass)
    },
    {
      latinName: LatinNames.DACTYLIS_GLOMERATA, // Ежова главица (Orchard Grass)
    },
    {
      latinName: LatinNames.AVENULA_PUBESCENS, // Безосилеста овсига (Downy Oatgrass)
    },
    {
      latinName: LatinNames.FESTUCA_PRATENSIS, // Ливадна власатка (Meadow Fescue)
    },
    {
      latinName: LatinNames.FESTUCA_RUBRA, // Червена власатка (Red Fescue)
    }
  ],
  SowingRateData: [
    {
      plantName: LatinNames.MEDICAGO_SATIVA, // Alfalfa
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
      plantName: LatinNames.PISUM_SATIVUM, // Pea  
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
      plantName: LatinNames.GLYCINE_MAX, // Soybean
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
      plantName: LatinNames.SORGHUM_VULGARE_VAR_TEHNICUM, // Industrial sorghum
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
      plantName: LatinNames.ZEA_MAYS, // Corn
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
      plantName: LatinNames.MEDICAGO_SATIVA,
      plantType: CombinationTypes.LEGUME,
      minSeedingRate: 2.5,
      maxSeedingRate: 3,
      priceFor1kgSeedsBGN: 26,
    },
    {
      plantName: LatinNames.TRIFOLIUM_STELLATUM,
      plantType: CombinationTypes.LEGUME,
      minSeedingRate: 1.5,
      maxSeedingRate: 2,
      priceFor1kgSeedsBGN: 34.5,
    },
    {
      plantName: LatinNames.TRIFOLIUM_PRATENSE,
      plantType: CombinationTypes.LEGUME,
      minSeedingRate: 2,
      maxSeedingRate: 2.5,
      priceFor1kgSeedsBGN: 29.3,
    },
    {
      plantName: LatinNames.TRIFOLIUM_REPENS,
      plantType: CombinationTypes.LEGUME,
      minSeedingRate: 2,
      maxSeedingRate: 2.5,
      priceFor1kgSeedsBGN: 35.9,
    },
    // Cereals (зърнени)
    {
      plantName: LatinNames.LOLIUM_PERENNE,
      plantType: CombinationTypes.CEREAL,
      minSeedingRate: 1,
      maxSeedingRate: 2.5,
      priceFor1kgSeedsBGN: 13.8,
    },
    {
      plantName: LatinNames.AGROPYRON_CRISTATUM,
      plantType: CombinationTypes.CEREAL,
      minSeedingRate: 1,
      maxSeedingRate: 1.5,
      priceFor1kgSeedsBGN: 10.5,
    },
    {
      plantName: LatinNames.DACTYLIS_GLOMERATA,
      plantType: CombinationTypes.CEREAL,
      minSeedingRate: 0.7,
      maxSeedingRate: 1,
      priceFor1kgSeedsBGN: 19.9,
    },
    {
      plantName: LatinNames.AVENULA_PUBESCENS,
      plantType: CombinationTypes.CEREAL,
      minSeedingRate: 2,
      maxSeedingRate: 2.5,
      priceFor1kgSeedsBGN: 47,
    },
    {
      plantName: LatinNames.FESTUCA_PRATENSIS,
      plantType: CombinationTypes.CEREAL,
      minSeedingRate: 0.8,
      maxSeedingRate: 1.2,
      priceFor1kgSeedsBGN: 22,
    },
    {
      plantName: LatinNames.FESTUCA_RUBRA,
      plantType: CombinationTypes.CEREAL,
      minSeedingRate: 0.7,
      maxSeedingRate: 1,
      priceFor1kgSeedsBGN: 7.8,
    }
  ],
  ChemicalProtection: [
    //Medicago sativa (люцерна, alfalfa)
    {
      //ДУАЛ ГОЛД 960 ЕК
      plantName: LatinNames.MEDICAGO_SATIVA,
      nameKey: SELECTABLE_STRINGS.CHEMICAL_PROTECTION_CHEM_DUAL_GOLD_960_EC,
      type: ChemicalType.HERBICIDE,
      activeIngredients: [
        {
          //960 g/l S-метолахлор
          nameKey: SELECTABLE_STRINGS.CHEMICAL_PROTECTION_ACTIVE_INGREDIENT_S_METOLAXLOUR,
          quantity: 960,
          unit: ChemicalActiveIngredientDosageUnit.G_L
        }
      ],
      applicationStage: ChemicalApplicationStage.AFTER_PLANTING_BEFORE_GERMINATION,
      applicationStageNotes: "",
      chemicalTarget: [
        // Балур (от семена)
        LatinNames.SORGHUM_HALEPENSE,
        // Кисела трева
        LatinNames.ACID_GRASS,
        // Кокоше просо
        LatinNames.ECHINOCHLOA_CRUS_GALLI,
        // Кръвно просо
        LatinNames.PANICUM_SANGUINALE,
        // Кощрява
        LatinNames.POLYGONUM_AVICULARE,
        // Метлица
        LatinNames.SETARIA_VIRIDIS,
        // Овчарска торбичка
        LatinNames.CAPSELLA_BURSA_PASTORIS,
        // Тученица
        LatinNames.PORTULACA_OLERACEA,
        // Черно куче грозде
        LatinNames.SOLANUM_NIGRUM,
        // Видове щир
        LatinNames.AMARANTHUS_SPP,
      ],
      dosage: 150,
      dosageUnit: ChemicalDosageUnit.ML_ACRE,
      maxApplications: 1,
      minIntervalBetweenApplicationsDays: 0,
      maxIntervalBetweenApplicationsDays: 0,
      quarantinePeriodDays: 0,
      pricePer1LiterBGN: 49,
      pricePerAcreBGN: 7.35,
      //Внася се след сеитба, преди поникване на културата и на плевелите.
      additionalInfo: SELECTABLE_STRINGS.CHEMICAL_PROTECTION_CHEM_DUAL_GOLD_960_EC_INFO,
      //За увеличаване ефикасността срещу широколистните плевели е препоръчително добавяне на противошироколистен хербицид в работния разтвор при третирането. Внасянето се извършва с работен разтвор от 30 до 60 l/da вода в зависимост от наличното земеделско оборудване. 
      additionalInfoNotes: SELECTABLE_STRINGS.CHEMICAL_PROTECTION_CHEM_DUAL_GOLD_960_EC_INFO_NOTES,
    },
    {
      //ДУАЛ ГОЛД 960 ЕК
      plantName: LatinNames.MEDICAGO_SATIVA,
      nameKey: SELECTABLE_STRINGS.CHEMICAL_PROTECTION_CHEM_DUAL_GOLD_960_EC,
      type: ChemicalType.HERBICIDE,
      activeIngredients: [
        {
          //960 g/l S-метолахлор
          nameKey: SELECTABLE_STRINGS.CHEMICAL_PROTECTION_ACTIVE_INGREDIENT_S_METOLAXLOUR,
          quantity: 960,
          unit: ChemicalActiveIngredientDosageUnit.G_L
        }
      ],
      applicationStage: ChemicalApplicationStage.AFTER_PLANTING_BEFORE_GERMINATION,
      applicationStageNotes: "",
      chemicalTarget: [
      ],
      dosage: 150,
      dosageUnit: ChemicalDosageUnit.ML_ACRE,
      maxApplications: 1,
      minIntervalBetweenApplicationsDays: 0,
      maxIntervalBetweenApplicationsDays: 0,
      quarantinePeriodDays: 0,
      pricePer1LiterBGN: 49,
      pricePerAcreBGN: 7.35,
      //Внася се след сеитба, преди поникване на културата и на плевелите.
      additionalInfo: SELECTABLE_STRINGS.CHEMICAL_PROTECTION_CHEM_DUAL_GOLD_960_EC_INFO,
      //За увеличаване ефикасността срещу широколистните плевели е препоръчително добавяне на противошироколистен хербицид в работния разтвор при третирането. Внасянето се извършва с работен разтвор от 30 до 60 l/da вода в зависимост от наличното земеделско оборудване. 
      additionalInfoNotes: SELECTABLE_STRINGS.CHEMICAL_PROTECTION_CHEM_DUAL_GOLD_960_EC_INFO_NOTES,
    },
    {
      // ЕКЛИПС 70 ВДГ
      plantName: LatinNames.MEDICAGO_SATIVA,
      nameKey: SELECTABLE_STRINGS.CHEMICAL_PROTECTION_CHEM_ECLIPSE_70_WDG,
      type: ChemicalType.HERBICIDE,
      activeIngredients: [
        {
          // 700 g/kg метрибузин
          nameKey: SELECTABLE_STRINGS.CHEMICAL_PROTECTION_ACTIVE_INGREDIENT_METRIBUZIN,
          quantity: 700,
          unit: ChemicalActiveIngredientDosageUnit.G_KG
        }
      ],
      applicationStage: ChemicalApplicationStage.OUT_OF_VEGETATION,
      applicationStageNotes: "",
      chemicalTargets: [],
      dosage: 50,
      dosageUnit: ChemicalDosageUnit.G_ACRE,
      maxApplications: 1,
      minIntervalBetweenApplicationsDays: 0,
      maxIntervalBetweenApplicationsDays: 0,
      quarantinePeriodDays: 60,
      pricePer1LiterBGN: 101,
      pricePerAcreBGN: 5.05,
      //Третирането се извършва есента, след реколтиране на последният откос, когато люцерната е във вегетационен покой.
      additionalInfo: SELECTABLE_STRINGS.CHEMICAL_PROTECTION_CHEM_ECLIPSE_70_WDG_INFO,
      //Да не се внася върху песъчливи почви с по-малко от 0,5% хумус. При смесване с други продукти за растителна защита, да се спазва по-дълг карантинен срок. Внасянето се извършва с работен разтвор от 25 до 50 l/da вода в зависимост от наличното земеделско оборудване. 
      additionalInfoNotes: SELECTABLE_STRINGS.CHEMICAL_PROTECTION_CHEM_ECLIPSE_70_WDG_INFO_NOTES,
    },
    {
      // ЛЕОПАРД 5 ЕК
      plantName: LatinNames.MEDICAGO_SATIVA,
      nameKey: SELECTABLE_STRINGS.CHEMICAL_PROTECTION_CHEM_LEOPARD_5_EC,
      type: ChemicalType.HERBICIDE,
      activeIngredients: [
        {
          // 50 g/l квизалофоп-П-етил
          nameKey: SELECTABLE_STRINGS.CHEMICAL_PROTECTION_ACTIVE_INGREDIENT_QUIZALOFOP_P_ETHYL,
          quantity: 50,
          unit: ChemicalActiveIngredientDosageUnit.G_L
        }
      ],
      applicationStage: ChemicalApplicationStage.VEGETATION,
      applicationStageNotes: "",
      chemicalTargets: [],
      dosage: 100,
      dosageUnit: ChemicalDosageUnit.ML_ACRE,
      maxApplications: 2,
      minIntervalBetweenApplicationsDays: 30,
      maxIntervalBetweenApplicationsDays: 30,
      quarantinePeriodDays: 30,
      pricePer1LiterBGN: 66.4,
      pricePerAcreBGN: 6.64,
      // Внася се от първи до четвърти лист на люцерната и при височина на балура 10-20 cm.
      additionalInfo: SELECTABLE_STRINGS.CHEMICAL_PROTECTION_CHEM_LEOPARD_5_EC_INFO,
      // Срещу многогодишни житни плевели, включително Балур (от коренища) - до 10-15 cm височина на балура. Троскот и Пирей – в активна вегетация на плевелите се внася в доза 200 ml/da. Внасянето се извършва с работен разтвор от 30 до 40 l/da вода в зависимост от наличното земеделско оборудване. 
      additionalInfoNotes: SELECTABLE_STRINGS.CHEMICAL_PROTECTION_CHEM_LEOPARD_5_EC_INFO_NOTES,
    },
    {
      // ЛЕНТАГРАН ВП
      plantName: LatinNames.MEDICAGO_SATIVA,
      nameKey: SELECTABLE_STRINGS.CHEMICAL_PROTECTION_CHEM_LENTAGRAN_WP,
      type: ChemicalType.HERBICIDE,
      activeIngredients: [
        {
          // 450 g/kg пиридат
          nameKey: SELECTABLE_STRINGS.CHEMICAL_PROTECTION_ACTIVE_INGREDIENT_PYRIDATE,
          quantity: 450,
          unit: ChemicalActiveIngredientDosageUnit.G_KG
        }
      ],
      applicationStage: ChemicalApplicationStage.VEGETATION,
      applicationStageNotes: "",
      chemicalTargets: [],
      dosage: 200,
      dosageUnit: ChemicalDosageUnit.G_ACRE,
      maxApplications: 1,
      minIntervalBetweenApplicationsDays: 0,
      maxIntervalBetweenApplicationsDays: 0,
      quarantinePeriodDays: 28,
      pricePer1LiterBGN: 104.74,
      pricePerAcreBGN: 20.95,
      // Да се прилага в начални фенофази от развитието на плевелите, до трети троен лист на културата.
      additionalInfo: SELECTABLE_STRINGS.CHEMICAL_PROTECTION_CHEM_LENTAGRAN_WP_INFO,
      // Не се препоръчва приложение на Лентагран ВП при активен летеж на медоносните пчели.
      // Внасянето се извършва с работен разтвор от 20 до 60 l/da вода в зависимост от наличното земеделско оборудване.
      additionalInfoNotes: SELECTABLE_STRINGS.CHEMICAL_PROTECTION_CHEM_LENTAGRAN_WP_INFO_NOTES,
    },
    {
      // ПУЛСАР 40
      plantName: LatinNames.MEDICAGO_SATIVA,
      nameKey: SELECTABLE_STRINGS.CHEMICAL_PROTECTION_CHEM_PULSAR_40,
      type: ChemicalType.HERBICIDE,
      activeIngredients: [
        {
          // 41 g/l имазамокс
          nameKey: SELECTABLE_STRINGS.CHEMICAL_PROTECTION_ACTIVE_INGREDIENT_IMAZAMOX,
          quantity: 41,
          unit: ChemicalActiveIngredientDosageUnit.G_L
        }
      ],
      applicationStage: ChemicalApplicationStage.VEGETATION,
      applicationStageNotes: "",
      chemicalTargets: [],
      dosage: 50,
      dosageUnit: ChemicalDosageUnit.ML_ACRE,
      maxApplications: 1,
      minIntervalBetweenApplicationsDays: 0,
      maxIntervalBetweenApplicationsDays: 0,
      quarantinePeriodDays: 90,
      pricePer1LiterBGN: 100.31,
      pricePerAcreBGN: 5.02,
      // Внася се във фаза втори-четвърти лист на културата с добавяне на 50 ml/da прилепител ДЕШ.
      additionalInfo: SELECTABLE_STRINGS.CHEMICAL_PROTECTION_CHEM_PULSAR_40_INFO,
      // При млада люцерна (в годината на създаване на посева) се внася в доза 120 ml/da един месец, след сеитба на културата.
      // Внасянето се извършва с работен разтвор от 15 до 20 l/da вода в зависимост от наличното земеделско оборудване.
      additionalInfoNotes: SELECTABLE_STRINGS.CHEMICAL_PROTECTION_CHEM_PULSAR_40_INFO_NOTES,
    },
    {
      // ДЕЦИС 100 ЕК
      plantName: LatinNames.MEDICAGO_SATIVA,
      nameKey: SELECTABLE_STRINGS.CHEMICAL_PROTECTION_CHEM_DECIS_100_EC,
      type: ChemicalType.INSECTICIDE,
      activeIngredients: [
        {
          // 100 g/l делтаметрин
          nameKey: SELECTABLE_STRINGS.CHEMICAL_PROTECTION_ACTIVE_INGREDIENT_DELTAMETHRIN,
          quantity: 100,
          unit: ChemicalActiveIngredientDosageUnit.G_L
        }
      ],
      applicationStage: ChemicalApplicationStage.VEGETATION,
      applicationStageNotes: "",
      chemicalTargets: [],
      dosage: 6.25,
      dosageUnit: ChemicalDosageUnit.ML_ACRE,
      maxApplications: 2,
      minIntervalBetweenApplicationsDays: 14,
      maxIntervalBetweenApplicationsDays: 14,
      quarantinePeriodDays: 14,
      pricePer1LiterBGN: 193.75,
      pricePerAcreBGN: 1.21,
      // Внасянето се извършва при поява на неприятелите над икономическия праг на вредност.
      additionalInfo: SELECTABLE_STRINGS.CHEMICAL_PROTECTION_CHEM_DECIS_100_EC_INFO,
      // Притежава много бърз инициален (нокдаун) ефект срещу голям брой смучещи и гризещи неприятели по оранжерийни, зърнени, технически, фуражни, зеленчукови, картофи, овощни видове и лозя.
      // Внасянето се извършва с работен разтвор от 40 до 140 l/da вода в зависимост от наличното земеделско оборудване.
      // Инсектицидът е опасен за пчелите (SPe8).
      additionalInfoNotes: SELECTABLE_STRINGS.CHEMICAL_PROTECTION_CHEM_DECIS_100_EC_INFO_NOTES,
    },
    {
      // ЛАМДЕКС ЕКСТРА
      plantName: LatinNames.MEDICAGO_SATIVA,
      nameKey: SELECTABLE_STRINGS.CHEMICAL_PROTECTION_CHEM_LAMDEX_EXTRA,
      type: ChemicalType.INSECTICIDE,
      activeIngredients: [
        {
          // 25 g/kg ламбда - цихалотрин
          nameKey: SELECTABLE_STRINGS.CHEMICAL_PROTECTION_ACTIVE_INGREDIENT_LAMBDA_CYHALOTHRIN,
          quantity: 25,
          unit: ChemicalActiveIngredientDosageUnit.G_KG
        }
      ],
      applicationStage: ChemicalApplicationStage.VEGETATION,
      applicationStageNotes: "",
      chemicalTargets: [],
      dosage: 42,
      dosageUnit: ChemicalDosageUnit.ML_ACRE,
      maxApplications: 1,
      minIntervalBetweenApplicationsDays: 0,
      maxIntervalBetweenApplicationsDays: 0,
      quarantinePeriodDays: 7,
      pricePer1LiterBGN: 57.872,
      pricePerAcreBGN: 2.43,
      // Да не се извършват повече от две третирания с инсектицида през вегетационния период на културата. Може да се прилага до 120 ml/da.
      additionalInfo: SELECTABLE_STRINGS.CHEMICAL_PROTECTION_CHEM_LAMDEX_EXTRA_INFO,
      // Ефекасен пиретроиден инсектицид със силно контактно и поглъщателно действие срещу широк спектър от вредители.
      // Внасянето се извършва с работен разтвор от 50 до 100 l/da вода в зависимост от наличното земеделско оборудване.
      // Съвместим е за смесено прилагане с други продукти за растителна защита. Опасен е за пчелите - SPe8.
      additionalInfoNotes: SELECTABLE_STRINGS.CHEMICAL_PROTECTION_CHEM_LAMDEX_EXTRA_INFO_NOTES,
    },
    {
      // МЕТЕОР
      plantName: LatinNames.MEDICAGO_SATIVA,
      nameKey: SELECTABLE_STRINGS.CHEMICAL_PROTECTION_CHEM_METEOR,
      type: ChemicalType.INSECTICIDE,
      activeIngredients: [
        {
          // 15,7 g/l делтаметрин
          nameKey: SELECTABLE_STRINGS.CHEMICAL_PROTECTION_ACTIVE_INGREDIENT_DELTAMETHRIN,
          quantity: 15.7,
          unit: ChemicalActiveIngredientDosageUnit.G_L
        }
      ],
      applicationStage: ChemicalApplicationStage.VEGETATION,
      applicationStageNotes: "",
      chemicalTargets: [],
      dosage: 60,
      dosageUnit: ChemicalDosageUnit.ML_ACRE,
      maxApplications: 1,
      minIntervalBetweenApplicationsDays: 0,
      maxIntervalBetweenApplicationsDays: 0,
      quarantinePeriodDays: 15,
      pricePer1LiterBGN: 18,
      pricePerAcreBGN: 1.08,
      // Внасянето се извършва при поява на неприятелите над икономическия праг на вредност. При нападение от скакалци инсектицида се внася 80 ml/da.
      additionalInfo: SELECTABLE_STRINGS.CHEMICAL_PROTECTION_CHEM_METEOR_INFO,
      // Шиpoĸooбxвaтeн несистемен пиретроиден инсектицид със стомашно и контактно действие, paзpeшeн зa yпoтpeбa при различни видoвe селскостопански култури.
      // Oбxвaтa нa дeйcтвиe нa инceĸтицидa вĸлючвa шиpoĸa гaмa лиcтни въшĸи, бpъмбapи, гъceници, пeпepyди, чepвeи и дpyги видове нaceĸoми.
      // Внасянето се извършва с работен разтвор от 60 до 80 l/da вода в зависимост от наличното земеделско оборудване.
      additionalInfoNotes: SELECTABLE_STRINGS.CHEMICAL_PROTECTION_CHEM_METEOR_INFO_NOTES,
    },
    {
      // СУМИ АЛФА 5 ЕК
      plantName: LatinNames.MEDICAGO_SATIVA,
      nameKey: SELECTABLE_STRINGS.CHEMICAL_PROTECTION_CHEM_SUMI_ALPHA_5_EC,
      type: ChemicalType.INSECTICIDE,
      activeIngredients: [
        {
          // 50 g/l есфенвалерат
          nameKey: SELECTABLE_STRINGS.CHEMICAL_PROTECTION_ACTIVE_INGREDIENT_ESFENVALERATE,
          quantity: 50,
          unit: ChemicalActiveIngredientDosageUnit.G_L
        }
      ],
      applicationStage: ChemicalApplicationStage.VEGETATION,
      applicationStageNotes: "",
      chemicalTargets: [],
      dosage: 20,
      dosageUnit: ChemicalDosageUnit.ML_ACRE,
      maxApplications: 2,
      minIntervalBetweenApplicationsDays: 14,
      maxIntervalBetweenApplicationsDays: 21,
      quarantinePeriodDays: 14,
      pricePer1LiterBGN: 42.75,
      pricePerAcreBGN: 0.86,
      // Внасянето се извършва при поява на неприятелите над икономическия праг на вредност.
      // Срещу неприятели през активния вегетационен период на люцерната в семепроизводни посеви.
      additionalInfo: SELECTABLE_STRINGS.CHEMICAL_PROTECTION_CHEM_SUMI_ALPHA_5_EC_INFO,
      // Несистемен широкоспектърен пиретроиден инсектицид от пето поколение с контактно (парализиращо) и стомашно действие с много бърз инициален (нокдаун) ефект.
      // Инсектицида е със силен репелент ефект - отблъсква медоносните пчели от третираната площ в следствие на което, може да се употребява във цъфтеж на културата.
      // Препоръчва се, третиранията да се извършват надвечер, когато е приключила дневната „паша“ на медоносната пчела.
      // Внасянето се извършва с работен разтвор от 20 до 50 l/da вода в зависимост от наличното земеделско оборудване.
      additionalInfoNotes: SELECTABLE_STRINGS.CHEMICAL_PROTECTION_CHEM_SUMI_ALPHA_5_EC_INFO_NOTES,
    },
    {
      // МОСПИЛАН 20 СГ
      plantName: LatinNames.MEDICAGO_SATIVA,
      nameKey: SELECTABLE_STRINGS.CHEMICAL_PROTECTION_CHEM_MOSPILAN_20_SG,
      type: ChemicalType.INSECTICIDE,
      activeIngredients: [
        {
          // 200 g/kg ацетамиприд
          nameKey: SELECTABLE_STRINGS.CHEMICAL_PROTECTION_ACTIVE_INGREDIENT_ACETAMIPRID,
          quantity: 200,
          unit: ChemicalActiveIngredientDosageUnit.G_KG
        }
      ],
      applicationStage: ChemicalApplicationStage.VEGETATION,
      applicationStageNotes: "",
      chemicalTargets: [],
      dosage: 7.5,
      dosageUnit: ChemicalDosageUnit.G_ACRE,
      maxApplications: 2,
      minIntervalBetweenApplicationsDays: 14,
      maxIntervalBetweenApplicationsDays: 21,
      quarantinePeriodDays: 14,
      pricePer1LiterBGN: 301.5,
      pricePerAcreBGN: 2.26,
      // Внасянето се извършва при поява на неприятелите над икономическия праг на вредност.
      additionalInfo: SELECTABLE_STRINGS.CHEMICAL_PROTECTION_CHEM_MOSPILAN_20_SG_INFO,
      // Ефикасен системен неоникотиноид инсектицид с контактно и стомашно действие.
      // Може да се прилага в доза до 10 g/da.
      // Внасянето се извършва с работен разтвор от 50 l/da вода в зависимост от наличното земеделско оборудване.
      additionalInfoNotes: SELECTABLE_STRINGS.CHEMICAL_PROTECTION_CHEM_MOSPILAN_20_SG_INFO_NOTES,
    },
    //Pisum sativum (Грах, Pea)
    {
      // СТОМП АКВА
      plantName: LatinNames.PISUM_SATIVUM,
      nameKey: SELECTABLE_STRINGS.CHEMICAL_PROTECTION_CHEM_STOMP_AQUA,
      type: ChemicalType.HERBICIDE,
      activeIngredients: [
        {
          // 455 g/l пендиметалин
          nameKey: SELECTABLE_STRINGS.CHEMICAL_PROTECTION_ACTIVE_INGREDIENT_PENDIMETHALIN,
          quantity: 455,
          unit: ChemicalActiveIngredientDosageUnit.G_L
        }
      ],
      applicationStage: ChemicalApplicationStage.AFTER_PLANTING_BEFORE_GERMINATION,
      applicationStageNotes: "",
      chemicalTargets: [],
      dosage: 250,
      dosageUnit: ChemicalDosageUnit.ML_ACRE,
      maxApplications: 1,
      minIntervalBetweenApplicationsDays: 0,
      maxIntervalBetweenApplicationsDays: 0,
      quarantinePeriodDays: 0,
      pricePer1LiterBGN: 49.5,
      pricePerAcreBGN: 12.38,
      // Внася се след сеитба, преди поникване на културата и на плевелите.
      additionalInfo: SELECTABLE_STRINGS.CHEMICAL_PROTECTION_CHEM_STOMP_AQUA_INFO,
      // Може да се използва в доза до 300 ml/da.
      // Да не се третира при температури над 30 °С поради силно изпарение на работния разтвор.
      // Внасянето се извършва с работен разтвор от 20 до 60 l/da вода в зависимост от наличното земеделско оборудване.
      additionalInfoNotes: SELECTABLE_STRINGS.CHEMICAL_PROTECTION_CHEM_STOMP_AQUA_INFO_NOTES,
    },
    {
      // ЧЕЛИНДЖ 600 СК
      plantName: LatinNames.PISUM_SATIVUM,
      nameKey: SELECTABLE_STRINGS.CHEMICAL_PROTECTION_CHEM_CHALLENGE_600_SC,
      type: ChemicalType.HERBICIDE,
      activeIngredients: [
        {
          // 600 g/l аклонифен
          nameKey: SELECTABLE_STRINGS.CHEMICAL_PROTECTION_ACTIVE_INGREDIENT_ACLONIFEN,
          quantity: 600,
          unit: ChemicalActiveIngredientDosageUnit.G_L
        }
      ],
      applicationStage: ChemicalApplicationStage.AFTER_PLANTING_BEFORE_GERMINATION,
      applicationStageNotes: "",
      chemicalTargets: [],
      dosage: 300,
      dosageUnit: ChemicalDosageUnit.ML_ACRE,
      maxApplications: 1,
      minIntervalBetweenApplicationsDays: 0,
      maxIntervalBetweenApplicationsDays: 0,
      quarantinePeriodDays: 0,
      pricePer1LiterBGN: 76.94,
      pricePerAcreBGN: 23.08,
      // Внася се след сеитба, преди поникване на културата и на плевелите.
      additionalInfo: SELECTABLE_STRINGS.CHEMICAL_PROTECTION_CHEM_CHALLENGE_600_SC_INFO,
      // Хербицидът може да се внесе вегетационно във междуфазния период втори осми същински лист на граха в доза до 50 ml/da при отсъствие на почвено приложение.
      // Внасянето се извършва с работен разтвор от 10 до 30 l/da вода в зависимост от наличното земеделско оборудване.
      additionalInfoNotes: SELECTABLE_STRINGS.CHEMICAL_PROTECTION_CHEM_CHALLENGE_600_SC_INFO_NOTES,
    },
    {
      // СТРАТОС УЛТРА
      plantName: LatinNames.PISUM_SATIVUM,
      nameKey: SELECTABLE_STRINGS.CHEMICAL_PROTECTION_CHEM_STRATOS_ULTRA,
      type: ChemicalType.HERBICIDE,
      activeIngredients: [
        {
          // 100 g/l циклоксидим
          nameKey: SELECTABLE_STRINGS.CHEMICAL_PROTECTION_ACTIVE_INGREDIENT_CYCLOXIDIM,
          quantity: 100,
          unit: ChemicalActiveIngredientDosageUnit.G_L
        }
      ],
      applicationStage: ChemicalApplicationStage.VEGETATION,
      applicationStageNotes: "",
      chemicalTargets: [],
      dosage: 200,
      dosageUnit: ChemicalDosageUnit.ML_ACRE,
      maxApplications: 1,
      minIntervalBetweenApplicationsDays: 0,
      maxIntervalBetweenApplicationsDays: 0,
      quarantinePeriodDays: 60,
      pricePer1LiterBGN: 57.324,
      pricePerAcreBGN: 11.46,
      // Внасянето на хербицида да не си извършва при резки температурни амплитуди (голяма разлика между дневна и нощна температура), както и при наводнени или силно засушени посеви.
      // За повишаване ефикасността на хербицида едногодишните и многогодишни житни плевели е необходимо да се третират до фаза братене.
      // Балур (от коренища) - до 10-15 cm височина на балура. Троскот и пирей – в активна вегетация на плевелите.
      additionalInfo: SELECTABLE_STRINGS.CHEMICAL_PROTECTION_CHEM_STRATOS_ULTRA_INFO,
      // Най-добро усвояване на хербицида се получава при температурния диапазон от 8.0 до 25.0 °C.
      // Превалявания от дъжд 1 час след третиране не намалява ефикасността на продукта.
      // Внасянето се извършва с работен разтвор от 15 до 20 l/da вода в зависимост от наличното земеделско оборудване.
      additionalInfoNotes: SELECTABLE_STRINGS.CHEMICAL_PROTECTION_CHEM_STRATOS_ULTRA_INFO_NOTES,
    },
    {
      // АЧИБА МАКС
      plantName: LatinNames.PISUM_SATIVUM,
      nameKey: SELECTABLE_STRINGS.CHEMICAL_PROTECTION_CHEM_ACHIBA_MAX,
      type: ChemicalType.HERBICIDE,
      activeIngredients: [
        {
          // 100 g/l хизалофоп - P - етил
          nameKey: SELECTABLE_STRINGS.CHEMICAL_PROTECTION_ACTIVE_INGREDIENT_QUIZALOFOP_P_ETHYL,
          quantity: 100,
          unit: ChemicalActiveIngredientDosageUnit.G_L
        }
      ],
      applicationStage: ChemicalApplicationStage.VEGETATION,
      applicationStageNotes: "",
      chemicalTargets: [],
      dosage: 75,
      dosageUnit: ChemicalDosageUnit.ML_ACRE,
      maxApplications: 1,
      minIntervalBetweenApplicationsDays: 0,
      maxIntervalBetweenApplicationsDays: 0,
      quarantinePeriodDays: 21,
      pricePer1LiterBGN: 67.34,
      pricePerAcreBGN: 5.05,
      // Внасянето на хербицида може да се извърши във фаза първи същински лист и/или в пълна зрялост на граха (при производство на семена).
      additionalInfo: SELECTABLE_STRINGS.CHEMICAL_PROTECTION_CHEM_ACHIBA_MAX_INFO,
      // Срещу многогодишни житни плевели, включително Балур (от коренища) - до 10-15 cm височина на балура.
      // Троскот и Пирей – в активна вегетация на плевелите се внася в доза 150 ml/da.
      // Внасянето се извършва с работен разтвор от 20 до 40 l/da вода в зависимост от наличното земеделско оборудване.
      additionalInfoNotes: SELECTABLE_STRINGS.CHEMICAL_PROTECTION_CHEM_ACHIBA_MAX_INFO_NOTES,
    },
    {
      // КОРУМ
      plantName: LatinNames.PISUM_SATIVUM,
      nameKey: SELECTABLE_STRINGS.CHEMICAL_PROTECTION_CHEM_CORUM,
      type: ChemicalType.HERBICIDE,
      activeIngredients: [
        {
          // 480 g/l бентазон
          nameKey: SELECTABLE_STRINGS.CHEMICAL_PROTECTION_ACTIVE_INGREDIENT_BENTAZONE,
          quantity: 480,
          unit: ChemicalActiveIngredientDosageUnit.G_L
        },
        {
          // 22.4 g/l имазамокс
          nameKey: SELECTABLE_STRINGS.CHEMICAL_PROTECTION_ACTIVE_INGREDIENT_IMAZAMOX,
          quantity: 22.4,
          unit: ChemicalActiveIngredientDosageUnit.G_L
        }
      ],
      applicationStage: ChemicalApplicationStage.VEGETATION,
      applicationStageNotes: "",
      chemicalTargets: [],
      dosage: 125,
      dosageUnit: ChemicalDosageUnit.ML_ACRE,
      maxApplications: 1,
      minIntervalBetweenApplicationsDays: 0,
      maxIntervalBetweenApplicationsDays: 0,
      quarantinePeriodDays: 35,
      pricePer1LiterBGN: 199.24,
      pricePerAcreBGN: 24.91,
      // Внася се във фаза втори същински лист, прилистниците на културата се разтварят или се развиват 2 мустачета, до визуализирано пето странично разклонение) с добавяне на адювант (прилепител) ДЕШ ХЦ в концентрация 0,25 – 0,3% в работния разтвор.
      additionalInfo: SELECTABLE_STRINGS.CHEMICAL_PROTECTION_CHEM_CORUM_INFO,
      // Слънчево и топло време с температури от 12,0 до 25,0°C стимулира активния растеж на плевелите и усилва действието.
      // Хладното, мрачно време или продължително засушаване намалява ефикасността.
      // Превалявания до 1 час след третиране не намаляват действието.
      // Внасянето се извършва с работен разтвор от 20 до 30 l/da вода в зависимост от наличното земеделско оборудване.
      additionalInfoNotes: SELECTABLE_STRINGS.CHEMICAL_PROTECTION_CHEM_CORUM_INFO_NOTES,
    },
    {
      // ЛЕБРОН 0,5 Г
      plantName: LatinNames.PISUM_SATIVUM,
      nameKey: SELECTABLE_STRINGS.CHEMICAL_PROTECTION_CHEM_LEBRON_0_5_G,
      type: ChemicalType.INSECTICIDE,
      activeIngredients: [
        {
          // 5 g/kg тефлутрин
          nameKey: SELECTABLE_STRINGS.CHEMICAL_PROTECTION_ACTIVE_INGREDIENT_TEFLUTHRIN,
          quantity: 5,
          unit: ChemicalActiveIngredientDosageUnit.G_KG
        }
      ],
      applicationStage: ChemicalApplicationStage.OUT_OF_VEGETATION,
      applicationStageNotes: "",
      chemicalTargets: [],
      dosage: 1500,
      dosageUnit: ChemicalDosageUnit.G_ACRE,
      maxApplications: 1,
      minIntervalBetweenApplicationsDays: 0,
      maxIntervalBetweenApplicationsDays: 0,
      quarantinePeriodDays: 0,
      pricePer1LiterBGN: 12.8,
      pricePerAcreBGN: 19.2,
      // Внася се едновременно със сеитбата на културата на дълбочина в почвата 4–5 cm.
      additionalInfo: SELECTABLE_STRINGS.CHEMICAL_PROTECTION_CHEM_LEBRON_0_5_G_INFO,
      // Инсектицид за почвено приложение срещу почвени неприятели от групата на пиретроидите,
      // действа контактно и чрез газовата си фаза в почвата. Поради високото налягане на парите си,
      // тефлутринът се разпространява бързо в орницата. Действа на нервната система и води до спиране на храненето и смърт.
      // Може да се прилага в доза до 2.0 kg/da.
      additionalInfoNotes: SELECTABLE_STRINGS.CHEMICAL_PROTECTION_CHEM_LEBRON_0_5_G_INFO_NOTES,
    },
    {
      // ДЕЦИС 100 ЕК (фуражен грах)
      plantName: LatinNames.PISUM_SATIVUM,
      nameKey: SELECTABLE_STRINGS.CHEMICAL_PROTECTION_CHEM_DECIS_100_EC_PEA,
      type: ChemicalType.INSECTICIDE,
      activeIngredients: [
        {
          // 100 g/l делтаметрин
          nameKey: SELECTABLE_STRINGS.CHEMICAL_PROTECTION_ACTIVE_INGREDIENT_DELTAMETHRIN,
          quantity: 100,
          unit: ChemicalActiveIngredientDosageUnit.G_L
        }
      ],
      applicationStage: ChemicalApplicationStage.VEGETATION,
      applicationStageNotes: "",
      chemicalTargets: [],
      dosage: 6.25,
      dosageUnit: ChemicalDosageUnit.ML_ACRE,
      maxApplications: 2,
      minIntervalBetweenApplicationsDays: 14,
      maxIntervalBetweenApplicationsDays: 14,
      quarantinePeriodDays: 7,
      pricePer1LiterBGN: 193.75,
      pricePerAcreBGN: 1.21,
      // Внасянето се извършва при поява на неприятелите над икономическия праг на вредност.
      // При нападение от Черна бобова листна въшка, Тъмна грахова листозавивачка, Подгризваща нощенка може да се прилага в доза до 12,5 ml/da.
      additionalInfo: SELECTABLE_STRINGS.CHEMICAL_PROTECTION_CHEM_DECIS_100_EC_PEA_INFO,
      // Притежава много бърз инициален (нокдаун) ефект срещу голям брой смучещи и гризещи неприятели по оранжерийни, зърнени, технически, фуражни, зеленчукови, картофи, овощни видове и лозя.
      // Внасянето се извършва с работен разтвор от 40 до 140 l/da вода в зависимост от наличното земеделско оборудване.
      // Инсектицидът е опасен за пчелите (SPe8).
      additionalInfoNotes: SELECTABLE_STRINGS.CHEMICAL_PROTECTION_CHEM_DECIS_100_EC_PEA_INFO_NOTES,
    },
    {
      // ОАЗИС 5 ЕК
      plantName: LatinNames.PISUM_SATIVUM,
      nameKey: SELECTABLE_STRINGS.CHEMICAL_PROTECTION_CHEM_OASIS_5_EC,
      type: ChemicalType.INSECTICIDE,
      activeIngredients: [
        {
          // 50 g/l есфенвалерат
          nameKey: SELECTABLE_STRINGS.CHEMICAL_PROTECTION_ACTIVE_INGREDIENT_ESFENVALERATE,
          quantity: 50,
          unit: ChemicalActiveIngredientDosageUnit.G_L
        }
      ],
      applicationStage: ChemicalApplicationStage.VEGETATION,
      applicationStageNotes: "",
      chemicalTargets: [],
      dosage: 25,
      dosageUnit: ChemicalDosageUnit.ML_ACRE,
      maxApplications: 2,
      minIntervalBetweenApplicationsDays: 14,
      maxIntervalBetweenApplicationsDays: 14,
      quarantinePeriodDays: 14,
      pricePer1LiterBGN: 40.83,
      pricePerAcreBGN: 1.02,
      // Внасянето се извършва при поява на неприятелите над икономическия праг на вредност.
      additionalInfo: SELECTABLE_STRINGS.CHEMICAL_PROTECTION_CHEM_OASIS_5_EC_INFO,
      // Притежава много бърз инициален (нокдаун) ефект с широк спектър на действие за борба с листогризещи и смучещи насекомни с добре изразено стомашно действие.
      // Внасянето се извършва с работен разтвор от 20 до 50 l/da вода в зависимост от наличното земеделско оборудване.
      additionalInfoNotes: SELECTABLE_STRINGS.CHEMICAL_PROTECTION_CHEM_OASIS_5_EC_INFO_NOTES,
    },
    {
      // ЦИТРИН МАКС
      plantName: LatinNames.PISUM_SATIVUM,
      nameKey: SELECTABLE_STRINGS.CHEMICAL_PROTECTION_CHEM_CYTRIN_MAX,
      type: ChemicalType.INSECTICIDE,
      activeIngredients: [
        {
          // 500 g/l циперметрин
          nameKey: SELECTABLE_STRINGS.CHEMICAL_PROTECTION_ACTIVE_INGREDIENT_CYFLUTHRIN,
          quantity: 500,
          unit: ChemicalActiveIngredientDosageUnit.G_L
        }
      ],
      applicationStage: ChemicalApplicationStage.VEGETATION,
      applicationStageNotes: "",
      chemicalTargets: [],
      dosage: 5,
      dosageUnit: ChemicalDosageUnit.ML_ACRE,
      maxApplications: 2,
      minIntervalBetweenApplicationsDays: 14,
      maxIntervalBetweenApplicationsDays: 14,
      quarantinePeriodDays: 14,
      pricePer1LiterBGN: 158.45,
      pricePerAcreBGN: 0.79,
      // Внасянето се извършва при поява на неприятелите над икономическия праг на вредност.
      additionalInfo: SELECTABLE_STRINGS.CHEMICAL_PROTECTION_CHEM_CYTRIN_MAX_INFO,
      // Притежава много бърз инициален (нокдаун) ефект с широк спектър на действие за борба със смучещи и гризещи неприятели.
      // Унищожава всички подвижни стадии – ларви, нимфи и възрастни форми на неприятелите.
      // Да не се смесва с алкални продукти като бордолезов разтвор и др.
      // Внасянето се извършва с работен разтвор от 10 до 100 l/da вода.
      // Инсектицидът е опасен за пчелите (SPe8).
      additionalInfoNotes: SELECTABLE_STRINGS.CHEMICAL_PROTECTION_CHEM_CYTRIN_MAX_INFO_NOTES,
    },
    {
      // ФЛИПЕР ЕВ
      plantName: LatinNames.PISUM_SATIVUM,
      nameKey: SELECTABLE_STRINGS.CHEMICAL_PROTECTION_CHEM_FLIPPER_EV,
      type: ChemicalType.INSECTICIDE,
      activeIngredients: [
        {
          // 479.8 g/l мастни киселини
          nameKey: SELECTABLE_STRINGS.CHEMICAL_PROTECTION_ACTIVE_INGREDIENT_FATTY_ACIDS,
          quantity: 479.8,
          unit: ChemicalActiveIngredientDosageUnit.G_L
        }
      ],
      applicationStage: ChemicalApplicationStage.VEGETATION,
      applicationStageNotes: "",
      chemicalTargets: [],
      dosage: 1600,
      dosageUnit: ChemicalDosageUnit.ML_ACRE,
      maxApplications: 5,
      minIntervalBetweenApplicationsDays: 10,
      maxIntervalBetweenApplicationsDays: 10,
      quarantinePeriodDays: 7,
      pricePer1LiterBGN: 48.4,
      pricePerAcreBGN: 77.44,
      // Третирането на посева може да се извършва от поникване до пълна зрялост на граха при поява на неприятелите над икономическия праг на вредност.
      // Може да се прилага в доза до 2000 ml/da.
      additionalInfo: SELECTABLE_STRINGS.CHEMICAL_PROTECTION_CHEM_FLIPPER_EV_INFO,
      // Биологичен, контактен инсектицид / акарицид за борба срещу различни неприятели в стадии - яйца, ларви и възрастни насекоми.
      // Разрешен за употреба при полски и оранжерийни условия.
      // Внасянето се извършва с работен разтвор от 30 до 200 l/da вода.
      // Безвреден за пчелите!
      additionalInfoNotes: SELECTABLE_STRINGS.CHEMICAL_PROTECTION_CHEM_FLIPPER_EV_INFO_NOTES,
    },
    {
      // ОРТИВА ТОП СК
      plantName: LatinNames.PISUM_SATIVUM,
      nameKey: SELECTABLE_STRINGS.CHEMICAL_PROTECTION_CHEM_ORtIVA_TOP_SC,
      type: ChemicalType.FUNGICIDE,
      activeIngredients: [
        {
          // 200 g/l азоксистробин
          nameKey: SELECTABLE_STRINGS.CHEMICAL_PROTECTION_ACTIVE_INGREDIENT_AZOXYSTROBIN,
          quantity: 200,
          unit: ChemicalActiveIngredientDosageUnit.G_L
        },
        {
          // 125 g/l дифеноконазол
          nameKey: SELECTABLE_STRINGS.CHEMICAL_PROTECTION_ACTIVE_INGREDIENT_DIFENOCONAZOLE,
          quantity: 125,
          unit: ChemicalActiveIngredientDosageUnit.G_L
        }
      ],
      applicationStage: ChemicalApplicationStage.VEGETATION,
      applicationStageNotes: "",
      chemicalTargets: [],
      dosage: 100,
      dosageUnit: ChemicalDosageUnit.ML_ACRE,
      maxApplications: 2,
      minIntervalBetweenApplicationsDays: 14,
      maxIntervalBetweenApplicationsDays: 14,
      quarantinePeriodDays: 7,
      pricePer1LiterBGN: 185.95,
      pricePerAcreBGN: 18.6,
      // Третирането на посева с фунгицида се извършва превантивно или при поява на първи симптоми.
      additionalInfo: SELECTABLE_STRINGS.CHEMICAL_PROTECTION_CHEM_ORTIVA_TOP_SC_INFO,
      // Комбиниран широкоспектърен фунгицид с контактно, трансламинарно и системно действие.
      // Внасянето се извършва с работен разтвор от 50 до 100 l/da вода в зависимост от наличното земеделско оборудване.
      additionalInfoNotes: SELECTABLE_STRINGS.CHEMICAL_PROTECTION_CHEM_ORTIVA_TOP_SC_INFO_NOTES,
    },
    {
      // СУИЧ 62.5 ВГ
      plantName: LatinNames.PISUM_SATIVUM,
      nameKey: SELECTABLE_STRINGS.CHEMICAL_PROTECTION_CHEM_SWITCH_625_WG,
      type: ChemicalType.FUNGICIDE,
      activeIngredients: [
        {
          // 250 g/kg флудиоксонил
          nameKey: SELECTABLE_STRINGS.CHEMICAL_PROTECTION_ACTIVE_INGREDIENT_FLUDIOXONIL,
          quantity: 250,
          unit: ChemicalActiveIngredientDosageUnit.G_KG
        },
        {
          // 375 g/kg ципродинил
          nameKey: SELECTABLE_STRINGS.CHEMICAL_PROTECTION_ACTIVE_INGREDIENT_CYPRODINIL,
          quantity: 375,
          unit: ChemicalActiveIngredientDosageUnit.G_KG
        }
      ],
      applicationStage: ChemicalApplicationStage.VEGETATION,
      applicationStageNotes: "",
      chemicalTargets: [],
      dosage: 80,
      dosageUnit: ChemicalDosageUnit.G_ACRE,
      maxApplications: 1,
      minIntervalBetweenApplicationsDays: 0,
      maxIntervalBetweenApplicationsDays: 0,
      quarantinePeriodDays: 21,
      pricePer1LiterBGN: 445.55,
      pricePerAcreBGN: 35.64,
      // Внася се в междуфазните периоди – от начало на цъфтеж до напълно оформени бобове (достигнали типичен размер) на грахът.
      additionalInfo: SELECTABLE_STRINGS.CHEMICAL_PROTECTION_CHEM_SWITCH_625_WG_INFO,
      // Комбиниран широкоспектърен фунгицид с несистемно предпазно, и системно предпазно и лечебно действие.
      // Може да се прилага в доза до 100 g/da.
      additionalInfoNotes: SELECTABLE_STRINGS.CHEMICAL_PROTECTION_CHEM_SWITCH_625_WG_INFO_NOTES,
    },
    {
      // БОРДО МИКС 20 ВП
      plantName: LatinNames.PISUM_SATIVUM,
      nameKey: SELECTABLE_STRINGS.CHEMICAL_PROTECTION_CHEM_BORDO_MIX_20_WP,
      type: ChemicalType.FUNGICIDE,
      activeIngredients: [
        {
          // 200 g/l бордолезова смес (меднокалциев сулфат)
          nameKey: SELECTABLE_STRINGS.CHEMICAL_PROTECTION_ACTIVE_INGREDIENT_BORDEAUX_MIX,
          quantity: 200,
          unit: ChemicalActiveIngredientDosageUnit.G_L
        }
      ],
      applicationStage: ChemicalApplicationStage.VEGETATION,
      applicationStageNotes: "",
      chemicalTargets: [],
      dosage: 375,
      dosageUnit: ChemicalDosageUnit.G_ACRE,
      maxApplications: 3,
      minIntervalBetweenApplicationsDays: 10,
      maxIntervalBetweenApplicationsDays: 10,
      quarantinePeriodDays: 3,
      pricePer1LiterBGN: 18.8,
      pricePerAcreBGN: 7.05,
      // Третирането на посева се извършва в междуфазния период – четвърти същински лист до пълно узряване на граха.
      additionalInfo: SELECTABLE_STRINGS.CHEMICAL_PROTECTION_CHEM_BORDO_MIX_20_WP_INFO,
      // Широкоспектърен контактен неорганичен фунгицид / бактерицид с предпазно действие, при максимална доза на приложение 500 g/da.
      // Внасянето се извършва с работен разтвор от 100 l/da вода. Подходящ за биологично земеделие.
      additionalInfoNotes: SELECTABLE_STRINGS.CHEMICAL_PROTECTION_CHEM_BORDO_MIX_20_WP_INFO_NOTES,
    },
    {
      // СЯРА ВГ
      plantName: LatinNames.PISUM_SATIVUM,
      nameKey: SELECTABLE_STRINGS.CHEMICAL_PROTECTION_CHEM_SULFUR_WG,
      type: ChemicalType.FUNGICIDE,
      activeIngredients: [
        {
          // 800 g/kg сяра
          nameKey: SELECTABLE_STRINGS.CHEMICAL_PROTECTION_ACTIVE_INGREDIENT_SULFUR,
          quantity: 800,
          unit: ChemicalActiveIngredientDosageUnit.G_KG
        }
      ],
      applicationStage: ChemicalApplicationStage.VEGETATION,
      applicationStageNotes: "",
      chemicalTargets: [],
      dosage: 300,
      dosageUnit: ChemicalDosageUnit.G_ACRE,
      maxApplications: 8,
      minIntervalBetweenApplicationsDays: 7,
      maxIntervalBetweenApplicationsDays: 8,
      quarantinePeriodDays: 8,
      pricePer1LiterBGN: 0.9,
      pricePerAcreBGN: 0.27,
      // Третирането се извършва при благоприятни метеорологични условия за масово развитие на болестта.
      additionalInfo: SELECTABLE_STRINGS.CHEMICAL_PROTECTION_CHEM_SULFUR_WG_INFO,
      // Несистемен неорганичен фунгицид и акарицид с контактно и фумигиращо действие.
      // Подходящ за употреба в биологичното земеделие. Внасяне с 50–100 l/da работен разтвор.
      additionalInfoNotes: SELECTABLE_STRINGS.CHEMICAL_PROTECTION_CHEM_SULFUR_WG_INFO_NOTES,
    },
    {
      // ЗОКСИС 250 СК
      plantName: LatinNames.PISUM_SATIVUM,
      nameKey: SELECTABLE_STRINGS.CHEMICAL_PROTECTION_CHEM_ZOXIS_250_SC,
      type: ChemicalType.FUNGICIDE,
      activeIngredients: [
        {
          // 250 g/l азоксистробин
          nameKey: SELECTABLE_STRINGS.CHEMICAL_PROTECTION_ACTIVE_INGREDIENT_AZOXYSTROBIN,
          quantity: 250,
          unit: ChemicalActiveIngredientDosageUnit.G_L
        }
      ],
      applicationStage: ChemicalApplicationStage.VEGETATION,
      applicationStageNotes: "",
      chemicalTargets: [],
      dosage: 80,
      dosageUnit: ChemicalDosageUnit.ML_ACRE,
      maxApplications: 2,
      minIntervalBetweenApplicationsDays: 10,
      maxIntervalBetweenApplicationsDays: 14,
      quarantinePeriodDays: 14,
      pricePer1LiterBGN: 55.34,
      pricePerAcreBGN: 4.43,
      // Третирането се извършва при благоприятни метеорологични условия за масово развитие на болестта. Внася се от поникване до край на цъфтежа на граха.
      additionalInfo: SELECTABLE_STRINGS.CHEMICAL_PROTECTION_CHEM_ZOXIS_250_SC_INFO,
      // Системен стробилуринов фунгицид с предпазно, лечебно и изкореняващо действие.
      // Позволява да се прилага в максимална доза 100 ml/da. Работен разтвор 80 l/da.
      additionalInfoNotes: SELECTABLE_STRINGS.CHEMICAL_PROTECTION_CHEM_ZOXIS_250_SC_INFO_NOTES,
    }























  ]
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
