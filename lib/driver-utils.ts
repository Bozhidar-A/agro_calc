import { driver } from "driver.js";
import '@/app/globals.css';

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

export const sowingStepsNoPlant = [
    {
        element: '#cultureSelect',
        popover: {
            title: 'Culture',
            description: 'Pick the culture you want to calculate the sowing rate for first',
        }
    }
];

export const sowingStepsPickedPlant = [
    {
        element: '#cultureSelect',
        popover: {
            title: 'Избор на култура',
            description: 'Изберете културата, за която искате да направите изчисление на сеитбената норма.',
        },
    },
    {
        element: '#safetyCoefficient',
        popover: {
            title: 'Коефициент на сигурност',
            description: 'Изберете стойност между 0.9 и 0.99 за корекция според условията на полето.',
        },
    },
    {
        element: '#wantedPlantsPerMeterSquared',
        popover: {
            title: 'Желан брой растения на m²',
            description: 'Изберете целевия брой растения на квадратен метър според препоръките за културата.',
        },
    },
    {
        element: '#massPer1000g',
        popover: {
            title: 'Маса на 1000 семена',
            description: 'Въведете масата на 1000 семена в грамове, според семепроизводителя.',
        },
    },
    {
        element: '#purity',
        popover: {
            title: 'Чистота на семената',
            description: 'Процентна стойност, която отразява чистотата на семената в партидата.',
        },
    },
    {
        element: '#germination',
        popover: {
            title: 'Лабораторна кълняемост',
            description: 'Процент на кълняемост според лабораторни анализи.',
        },
    },
    {
        element: '#rowSpacing',
        popover: {
            title: 'Междуредово разстояние',
            description: 'Изберете междуредовото разстояние в сантиметри според схемата на сеитба.',
        },
    },
    {
        element: '#visualizationSection',
        popover: {
            title: 'Визуализация на резултатите',
            description: 'Графично представяне на резултатите от изчислението – растения на декар, кг/дка, междуредово разстояние и други.',
        },
    },
    {
        element: '#totalArea',
        popover: {
            title: 'Обща площ',
            description: 'Въведете общата площ (в декари), за която ще се извърши сеитбата.',
        },
    },
    {
        element: '#saveCalculationButton',
        popover: {
            title: 'Запазване на калкулацията',
            description: 'Натиснете тук, за да запазите калкулацията с въведените параметри.',
        },
    },
]

