'use client'

import { SELECTABLE_STRINGS } from "@/lib/LangMap";
import { useTranslate } from "@/hooks/useTranslate";
import { useSelector } from "react-redux";
import { RootState } from "@/store/store";
import HistoryDisplay from "@/components/HistoryDisplay/HistoryDisplay";
import { User, History, LogIn } from "lucide-react";
import SettingsGrid from "@/components/SettingsGrid/SettingsGrid";
import LoggedInInstances from "@/components/LoggedInInstances/LoggedInInstances";
import { GetEmailSafely } from "@/lib/utils";

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
                        {translator(SELECTABLE_STRINGS.HEADER_WELCOME)}
                        {GetEmailSafely(authObj)}
                    </p>
                </div>

                {/* Settings Section */}
                <div className="mb-8">
                    <h2 className="text-xl sm:text-2xl font-bold text-green-700 mb-3 sm:mb-4 flex items-center gap-2">
                        {translator(SELECTABLE_STRINGS.SETTINGS)}
                    </h2>
                    <div className="bg-white dark:bg-zinc-900 rounded-xl shadow p-4 border border-zinc-200 dark:border-zinc-800">
                        <SettingsGrid />
                    </div>
                </div>

                {/* Logged In Instances Section */}
                <div className="mb-8">
                    <h2 className="text-xl sm:text-2xl font-bold text-green-700 mb-3 sm:mb-4 flex items-center gap-2">
                        <LogIn className="h-5 w-5 sm:h-6 sm:w-6" />
                        {translator(SELECTABLE_STRINGS.ACTIVE_SESSIONS)}
                    </h2>
                    <div className="border-t border-gray-200 pt-3 sm:pt-4">
                        <LoggedInInstances userId={authObj.user.id} />
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