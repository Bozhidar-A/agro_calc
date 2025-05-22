import { driver } from "driver.js";
import '@/app/globals.css';
import { SELECTABLE_STRINGS } from '@/lib/LangMap';

export function SpawnStartDriver(newSteps: {}[]) {
    const settings = {
        popoverClass: 'my-custom-popover-class',
        allowClose: true,
        disableActiveInteraction: true,
        showProgress: true,
        nextBtnText: 'Next',
        prevBtnText: 'Previous',
        doneBtnText: 'Done',
        steps: [
            ...newSteps
        ]
    }
    const driverTour = driver(settings);
    driverTour.drive();
}

export function getSowingStepsNoPlant(translator: (key: string) => string) {
    return [
        {
            element: '#cultureSelect',
            popover: {
                title: translator(SELECTABLE_STRINGS.SOWING_RATE_TOUR_CULTURE_SELECT),
                description: translator(SELECTABLE_STRINGS.SOWING_RATE_TOUR_CULTURE_SELECT_DESCRIPTION_SELECT_CULTURE_FIRST),
            }
        }
    ];
}

export function getSowingStepsPickedPlant(translator: (key: string) => string) {
    return [
        {
            element: '#cultureSelect',
            popover: {
                title: translator(SELECTABLE_STRINGS.SOWING_RATE_TOUR_CULTURE_SELECT),
                description: translator(SELECTABLE_STRINGS.SOWING_RATE_TOUR_CULTURE_SELECT_DESCRIPTION),
            },
        },
        {
            element: '#safetyCoefficient',
            popover: {
                title: translator(SELECTABLE_STRINGS.SOWING_RATE_TOUR_SAFETY_COEFFICIENT),
                description: translator(SELECTABLE_STRINGS.SOWING_RATE_TOUR_SAFETY_COEFFICIENT_DESCRIPTION),
            },
        },
        {
            element: '#wantedPlantsPerMeterSquared',
            popover: {
                title: translator(SELECTABLE_STRINGS.SOWING_RATE_TOUR_WANTED_PLANTS_PER_M2),
                description: translator(SELECTABLE_STRINGS.SOWING_RATE_TOUR_WANTED_PLANTS_PER_M2_DESCRIPTION),
            },
        },
        {
            element: '#massPer1000g',
            popover: {
                title: translator(SELECTABLE_STRINGS.SOWING_RATE_TOUR_MASS_PER_1000g),
                description: translator(SELECTABLE_STRINGS.SOWING_RATE_TOUR_MASS_PER_1000g_DESCRIPTION),
            },
        },
        {
            element: '#purity',
            popover: {
                title: translator(SELECTABLE_STRINGS.SOWING_RATE_TOUR_PURITY),
                description: translator(SELECTABLE_STRINGS.SOWING_RATE_TOUR_PURITY_DESCRIPTION),
            },
        },
        {
            element: '#germination',
            popover: {
                title: translator(SELECTABLE_STRINGS.SOWING_RATE_TOUR_GERMINATION),
                description: translator(SELECTABLE_STRINGS.SOWING_RATE_TOUR_GERMINATION_DESCRIPTION),
            },
        },
        {
            element: '#rowSpacing',
            popover: {
                title: translator(SELECTABLE_STRINGS.SOWING_RATE_TOUR_ROW_SPACING),
                description: translator(SELECTABLE_STRINGS.SOWING_RATE_TOUR_ROW_SPACING_DESCRIPTION),
            },
        },
        {
            element: '#visualizationSection',
            popover: {
                title: translator(SELECTABLE_STRINGS.SOWING_RATE_TOUR_VISUALIZATION),
                description: translator(SELECTABLE_STRINGS.SOWING_RATE_TOUR_VISUALIZATION_DESCRIPTION),
            },
        },
        {
            element: '#totalArea',
            popover: {
                title: translator(SELECTABLE_STRINGS.SOWING_RATE_TOUR_TOTAL_AREA),
                description: translator(SELECTABLE_STRINGS.SOWING_RATE_TOUR_TOTAL_AREA_DESCRIPTION),
            },
        },
        {
            element: '#saveCalculationButton',
            popover: {
                title: translator(SELECTABLE_STRINGS.SOWING_RATE_TOUR_SAVE_CALCULATION),
                description: translator(SELECTABLE_STRINGS.SOWING_RATE_TOUR_SAVE_CALCULATION_DESCRIPTION),
            },
        },
        {
            element: '#analysisSection',
            popover: {
                title: translator(SELECTABLE_STRINGS.SOWING_RATE_TOUR_ANALYSIS),
                description: translator(SELECTABLE_STRINGS.SOWING_RATE_TOUR_ANALYSIS_DESCRIPTION),
            },
        },
    ];
}

export function getCombinedSteps(translator: (key: string) => string) {
    return [
        {
            element: '#perennialLegumeSection',
            popover: {
                title: translator(SELECTABLE_STRINGS.COMBINED_TOUR_PERENNIAL_LEGUME),
                description: translator(SELECTABLE_STRINGS.COMBINED_TOUR_PERENNIAL_LEGUME_DESCRIPTION),
            },
        },
        {
            element: '#activeCheckbox',
            popover: {
                title: translator(SELECTABLE_STRINGS.COMBINED_TOUR_CROP_ACTIVATION),
                description: translator(SELECTABLE_STRINGS.COMBINED_TOUR_CROP_ACTIVATION_DESCRIPTION),
            },
        },
        {
            element: '#plantSelect',
            popover: {
                title: translator(SELECTABLE_STRINGS.COMBINED_TOUR_PLANT_SELECTION),
                description: translator(SELECTABLE_STRINGS.COMBINED_TOUR_PLANT_SELECTION_DESCRIPTION),
            },
        },
        {
            element: '#sowingRate',
            popover: {
                title: translator(SELECTABLE_STRINGS.COMBINED_TOUR_SOWING_RATE_SINGLE),
                description: translator(SELECTABLE_STRINGS.COMBINED_TOUR_SOWING_RATE_SINGLE_DESCRIPTION),
            },
        },
        {
            element: '#participationPercent',
            popover: {
                title: translator(SELECTABLE_STRINGS.COMBINED_TOUR_PARTICIPATION_PERCENT),
                description: translator(SELECTABLE_STRINGS.COMBINED_TOUR_PARTICIPATION_PERCENT_DESCRIPTION),
            },
        },
        {
            element: '#perennialLegumeParticipation',
            popover: {
                title: translator(SELECTABLE_STRINGS.COMBINED_TOUR_LEGUME_PARTICIPATION),
                description: translator(SELECTABLE_STRINGS.COMBINED_TOUR_LEGUME_PARTICIPATION_DESCRIPTION),
            },
        },
        {
            element: '#sowingRateMixture',
            popover: {
                title: translator(SELECTABLE_STRINGS.COMBINED_TOUR_SOWING_RATE_MIXTURE),
                description: translator(SELECTABLE_STRINGS.COMBINED_TOUR_SOWING_RATE_MIXTURE_DESCRIPTION),
            },
        },
        {
            element: '#seedPrice',
            popover: {
                title: translator(SELECTABLE_STRINGS.COMBINED_TOUR_SEED_PRICE),
                description: translator(SELECTABLE_STRINGS.COMBINED_TOUR_SEED_PRICE_DESCRIPTION),
            },
        },
        {
            element: '#perennialCerealSection',
            popover: {
                title: translator(SELECTABLE_STRINGS.COMBINED_TOUR_PERENNIAL_CEREAL),
                description: translator(SELECTABLE_STRINGS.COMBINED_TOUR_PERENNIAL_CEREAL_DESCRIPTION),
            },
        },
        {
            element: '#perennialCerealParticipation',
            popover: {
                title: translator(SELECTABLE_STRINGS.COMBINED_TOUR_CEREAL_PARTICIPATION),
                description: translator(SELECTABLE_STRINGS.COMBINED_TOUR_CEREAL_PARTICIPATION_DESCRIPTION),
            },
        },
        {
            element: '#mixtureSummary',
            popover: {
                title: translator(SELECTABLE_STRINGS.COMBINED_TOUR_MIXTURE_SUMMARY),
                description: translator(SELECTABLE_STRINGS.COMBINED_TOUR_MIXTURE_SUMMARY_DESCRIPTION),
            },
        },
        {
            element: '#totalMixtureParticipation',
            popover: {
                title: translator(SELECTABLE_STRINGS.COMBINED_TOUR_TOTAL_PARTICIPATION),
                description: translator(SELECTABLE_STRINGS.COMBINED_TOUR_TOTAL_PARTICIPATION_DESCRIPTION),
            },
        },
        {
            element: '#finalPrice',
            popover: {
                title: translator(SELECTABLE_STRINGS.COMBINED_TOUR_FINAL_PRICE),
                description: translator(SELECTABLE_STRINGS.COMBINED_TOUR_FINAL_PRICE_DESCRIPTION),
            },
        },
        {
            element: '#saveMixtureCalculation',
            popover: {
                title: translator(SELECTABLE_STRINGS.COMBINED_TOUR_SAVE_CALCULATION),
                description: translator(SELECTABLE_STRINGS.COMBINED_TOUR_SAVE_CALCULATION_DESCRIPTION),
            },
        },
        {
            element: '#mixtureVisualization',
            popover: {
                title: translator(SELECTABLE_STRINGS.COMBINED_TOUR_VISUALIZATION),
                description: translator(SELECTABLE_STRINGS.COMBINED_TOUR_VISUALIZATION_DESCRIPTION),
            },
        },
    ];
}
