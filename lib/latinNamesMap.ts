interface LatinNamesMap {
    [key: string]: {
        [key: string]: string;
    };
}

const latinNamesMap: LatinNamesMap = {
    //the idea is the saves the latin name. simple and generic
    //if something else needs to be displayed or data needs to change fetch it
    bg: {
        "Pisum sativum": "Грах",
        "Glycine max": "Соя",
        "Sorghum vulgare var. tehnicum": "Сорго",
        "Zea mays": "Царевица",
        "Medicago sativa": "Люцерна",
        "Trifolium stellatum": "Звездан",
        "Trifolium pratense": "Червена детелина",
        "Trifolium repens": "Бяла детелина",
        "Lolium perenne": "Пасищен райграс",
        "Agropyron cristatum": "Гребенчат житняк",
        "Dactylis glomerata": "Ежова главица",
        "Avenula pubescens": "Безосилеста овсига",
        "Festuca pratensis": "Ливадна власатка",
        "Festuca rubra": "Червена власатка"
    }
}

export default latinNamesMap;