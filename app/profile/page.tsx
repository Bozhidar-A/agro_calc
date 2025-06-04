'use client'

import { SELECTABLE_STRINGS } from "@/lib/LangMap";
import { useTranslate } from "@/app/hooks/useTranslate";
import { useSelector } from "react-redux";
import { RootState } from "@/store/store";
import Link from "next/link";
import HistoryDisplay from "@/components/HistoryDisplay/HistoryDisplay";
import { User, Key, History } from "lucide-react";
import SettingsGrid from "@/components/SettingsGrid/SettingsGrid";

export default function Profile() {
    const translator = useTranslate();
    const authObj = useSelector((state: RootState) => state.auth);

    return (
        <div className="container mx-auto px-2 sm:px-4 py-4 sm:py-8">
            <div className="max-w-4xl mx-auto">
                {/* Profile Header */}
                <div className="mb-6 sm:mb-8">
                    <h1 className="text-2xl sm:text-3xl font-bold text-green-700 mb-2 flex items-center gap-2">
                        <User className="h-6 w-6 sm:h-7 sm:w-7" />
                        {translator(SELECTABLE_STRINGS.PROFILE)}
                    </h1>
                    <p className="text-base sm:text-lg text-gray-600">
                        {translator(SELECTABLE_STRINGS.HEADER_WELCOME)} {authObj.user.email}
                    </p>
                    <div className="mt-3 sm:mt-4">
                        <Link
                            href="/auth/password/request"
                            className="text-green-700 hover:text-green-600 flex items-center gap-2 transition-colors text-sm sm:text-base"
                        >
                            <Key className="h-4 w-4" />
                            {translator(SELECTABLE_STRINGS.FORGOT_PASSWORD)}
                        </Link>
                    </div>

                    <div className="mt-6 sm:mt-8">
                        <h2 className="text-xl sm:text-2xl font-bold text-green-700 mb-3 sm:mb-4 flex items-center gap-2">
                            {translator(SELECTABLE_STRINGS.SETTINGS)}
                        </h2>
                        <SettingsGrid />
                    </div>
                </div>

                {/* History Section */}
                <div>
                    <h2 className="text-xl sm:text-2xl font-bold text-green-700 mb-3 sm:mb-4 flex items-center gap-2">
                        <History className="h-5 w-5 sm:h-6 sm:w-6" />
                        {translator(SELECTABLE_STRINGS.HISTORY_HERE)}
                    </h2>
                    <div className="border-t border-gray-200 pt-3 sm:pt-4">
                        <HistoryDisplay />
                    </div>
                </div>
            </div>
        </div>
    )
}