'use client';

import { Group, NavLink } from "@mantine/core";
import { IconCheck } from "@tabler/icons-react";
import { useEffect, useState } from "react";
import { styles } from "./LangList.Mantine";

interface LangItem {
    code: string;
    name: string;
    selected: boolean;
}


export default function LoadLangOptions({ loadLangUpdater }) {
    const [langList, setLangList] = useState<LangItem[]>([]);
    const [selectedLang, setSelectedLang] = useState(localStorage.getItem('lang') || 'en');
    // const selectedLang = localStorage.getItem('lang') || 'en';

    useEffect(() => {
        loadLangUpdater(true);

        //fetch all available languages from json file
        //TODO: replace with actual fetch

        const langList: LangItem[] = [
            { code: 'en', name: 'English', selected: selectedLang === 'en' },
            { code: 'bg', name: 'Български', selected: selectedLang === 'bg' },
        ]

        setLangList(langList);
        loadLangUpdater(false);
    }, [selectedLang]);

    return (
        <Group style={styles.groupFull}>
            {langList.map((lang, index) => (
                <NavLink
                    key={index}
                    onClick={() => {
                        localStorage.setItem('lang', lang.code);
                        setSelectedLang(lang.code);
                    }}
                    leftSection={lang.selected ? <IconCheck /> : null}
                    active={lang.selected}
                    label={lang.name}
                    color="green"
                />
            ))}
        </Group>
    )

}