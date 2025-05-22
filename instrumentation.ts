import { SELECTABLE_STRINGS } from "./lib/LangMap";
import { CalculatorValueTypes, CombinationTypes } from "./lib/utils";


const dbData = {
  plants: [
    //there is some cross over but what can be seperated is seperated
    //seeding
    {
      latinName: SELECTABLE_STRINGS.PISUM_SATIVUM // Грах (Pea)
    },
    {
      latinName: SELECTABLE_STRINGS.GLYCINE_MAX // Соя (Soybean)
    },
    {
      latinName: SELECTABLE_STRINGS.SORGHUM_VULGARE_VAR_TEHNICUM // Сорго (Sorghum)
    },
    {
      latinName: SELECTABLE_STRINGS.ZEA_MAYS // Царевица (Corn)
    },

    //combined
    // Legumes (бобови)
    {
      latinName: SELECTABLE_STRINGS.MEDICAGO_SATIVA, // Люцерна (Alfalfa)
    },
    {
      latinName: SELECTABLE_STRINGS.TRIFOLIUM_STELLATUM, // Звездан (Star Clover)
    },
    {
      latinName: SELECTABLE_STRINGS.TRIFOLIUM_PRATENSE, // Червена детелина (Red Clover)
    },
    {
      latinName: SELECTABLE_STRINGS.TRIFOLIUM_REPENS, // Бяла детелина (White Clover)
    },
    // Cereals (зърнени)
    {
      latinName: SELECTABLE_STRINGS.LOLIUM_PERENNE, // Пасищен райграс (Perennial Ryegrass)
    },
    {
      latinName: SELECTABLE_STRINGS.AGROPYRON_CRISTATUM, // Гребенчат житняк (Crested Wheatgrass)
    },
    {
      latinName: SELECTABLE_STRINGS.DACTYLIS_GLOMERATA, // Ежова главица (Orchard Grass)
    },
    {
      latinName: SELECTABLE_STRINGS.AVENULA_PUBESCENS, // Безосилеста овсига (Downy Oatgrass)
    },
    {
      latinName: SELECTABLE_STRINGS.FESTUCA_PRATENSIS, // Ливадна власатка (Meadow Fescue)
    },
    {
      latinName: SELECTABLE_STRINGS.FESTUCA_RUBRA, // Червена власатка (Red Fescue)
    }
  ],
  SowingRateData: [
    {
      plantName: SELECTABLE_STRINGS.MEDICAGO_SATIVA, // Alfalfa
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
      plantName: SELECTABLE_STRINGS.PISUM_SATIVUM, // Pea  
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
      plantName: SELECTABLE_STRINGS.GLYCINE_MAX, // Soybean
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
      plantName: SELECTABLE_STRINGS.SORGHUM_VULGARE_VAR_TEHNICUM, // Industrial sorghum
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
      plantName: SELECTABLE_STRINGS.ZEA_MAYS, // Corn
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
      plantName: SELECTABLE_STRINGS.MEDICAGO_SATIVA,
      plantType: CombinationTypes.LEGUME,
      minSeedingRate: 2.5,
      maxSeedingRate: 3,
      priceFor1kgSeedsBGN: 26,
    },
    {
      plantName: SELECTABLE_STRINGS.TRIFOLIUM_STELLATUM,
      plantType: CombinationTypes.LEGUME,
      minSeedingRate: 1.5,
      maxSeedingRate: 2,
      priceFor1kgSeedsBGN: 34.5,
    },
    {
      plantName: SELECTABLE_STRINGS.TRIFOLIUM_PRATENSE,
      plantType: CombinationTypes.LEGUME,
      minSeedingRate: 2,
      maxSeedingRate: 2.5,
      priceFor1kgSeedsBGN: 29.3,
    },
    {
      plantName: SELECTABLE_STRINGS.TRIFOLIUM_REPENS,
      plantType: CombinationTypes.LEGUME,
      minSeedingRate: 2,
      maxSeedingRate: 2.5,
      priceFor1kgSeedsBGN: 35.9,
    },
    // Cereals (зърнени)
    {
      plantName: SELECTABLE_STRINGS.LOLIUM_PERENNE,
      plantType: CombinationTypes.CEREAL,
      minSeedingRate: 1,
      maxSeedingRate: 2.5,
      priceFor1kgSeedsBGN: 13.8,
    },
    {
      plantName: SELECTABLE_STRINGS.AGROPYRON_CRISTATUM,
      plantType: CombinationTypes.CEREAL,
      minSeedingRate: 1,
      maxSeedingRate: 1.5,
      priceFor1kgSeedsBGN: 10.5,
    },
    {
      plantName: SELECTABLE_STRINGS.DACTYLIS_GLOMERATA,
      plantType: CombinationTypes.CEREAL,
      minSeedingRate: 0.7,
      maxSeedingRate: 1,
      priceFor1kgSeedsBGN: 19.9,
    },
    {
      plantName: SELECTABLE_STRINGS.AVENULA_PUBESCENS,
      plantType: CombinationTypes.CEREAL,
      minSeedingRate: 2,
      maxSeedingRate: 2.5,
      priceFor1kgSeedsBGN: 47,
    },
    {
      plantName: SELECTABLE_STRINGS.FESTUCA_PRATENSIS,
      plantType: CombinationTypes.CEREAL,
      minSeedingRate: 0.8,
      maxSeedingRate: 1.2,
      priceFor1kgSeedsBGN: 22,
    },
    {
      plantName: SELECTABLE_STRINGS.FESTUCA_RUBRA,
      plantType: CombinationTypes.CEREAL,
      minSeedingRate: 0.7,
      maxSeedingRate: 1,
      priceFor1kgSeedsBGN: 7.8,
    }
  ],
  ChemicalProtectionEnemiesData: [
    {
      latinName: SELECTABLE_STRINGS.SORGHUM_HALEPENSE
    },
    {
      latinName: SELECTABLE_STRINGS.CYPERUS_STRIGOSUS
    },
    {
      latinName: SELECTABLE_STRINGS.ECHINOCHLOA_CRUS_GALLI
    },
    {
      latinName: SELECTABLE_STRINGS.DIGITARIA_SANGUINALIS
    },
    {
      latinName: SELECTABLE_STRINGS.SETARIA_SPP
    },
    {
      latinName: SELECTABLE_STRINGS.CAPSELLA_BURSA_PASTORIS
    },
    {
      latinName: SELECTABLE_STRINGS.PORTULACA_OLERACEA
    },
    {
      latinName: SELECTABLE_STRINGS.SOLANUM_NIGRUM
    },
    {
      latinName: SELECTABLE_STRINGS.AMARANTHUS
    },
    {
      latinName: SELECTABLE_STRINGS.ALOPECURUS_MYOSUROIDES
    },
    {
      latinName: SELECTABLE_STRINGS.LOLIUM
    },
    {
      latinName: SELECTABLE_STRINGS.AMARANTHUS_RETROFLEXUS
    },
    {
      latinName: SELECTABLE_STRINGS.CHENOPODIUM_ALBUM
    },
    {
      latinName: SELECTABLE_STRINGS.PERSICARIA_HYDROPIPER
    },
    {
      latinName: SELECTABLE_STRINGS.VERONICA_OFFICINALIS
    },
    {
      latinName: SELECTABLE_STRINGS.STELLARIA_MEDIA
    },
    {
      latinName: SELECTABLE_STRINGS.MATRICARIA_RECUTITA
    },
    {
      latinName: SELECTABLE_STRINGS.RAPHANUS_RAPHANISTRUM
    },
    {
      latinName: SELECTABLE_STRINGS.GERANIUM_SP
    },
    {
      latinName: SELECTABLE_STRINGS.SENECIO_VULGARIS
    },
    {
      latinName: SELECTABLE_STRINGS.LAMIUM_PURPUREUM
    },
    {
      latinName: SELECTABLE_STRINGS.SINAPIS_ARVENSIS
    },
    {
      latinName: SELECTABLE_STRINGS.LYSIMACHIA_ARVENSIS
    },
    {
      latinName: SELECTABLE_STRINGS.CENTAUREA_CYANUS
    },
    {
      latinName: SELECTABLE_STRINGS.AVENA_FATUA
    },
    {
      latinName: SELECTABLE_STRINGS.BROMUS
    },
    {
      latinName: SELECTABLE_STRINGS.PHALARIS_SPP
    },
    {
      latinName: SELECTABLE_STRINGS.ELYMUS_REPENS
    },
    {
      latinName: SELECTABLE_STRINGS.CYNODON_DACTYLON
    },
    {
      latinName: SELECTABLE_STRINGS.GALIUM_APARINE
    },
    {
      latinName: SELECTABLE_STRINGS.BIDENS_TRIPARTITA
    },
    {
      latinName: SELECTABLE_STRINGS.CONVOLVULUS_ARVENSIS
    },
    {
      latinName: SELECTABLE_STRINGS.APERA_SPICA_VENTI
    },
    {
      latinName: SELECTABLE_STRINGS.APERA_SPP
    },
    {
      latinName: SELECTABLE_STRINGS.ABUTILON_THEOPHRASTI
    },
    {
      latinName: SELECTABLE_STRINGS.CIRSIUM_ARVENSE
    },
    {
      latinName: SELECTABLE_STRINGS.ANTHEMIS_ARVENSIS
    },
    {
      latinName: SELECTABLE_STRINGS.SINAPIS_ALBA
    },
    {
      latinName: SELECTABLE_STRINGS.ACYRTHOSIPHON_PISI
    },
    {
      latinName: SELECTABLE_STRINGS.PROTAPION_APRICANS
    },
    {
      latinName: SELECTABLE_STRINGS.HYPERA_POSTICA
    },
    {
      latinName: SELECTABLE_STRINGS.BRUCHIDIUS_VARIUS
    },
    {
      latinName: SELECTABLE_STRINGS.APHIDOLETES_APHIDIMYZA
    },
    {
      latinName: SELECTABLE_STRINGS.NOCTUIDAE
    },
    {
      latinName: SELECTABLE_STRINGS.CAELIFERA
    },
    {
      latinName: SELECTABLE_STRINGS.GEOMETRIDAE
    },
    {
      latinName: SELECTABLE_STRINGS.GONIOCTENA_FORNICATA
    },
    {
      latinName: SELECTABLE_STRINGS.PHYTONOMUS_VARIABILIS
    },
    {
      latinName: SELECTABLE_STRINGS.DASYNEURA_IGNORATA
    },
    {
      latinName: SELECTABLE_STRINGS.CONTARINIA_MEDICAGINIS
    },
    {
      latinName: SELECTABLE_STRINGS.ENTOMOSCELIS_SULTATOR
    },
    {
      latinName: SELECTABLE_STRINGS.APHIS_MEDICAGINIS
    },
    {
      latinName: SELECTABLE_STRINGS.DATURA_STRAMONIUM
    },
    {
      latinName: SELECTABLE_STRINGS.AGRIOTIS_LINEATUS
    },
    {
      latinName: SELECTABLE_STRINGS.CEUTORRHYNCHUS_PLEUROSTIGMA
    },
    {
      latinName: SELECTABLE_STRINGS.CHILOPODA
    },
    {
      latinName: SELECTABLE_STRINGS.CHORTOPHILA_BRASSICAE
    },
    {
      latinName: SELECTABLE_STRINGS.MELOLONTHA_MELOLONTHA
    },
    {
      latinName: SELECTABLE_STRINGS.SITONA_SP
    },
    {
      latinName: SELECTABLE_STRINGS.APHIS_FABAE
    },
    {
      latinName: SELECTABLE_STRINGS.LASPEYRESIA_NIGRICANA
    },
    {
      latinName: SELECTABLE_STRINGS.BRUCHUS_PISORUM
    },
    {
      latinName: SELECTABLE_STRINGS.AUTOGRAPHA_GAMMA
    },
    {
      latinName: SELECTABLE_STRINGS.APHIDOIDEA
    },
    {
      latinName: SELECTABLE_STRINGS.CURCULIONIDAE
    },
    {
      latinName: SELECTABLE_STRINGS.ACARINA
    },
    {
      latinName: SELECTABLE_STRINGS.TRIALEURODES_VAPORARIORUM
    },
    {
      latinName: SELECTABLE_STRINGS.ASCOCHYTA_RABIEI
    },
    {
      latinName: SELECTABLE_STRINGS.ANTHRACNOSE
    },
    {
      latinName: SELECTABLE_STRINGS.BLUMERIA_GRAMINIS
    },
    {
      latinName: SELECTABLE_STRINGS.SCLEROTINIA_SCLEROTIORUM
    },
    {
      latinName: SELECTABLE_STRINGS.BOTRYTIS_CINEREA
    },
    {
      latinName: SELECTABLE_STRINGS.PERONOSPORACEAE
    },
    {
      latinName: SELECTABLE_STRINGS.PUCCINIA_GRAMINIS
    },
    {
      latinName: SELECTABLE_STRINGS.SEPTORIA
    },
    {
      latinName: SELECTABLE_STRINGS.XANTHOMONAS
    },
    {
      latinName: SELECTABLE_STRINGS.SETOSPHAERIA_TURCICA
    },
    {
      latinName: SELECTABLE_STRINGS.RANUNCULUS_ARVENSIS
    },
    {
      latinName: SELECTABLE_STRINGS.THYSANOPTERA
    },
    {
      latinName: SELECTABLE_STRINGS.OULEMA_MELANOPA
    },
    {
      latinName: SELECTABLE_STRINGS.SITOBION_AVENAE
    },
    {
      latinName: SELECTABLE_STRINGS.CICADOIDEA
    },
    {
      latinName: SELECTABLE_STRINGS.DIABROTICA_VIRGIFERA_ZEAE
    },
    {
      latinName: SELECTABLE_STRINGS.OSTRINIA_NUBILALIS
    },
    {
      latinName: SELECTABLE_STRINGS.LOXOSTEGE_STICTICALIS
    },
    {
      latinName: SELECTABLE_STRINGS.RHYZOPERTHA_DOMINICA
    },
    {
      latinName: SELECTABLE_STRINGS.TENEBRIO_MOLITOR
    },
    {
      latinName: SELECTABLE_STRINGS.TANYMECUS_DILATICOLLIS
    },
    {
      latinName: SELECTABLE_STRINGS.PYTHIUM_APHANIDERMATUM
    },
    {
      latinName: SELECTABLE_STRINGS.FUSARIUM_GRAMINEARUM
    },
    {
      latinName: SELECTABLE_STRINGS.RHIZOCTONIA_ZEAE
    }
  ],
  ChemicalProtectionData: [
    //Medicago sativa (люцерна, alfalfa)
    {
      //ДУАЛ ГОЛД 960 ЕК
      plantUsages: [
        SELECTABLE_STRINGS.MEDICAGO_SATIVA,
        SELECTABLE_STRINGS.GLYCINE_MAX,
        SELECTABLE_STRINGS.SORGHUM_VULGARE_VAR_TEHNICUM
      ],
      nameKey: SELECTABLE_STRINGS.CHEMICAL_PROTECTION_CHEM_DUAL_GOLD_960_EC,
      type: SELECTABLE_STRINGS.CHEMICAL_PROTECTION_CHEMICAL_TYPE_HERBICIDE,
      activeIngredients: [
        {
          //960 g/l S-метолахлор
          nameKey: SELECTABLE_STRINGS.CHEMICAL_PROTECTION_ACTIVE_INGREDIENT_S_METOLACHLOR,
          quantity: 960,
          unit: SELECTABLE_STRINGS.G_LITER
        }
      ],
      applicationStage: SELECTABLE_STRINGS.CHEMICAL_PROTECTION_APPLICATION_STAGE_PRE_EMERGENT_AFTER_SOWING_BEFORE_EMERGENCE,
      chemicalTargetEnemies: [
        SELECTABLE_STRINGS.SORGHUM_HALEPENSE,
        SELECTABLE_STRINGS.CYPERUS_STRIGOSUS,
        SELECTABLE_STRINGS.ECHINOCHLOA_CRUS_GALLI,
        SELECTABLE_STRINGS.DIGITARIA_SANGUINALIS,
        SELECTABLE_STRINGS.SETARIA_SPP,
        SELECTABLE_STRINGS.APERA_SPP,
        SELECTABLE_STRINGS.CAPSELLA_BURSA_PASTORIS,
        SELECTABLE_STRINGS.PORTULACA_OLERACEA,
        SELECTABLE_STRINGS.SOLANUM_NIGRUM,
        SELECTABLE_STRINGS.AMARANTHUS
      ],
      dosage: 150,
      dosageUnit: SELECTABLE_STRINGS.ML_ACRE,
      maxApplications: 1,
      minIntervalBetweenApplicationsDays: 0,
      maxIntervalBetweenApplicationsDays: 0,
      quarantinePeriodDays: 0,
      pricePer1LiterBGN: 49,
      pricePerAcreBGN: 7.35,
      //Внася се след сеитба, преди поникване на културата и на плевелите.
      additionalInfo: SELECTABLE_STRINGS.CHEMICAL_PROTECTION_CHEM_DUAL_GOLD_960_EC_INFO,
      //За увеличаване ефикасността срещу широколистните плевели е препоръчително добавяне на противошироколистен хербицид в работния разтвор при третирането. Внасянето се извършва с работен разтвор от 30 до 60 l/acre вода в зависимост от наличното земеделско оборудване. 
      additionalInfoNotes: SELECTABLE_STRINGS.CHEMICAL_PROTECTION_CHEM_DUAL_GOLD_960_EC_INFO_NOTES,
    },
    {
      // ЕКЛИПС 70 ВДГ
      plantUsages: [SELECTABLE_STRINGS.MEDICAGO_SATIVA],
      nameKey: SELECTABLE_STRINGS.CHEMICAL_PROTECTION_CHEM_EKLIPS_70_VDG,
      type: SELECTABLE_STRINGS.CHEMICAL_PROTECTION_CHEMICAL_TYPE_HERBICIDE,
      activeIngredients: [
        {
          // 700 g/kg метрибузин
          nameKey: SELECTABLE_STRINGS.CHEMICAL_PROTECTION_ACTIVE_INGREDIENT_METRIBUZIN,
          quantity: 700,
          unit: SELECTABLE_STRINGS.G_KG
        }
      ],
      applicationStage: SELECTABLE_STRINGS.CHEMICAL_PROTECTION_APPLICATION_STAGE_PRE_EMERGENT_BEFORE_START_OF_GROWING_SEASON,

      chemicalTargetEnemies: [SELECTABLE_STRINGS.ALOPECURUS_MYOSUROIDES, SELECTABLE_STRINGS.LOLIUM, SELECTABLE_STRINGS.ECHINOCHLOA_CRUS_GALLI, SELECTABLE_STRINGS.AMARANTHUS_RETROFLEXUS, SELECTABLE_STRINGS.CAPSELLA_BURSA_PASTORIS, SELECTABLE_STRINGS.CHENOPODIUM_ALBUM, SELECTABLE_STRINGS.PERSICARIA_HYDROPIPER, SELECTABLE_STRINGS.VERONICA_OFFICINALIS, SELECTABLE_STRINGS.STELLARIA_MEDIA, SELECTABLE_STRINGS.MATRICARIA_RECUTITA, SELECTABLE_STRINGS.RAPHANUS_RAPHANISTRUM, SELECTABLE_STRINGS.GERANIUM_SP, SELECTABLE_STRINGS.SENECIO_VULGARIS, SELECTABLE_STRINGS.LAMIUM_PURPUREUM, SELECTABLE_STRINGS.SINAPIS_ARVENSIS, SELECTABLE_STRINGS.LYSIMACHIA_ARVENSIS, SELECTABLE_STRINGS.CENTAUREA_CYANUS, SELECTABLE_STRINGS.PORTULACA_OLERACEA],
      dosage: 50,
      dosageUnit: SELECTABLE_STRINGS.G_ACRE,
      maxApplications: 1,
      minIntervalBetweenApplicationsDays: 0,
      maxIntervalBetweenApplicationsDays: 0,
      quarantinePeriodDays: 60,
      pricePer1LiterBGN: 101,
      pricePerAcreBGN: 5.05,
      //Третирането се извършва есента, след реколтиране на последният откос, когато люцерната е във вегетационен покой.
      additionalInfo: SELECTABLE_STRINGS.CHEMICAL_PROTECTION_CHEM_EKLIPS_70_VDG_INFO,
      //Да не се внася върху песъчливи почви с по-малко от 0,5% хумус. При смесване с други продукти за растителна защита, да се спазва по-дълг карантинен срок. Внасянето се извършва с работен разтвор от 25 до 50 l/acre вода в зависимост от наличното земеделско оборудване. 
      additionalInfoNotes: SELECTABLE_STRINGS.CHEMICAL_PROTECTION_CHEM_EKLIPS_70_VDG_INFO_NOTES,
    },
    {
      // ЛЕОПАРД 5 ЕК
      plantUsages: [SELECTABLE_STRINGS.MEDICAGO_SATIVA],
      nameKey: SELECTABLE_STRINGS.CHEMICAL_PROTECTION_CHEM_LEOPARD_5_EC,
      type: SELECTABLE_STRINGS.CHEMICAL_PROTECTION_CHEMICAL_TYPE_HERBICIDE,
      activeIngredients: [
        {
          // 50 g/l квизалофоп-П-етил
          nameKey: SELECTABLE_STRINGS.CHEMICAL_PROTECTION_ACTIVE_INGREDIENT_QUIZALOFOP_P_ETHYL,
          quantity: 50,
          unit: SELECTABLE_STRINGS.G_LITER
        }
      ],
      applicationStage: SELECTABLE_STRINGS.CHEMICAL_PROTECTION_APPLICATION_STAGE_POST_EMERGENT,

      chemicalTargetEnemies: [SELECTABLE_STRINGS.ALOPECURUS_MYOSUROIDES, SELECTABLE_STRINGS.AVENA_FATUA, SELECTABLE_STRINGS.BROMUS, SELECTABLE_STRINGS.ECHINOCHLOA_CRUS_GALLI, SELECTABLE_STRINGS.LOLIUM, SELECTABLE_STRINGS.PHALARIS_SPP, SELECTABLE_STRINGS.SORGHUM_HALEPENSE, SELECTABLE_STRINGS.ELYMUS_REPENS, SELECTABLE_STRINGS.CYNODON_DACTYLON],
      dosage: 100,
      dosageUnit: SELECTABLE_STRINGS.ML_ACRE,
      maxApplications: 2,
      minIntervalBetweenApplicationsDays: 30,
      maxIntervalBetweenApplicationsDays: 30,
      quarantinePeriodDays: 30,
      pricePer1LiterBGN: 66.4,
      pricePerAcreBGN: 6.64,
      // Внася се от първи до четвърти лист на люцерната и при височина на балура 10-20 cm.
      additionalInfo: SELECTABLE_STRINGS.CHEMICAL_PROTECTION_CHEM_LEOPARD_5_EC_INFO,
      // Срещу многогодишни житни плевели, включително Балур (от коренища) - до 10-15 cm височина на балура. Троскот и Пирей – в активна вегетация на плевелите се внася в доза 200 ml/acre. Внасянето се извършва с работен разтвор от 30 до 40 l/acre вода в зависимост от наличното земеделско оборудване. 
      additionalInfoNotes: SELECTABLE_STRINGS.CHEMICAL_PROTECTION_CHEM_LEOPARD_5_EC_INFO_NOTES,
    },
    {
      // ЛЕНТАГРАН ВП
      plantUsages: [SELECTABLE_STRINGS.MEDICAGO_SATIVA],
      nameKey: SELECTABLE_STRINGS.CHEMICAL_PROTECTION_CHEM_LENTAGRAN_45_WP,
      type: SELECTABLE_STRINGS.CHEMICAL_PROTECTION_CHEMICAL_TYPE_HERBICIDE,
      activeIngredients: [
        {
          // 450 g/kg пиридат
          nameKey: SELECTABLE_STRINGS.CHEMICAL_PROTECTION_ACTIVE_INGREDIENT_PYRIDATE,
          quantity: 450,
          unit: SELECTABLE_STRINGS.G_KG
        }
      ],
      applicationStage: SELECTABLE_STRINGS.CHEMICAL_PROTECTION_APPLICATION_STAGE_POST_EMERGENT,
      chemicalTargetEnemies: [SELECTABLE_STRINGS.SOLANUM_NIGRUM, SELECTABLE_STRINGS.GALIUM_APARINE, SELECTABLE_STRINGS.BIDENS_TRIPARTITA, SELECTABLE_STRINGS.AMARANTHUS_RETROFLEXUS, SELECTABLE_STRINGS.STELLARIA_MEDIA, SELECTABLE_STRINGS.CHENOPODIUM_ALBUM, SELECTABLE_STRINGS.SENECIO_VULGARIS, SELECTABLE_STRINGS.LAMIUM_PURPUREUM, SELECTABLE_STRINGS.CONVOLVULUS_ARVENSIS],
      dosage: 200,
      dosageUnit: SELECTABLE_STRINGS.G_ACRE,
      maxApplications: 1,
      minIntervalBetweenApplicationsDays: 0,
      maxIntervalBetweenApplicationsDays: 0,
      quarantinePeriodDays: 28,
      pricePer1LiterBGN: 104.74,
      pricePerAcreBGN: 20.95,
      // Да се прилага в начални фенофази от развитието на плевелите, до трети троен лист на културата.
      additionalInfo: SELECTABLE_STRINGS.CHEMICAL_PROTECTION_CHEM_LENTAGRAN_45_WP_INFO,
      // Не се препоръчва приложение на Лентагран ВП при активен летеж на медоносните пчели.
      // Внасянето се извършва с работен разтвор от 20 до 60 l/acre вода в зависимост от наличното земеделско оборудване.
      additionalInfoNotes: SELECTABLE_STRINGS.CHEMICAL_PROTECTION_CHEM_LENTAGRAN_45_WP_INFO_NOTES,
    },
    {
      // ПУЛСАР 40
      plantUsages: [SELECTABLE_STRINGS.MEDICAGO_SATIVA],
      nameKey: SELECTABLE_STRINGS.CHEMICAL_PROTECTION_CHEM_PULSAR_40_SL,
      type: SELECTABLE_STRINGS.CHEMICAL_PROTECTION_CHEMICAL_TYPE_HERBICIDE,
      activeIngredients: [
        {
          // 41 g/l имазамокс
          nameKey: SELECTABLE_STRINGS.CHEMICAL_PROTECTION_ACTIVE_INGREDIENT_IMAZAMOX,
          quantity: 41,
          unit: SELECTABLE_STRINGS.G_LITER
        }
      ],
      applicationStage: SELECTABLE_STRINGS.CHEMICAL_PROTECTION_APPLICATION_STAGE_POST_EMERGENT,

      chemicalTargetEnemies: [SELECTABLE_STRINGS.SORGHUM_HALEPENSE, SELECTABLE_STRINGS.APERA_SPICA_VENTI, SELECTABLE_STRINGS.AVENA_FATUA, SELECTABLE_STRINGS.APERA_SPP, SELECTABLE_STRINGS.ECHINOCHLOA_CRUS_GALLI, SELECTABLE_STRINGS.ABUTILON_THEOPHRASTI, SELECTABLE_STRINGS.BIDENS_TRIPARTITA, SELECTABLE_STRINGS.RAPHANUS_RAPHANISTRUM, SELECTABLE_STRINGS.CAPSELLA_BURSA_PASTORIS, SELECTABLE_STRINGS.CIRSIUM_ARVENSE, SELECTABLE_STRINGS.ANTHEMIS_ARVENSIS, SELECTABLE_STRINGS.SINAPIS_ALBA],
      dosage: 50,
      dosageUnit: SELECTABLE_STRINGS.ML_ACRE,
      maxApplications: 1,
      minIntervalBetweenApplicationsDays: 0,
      maxIntervalBetweenApplicationsDays: 0,
      quarantinePeriodDays: 90,
      pricePer1LiterBGN: 100.31,
      pricePerAcreBGN: 5.02,
      // Внася се във фаза втори-четвърти лист на културата с добавяне на 50 ml/acre прилепител ДЕШ.
      additionalInfo: SELECTABLE_STRINGS.CHEMICAL_PROTECTION_CHEM_PULSAR_40_SL_INFO,
      // При млада люцерна (в годината на създаване на посева) се внася в доза 120 ml/acre един месец, след сеитба на културата.
      // Внасянето се извършва с работен разтвор от 15 до 20 l/acre вода в зависимост от наличното земеделско оборудване.
      additionalInfoNotes: SELECTABLE_STRINGS.CHEMICAL_PROTECTION_CHEM_PULSAR_40_SL_INFO_NOTES,
    },
    {
      // ДЕЦИС 100 ЕК
      plantUsages: [SELECTABLE_STRINGS.MEDICAGO_SATIVA, SELECTABLE_STRINGS.PISUM_SATIVUM],
      nameKey: SELECTABLE_STRINGS.CHEMICAL_PROTECTION_CHEM_DECIS_100_EC,
      type: SELECTABLE_STRINGS.CHEMICAL_PROTECTION_CHEMICAL_TYPE_INSECTICIDE,
      activeIngredients: [
        {
          // 100 g/l делтаметрин
          nameKey: SELECTABLE_STRINGS.CHEMICAL_PROTECTION_ACTIVE_INGREDIENT_DELTAMETHRIN,
          quantity: 100,
          unit: SELECTABLE_STRINGS.G_LITER
        }
      ],
      applicationStage: SELECTABLE_STRINGS.CHEMICAL_PROTECTION_APPLICATION_STAGE_POST_EMERGENT,

      chemicalTargetEnemies: [SELECTABLE_STRINGS.APHIDOIDEA, SELECTABLE_STRINGS.NOCTUIDAE, SELECTABLE_STRINGS.CURCULIONIDAE],
      dosage: 6.25,
      dosageUnit: SELECTABLE_STRINGS.ML_ACRE,
      maxApplications: 2,
      minIntervalBetweenApplicationsDays: 14,
      maxIntervalBetweenApplicationsDays: 14,
      quarantinePeriodDays: 14,
      pricePer1LiterBGN: 193.75,
      pricePerAcreBGN: 1.21,
      // Внасянето се извършва при поява на неприятелите над икономическия праг на вредност.
      additionalInfo: SELECTABLE_STRINGS.CHEMICAL_PROTECTION_CHEM_DECIS_100_EC_INFO,
      // Притежава много бърз инициален (нокдаун) ефект срещу голям брой смучещи и гризещи неприятели по оранжерийни, зърнени, технически, фуражни, зеленчукови, картофи, овощни видове и лозя.
      // Внасянето се извършва с работен разтвор от 40 до 140 l/acre вода в зависимост от наличното земеделско оборудване.
      // Инсектицидът е опасен за пчелите (SPe8).
      additionalInfoNotes: SELECTABLE_STRINGS.CHEMICAL_PROTECTION_CHEM_DECIS_100_EC_INFO_NOTES,
    },
    {
      // ЛАМДЕКС ЕКСТРА
      plantUsages: [SELECTABLE_STRINGS.MEDICAGO_SATIVA, SELECTABLE_STRINGS.SORGHUM_VULGARE_VAR_TEHNICUM],
      nameKey: SELECTABLE_STRINGS.CHEMICAL_PROTECTION_CHEM_LAMDEX_EXTRA,
      type: SELECTABLE_STRINGS.CHEMICAL_PROTECTION_CHEMICAL_TYPE_INSECTICIDE,
      activeIngredients: [
        {
          // 25 g/kg ламбда - цихалотрин
          nameKey: SELECTABLE_STRINGS.CHEMICAL_PROTECTION_ACTIVE_INGREDIENT_LAMBDA_CYHALOTHRIN,
          quantity: 25,
          unit: SELECTABLE_STRINGS.G_KG
        }
      ],
      applicationStage: SELECTABLE_STRINGS.CHEMICAL_PROTECTION_APPLICATION_STAGE_POST_EMERGENT,

      chemicalTargetEnemies: [SELECTABLE_STRINGS.THYSANOPTERA, SELECTABLE_STRINGS.OULEMA_MELANOPA, SELECTABLE_STRINGS.APHIDOIDEA, SELECTABLE_STRINGS.NOCTUIDAE],
      dosage: 42,
      dosageUnit: SELECTABLE_STRINGS.ML_ACRE,
      maxApplications: 1,
      minIntervalBetweenApplicationsDays: 0,
      maxIntervalBetweenApplicationsDays: 0,
      quarantinePeriodDays: 7,
      pricePer1LiterBGN: 57.872,
      pricePerAcreBGN: 2.43,
      // Да не се извършват повече от две третирания с инсектицида през вегетационния период на културата. Може да се прилага до 120 ml/acre.
      additionalInfo: SELECTABLE_STRINGS.CHEMICAL_PROTECTION_CHEM_LAMDEX_EXTRA_INFO,
      // Ефекасен пиретроиден инсектицид със силно контактно и поглъщателно действие срещу широк спектър от вредители.
      // Внасянето се извършва с работен разтвор от 50 до 100 l/acre вода в зависимост от наличното земеделско оборудване.
      // Съвместим е за смесено прилагане с други продукти за растителна защита. Опасен е за пчелите - SPe8.
      additionalInfoNotes: SELECTABLE_STRINGS.CHEMICAL_PROTECTION_CHEM_LAMDEX_EXTRA_INFO_NOTES,
    },
    {
      // МЕТЕОР
      plantUsages: [SELECTABLE_STRINGS.MEDICAGO_SATIVA, SELECTABLE_STRINGS.GLYCINE_MAX],
      nameKey: SELECTABLE_STRINGS.CHEMICAL_PROTECTION_CHEM_METEOR,
      type: SELECTABLE_STRINGS.CHEMICAL_PROTECTION_CHEMICAL_TYPE_INSECTICIDE,
      activeIngredients: [
        {
          // 15,7 g/l делтаметрин
          nameKey: SELECTABLE_STRINGS.CHEMICAL_PROTECTION_ACTIVE_INGREDIENT_DELTAMETHRIN,
          quantity: 15.7,
          unit: SELECTABLE_STRINGS.G_LITER
        }
      ],
      applicationStage: SELECTABLE_STRINGS.CHEMICAL_PROTECTION_APPLICATION_STAGE_POST_EMERGENT,

      chemicalTargetEnemies: [SELECTABLE_STRINGS.CAELIFERA, SELECTABLE_STRINGS.NOCTUIDAE, SELECTABLE_STRINGS.GEOMETRIDAE],
      dosage: 60,
      dosageUnit: SELECTABLE_STRINGS.ML_ACRE,
      maxApplications: 1,
      minIntervalBetweenApplicationsDays: 0,
      maxIntervalBetweenApplicationsDays: 0,
      quarantinePeriodDays: 15,
      pricePer1LiterBGN: 18,
      pricePerAcreBGN: 1.08,
      // Внасянето се извършва при поява на неприятелите над икономическия праг на вредност. При нападение от скакалци инсектицида се внася 80 ml/acre.
      additionalInfo: SELECTABLE_STRINGS.CHEMICAL_PROTECTION_CHEM_METEOR_INFO,
      // Шиpoĸooбxвaтeн несистемен пиретроиден инсектицид със стомашно и контактно действие, paзpeшeн зa yпoтpeбa при различни видoвe селскостопански култури.
      // Oбxвaтa нa дeйcтвиe нa инceĸтицидa вĸлючвa шиpoĸa гaмa лиcтни въшĸи, бpъмбapи, гъceници, пeпepyди, чepвeи и дpyги видове нaceĸoми.
      // Внасянето се извършва с работен разтвор от 60 до 80 l/acre вода в зависимост от наличното земеделско оборудване.
      additionalInfoNotes: SELECTABLE_STRINGS.CHEMICAL_PROTECTION_CHEM_METEOR_INFO_NOTES,
    },
    {
      // СУМИ АЛФА 5 ЕК
      plantUsages: [SELECTABLE_STRINGS.MEDICAGO_SATIVA],
      nameKey: SELECTABLE_STRINGS.CHEMICAL_PROTECTION_CHEM_SUMI_ALPHA_5_EC,
      type: SELECTABLE_STRINGS.CHEMICAL_PROTECTION_CHEMICAL_TYPE_INSECTICIDE,
      activeIngredients: [
        {
          // 50 g/l есфенвалерат
          nameKey: SELECTABLE_STRINGS.CHEMICAL_PROTECTION_ACTIVE_INGREDIENT_ESFENVALERATE,
          quantity: 50,
          unit: SELECTABLE_STRINGS.G_LITER
        }
      ],
      applicationStage: SELECTABLE_STRINGS.CHEMICAL_PROTECTION_APPLICATION_STAGE_POST_EMERGENT,

      chemicalTargetEnemies: [SELECTABLE_STRINGS.ACYRTHOSIPHON_PISI, SELECTABLE_STRINGS.GEOMETRIDAE, SELECTABLE_STRINGS.GONIOCTENA_FORNICATA, SELECTABLE_STRINGS.PHYTONOMUS_VARIABILIS, SELECTABLE_STRINGS.DASYNEURA_IGNORATA, SELECTABLE_STRINGS.CONTARINIA_MEDICAGINIS, SELECTABLE_STRINGS.ENTOMOSCELIS_SULTATOR],
      dosage: 20,
      dosageUnit: SELECTABLE_STRINGS.ML_ACRE,
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
      // Внасянето се извършва с работен разтвор от 20 до 50 l/acre вода в зависимост от наличното земеделско оборудване.
      additionalInfoNotes: SELECTABLE_STRINGS.CHEMICAL_PROTECTION_CHEM_SUMI_ALPHA_5_EC_INFO_NOTES,
    },
    {
      // МОСПИЛАН 20 СГ
      plantUsages: [SELECTABLE_STRINGS.MEDICAGO_SATIVA],
      nameKey: SELECTABLE_STRINGS.CHEMICAL_PROTECTION_CHEM_MOSPILAN_20_SG,
      type: SELECTABLE_STRINGS.CHEMICAL_PROTECTION_CHEMICAL_TYPE_INSECTICIDE,
      activeIngredients: [
        {
          // 101 g/kg ацетамиприд
          nameKey: SELECTABLE_STRINGS.CHEMICAL_PROTECTION_ACTIVE_INGREDIENT_ACETAMIPRID,
          quantity: 101,
          unit: SELECTABLE_STRINGS.G_KG
        }
      ],
      applicationStage: SELECTABLE_STRINGS.CHEMICAL_PROTECTION_APPLICATION_STAGE_POST_EMERGENT,
      chemicalTargetEnemies: [SELECTABLE_STRINGS.APHIS_MEDICAGINIS, SELECTABLE_STRINGS.ACYRTHOSIPHON_PISI],
      dosage: 7.5,
      dosageUnit: SELECTABLE_STRINGS.G_ACRE,
      maxApplications: 2,
      minIntervalBetweenApplicationsDays: 14,
      maxIntervalBetweenApplicationsDays: 21,
      quarantinePeriodDays: 14,
      pricePer1LiterBGN: 301.5,
      pricePerAcreBGN: 2.26,
      // Внасянето се извършва при поява на неприятелите над икономическия праг на вредност.
      additionalInfo: SELECTABLE_STRINGS.CHEMICAL_PROTECTION_CHEM_MOSPILAN_20_SG_INFO,
      // Ефикасен системен неоникотиноид инсектицид с контактно и стомашно действие.
      // Може да се прилага в доза до 10 g/acre.
      // Внасянето се извършва с работен разтвор от 50 l/acre вода в зависимост от наличното земеделско оборудване.
      additionalInfoNotes: SELECTABLE_STRINGS.CHEMICAL_PROTECTION_CHEM_MOSPILAN_20_SG_INFO_NOTES,
    },
    //Pisum sativum (Грах, Pea)
    {
      // СТОМП АКВА
      plantUsages: [SELECTABLE_STRINGS.PISUM_SATIVUM, SELECTABLE_STRINGS.GLYCINE_MAX, SELECTABLE_STRINGS.SORGHUM_VULGARE_VAR_TEHNICUM],
      nameKey: SELECTABLE_STRINGS.CHEMICAL_PROTECTION_CHEM_STOMP_AQUA,
      type: SELECTABLE_STRINGS.CHEMICAL_PROTECTION_CHEMICAL_TYPE_HERBICIDE,
      activeIngredients: [
        {
          // 455 g/l пендиметалин
          nameKey: SELECTABLE_STRINGS.CHEMICAL_PROTECTION_ACTIVE_INGREDIENT_PENDIMETHALIN,
          quantity: 455,
          unit: SELECTABLE_STRINGS.G_LITER
        }
      ],
      applicationStage: SELECTABLE_STRINGS.CHEMICAL_PROTECTION_APPLICATION_STAGE_PRE_EMERGENT_AFTER_SOWING_BEFORE_EMERGENCE,

      chemicalTargetEnemies: [SELECTABLE_STRINGS.DIGITARIA_SANGUINALIS, SELECTABLE_STRINGS.SETARIA_SPP, SELECTABLE_STRINGS.ALOPECURUS_MYOSUROIDES, SELECTABLE_STRINGS.ECHINOCHLOA_CRUS_GALLI, SELECTABLE_STRINGS.CHENOPODIUM_ALBUM, SELECTABLE_STRINGS.AMARANTHUS_RETROFLEXUS, SELECTABLE_STRINGS.PORTULACA_OLERACEA, SELECTABLE_STRINGS.STELLARIA_MEDIA, SELECTABLE_STRINGS.SINAPIS_ALBA, SELECTABLE_STRINGS.SOLANUM_NIGRUM, SELECTABLE_STRINGS.SENECIO_VULGARIS],
      dosage: 250,
      dosageUnit: SELECTABLE_STRINGS.ML_ACRE,
      maxApplications: 1,
      minIntervalBetweenApplicationsDays: 0,
      maxIntervalBetweenApplicationsDays: 0,
      quarantinePeriodDays: 0,
      pricePer1LiterBGN: 49.5,
      pricePerAcreBGN: 12.38,
      // Внася се след сеитба, преди поникване на културата и на плевелите.
      additionalInfo: SELECTABLE_STRINGS.CHEMICAL_PROTECTION_CHEM_STOMP_AQUA_INFO,
      // Може да се използва в доза до 300 ml/acre.
      // Да не се третира при температури над 30 °С поради силно изпарение на работния разтвор.
      // Внасянето се извършва с работен разтвор от 20 до 60 l/acre вода в зависимост от наличното земеделско оборудване.
      additionalInfoNotes: SELECTABLE_STRINGS.CHEMICAL_PROTECTION_CHEM_STOMP_AQUA_INFO_NOTES,
    },
    {
      // ЧЕЛИНДЖ 600 СК
      plantUsages: [SELECTABLE_STRINGS.PISUM_SATIVUM],
      nameKey: SELECTABLE_STRINGS.CHEMICAL_PROTECTION_CHEM_CHALLENGE_600_SC,
      type: SELECTABLE_STRINGS.CHEMICAL_PROTECTION_CHEMICAL_TYPE_HERBICIDE,
      activeIngredients: [
        {
          // 600 g/l аклонифен
          nameKey: SELECTABLE_STRINGS.CHEMICAL_PROTECTION_ACTIVE_INGREDIENT_ACLONIFEN,
          quantity: 600,
          unit: SELECTABLE_STRINGS.G_LITER
        }
      ],
      applicationStage: SELECTABLE_STRINGS.CHEMICAL_PROTECTION_APPLICATION_STAGE_PRE_EMERGENT_AFTER_SOWING_BEFORE_EMERGENCE,

      chemicalTargetEnemies: [SELECTABLE_STRINGS.ALOPECURUS_MYOSUROIDES, SELECTABLE_STRINGS.ECHINOCHLOA_CRUS_GALLI, SELECTABLE_STRINGS.DIGITARIA_SANGUINALIS, SELECTABLE_STRINGS.APERA_SPР, SELECTABLE_STRINGS.CAPSELLA_BURSA_PASTORIS, SELECTABLE_STRINGS.CHENOPODIUM_ALBUM, SELECTABLE_STRINGS.LAMIUM_PURPUREUM, SELECTABLE_STRINGS.MATRICARIA_RECUTITA, SELECTABLE_STRINGS.SINAPIS_ALBA, SELECTABLE_STRINGS.SENECIO_VULGARIS, SELECTABLE_STRINGS.STELLARIA_MEDIA, SELECTABLE_STRINGS.VERONICA_OFFICINALIS],
      dosage: 300,
      dosageUnit: SELECTABLE_STRINGS.ML_ACRE,
      maxApplications: 1,
      minIntervalBetweenApplicationsDays: 0,
      maxIntervalBetweenApplicationsDays: 0,
      quarantinePeriodDays: 0,
      pricePer1LiterBGN: 76.94,
      pricePerAcreBGN: 23.08,
      // Внася се след сеитба, преди поникване на културата и на плевелите.
      additionalInfo: SELECTABLE_STRINGS.CHEMICAL_PROTECTION_CHEM_CHALLENGE_600_SC_INFO,
      // Хербицидът може да се внесе вегетационно във междуфазния период втори осми същински лист на граха в доза до 50 ml/acre при отсъствие на почвено приложение.
      // Внасянето се извършва с работен разтвор от 10 до 30 l/acre вода в зависимост от наличното земеделско оборудване.
      additionalInfoNotes: SELECTABLE_STRINGS.CHEMICAL_PROTECTION_CHEM_CHALLENGE_600_SC_INFO_NOTES,
    },
    {
      // СТРАТОС УЛТРА
      plantUsages: [SELECTABLE_STRINGS.PISUM_SATIVUM],
      nameKey: SELECTABLE_STRINGS.CHEMICAL_PROTECTION_CHEM_STRATOS_ULTRA,
      type: SELECTABLE_STRINGS.CHEMICAL_PROTECTION_CHEMICAL_TYPE_HERBICIDE,
      activeIngredients: [
        {
          // 100 g/l циклоксидим
          nameKey: SELECTABLE_STRINGS.CHEMICAL_PROTECTION_ACTIVE_INGREDIENT_CYCLOXYDIM,
          quantity: 100,
          unit: SELECTABLE_STRINGS.G_LITER
        }
      ],
      applicationStage: SELECTABLE_STRINGS.CHEMICAL_PROTECTION_APPLICATION_STAGE_POST_EMERGENT,

      chemicalTargetEnemies: [SELECTABLE_STRINGS.SETARIA_SPP, SELECTABLE_STRINGS.SORGHUM_HALEPENSE, SELECTABLE_STRINGS.CYNODON_DACTYLON, SELECTABLE_STRINGS.ELYMUS_REPENS],
      dosage: 200,
      dosageUnit: SELECTABLE_STRINGS.ML_ACRE,
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
      // Внасянето се извършва с работен разтвор от 15 до 20 l/acre вода в зависимост от наличното земеделско оборудване.
      additionalInfoNotes: SELECTABLE_STRINGS.CHEMICAL_PROTECTION_CHEM_STRATOS_ULTRA_INFO_NOTES,
    },
    {
      // АЧИБА МАКС
      plantUsages: [SELECTABLE_STRINGS.PISUM_SATIVUM],
      nameKey: SELECTABLE_STRINGS.CHEMICAL_PROTECTION_CHEM_ACHIBA_MAX,
      type: SELECTABLE_STRINGS.CHEMICAL_PROTECTION_CHEMICAL_TYPE_HERBICIDE,
      activeIngredients: [
        {
          // 100 g/l хизалофоп - P - етил
          nameKey: SELECTABLE_STRINGS.CHEMICAL_PROTECTION_ACTIVE_INGREDIENT_QUIZALOFOP_P_ETHYL,
          quantity: 100,
          unit: SELECTABLE_STRINGS.G_LITER
        }
      ],
      applicationStage: SELECTABLE_STRINGS.CHEMICAL_PROTECTION_APPLICATION_STAGE_POST_EMERGENT,

      chemicalTargetEnemies: [SELECTABLE_STRINGS.SETARIA_SPP, SELECTABLE_STRINGS.SORGHUM_HALEPENSE, SELECTABLE_STRINGS.CYNODON_DACTYLON, SELECTABLE_STRINGS.ELYMUS_REPENS],
      dosage: 75,
      dosageUnit: SELECTABLE_STRINGS.ML_ACRE,
      maxApplications: 1,
      minIntervalBetweenApplicationsDays: 0,
      maxIntervalBetweenApplicationsDays: 0,
      quarantinePeriodDays: 21,
      pricePer1LiterBGN: 67.34,
      pricePerAcreBGN: 5.05,
      // Внасянето на хербицида може да се извърши във фаза първи същински лист и/или в пълна зрялост на граха (при производство на семена).
      additionalInfo: SELECTABLE_STRINGS.CHEMICAL_PROTECTION_CHEM_ACHIBA_MAX_INFO,
      // Срещу многогодишни житни плевели, включително Балур (от коренища) - до 10-15 cm височина на балура.
      // Троскот и Пирей – в активна вегетация на плевелите се внася в доза 150 ml/acre.
      // Внасянето се извършва с работен разтвор от 20 до 40 l/acre вода в зависимост от наличното земеделско оборудване.
      additionalInfoNotes: SELECTABLE_STRINGS.CHEMICAL_PROTECTION_CHEM_ACHIBA_MAX_INFO_NOTES,
    },
    {
      // КОРУМ
      plantUsages: [SELECTABLE_STRINGS.PISUM_SATIVUM],
      nameKey: SELECTABLE_STRINGS.CHEMICAL_PROTECTION_CHEM_CORUM,
      type: SELECTABLE_STRINGS.CHEMICAL_PROTECTION_CHEMICAL_TYPE_HERBICIDE,
      activeIngredients: [
        {
          // 480 g/l бентазон
          nameKey: SELECTABLE_STRINGS.CHEMICAL_PROTECTION_ACTIVE_INGREDIENT_BENTAZONE,
          quantity: 480,
          unit: SELECTABLE_STRINGS.G_LITER
        },
        {
          // 22.4 g/l имазамокс
          nameKey: SELECTABLE_STRINGS.CHEMICAL_PROTECTION_ACTIVE_INGREDIENT_IMAZAMOX,
          quantity: 22.4,
          unit: SELECTABLE_STRINGS.G_LITER
        }
      ],
      applicationStage: SELECTABLE_STRINGS.CHEMICAL_PROTECTION_APPLICATION_STAGE_POST_EMERGENT,

      chemicalTargetEnemies: [SELECTABLE_STRINGS.AVENA_FATUA, SELECTABLE_STRINGS.SETARIA_SPP, SELECTABLE_STRINGS.ECHINOCHLOA_CRUS_GALLI, SELECTABLE_STRINGS.ALOPECURUS_MYOSUROIDES, SELECTABLE_STRINGS.SORGHUM_HALEPENSE, SELECTABLE_STRINGS.ABUTILON_THEOPHRASTI, SELECTABLE_STRINGS.AMARANTHUS_RETROFLEXUS, SELECTABLE_STRINGS.CAPSELLA_BURSA_PASTORIS, SELECTABLE_STRINGS.GALIUM_APARINE, SELECTABLE_STRINGS.DATURA_STRAMONIUM, SELECTABLE_STRINGS.PORTULACA_OLERACEA, SELECTABLE_STRINGS.PERSICARIA_HYDROPIPER, SELECTABLE_STRINGS.SINAPIS_ALBA, SELECTABLE_STRINGS.SENECIO_VULGARIS, SELECTABLE_STRINGS.CONVOLVULUS_ARVENSIS, SELECTABLE_STRINGS.CIRSIUM_ARVENSE],
      dosage: 125,
      dosageUnit: SELECTABLE_STRINGS.ML_ACRE,
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
      // Внасянето се извършва с работен разтвор от 20 до 30 l/acre вода в зависимост от наличното земеделско оборудване.
      additionalInfoNotes: SELECTABLE_STRINGS.CHEMICAL_PROTECTION_CHEM_CORUM_INFO_NOTES,
    },
    {
      // ЛЕБРОН 0,5 Г
      plantUsages: [SELECTABLE_STRINGS.PISUM_SATIVUM, SELECTABLE_STRINGS.GLYCINE_MAX],
      nameKey: SELECTABLE_STRINGS.CHEMICAL_PROTECTION_CHEM_LEBRON_0_5_G,
      type: SELECTABLE_STRINGS.CHEMICAL_PROTECTION_CHEMICAL_TYPE_INSECTICIDE,
      activeIngredients: [
        {
          // 5 g/kg тефлутрин
          nameKey: SELECTABLE_STRINGS.CHEMICAL_PROTECTION_ACTIVE_INGREDIENT_TEFLUTHRIN,
          quantity: 5,
          unit: SELECTABLE_STRINGS.G_KG
        }
      ],
      applicationStage: SELECTABLE_STRINGS.CHEMICAL_PROTECTION_APPLICATION_STAGE_PRE_EMERGENT,
      chemicalTargetEnemies: [SELECTABLE_STRINGS.AGRIOTIS_LINEATUS, SELECTABLE_STRINGS.NOCTUIDAE, SELECTABLE_STRINGS.CEUTORRHYNCHUS_PLEUROSTIGMA, SELECTABLE_STRINGS.CHILOPODA, SELECTABLE_STRINGS.CHORTOPHILA_BRASSICAE, SELECTABLE_STRINGS.MELOLONTHA_MELOLONTHA],
      dosage: 1500,
      dosageUnit: SELECTABLE_STRINGS.G_ACRE,
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
      // Може да се прилага в доза до 2.0 kg/acre.
      additionalInfoNotes: SELECTABLE_STRINGS.CHEMICAL_PROTECTION_CHEM_LEBRON_0_5_G_INFO_NOTES,
    },
    {
      // ОАЗИС 5 ЕК
      plantUsages: [SELECTABLE_STRINGS.PISUM_SATIVUM],
      nameKey: SELECTABLE_STRINGS.CHEMICAL_PROTECTION_CHEM_OASIS_5_EC,
      type: SELECTABLE_STRINGS.CHEMICAL_PROTECTION_CHEMICAL_TYPE_INSECTICIDE,
      activeIngredients: [
        {
          // 50 g/l есфенвалерат
          nameKey: SELECTABLE_STRINGS.CHEMICAL_PROTECTION_ACTIVE_INGREDIENT_ESFENVALERATE,
          quantity: 50,
          unit: SELECTABLE_STRINGS.G_LITER
        }
      ],
      applicationStage: SELECTABLE_STRINGS.CHEMICAL_PROTECTION_APPLICATION_STAGE_POST_EMERGENT,

      chemicalTargetEnemies: [SELECTABLE_STRINGS.BRUCHUS_PISORUM],
      dosage: 25,
      dosageUnit: SELECTABLE_STRINGS.ML_ACRE,
      maxApplications: 2,
      minIntervalBetweenApplicationsDays: 14,
      maxIntervalBetweenApplicationsDays: 14,
      quarantinePeriodDays: 14,
      pricePer1LiterBGN: 40.83,
      pricePerAcreBGN: 1.02,
      // Внасянето се извършва при поява на неприятелите над икономическия праг на вредност.
      additionalInfo: SELECTABLE_STRINGS.CHEMICAL_PROTECTION_CHEM_OASIS_5_EC_INFO,
      // Притежава много бърз инициален (нокдаун) ефект с широк спектър на действие за борба с листогризещи и смучещи насекомни с добре изразено стомашно действие.
      // Внасянето се извършва с работен разтвор от 20 до 50 l/acre вода в зависимост от наличното земеделско оборудване.
      additionalInfoNotes: SELECTABLE_STRINGS.CHEMICAL_PROTECTION_CHEM_OASIS_5_EC_INFO_NOTES,
    },
    {
      // ЦИТРИН МАКС
      plantUsages: [SELECTABLE_STRINGS.PISUM_SATIVUM],
      nameKey: SELECTABLE_STRINGS.CHEMICAL_PROTECTION_CHEM_CITRINE_MAX,
      type: SELECTABLE_STRINGS.CHEMICAL_PROTECTION_CHEMICAL_TYPE_INSECTICIDE,
      activeIngredients: [
        {
          // 500 g/l циперметрин
          nameKey: SELECTABLE_STRINGS.CHEMICAL_PROTECTION_ACTIVE_INGREDIENT_CYCLOXYDIM,
          quantity: 500,
          unit: SELECTABLE_STRINGS.G_LITER
        }
      ],
      applicationStage: SELECTABLE_STRINGS.CHEMICAL_PROTECTION_APPLICATION_STAGE_POST_EMERGENT,

      chemicalTargetEnemies: [SELECTABLE_STRINGS.BRUCHUS_PISORUM, SELECTABLE_STRINGS.AUTOGRAPHA_GAMMA, SELECTABLE_STRINGS.LASPEYRESIA_NIGRICANA, SELECTABLE_STRINGS.APHIDOIDEA, SELECTABLE_STRINGS.CURCULIONIDAE],
      dosage: 5,
      dosageUnit: SELECTABLE_STRINGS.ML_ACRE,
      maxApplications: 2,
      minIntervalBetweenApplicationsDays: 14,
      maxIntervalBetweenApplicationsDays: 14,
      quarantinePeriodDays: 14,
      pricePer1LiterBGN: 158.45,
      pricePerAcreBGN: 0.79,
      // Внасянето се извършва при поява на неприятелите над икономическия праг на вредност.
      additionalInfo: SELECTABLE_STRINGS.CHEMICAL_PROTECTION_CHEM_CITRINE_MAX_INFO,
      // Притежава много бърз инициален (нокдаун) ефект с широк спектър на действие за борба със смучещи и гризещи неприятели.
      // Унищожава всички подвижни стадии – ларви, нимфи и възрастни форми на неприятелите.
      // Да не се смесва с алкални продукти като бордолезов разтвор и др.
      // Внасянето се извършва с работен разтвор от 10 до 100 l/acre вода.
      // Инсектицидът е опасен за пчелите (SPe8).
      additionalInfoNotes: SELECTABLE_STRINGS.CHEMICAL_PROTECTION_CHEM_CITRINE_MAX_INFO_NOTES,
    },
    {
      // ФЛИПЕР ЕВ
      plantUsages: [SELECTABLE_STRINGS.PISUM_SATIVUM, SELECTABLE_STRINGS.GLYCINE_MAX],
      nameKey: SELECTABLE_STRINGS.CHEMICAL_PROTECTION_CHEM_FLIPPER,
      type: SELECTABLE_STRINGS.CHEMICAL_PROTECTION_CHEMICAL_TYPE_INSECTICIDE,
      activeIngredients: [
        {
          // 479.8 g/l мастни киселини
          nameKey: SELECTABLE_STRINGS.CHEMICAL_PROTECTION_ACTIVE_INGREDIENT_FATTY_ACIDS,
          quantity: 479.8,
          unit: SELECTABLE_STRINGS.G_LITER
        }
      ],
      applicationStage: SELECTABLE_STRINGS.CHEMICAL_PROTECTION_APPLICATION_STAGE_POST_EMERGENT,

      chemicalTargetEnemies: [SELECTABLE_STRINGS.ACARINA, SELECTABLE_STRINGS.APHIDOIDEA, SELECTABLE_STRINGS.TRIALEURODES_VAPORARIORUM],
      dosage: 1600,
      dosageUnit: SELECTABLE_STRINGS.ML_ACRE,
      maxApplications: 5,
      minIntervalBetweenApplicationsDays: 10,
      maxIntervalBetweenApplicationsDays: 10,
      quarantinePeriodDays: 7,
      pricePer1LiterBGN: 48.4,
      pricePerAcreBGN: 77.44,
      // Третирането на посева може да се извършва от поникване до пълна зрялост на граха при поява на неприятелите над икономическия праг на вредност.
      // Може да се прилага в доза до 2000 ml/acre.
      additionalInfo: SELECTABLE_STRINGS.CHEMICAL_PROTECTION_CHEM_FLIPPER_INFO,
      // Биологичен, контактен инсектицид / акарицид за борба срещу различни неприятели в стадии - яйца, ларви и възрастни насекоми.
      // Разрешен за употреба при полски и оранжерийни условия.
      // Внасянето се извършва с работен разтвор от 30 до 200 l/acre вода.
      // Безвреден за пчелите!
      additionalInfoNotes: SELECTABLE_STRINGS.CHEMICAL_PROTECTION_CHEM_FLIPPER_INFO_NOTES,
    },
    {
      // ОРТИВА ТОП СК
      plantUsages: [SELECTABLE_STRINGS.PISUM_SATIVUM],
      nameKey: SELECTABLE_STRINGS.CHEMICAL_PROTECTION_CHEM_ORTIVA_TOP_SC,
      type: SELECTABLE_STRINGS.CHEMICAL_PROTECTION_CHEMICAL_TYPE_FUNGICIDE,
      activeIngredients: [
        {
          // 200 g/l азоксистробин
          nameKey: SELECTABLE_STRINGS.CHEMICAL_PROTECTION_ACTIVE_INGREDIENT_AZOXYSTROBIN,
          quantity: 200,
          unit: SELECTABLE_STRINGS.G_LITER
        },
        {
          // 125 g/l дифеноконазол
          nameKey: SELECTABLE_STRINGS.CHEMICAL_PROTECTION_ACTIVE_INGREDIENT_DIFENOCONAZOLE,
          quantity: 125,
          unit: SELECTABLE_STRINGS.G_LITER
        }
      ],
      applicationStage: SELECTABLE_STRINGS.CHEMICAL_PROTECTION_APPLICATION_STAGE_POST_EMERGENT,
      chemicalTargetEnemies: [SELECTABLE_STRINGS.ASCOCHYTA_RABIEI],
      dosage: 100,
      dosageUnit: SELECTABLE_STRINGS.ML_ACRE,
      maxApplications: 2,
      minIntervalBetweenApplicationsDays: 14,
      maxIntervalBetweenApplicationsDays: 14,
      quarantinePeriodDays: 7,
      pricePer1LiterBGN: 185.95,
      pricePerAcreBGN: 18.6,
      // Третирането на посева с фунгицида се извършва превантивно или при поява на първи симптоми.
      additionalInfo: SELECTABLE_STRINGS.CHEMICAL_PROTECTION_CHEM_ORTIVA_TOP_SC_INFO,
      // Комбиниран широкоспектърен фунгицид с контактно, трансламинарно и системно действие.
      // Внасянето се извършва с работен разтвор от 50 до 100 l/acre вода в зависимост от наличното земеделско оборудване.
      additionalInfoNotes: SELECTABLE_STRINGS.CHEMICAL_PROTECTION_CHEM_ORTIVA_TOP_SC_INFO_NOTES,
    },
    {
      // СУИЧ 62.5 ВГ
      plantUsages: [SELECTABLE_STRINGS.PISUM_SATIVUM, SELECTABLE_STRINGS.GLYCINE_MAX],
      nameKey: SELECTABLE_STRINGS.CHEMICAL_PROTECTION_CHEM_SWITCH_625_WG,
      type: SELECTABLE_STRINGS.CHEMICAL_PROTECTION_CHEMICAL_TYPE_FUNGICIDE,
      activeIngredients: [
        {
          // 250 g/kg флудиоксонил
          nameKey: SELECTABLE_STRINGS.CHEMICAL_PROTECTION_ACTIVE_INGREDIENT_FLUDIOXONIL,
          quantity: 250,
          unit: SELECTABLE_STRINGS.G_KG
        },
        {
          // 375 g/kg ципродинил
          nameKey: SELECTABLE_STRINGS.CHEMICAL_PROTECTION_ACTIVE_INGREDIENT_CYPRODINIL,
          quantity: 375,
          unit: SELECTABLE_STRINGS.G_KG
        }
      ],
      applicationStage: SELECTABLE_STRINGS.CHEMICAL_PROTECTION_APPLICATION_STAGE_POST_EMERGENT,

      chemicalTargetEnemies: [SELECTABLE_STRINGS.ANTHRACNOSE, SELECTABLE_STRINGS.BLUMERIA_GRAMINIS, SELECTABLE_STRINGS.BOTRYTIS_CINEREA],
      dosage: 80,
      dosageUnit: SELECTABLE_STRINGS.G_ACRE,
      maxApplications: 1,
      minIntervalBetweenApplicationsDays: 0,
      maxIntervalBetweenApplicationsDays: 0,
      quarantinePeriodDays: 21,
      pricePer1LiterBGN: 445.55,
      pricePerAcreBGN: 35.64,
      // Внася се в междуфазните периоди – от начало на цъфтеж до напълно оформени бобове (достигнали типичен размер) на грахът.
      additionalInfo: SELECTABLE_STRINGS.CHEMICAL_PROTECTION_CHEM_SWITCH_625_WG_INFO,
      // Комбиниран широкоспектърен фунгицид с несистемно предпазно, и системно предпазно и лечебно действие.
      // Може да се прилага в доза до 100 g/acre.
      additionalInfoNotes: SELECTABLE_STRINGS.CHEMICAL_PROTECTION_CHEM_SWITCH_625_WG_INFO_NOTES,
    },
    {
      // БОРДО МИКС 20 ВП
      plantUsages: [SELECTABLE_STRINGS.PISUM_SATIVUM],
      nameKey: SELECTABLE_STRINGS.CHEMICAL_PROTECTION_CHEM_BORDEAUX_MIX_20_VP,
      type: SELECTABLE_STRINGS.CHEMICAL_PROTECTION_CHEMICAL_TYPE_FUNGICIDE,
      activeIngredients: [
        {
          // 200 g/l бордолезова смес (меднокалциев сулфат)
          nameKey: SELECTABLE_STRINGS.CHEMICAL_PROTECTION_ACTIVE_INGREDIENT_BORDEAUX_MIXTURE,
          quantity: 200,
          unit: SELECTABLE_STRINGS.G_LITER
        }
      ],
      applicationStage: SELECTABLE_STRINGS.CHEMICAL_PROTECTION_APPLICATION_STAGE_POST_EMERGENT,

      chemicalTargetEnemies: [SELECTABLE_STRINGS.ANTHRACNOSE, SELECTABLE_STRINGS.PERONOSPORACEAE, SELECTABLE_STRINGS.PUCCINIA_GRAMINIS, SELECTABLE_STRINGS.SEPTORIA, SELECTABLE_STRINGS.XANTHOMONAS],
      dosage: 375,
      dosageUnit: SELECTABLE_STRINGS.G_ACRE,
      maxApplications: 3,
      minIntervalBetweenApplicationsDays: 10,
      maxIntervalBetweenApplicationsDays: 10,
      quarantinePeriodDays: 3,
      pricePer1LiterBGN: 18.8,
      pricePerAcreBGN: 7.05,
      // Третирането на посева се извършва в междуфазния период – четвърти същински лист до пълно узряване на граха.
      additionalInfo: SELECTABLE_STRINGS.CHEMICAL_PROTECTION_CHEM_BORDEAUX_MIX_20_VP_INFO,
      // Широкоспектърен контактен неорганичен фунгицид / бактерицид с предпазно действие, при максимална доза на приложение 500 g/acre.
      // Внасянето се извършва с работен разтвор от 100 l/acre вода. Подходящ за биологично земеделие.
      additionalInfoNotes: SELECTABLE_STRINGS.CHEMICAL_PROTECTION_CHEM_BORDEAUX_MIX_20_VP_INFO_NOTES,
    },
    {
      // СЯРА ВГ
      plantUsages: [SELECTABLE_STRINGS.PISUM_SATIVUM, SELECTABLE_STRINGS.GLYCINE_MAX],
      nameKey: SELECTABLE_STRINGS.CHEMICAL_PROTECTION_CHEM_SULPHUR_WG,
      type: SELECTABLE_STRINGS.CHEMICAL_PROTECTION_CHEMICAL_TYPE_FUNGICIDE,
      activeIngredients: [
        {
          // 800 g/kg сяра
          nameKey: SELECTABLE_STRINGS.CHEMICAL_PROTECTION_ACTIVE_INGREDIENT_SULFUR,
          quantity: 800,
          unit: SELECTABLE_STRINGS.G_KG
        }
      ],
      applicationStage: SELECTABLE_STRINGS.CHEMICAL_PROTECTION_APPLICATION_STAGE_POST_EMERGENT,

      chemicalTargetEnemies: [SELECTABLE_STRINGS.BLUMERIA_GRAMINIS],
      dosage: 300,
      dosageUnit: SELECTABLE_STRINGS.G_ACRE,
      maxApplications: 8,
      minIntervalBetweenApplicationsDays: 7,
      maxIntervalBetweenApplicationsDays: 8,
      quarantinePeriodDays: 8,
      pricePer1LiterBGN: 0.9,
      pricePerAcreBGN: 0.27,
      // Третирането се извършва при благоприятни метеорологични условия за масово развитие на болестта.
      additionalInfo: SELECTABLE_STRINGS.CHEMICAL_PROTECTION_CHEM_SULPHUR_WG_INFO,
      // Несистемен неорганичен фунгицид и акарицид с контактно и фумигиращо действие.
      // Подходящ за употреба в биологичното земеделие. Внасяне с 50–100 l/acre работен разтвор.
      additionalInfoNotes: SELECTABLE_STRINGS.CHEMICAL_PROTECTION_CHEM_SULPHUR_WG_INFO_NOTES,
    },
    {
      // ЗОКСИС 250 СК
      plantUsages: [SELECTABLE_STRINGS.PISUM_SATIVUM],
      nameKey: SELECTABLE_STRINGS.CHEMICAL_PROTECTION_CHEM_ZOXIS_250_SC,
      type: SELECTABLE_STRINGS.CHEMICAL_PROTECTION_CHEMICAL_TYPE_FUNGICIDE,
      activeIngredients: [
        {
          // 250 g/l азоксистробин
          nameKey: SELECTABLE_STRINGS.CHEMICAL_PROTECTION_ACTIVE_INGREDIENT_AZOXYSTROBIN,
          quantity: 250,
          unit: SELECTABLE_STRINGS.G_LITER
        }
      ],
      applicationStage: SELECTABLE_STRINGS.CHEMICAL_PROTECTION_APPLICATION_STAGE_POST_EMERGENT,

      chemicalTargetEnemies: [SELECTABLE_STRINGS.ASCOCHYTA_RABIEI, SELECTABLE_STRINGS.BLUMERIA_GRAMINIS, SELECTABLE_STRINGS.PUCCINIA_GRAMINIS, SELECTABLE_STRINGS.BOTRYTIS_CINEREA],
      dosage: 80,
      dosageUnit: SELECTABLE_STRINGS.ML_ACRE,
      maxApplications: 2,
      minIntervalBetweenApplicationsDays: 10,
      maxIntervalBetweenApplicationsDays: 14,
      quarantinePeriodDays: 14,
      pricePer1LiterBGN: 55.34,
      pricePerAcreBGN: 4.43,
      // Третирането се извършва при благоприятни метеорологични условия за масово развитие на болестта. Внася се от поникване до край на цъфтежа на граха.
      additionalInfo: SELECTABLE_STRINGS.CHEMICAL_PROTECTION_CHEM_ZOXIS_250_SC_INFO,
      // Системен стробилуринов фунгицид с предпазно, лечебно и изкореняващо действие.
      // Позволява да се прилага в максимална доза 100 ml/acre. Работен разтвор 80 l/acre.
      additionalInfoNotes: SELECTABLE_STRINGS.CHEMICAL_PROTECTION_CHEM_ZOXIS_250_SC_INFO_NOTES,
    },
    //Glycine max (Соя Soybean)
    {
      // СИРТАКИ
      plantUsages: [SELECTABLE_STRINGS.GLYCINE_MAX],
      nameKey: SELECTABLE_STRINGS.CHEMICAL_PROTECTION_CHEM_SIRTAKI,
      type: SELECTABLE_STRINGS.CHEMICAL_PROTECTION_CHEMICAL_TYPE_HERBICIDE,
      activeIngredients: [
        {
          // 360 g/l кломазон
          nameKey: SELECTABLE_STRINGS.CHEMICAL_PROTECTION_ACTIVE_INGREDIENT_CLOMAZONE,
          quantity: 360,
          unit: SELECTABLE_STRINGS.G_LITER
        }
      ],
      applicationStage: SELECTABLE_STRINGS.CHEMICAL_PROTECTION_APPLICATION_STAGE_PRE_EMERGENT_AFTER_SOWING_BEFORE_EMERGENCE,

      chemicalTargetEnemies: [SELECTABLE_STRINGS.ECHINOCHLOA_CRUS_GALLI, SELECTABLE_STRINGS.DIGITARIA_SANGUINALIS, SELECTABLE_STRINGS.SETARIA_SPP, SELECTABLE_STRINGS.SOLANUM_NIGRUM, SELECTABLE_STRINGS.CHENOPODIUM_ALBUM, SELECTABLE_STRINGS.AMARANTHUS_RETROFLEXUS, SELECTABLE_STRINGS.PORTULACA_OLERACEA],
      dosage: 40,
      dosageUnit: SELECTABLE_STRINGS.ML_ACRE,
      maxApplications: 1,
      minIntervalBetweenApplicationsDays: 0,
      maxIntervalBetweenApplicationsDays: 0,
      quarantinePeriodDays: 0,
      pricePer1LiterBGN: 263.79,
      pricePerAcreBGN: 10.55,
      // Третирането се извършва след сеитба, преди поникване на културата и на плевелите.
      additionalInfo: SELECTABLE_STRINGS.CHEMICAL_PROTECTION_CHEM_SIRTAKI_INFO,
      // За по-висока ефикасност на хербицида, плевелните видове трябва да са в начални фази от развитието си...
      additionalInfoNotes: SELECTABLE_STRINGS.CHEMICAL_PROTECTION_CHEM_SIRTAKI_INFO_NOTES,
    },
    {
      // САЛТУС
      plantUsages: [SELECTABLE_STRINGS.GLYCINE_MAX],
      nameKey: SELECTABLE_STRINGS.CHEMICAL_PROTECTION_CHEM_SALTUS,
      type: SELECTABLE_STRINGS.CHEMICAL_PROTECTION_CHEMICAL_TYPE_HERBICIDE,
      activeIngredients: [
        {
          // 80 g/l имазамокс
          nameKey: SELECTABLE_STRINGS.CHEMICAL_PROTECTION_ACTIVE_INGREDIENT_IMAZAMOX,
          quantity: 80,
          unit: SELECTABLE_STRINGS.G_LITER
        }
      ],
      applicationStage: SELECTABLE_STRINGS.CHEMICAL_PROTECTION_APPLICATION_STAGE_POST_EMERGENT,
      chemicalTargetEnemies: [SELECTABLE_STRINGS.SORGHUM_HALEPENSE, SELECTABLE_STRINGS.APERA_SPICA_VENTI, SELECTABLE_STRINGS.ECHINOCHLOA_CRUS_GALLI, SELECTABLE_STRINGS.SETARIA_SPP, SELECTABLE_STRINGS.ABUTILON_THEOPHRASTI, SELECTABLE_STRINGS.CHENOPODIUM_ALBUM, SELECTABLE_STRINGS.RAPHANUS_RAPHANISTRUM, SELECTABLE_STRINGS.CAPSELLA_BURSA_PASTORIS, SELECTABLE_STRINGS.CIRSIUM_ARVENSE, SELECTABLE_STRINGS.ANTHEMIS_ARVENSIS, SELECTABLE_STRINGS.SINAPIS_ALBA],
      dosage: 65,
      dosageUnit: SELECTABLE_STRINGS.ML_ACRE,
      maxApplications: 1,
      minIntervalBetweenApplicationsDays: 0,
      maxIntervalBetweenApplicationsDays: 0,
      quarantinePeriodDays: 0,
      pricePer1LiterBGN: 135.24,
      pricePerAcreBGN: 8.79,
      //Внася се във фаза втори – четвърти троен лист на соята.
      additionalInfo: SELECTABLE_STRINGS.CHEMICAL_PROTECTION_CHEM_SALTUS_INFO,
      //Селективен системен хербицид с висока ефикасност, когато плевелните видове са във фенофаза втори-четвърти лист (фаза „кръстосване“ на листата). Позволява миксиране с хербициди с активно вещество бентазон за смесено приложение. Не трябва да се смесва с инсектициди от групата на карбаматите и органофосфорните съединения. Под въздействие на стресови абиотични условия хербицидът може да причини преходна фитотоксичност на културата, която се проявява с леко пожълтяване (хлороза) и краткотраен застой в нарастването на соята, който не рефлектират върху добива. Внасянето се извършва с работен разтвор от 10 до 40 l/acre вода в зависимост от наличното земеделско оборудване. 
      additionalInfoNotes: SELECTABLE_STRINGS.CHEMICAL_PROTECTION_CHEM_SALTUS_INFO_NOTES
    },
    {
      // ПАНТЕРА 40 ЕК
      plantUsages: [SELECTABLE_STRINGS.GLYCINE_MAX],
      nameKey: SELECTABLE_STRINGS.CHEMICAL_PROTECTION_CHEM_PANTHER_40_EC,
      type: SELECTABLE_STRINGS.CHEMICAL_PROTECTION_CHEMICAL_TYPE_HERBICIDE,
      activeIngredients: [
        {
          // 40 g/l квизалофоп-П-тефурил
          nameKey: SELECTABLE_STRINGS.CHEMICAL_PROTECTION_ACTIVE_INGREDIENT_QUIZALOFOP_P_TEFRIL,
          quantity: 40,
          unit: SELECTABLE_STRINGS.G_LITER
        }
      ],
      applicationStage: SELECTABLE_STRINGS.CHEMICAL_PROTECTION_APPLICATION_STAGE_POST_EMERGENT,
      chemicalTargetEnemies: [SELECTABLE_STRINGS.SETARIA_SPP, SELECTABLE_STRINGS.SORGHUM_HALEPENSE, SELECTABLE_STRINGS.CYNODON_DACTYLON, SELECTABLE_STRINGS.ELYMUS_REPENS, SELECTABLE_STRINGS.ECHINOCHLOA_CRUS_GALLI, SELECTABLE_STRINGS.AVENA_FATUA],
      dosage: 150,
      dosageUnit: SELECTABLE_STRINGS.ML_ACRE,
      maxApplications: 1,
      minIntervalBetweenApplicationsDays: 0,
      maxIntervalBetweenApplicationsDays: 60,
      quarantinePeriodDays: 0,
      pricePer1LiterBGN: 42.49,
      pricePerAcreBGN: 6.37,
      //Внася се във фаза втори – четвърти троен лист преди начало на цъфтеж на соята.
      additionalInfo: SELECTABLE_STRINGS.CHEMICAL_PROTECTION_CHEM_PANTHER_40_EC_INFO,
      //Не изисква добавяне на прилепител или омокрител. Внасянето се извършва с работен разтвор от 20 до 40 l/acre вода в зависимост от наличното земеделско оборудване. 
      additionalInfoNotes: SELECTABLE_STRINGS.CHEMICAL_PROTECTION_CHEM_PANTHER_40_EC_INFO_NOTES
    },
    {
      // ДЕКА ЕК
      plantUsages: [SELECTABLE_STRINGS.GLYCINE_MAX],
      nameKey: SELECTABLE_STRINGS.CHEMICAL_PROTECTION_CHEM_DECA_EC,
      type: SELECTABLE_STRINGS.CHEMICAL_PROTECTION_CHEMICAL_TYPE_INSECTICIDE,
      activeIngredients: [
        {
          // 100 g/l делтаметрин
          nameKey: SELECTABLE_STRINGS.CHEMICAL_PROTECTION_ACTIVE_INGREDIENT_DELTAMETHRIN,
          quantity: 100,
          unit: SELECTABLE_STRINGS.G_LITER
        }
      ],
      applicationStage: SELECTABLE_STRINGS.CHEMICAL_PROTECTION_APPLICATION_STAGE_POST_EMERGENT,
      chemicalTargetEnemies: [SELECTABLE_STRINGS.ACYRTHOSIPHON_PISI, SELECTABLE_STRINGS.PROTAPION_APRICANS, SELECTABLE_STRINGS.PHYTONOMUS_VARIABILIS],
      dosage: 50,
      dosageUnit: SELECTABLE_STRINGS.ML_ACRE,
      maxApplications: 2,
      minIntervalBetweenApplicationsDays: 14,
      maxIntervalBetweenApplicationsDays: 14,
      quarantinePeriodDays: 3,
      pricePer1LiterBGN: 33,
      pricePerAcreBGN: 1.65,
      // Внасянето се извършва с работен разтвор до 100 l/acre вода в зависимост от наличното земеделско оборудване. Инсектицидът е опасен за пчелите (SPe8).
      additionalInfo: SELECTABLE_STRINGS.CHEMICAL_PROTECTION_CHEM_DECA_EC_INFO,
      // Притежава много бърз инициален (нокдаун) ефект срещу голям брой смучещи и гризещи неприятели по оранжерийни, зърнени, технически, фуражни, зеленчукови, картофи, овощни видове и лозя.
      additionalInfoNotes: SELECTABLE_STRINGS.CHEMICAL_PROTECTION_CHEM_DECA_EC_INFO_NOTES
    },
    {
      // ТРИКА ЕКСПЕРТ
      plantUsages: [SELECTABLE_STRINGS.GLYCINE_MAX],
      nameKey: SELECTABLE_STRINGS.CHEMICAL_PROTECTION_CHEM_TRIKA_EXPERT,
      type: SELECTABLE_STRINGS.CHEMICAL_PROTECTION_CHEMICAL_TYPE_INSECTICIDE,
      activeIngredients: [
        {
          // 4 g/l ламбда - цихалотрин
          nameKey: SELECTABLE_STRINGS.CHEMICAL_PROTECTION_ACTIVE_INGREDIENT_LAMBDA_CYHALOTHRIN,
          quantity: 4,
          unit: SELECTABLE_STRINGS.G_LITER
        }
      ],
      applicationStage: SELECTABLE_STRINGS.CHEMICAL_PROTECTION_APPLICATION_STAGE_PRE_EMERGENT_DURING_SOWING,
      chemicalTargetEnemies: [SELECTABLE_STRINGS.NOCTUIDAE, SELECTABLE_STRINGS.MELOLONTHA_MELOLONTHA, SELECTABLE_STRINGS.AGRIOTIS_LINEATUS],
      dosage: 1300,
      dosageUnit: SELECTABLE_STRINGS.G_ACRE,
      maxApplications: 1,
      minIntervalBetweenApplicationsDays: 0,
      maxIntervalBetweenApplicationsDays: 0,
      quarantinePeriodDays: 0,
      pricePer1LiterBGN: 18.26,
      pricePerAcreBGN: 14.17,
      // Прилага се локализирано, по време на сеитба в браздата.
      additionalInfo: SELECTABLE_STRINGS.CHEMICAL_PROTECTION_CHEM_TRIKA_EXPERT_INFO,
      // Локализирането на инсектицида до семената по време на сеитба или до корените по време на окопаване/загърляне формира образуването на защитен филм около семето или коренчетата, предпазва от почвени инсекти като гъсеници на нощенки, ларви на бръмбари, телени червеи и други неприятели. В гранулите на Трика Експерт, като коформуланти са включени азот и фосфор в съотношение 7:35. Поради тази причина с прилагането на препарата се постига двоен ефект- предпазване и подхранване.
      additionalInfoNotes: SELECTABLE_STRINGS.CHEMICAL_PROTECTION_CHEM_TRIKA_EXPERT_INFO_NOTES
    },
    {
      // РЕТЕНГО 20ЕК
      plantUsages: [SELECTABLE_STRINGS.GLYCINE_MAX, SELECTABLE_STRINGS.ZEA_MAYS],
      nameKey: SELECTABLE_STRINGS.CHEMICAL_PROTECTION_CHEM_RETENGO_20_EC,
      type: SELECTABLE_STRINGS.CHEMICAL_PROTECTION_CHEMICAL_TYPE_FUNGICIDE,
      activeIngredients: [
        {
          // 200 g/l пираклостробин
          nameKey: SELECTABLE_STRINGS.CHEMICAL_PROTECTION_ACTIVE_INGREDIENT_PYRACLOSTROBIN,
          quantity: 200,
          unit: SELECTABLE_STRINGS.G_LITER
        }
      ],
      applicationStage: SELECTABLE_STRINGS.CHEMICAL_PROTECTION_APPLICATION_STAGE_POST_EMERGENT,
      chemicalTargetEnemies: [SELECTABLE_STRINGS.SETOSPHAERIA_TURCICA, SELECTABLE_STRINGS.PUCCINIA_GRAMINIS],
      dosage: 80,
      dosageUnit: SELECTABLE_STRINGS.ML_ACRE,
      maxApplications: 1,
      minIntervalBetweenApplicationsDays: 0,
      maxIntervalBetweenApplicationsDays: 0,
      quarantinePeriodDays: 0,
      pricePer1LiterBGN: 102,
      pricePerAcreBGN: 8.16,
      // Третирането на посева може да се извърши от поникване до пълно оформяне на бобовите на соята.
      additionalInfo: SELECTABLE_STRINGS.CHEMICAL_PROTECTION_CHEM_RETENGO_20_EC_INFO,
      // Системен неорганичен фунгицид и акарицид с контактно и фумигиращо действие. Подходящ за употреба в биологичното земеделие. Внасянето на фунгицида се извършва с работен разтвор от 10 до 40 l/acre вода в зависимост от наличното земеделско оборудване.
      additionalInfoNotes: SELECTABLE_STRINGS.CHEMICAL_PROTECTION_CHEM_RETENGO_20_EC_INFO_NOTES
    },
    {
      // ДИФКОР 250 СК
      plantUsages: [SELECTABLE_STRINGS.GLYCINE_MAX],
      nameKey: SELECTABLE_STRINGS.CHEMICAL_PROTECTION_CHEM_DIFKOR_250_SC,
      type: SELECTABLE_STRINGS.CHEMICAL_PROTECTION_CHEMICAL_TYPE_FUNGICIDE,
      activeIngredients: [
        {
          // 250 g/l дифеноконазол
          nameKey: SELECTABLE_STRINGS.CHEMICAL_PROTECTION_ACTIVE_INGREDIENT_DIFENOCONAZOLE,
          quantity: 250,
          unit: SELECTABLE_STRINGS.G_LITER
        }
      ],
      applicationStage: SELECTABLE_STRINGS.CHEMICAL_PROTECTION_APPLICATION_STAGE_POST_EMERGENT,
      chemicalTargetEnemies: [SELECTABLE_STRINGS.PUCCINIA_GRAMINIS],
      dosage: 50,
      dosageUnit: SELECTABLE_STRINGS.ML_ACRE,
      maxApplications: 2,
      minIntervalBetweenApplicationsDays: 14,
      maxIntervalBetweenApplicationsDays: 14,
      quarantinePeriodDays: 0,
      pricePer1LiterBGN: 98.37,
      pricePerAcreBGN: 4.92,
      // Третирането  се извършва в междуфазните периоди от девети троен лист до пълна зрялост на соята. Само в семепроизводни посеви.
      additionalInfo: SELECTABLE_STRINGS.CHEMICAL_PROTECTION_CHEM_DIFKOR_250_SC_INFO,
      // Продуктът е устойчив на измиване от валежи, паднали 2 часа след третирането, а също така притежава добро продължително действие. Внасянето се извършва с работен разтвор от 20 до 100 l/acre вода в зависимост от наличното земеделско оборудване.
      additionalInfoNotes: SELECTABLE_STRINGS.CHEMICAL_PROTECTION_CHEM_DIFKOR_250_SC_INFO_NOTES
    },
    //Sorghum vulgare var. tehnicum (Сорго, Sorghum) 
    {
      // АГРАКСОН 500 СЛ
      plantUsages: [SELECTABLE_STRINGS.SORGHUM_VULGARE_VAR_TEHNICUM],
      nameKey: SELECTABLE_STRINGS.CHEMICAL_PROTECTION_CHEM_AGROXONE_500_SL,
      type: SELECTABLE_STRINGS.CHEMICAL_PROTECTION_CHEMICAL_TYPE_HERBICIDE,
      activeIngredients: [
        {
          // 500 g/l МЦПА
          nameKey: SELECTABLE_STRINGS.CHEMICAL_PROTECTION_ACTIVE_INGREDIENT_MCPA,
          quantity: 500,
          unit: SELECTABLE_STRINGS.G_LITER
        }
      ],
      applicationStage: SELECTABLE_STRINGS.CHEMICAL_PROTECTION_APPLICATION_STAGE_POST_EMERGENT,

      chemicalTargetEnemies: [SELECTABLE_STRINGS.CIRSIUM_ARVENSE, SELECTABLE_STRINGS.CAPSELLA_BURSA_PASTORIS, SELECTABLE_STRINGS.CHENOPODIUM_ALBUM, SELECTABLE_STRINGS.RANUNCULUS_ARVENSIS, SELECTABLE_STRINGS.LAMIUM_PURPUREUM, SELECTABLE_STRINGS.RAPHANUS_RAPHANISTRUM],
      dosage: 160,
      dosageUnit: SELECTABLE_STRINGS.ML_ACRE,
      maxApplications: 1,
      minIntervalBetweenApplicationsDays: 0,
      maxIntervalBetweenApplicationsDays: 0,
      quarantinePeriodDays: 0,
      pricePer1LiterBGN: 20.09,
      pricePerAcreBGN: 3.21,
      // Третирането се извършва до фенофаза четвърти лист на културата.
      additionalInfo: SELECTABLE_STRINGS.CHEMICAL_PROTECTION_CHEM_AGROXONE_500_SL_INFO,
      // Селективен, системен, хормоноподобен хербицид, предназначен за борба с едногодишните и многогодишни, широколистни плевели изисква плевелите да са в активен растеж. Внасянето се извършва с работен разтвор от 40 до 60 l/acre вода в зависимост от наличното земеделско оборудване.
      additionalInfoNotes: SELECTABLE_STRINGS.CHEMICAL_PROTECTION_CHEM_AGROXONE_500_SL_INFO_NOTES
    },
    {
      // ДЖАНЕРО 480 СЛ
      plantUsages: [SELECTABLE_STRINGS.SORGHUM_VULGARE_VAR_TEHNICUM],
      nameKey: SELECTABLE_STRINGS.CHEMICAL_PROTECTION_CHEM_GENERO_480_SL,
      type: SELECTABLE_STRINGS.CHEMICAL_PROTECTION_CHEMICAL_TYPE_HERBICIDE,
      activeIngredients: [
        {
          // 480 g/l дикамба
          nameKey: SELECTABLE_STRINGS.CHEMICAL_PROTECTION_ACTIVE_INGREDIENT_DICAMBA,
          quantity: 480,
          unit: SELECTABLE_STRINGS.G_LITER
        }
      ],
      applicationStage: SELECTABLE_STRINGS.CHEMICAL_PROTECTION_APPLICATION_STAGE_POST_EMERGENT,

      chemicalTargetEnemies: [SELECTABLE_STRINGS.CHENOPODIUM_ALBUM, SELECTABLE_STRINGS.AMARANTHUS_RETROFLEXUS, SELECTABLE_STRINGS.SINAPIS_ALBA, SELECTABLE_STRINGS.SOLANUM_NIGRUM],
      dosage: 35,
      dosageUnit: SELECTABLE_STRINGS.ML_ACRE,
      maxApplications: 1,
      minIntervalBetweenApplicationsDays: 0,
      maxIntervalBetweenApplicationsDays: 0,
      quarantinePeriodDays: 0,
      pricePer1LiterBGN: 37.22,
      pricePerAcreBGN: 1.30,
      // Третирането се извършва ранно вегетационно от фенофаза втори лист до шести лист на културата.
      additionalInfo: SELECTABLE_STRINGS.CHEMICAL_PROTECTION_CHEM_GENERO_480_SL_INFO,
      // За разширяване спектъра на действие може да се смесва с НИШИН 4 ОД или ОСОРНО СК. Внасянето се извършва с работен разтвор от 10 до 40 l/acre вода в зависимост от наличното земеделско оборудване.
      additionalInfoNotes: SELECTABLE_STRINGS.CHEMICAL_PROTECTION_CHEM_GENERO_480_SL_INFO_NOTES
    },
    {
      // КИДЕКА ПРО
      plantUsages: [SELECTABLE_STRINGS.SORGHUM_VULGARE_VAR_TEHNICUM],
      nameKey: SELECTABLE_STRINGS.CHEMICAL_PROTECTION_CHEM_KIDEKA_PRO,
      type: SELECTABLE_STRINGS.CHEMICAL_PROTECTION_CHEMICAL_TYPE_HERBICIDE,
      activeIngredients: [
        {
          // 100 g/l месотрион
          nameKey: SELECTABLE_STRINGS.CHEMICAL_PROTECTION_ACTIVE_INGREDIENT_MESOTRIONE,
          quantity: 100,
          unit: SELECTABLE_STRINGS.G_LITER
        }
      ],
      applicationStage: SELECTABLE_STRINGS.CHEMICAL_PROTECTION_APPLICATION_STAGE_POST_EMERGENT,

      chemicalTargetEnemies: [SELECTABLE_STRINGS.CHENOPODIUM_ALBUM, SELECTABLE_STRINGS.AMARANTHUS_RETROFLEXUS, SELECTABLE_STRINGS.PORTULACA_OLERACEA, SELECTABLE_STRINGS.SETARIA_SPP, SELECTABLE_STRINGS.APERA_SPР, SELECTABLE_STRINGS.SORGHUM_HALEPENSE, SELECTABLE_STRINGS.CAPSELLA_BURSA_PASTORIS, SELECTABLE_STRINGS.LAMIUM_PURPUREUM, SELECTABLE_STRINGS.RAPHANUS_RAPHANISTRUM, SELECTABLE_STRINGS.SENECIO_VULGARIS, SELECTABLE_STRINGS.SOLANUM_NIGRUM, SELECTABLE_STRINGS.SINAPIS_ALBA],
      dosage: 50,
      dosageUnit: SELECTABLE_STRINGS.ML_ACRE,
      maxApplications: 2,
      minIntervalBetweenApplicationsDays: 10,
      maxIntervalBetweenApplicationsDays: 10,
      quarantinePeriodDays: 0,
      pricePer1LiterBGN: 37.97,
      pricePerAcreBGN: 1.90,
      // Третирането на соргото може да се извърши от втори до девети лист на културата.
      additionalInfo: SELECTABLE_STRINGS.CHEMICAL_PROTECTION_CHEM_KIDEKA_PRO_INFO,
      // Хербицидът е с изразено системно почвено действие. Периодът на защитно действие продължава от 40 до 60 дни след третиране. Инхибира нарастването на на чувствителните плевели до два дни след приложението му. Внасянето се извършва с работен разтвор от 8 до 40 l/acre вода при интервал между приложенията 10 дни в зависимост от наличното земеделско оборудване.
      additionalInfoNotes: SELECTABLE_STRINGS.CHEMICAL_PROTECTION_CHEM_KIDEKA_PRO_INFO_NOTES
    },
    {
      // КОЛОМБО ПРО
      plantUsages: [SELECTABLE_STRINGS.SORGHUM_VULGARE_VAR_TEHNICUM, SELECTABLE_STRINGS.ZEA_MAYS],
      nameKey: SELECTABLE_STRINGS.CHEMICAL_PROTECTION_CHEM_COLOMBO_PRO,
      type: SELECTABLE_STRINGS.CHEMICAL_PROTECTION_CHEMICAL_TYPE_INSECTICIDE,
      activeIngredients: [
        {
          // 8 g/kg циперметрин
          nameKey: SELECTABLE_STRINGS.CHEMICAL_PROTECTION_ACTIVE_INGREDIENT_CYPERMETHRIN,
          quantity: 8,
          unit: SELECTABLE_STRINGS.G_KG
        }
      ],
      applicationStage: SELECTABLE_STRINGS.CHEMICAL_PROTECTION_APPLICATION_STAGE_PRE_EMERGENT_BEFORE_START_OF_GROWING_SEASON,

      chemicalTargetEnemies: [SELECTABLE_STRINGS.AGRIOTIS_LINEATUS, SELECTABLE_STRINGS.NOCTUIDAE, SELECTABLE_STRINGS.DIABROTICA_VIRGIFERA_ZEAE],
      dosage: 1200,
      dosageUnit: SELECTABLE_STRINGS.G_ACRE,
      maxApplications: 1,
      minIntervalBetweenApplicationsDays: 0,
      maxIntervalBetweenApplicationsDays: 0,
      quarantinePeriodDays: 0,
      pricePer1LiterBGN: 21.50,
      pricePerAcreBGN: 25.80,
      // Продукта се прилага като сухи гранули на дълбочина 4 cm в почвата
      additionalInfo: SELECTABLE_STRINGS.CHEMICAL_PROTECTION_CHEM_COLOMBO_PRO_INFO,
      // Mexaнизъм нa дeйcтвиe: нecиcтeмeн пиpeтpoидeн инceĸтицид c ĸoнтaĸтнo и cтoмaшнo дeйcтвиe.
      additionalInfoNotes: SELECTABLE_STRINGS.CHEMICAL_PROTECTION_CHEM_COLOMBO_PRO_INFO_NOTES
    },
    {
      // СИВАНТО ЕНЕРДЖИ
      plantUsages: [SELECTABLE_STRINGS.SORGHUM_VULGARE_VAR_TEHNICUM],
      nameKey: SELECTABLE_STRINGS.CHEMICAL_PROTECTION_CHEM_SIVANTO_ENERGY,
      type: SELECTABLE_STRINGS.CHEMICAL_PROTECTION_CHEMICAL_TYPE_INSECTICIDE,
      activeIngredients: [
        {
          // 10 g/l делтаметрин
          nameKey: SELECTABLE_STRINGS.CHEMICAL_PROTECTION_ACTIVE_INGREDIENT_DELTAMETHRIN,
          quantity: 10,
          unit: SELECTABLE_STRINGS.G_LITER
        },
        {
          // 75 g/l флупирадифурон
          nameKey: SELECTABLE_STRINGS.CHEMICAL_PROTECTION_ACTIVE_INGREDIENT_FLUPYRADIFURON,
          quantity: 75,
          unit: SELECTABLE_STRINGS.G_LITER
        }
      ],
      applicationStage: SELECTABLE_STRINGS.CHEMICAL_PROTECTION_APPLICATION_STAGE_POST_EMERGENT,

      chemicalTargetEnemies: [SELECTABLE_STRINGS.SITOBION_AVENAE, SELECTABLE_STRINGS.CICADOIDEA],
      dosage: 75,
      dosageUnit: SELECTABLE_STRINGS.ML_ACRE,
      maxApplications: 1,
      minIntervalBetweenApplicationsDays: 0,
      maxIntervalBetweenApplicationsDays: 0,
      quarantinePeriodDays: 0,
      pricePer1LiterBGN: 76.59,
      pricePerAcreBGN: 5.74,
      // Третирането се извършва при благоприятни метеорологични условия за масова поява на неприятеля.
      additionalInfo: SELECTABLE_STRINGS.CHEMICAL_PROTECTION_CHEM_SIVANTO_ENERGY_INFO,
      // Системен, вегетационен двукомпонентен инсектицид с комбинирано (системно и контактно) действие, с отличен контрол върху широк спектър от смучещи неприятели с много добър инициален (нокдаун) ефект при голям брой неприятели и дълго последействие.  Внасянето се извършва с работен разтвор от 40 до 80 l/acre вода в зависимост от наличното земеделско оборудване.
      additionalInfoNotes: SELECTABLE_STRINGS.CHEMICAL_PROTECTION_CHEM_SIVANTO_ENERGY_INFO_NOTES
    },
    //Zea mays (Царевица, Corn)
    {
      // БИСМАРК КС
      plantUsages: [SELECTABLE_STRINGS.ZEA_MAYS],
      nameKey: SELECTABLE_STRINGS.CHEMICAL_PROTECTION_CHEM_BISMARCK_KS,
      type: SELECTABLE_STRINGS.CHEMICAL_PROTECTION_CHEMICAL_TYPE_HERBICIDE,
      activeIngredients: [
        {
          // 55 g/l кломазон
          nameKey: SELECTABLE_STRINGS.CHEMICAL_PROTECTION_ACTIVE_INGREDIENT_CLOMAZONE,
          quantity: 55,
          unit: SELECTABLE_STRINGS.G_LITER
        },
        {
          // 275 g/l пендиметалин
          nameKey: SELECTABLE_STRINGS.CHEMICAL_PROTECTION_ACTIVE_INGREDIENT_PENDIMETHALIN,
          quantity: 275,
          unit: SELECTABLE_STRINGS.G_LITER
        }
      ],
      applicationStage: SELECTABLE_STRINGS.CHEMICAL_PROTECTION_APPLICATION_STAGE_PRE_EMERGENT_AFTER_SOWING_BEFORE_EMERGENCE,

      chemicalTargetEnemies: [SELECTABLE_STRINGS.DIGITARIA_SANGUINALIS, SELECTABLE_STRINGS.SETARIA_SPP, SELECTABLE_STRINGS.ALOPECURUS_MYOSUROIDES, SELECTABLE_STRINGS.ECHINOCHLOA_CRUS_GALLI, SELECTABLE_STRINGS.APERA_SPР, SELECTABLE_STRINGS.SORGHUM_HALEPENSE, SELECTABLE_STRINGS.CAPSELLA_BURSA_PASTORIS, SELECTABLE_STRINGS.CHENOPODIUM_ALBUM, SELECTABLE_STRINGS.SOLANUM_NIGRUM, SELECTABLE_STRINGS.PORTULACA_OLERACEA, SELECTABLE_STRINGS.STELLARIA_MEDIA],
      dosage: 150,
      dosageUnit: SELECTABLE_STRINGS.ML_ACRE,
      maxApplications: 1,
      minIntervalBetweenApplicationsDays: 0,
      maxIntervalBetweenApplicationsDays: 0,
      quarantinePeriodDays: 0,
      pricePer1LiterBGN: 63.65,
      pricePerAcreBGN: 9.55,
      // Внася се след сеитба, преди поникване на културата и на плевелите.
      additionalInfo: SELECTABLE_STRINGS.CHEMICAL_PROTECTION_CHEM_BISMARCK_KS_INFO,
      // Абсорбира се от плевелните семена при поникването им. Чувствителните плевели могат да бъдат контролирани в ранните фази от развитието им. Внасянето се извършва с работен разтвор от 40 до 140 l/acre вода в зависимост от наличното земеделско оборудване. Хербицидът може да се прилага при царевица в доза до 200 ml/acre.
      additionalInfoNotes: SELECTABLE_STRINGS.CHEMICAL_PROTECTION_CHEM_BISMARCK_KS_INFO_NOTES
    },
    {
      // АРАТ
      plantUsages: [SELECTABLE_STRINGS.ZEA_MAYS],
      nameKey: SELECTABLE_STRINGS.CHEMICAL_PROTECTION_CHEM_ARRAT,
      type: SELECTABLE_STRINGS.CHEMICAL_PROTECTION_CHEMICAL_TYPE_HERBICIDE,
      activeIngredients: [
        {
          // 500 g/kg дикамба
          nameKey: SELECTABLE_STRINGS.CHEMICAL_PROTECTION_ACTIVE_INGREDIENT_DICAMBA,
          quantity: 500,
          unit: SELECTABLE_STRINGS.G_KG
        },
        {
          // 250 g/kg тритосулфурон
          nameKey: SELECTABLE_STRINGS.CHEMICAL_PROTECTION_ACTIVE_INGREDIENT_TRITOSULFURON,
          quantity: 250,
          unit: SELECTABLE_STRINGS.G_KG
        }
      ],
      applicationStage: SELECTABLE_STRINGS.CHEMICAL_PROTECTION_APPLICATION_STAGE_POST_EMERGENT,

      chemicalTargetEnemies: [SELECTABLE_STRINGS.ABUTILON_THEOPHRASTI, SELECTABLE_STRINGS.BIDENS_TRIPARTITA, SELECTABLE_STRINGS.SINAPIS_ARVENSIS, SELECTABLE_STRINGS.CIRSIUM_ARVENSE, SELECTABLE_STRINGS.PORTULACA_OLERACEA],
      dosage: 20,
      dosageUnit: SELECTABLE_STRINGS.G_ACRE,
      maxApplications: 1,
      minIntervalBetweenApplicationsDays: 0,
      maxIntervalBetweenApplicationsDays: 0,
      quarantinePeriodDays: 0,
      pricePer1LiterBGN: 150.55,
      pricePerAcreBGN: 3.01,
      // Третирането на царевицата се извършва от фаза втори лист до шести лист на културата.
      additionalInfo: SELECTABLE_STRINGS.CHEMICAL_PROTECTION_CHEM_ARRAT_INFO,
      // Използването на хербицида не се препоръчва при резки температурни амплитуди (голяма разлика между дневната и нощна температури), наводнени посеви или силно депресирани в резултат на засушаване, както и да не се добавят органофосфорни инсектициди в резервоарна смес. Третирането се извършва с работен разтвор от 20 до 40 l/acre вода в зависимост от наличното земеделско оборудване. Да не се използва при сладка царевица!
      additionalInfoNotes: SELECTABLE_STRINGS.CHEMICAL_PROTECTION_CHEM_ARRAT_INFO_NOTES
    },
    {
      // АМИНОПИЕЛИК 600 СЛ
      plantUsages: [SELECTABLE_STRINGS.ZEA_MAYS],
      nameKey: SELECTABLE_STRINGS.CHEMICAL_PROTECTION_CHEM_AMINOPIELIK_600_SL,
      type: SELECTABLE_STRINGS.CHEMICAL_PROTECTION_CHEMICAL_TYPE_HERBICIDE,
      activeIngredients: [
        {
          // 600 g/l 2,4-Д аминна сол
          nameKey: SELECTABLE_STRINGS.CHEMICAL_PROTECTION_ACTIVE_INGREDIENT_2_4D_AMINE_SALT,
          quantity: 600,
          unit: SELECTABLE_STRINGS.G_LITER
        }
      ],
      applicationStage: SELECTABLE_STRINGS.CHEMICAL_PROTECTION_APPLICATION_STAGE_POST_EMERGENT,
      chemicalTargetEnemies: [SELECTABLE_STRINGS.ABUTILON_THEOPHRASTI, SELECTABLE_STRINGS.AMARANTHUS_RETROFLEXUS, SELECTABLE_STRINGS.RAPHANUS_RAPHANISTRUM, SELECTABLE_STRINGS.CHENOPODIUM_ALBUM, SELECTABLE_STRINGS.SOLANUM_NIGRUM, SELECTABLE_STRINGS.CAPSELLA_BURSA_PASTORIS, SELECTABLE_STRINGS.CIRSIUM_ARVENSE, SELECTABLE_STRINGS.SINAPIS_ARVENSIS, SELECTABLE_STRINGS.CONVOLVULUS_ARVENSIS],
      dosage: 120,
      dosageUnit: SELECTABLE_STRINGS.ML_ACRE,
      maxApplications: 1,
      minIntervalBetweenApplicationsDays: 0,
      maxIntervalBetweenApplicationsDays: 0,
      quarantinePeriodDays: 0,
      pricePer1LiterBGN: 151.55,
      pricePerAcreBGN: 18.19,
      // Внася се във фенофази - от трети до пети лист на културата.
      additionalInfo: SELECTABLE_STRINGS.CHEMICAL_PROTECTION_CHEM_AMINOPIELIK_600_SL_INFO,
      // Хербицидът е с бърз инициален ефектът срещу чувствителните плевели. Първите фитосимптоматични повреди (изисквания на дръжките, стъблата и листата на плевелите) се визуализират на следващия ден ден след третирането. Третирането се извършва с работен разтвор от 30 до 40 l/acre вода в зависимост от наличното земеделско оборудване.
      additionalInfoNotes: SELECTABLE_STRINGS.CHEMICAL_PROTECTION_CHEM_AMINOPIELIK_600_SL_INFO_NOTES
    },
    {
      // ДЖАНЕРО 480 СЛ
      plantUsages: [SELECTABLE_STRINGS.ZEA_MAYS],
      nameKey: SELECTABLE_STRINGS.CHEMICAL_PROTECTION_CHEM_JANERO_480_SL,
      type: SELECTABLE_STRINGS.CHEMICAL_PROTECTION_CHEMICAL_TYPE_HERBICIDE,
      activeIngredients: [
        {
          // 480 g/l дикамба
          nameKey: SELECTABLE_STRINGS.CHEMICAL_PROTECTION_ACTIVE_INGREDIENT_DICAMBA,
          quantity: 480,
          unit: SELECTABLE_STRINGS.G_LITER
        }
      ],
      applicationStage: SELECTABLE_STRINGS.CHEMICAL_PROTECTION_APPLICATION_STAGE_POST_EMERGENT,

      chemicalTargetEnemies: [SELECTABLE_STRINGS.CHENOPODIUM_ALBUM, SELECTABLE_STRINGS.AMARANTHUS_RETROFLEXUS, SELECTABLE_STRINGS.SINAPIS_ALBA, SELECTABLE_STRINGS.SOLANUM_NIGRUM],
      dosage: 50,
      dosageUnit: SELECTABLE_STRINGS.ML_ACRE,
      maxApplications: 1,
      minIntervalBetweenApplicationsDays: 0,
      maxIntervalBetweenApplicationsDays: 0,
      quarantinePeriodDays: 0,
      pricePer1LiterBGN: 37.22,
      pricePerAcreBGN: 1.86,
      // Внася се във фенофази - от втори до шести лист на културата.
      additionalInfo: SELECTABLE_STRINGS.CHEMICAL_PROTECTION_CHEM_JANERO_480_SL_INFO,
      // Да не се използва на варовити почви, поради вероятност да предизвика фитотоксичност при царевицата.За разширяване спектъра на действие може да се смесва с НИШИН 4 ОД или ОСОРНО СК. Третирането на посевите се извършва с работен разтвор от 27,5 до 30 l/acre вода в зависимост от наличното земеделско оборудване.
      additionalInfoNotes: SELECTABLE_STRINGS.CHEMICAL_PROTECTION_CHEM_JANERO_480_SL_INFO_NOTES
    },
    {
      // КОРАГЕН 20 СК
      plantUsages: [SELECTABLE_STRINGS.ZEA_MAYS],
      nameKey: SELECTABLE_STRINGS.CHEMICAL_PROTECTION_CHEM_CORAGEN_20_SC,
      type: SELECTABLE_STRINGS.CHEMICAL_PROTECTION_CHEMICAL_TYPE_INSECTICIDE,
      activeIngredients: [
        {
          // 200 г/л ринаксипир
          nameKey: SELECTABLE_STRINGS.CHEMICAL_PROTECTION_ACTIVE_INGREDIENT_RYNAXYPYR,
          quantity: 200,
          unit: SELECTABLE_STRINGS.G_LITER
        }
      ],
      applicationStage: SELECTABLE_STRINGS.CHEMICAL_PROTECTION_APPLICATION_STAGE_POST_EMERGENT,

      chemicalTargetEnemies: [SELECTABLE_STRINGS.OSTRINIA_NUBILALIS, SELECTABLE_STRINGS.NOCTUIDAE, SELECTABLE_STRINGS.LOXOSTEGE_STICTICALIS],
      dosage: 15,
      dosageUnit: SELECTABLE_STRINGS.ML_ACRE,
      maxApplications: 2,
      minIntervalBetweenApplicationsDays: 10,
      maxIntervalBetweenApplicationsDays: 10,
      quarantinePeriodDays: 0,
      pricePer1LiterBGN: 775,
      pricePerAcreBGN: 11.63,
      // Третирането на посева се извършва при поява на неприятелите над икономическия праг на вредност.
      additionalInfo: SELECTABLE_STRINGS.CHEMICAL_PROTECTION_CHEM_CORAGEN_20_SC_INFO,
      // Инсектицидът е със стомашно и контактно действие, придвижва трансламинарно в растението и има удължено последействие, като запазва високата си активност 14-21 дни след третирането с изразен ово-ларвициден ефект, като при някои видове действа и на възрастните. Внасянето на инсектицида се извършва с работен разтвор от 30 до 80 l/acre вода в зависимост от наличното земеделско оборудване.
      additionalInfoNotes: SELECTABLE_STRINGS.CHEMICAL_PROTECTION_CHEM_CORAGEN_20_SC_INFO_NOTES
    },
    {
      // К-ОБИОЛ 6 УЛВ
      plantUsages: [SELECTABLE_STRINGS.ZEA_MAYS],
      nameKey: SELECTABLE_STRINGS.CHEMICAL_PROTECTION_CHEM_K_OBIOL_6_ULV,
      type: SELECTABLE_STRINGS.CHEMICAL_PROTECTION_CHEMICAL_TYPE_INSECTICIDE,
      activeIngredients: [
        {
          // 6 g/l делтаметрин
          nameKey: SELECTABLE_STRINGS.CHEMICAL_PROTECTION_ACTIVE_INGREDIENT_DELTAMETHRIN,
          quantity: 6,
          unit: SELECTABLE_STRINGS.G_LITER
        }
      ],
      applicationStage: SELECTABLE_STRINGS.CHEMICAL_PROTECTION_APPLICATION_STAGE_PRE_EMERGENT,

      chemicalTargetEnemies: [SELECTABLE_STRINGS.RHYZOPERTHA_DOMINICA, SELECTABLE_STRINGS.TENEBRIO_MOLITOR],
      dosage: 4.2,
      dosageUnit: SELECTABLE_STRINGS.G_100_KG_SEEDS,
      maxApplications: 1,
      minIntervalBetweenApplicationsDays: 0,
      maxIntervalBetweenApplicationsDays: 0,
      quarantinePeriodDays: 7,
      pricePer1LiterBGN: 388,
      pricePerAcreBGN: 1.63,
      // Борба със складови неприятели - Житояди (Гъгрици), Брашнени бръмбъри, Зърнопробивачи, Грахови и Бобови гъгрици, Молци.
      additionalInfo: SELECTABLE_STRINGS.CHEMICAL_PROTECTION_CHEM_K_OBIOL_6_ULV_INFO,
      // Инсектицидът контролира успешно вредителите във всичките им фази на развитие – яйце, ларва, пупа и възрастно насекомо. Ефективният срок на защита е 12 месеца. Напълно безопасен и съгласуван с всички европейски и световни наредби. След завършване на производствения цикъл и преработка на суровината, не се откриват остатъчни вещества.
      additionalInfoNotes: SELECTABLE_STRINGS.CHEMICAL_PROTECTION_CHEM_K_OBIOL_6_ULV_INFO_NOTES
    },
    {
      // ИНАЗУМА
      plantUsages: [SELECTABLE_STRINGS.ZEA_MAYS],
      nameKey: SELECTABLE_STRINGS.CHEMICAL_PROTECTION_CHEM_INAZUMA,
      type: SELECTABLE_STRINGS.CHEMICAL_PROTECTION_CHEMICAL_TYPE_INSECTICIDE,
      activeIngredients: [
        {
          // 100 г/кг ацетамиприд
          nameKey: SELECTABLE_STRINGS.CHEMICAL_PROTECTION_ACTIVE_INGREDIENT_ACETAMIPRID,
          quantity: 100,
          unit: SELECTABLE_STRINGS.G_KG
        },
        {
          // 30 г/кг ламбда-цихалотрин
          nameKey: SELECTABLE_STRINGS.CHEMICAL_PROTECTION_ACTIVE_INGREDIENT_LAMBDA_CYHALOTHRIN,
          quantity: 30,
          unit: SELECTABLE_STRINGS.G_KG
        }
      ],
      applicationStage: SELECTABLE_STRINGS.CHEMICAL_PROTECTION_APPLICATION_STAGE_POST_EMERGENT,

      chemicalTargetEnemies: [SELECTABLE_STRINGS.OSTRINIA_NUBILALIS, SELECTABLE_STRINGS.TANYMECUS_DILATICOLLIS],
      dosage: 20,
      dosageUnit: SELECTABLE_STRINGS.G_ACRE,
      maxApplications: 2,
      minIntervalBetweenApplicationsDays: 14,
      maxIntervalBetweenApplicationsDays: 14,
      quarantinePeriodDays: 0,
      pricePer1LiterBGN: 251.25,
      pricePerAcreBGN: 5.03,
      // Третирането на посева се извършва двукратно през 14 дни при поява на неприятеля над икономическия праг на вредност, до фенофаза изметляване на царевицата.
      additionalInfo: SELECTABLE_STRINGS.CHEMICAL_PROTECTION_CHEM_INAZUMA_INFO,
      // Внасянето на инсектицида се извършва с работен разтвор от 30 до 50 l/acre вода в зависимост от наличното земеделско оборудване. Да не се прилага при култури в периода на активен цъфтеж или при наличие на цъфтяща плевелна растителност с цел опазване на пчелите и други насекоми опрашители. Опасен е за пчелите (SPe 8).
      additionalInfoNotes: SELECTABLE_STRINGS.CHEMICAL_PROTECTION_CHEM_INAZUMA_INFO_NOTES
    },
    {
      // РЕДИГО М
      plantUsages: [SELECTABLE_STRINGS.ZEA_MAYS],
      nameKey: SELECTABLE_STRINGS.CHEMICAL_PROTECTION_CHEM_REDIGO_M,
      type: SELECTABLE_STRINGS.CHEMICAL_PROTECTION_CHEMICAL_TYPE_FUNGICIDE,
      activeIngredients: [
        {
          // 100 g/l Протиоконазол
          nameKey: SELECTABLE_STRINGS.CHEMICAL_PROTECTION_ACTIVE_INGREDIENT_PROTHIOCONAZOLE,
          quantity: 100,
          unit: SELECTABLE_STRINGS.G_LITER
        },
        {
          // 20 g/l Металаксил
          nameKey: SELECTABLE_STRINGS.CHEMICAL_PROTECTION_ACTIVE_INGREDIENT_METALAXYL,
          quantity: 20,
          unit: SELECTABLE_STRINGS.G_LITER
        }
      ],
      applicationStage: SELECTABLE_STRINGS.CHEMICAL_PROTECTION_APPLICATION_STAGE_PRE_EMERGENT_PRE_SOWING_SEEDS_TREATMENT,

      chemicalTargetEnemies: [SELECTABLE_STRINGS.PYTHIUM_APHANIDERMATUM, SELECTABLE_STRINGS.FUSARIUM_GRAMINEARUM, SELECTABLE_STRINGS.RHIZOCTONIA_ZEAE],
      dosage: 3,
      dosageUnit: SELECTABLE_STRINGS.ML_ACRE,
      maxApplications: 1,
      minIntervalBetweenApplicationsDays: 0,
      maxIntervalBetweenApplicationsDays: 0,
      quarantinePeriodDays: 0,
      pricePer1LiterBGN: 18.97,
      pricePerAcreBGN: 0.06,
      // Предсеитбено обеззаразяване на семена
      additionalInfo: SELECTABLE_STRINGS.CHEMICAL_PROTECTION_CHEM_REDIGO_M_INFO,
      // Третирането на посева се извършва при поява на неприятеля над икономическия праг на вредност от фенофаза начало на удължаване на стъблото до масов цъфтеж на царевицата. Обеззаразяването на семената от царевица може да се извърши с работен разтвор от 0,1 до 1,9 l вода за 100 kg семена. Препоръчителна доза за приложение на фунгицида е 15 ml продукт на 50 000 бр. семена, при сеитбена норма 10 000 семена на декар. Да се използват специализирани машини за обеззаразяване на семена.
      additionalInfoNotes: SELECTABLE_STRINGS.CHEMICAL_PROTECTION_CHEM_REDIGO_M_INFO_NOTES
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

  if (!process.env.MAILTRAP_API_KEY) {
    console.error('MAILTRAP_API_KEY not set');
    process.exit(1);
  }

  //set up db
  //npx prisma migrate dev in terminal

  //seed the db
  //force to run in server mode so prisma is happy and works
  //dont try catch here, if something fails we want it to crash. dont start with broken data
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
          throw new Error('Force exit in instrumentation');
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
      console.log('Sowing Rate seeded.');

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
      console.log('Seeding Combined seeded.');

      //chem protection
      console.log('Seeding Chem Protection...');
      for (const chemicalData of dbData.ChemicalProtectionData) {
        // create chemical
        const createdChemical = await prisma.chemical.create({
          data: {
            nameKey: chemicalData.nameKey,
            type: chemicalData.type,
            applicationStage: chemicalData.applicationStage,
            dosage: chemicalData.dosage,
            dosageUnit: chemicalData.dosageUnit,
            maxApplications: chemicalData.maxApplications,
            minIntervalBetweenApplicationsDays: chemicalData.minIntervalBetweenApplicationsDays,
            maxIntervalBetweenApplicationsDays: chemicalData.maxIntervalBetweenApplicationsDays,
            quarantinePeriodDays: chemicalData.quarantinePeriodDays,
            pricePer1LiterBGN: chemicalData.pricePer1LiterBGN,
            pricePerAcreBGN: chemicalData.pricePerAcreBGN,
            additionalInfo: chemicalData.additionalInfo,
            additionalInfoNotes: chemicalData.additionalInfoNotes,
            // Fixed: Create target enemies directly since they're unique per chemical
            chemicalTargetEnemies: {
              create: chemicalData.chemicalTargetEnemies.map((enemy) => ({
                latinName: enemy,
              })),
            },
            activeIngredients: {
              create: chemicalData.activeIngredients.map((ingredient) => ({
                quantity: ingredient.quantity,
                activeIngredient: {
                  connectOrCreate: {
                    where: { nameKey: ingredient.nameKey },
                    create: {
                      nameKey: ingredient.nameKey,
                      unit: ingredient.unit,
                    },
                  },
                },
              })),
            },
          },
        });

        // connect to all plants
        for (const plantLatinName of chemicalData.plantUsages) {
          const plant = await prisma.plant.findUnique({
            where: { latinName: plantLatinName },
          });
          if (!plant) {
            console.error(`Plant not found: ${plantLatinName}`);
            throw new Error('Force exit in instrumentation');
          }

          // use upsert to avoid duplicate key errors
          await prisma.plantChemical.upsert({
            where: {
              plantId_chemicalId: {
                plantId: plant.id,
                chemicalId: createdChemical.id,
              },
            },
            update: {}, // no updates needed if it exists
            create: {
              plantId: plant.id,
              chemicalId: createdChemical.id,
            },
          });
        }
      }

      console.log('Chem Protection seeded.');

      console.log('Database seeded.');
    } else {
      console.log('Database already seeded.');
    }

  }
}
