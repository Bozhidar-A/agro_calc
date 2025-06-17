import Link from "next/link"
import { useTranslate } from "@/hooks/useTranslate"
import { SELECTABLE_STRINGS } from "@/lib/LangMap";

export function Footer() {
    const translator = useTranslate();

    return (
        <footer className="bg-green-700 text-white py-12 w-full">
            <div className="container max-w-screen-xl mx-auto px-4">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                    <div>
                        <h3 className="text-xl font-bold mb-4">Agro-Calc</h3>
                        <p className="text-green-100 dark:text-green-200">
                            {translator(SELECTABLE_STRINGS.FOOTER_DESCRIPTION)}
                        </p>
                    </div>

                    <div>
                        <h4 className="text-lg font-semibold mb-4">{translator(SELECTABLE_STRINGS.FOOTER_QUICK_LINKS)}</h4>
                        <ul className="space-y-2">
                            <li>
                                <Link
                                    href="/"
                                    className="text-green-100 hover:text-white dark:text-green-200 dark:hover:text-white transition"
                                >
                                    {translator(SELECTABLE_STRINGS.FOOTER_HOME)}
                                </Link>
                            </li>
                            <li>
                                <Link
                                    href="/calculators/sowing"
                                    className="text-green-100 hover:text-white dark:text-green-200 dark:hover:text-white transition"
                                >
                                    {translator(SELECTABLE_STRINGS.FOOTER_SOWING_RATE_CALCULATOR)}
                                </Link>
                            </li>
                            <li>
                                <Link
                                    href="/calculators/combined"
                                    className="text-green-100 hover:text-white dark:text-green-200 dark:hover:text-white transition"
                                >
                                    {translator(SELECTABLE_STRINGS.FOOTER_COMBINED_CALCULATOR)}
                                </Link>
                            </li>
                            <li>
                                <Link
                                    href="/calculators/chemical-protection/working-solution"
                                    className="text-green-100 hover:text-white dark:text-green-200 dark:hover:text-white transition"
                                >
                                    {translator(SELECTABLE_STRINGS.FOOTER_CHEMICAL_PROTECTION_CALCULATOR)}
                                </Link>
                            </li>
                            <li>
                                <Link
                                    href="/calculators/chemical-protection/percent-solution"
                                    className="text-green-100 hover:text-white dark:text-green-200 dark:hover:text-white transition"
                                >
                                    {translator(SELECTABLE_STRINGS.FOOTER_CHEMICAL_PROTECTION_CALCULATOR)}
                                </Link>
                            </li>
                        </ul>
                    </div>

                </div>
            </div>
        </footer>
    )
}
