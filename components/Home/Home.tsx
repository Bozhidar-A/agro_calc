import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import Link from "next/link";
import { useSelector } from "react-redux";

export default function HomePage() {
    const authObj = useSelector((state) => state.auth);

    return (
        <div className="flex flex-col items-center justify-center min-h-[calc(100vh)] text-center">
            <motion.h1
                className="text-6xl font-bold text-green-800"
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
            >
                Agro-Calc
            </motion.h1>
            <motion.p
                className="text-lg text-gray-600 mt-4"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.3, duration: 0.5 }}
            >
                Your trusted agricultural calculator
            </motion.p>
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6, duration: 0.5 }}
                className="mt-6"
            >
                <Button className="px-6 py-3 text-lg bg-green-700 hover:bg-green-600 text-white rounded-xl shadow-lg">
                    <Link href="/idk">Get Started</Link>
                </Button>
            </motion.div>

            <p>{JSON.stringify(authObj)}</p>
        </div>
    );
}
