import Link from "next/link"

export function Footer() {
    return (
        <footer className="bg-green-700 text-white py-12 w-full">
            <div className="container max-w-screen-xl mx-auto px-4">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                    <div>
                        <h3 className="text-xl font-bold mb-4">Agro-Calc</h3>
                        <p className="text-green-100 dark:text-green-200">
                            Precision agricultural calculators for modern farming needs.
                        </p>
                    </div>

                    <div>
                        <h4 className="text-lg font-semibold mb-4">Quick Links</h4>
                        <ul className="space-y-2">
                            <li>
                                <Link
                                    href="/"
                                    className="text-green-100 hover:text-white dark:text-green-200 dark:hover:text-white transition"
                                >
                                    Home
                                </Link>
                            </li>
                            <li>
                                <Link
                                    href="/calculators/sowing"
                                    className="text-green-100 hover:text-white dark:text-green-200 dark:hover:text-white transition"
                                >
                                    Sowing Rate Calculator
                                </Link>
                            </li>
                            <li>
                                <Link
                                    href="/calculators/combined"
                                    className="text-green-100 hover:text-white dark:text-green-200 dark:hover:text-white transition"
                                >
                                    Combined Calculator
                                </Link>
                            </li>
                            <li>
                                <Link
                                    href="/calculators/chemical-protection/working-solution"
                                    className="text-green-100 hover:text-white dark:text-green-200 dark:hover:text-white transition"
                                >
                                    Working Solution Calculator
                                </Link>
                            </li>
                            <li>
                                <Link
                                    href="/calculators/chemical-protection/percent-solution"
                                    className="text-green-100 hover:text-white dark:text-green-200 dark:hover:text-white transition"
                                >
                                    Percent Solution Calculator
                                </Link>
                            </li>
                        </ul>
                    </div>

                </div>
            </div>
        </footer>
    )
}
