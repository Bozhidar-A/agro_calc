'use client'

import { SELECTABLE_STRINGS } from "@/lib/LangMap";
import { useTranslate } from "@/app/hooks/useTranslate";
import { useSelector } from "react-redux";
import { RootState } from "@/store/store";
import Link from "next/link";
import HistoryDisplay from "@/components/HistoryDisplay/HistoryDisplay";
import { User, Key, History } from "lucide-react";

export default function Profile() {
    const translator = useTranslate();
    const authObj = useSelector((state: RootState) => state.auth);

    return (
        <div className="container mx-auto px-4 py-8">
            <div className="max-w-4xl mx-auto">
                {/* Profile Header */}
                <div className="mb-8">
                    <h1 className="text-3xl font-bold text-green-700 mb-2 flex items-center gap-2">
                        <User className="h-7 w-7" />
                        {translator(SELECTABLE_STRINGS.PROFILE)}
                    </h1>
                    <p className="text-lg text-gray-600">
                        {translator(SELECTABLE_STRINGS.HEADER_WELCOME)} {authObj.user.email}
                    </p>
                    <div className="mt-4">
                        <Link
                            href="/auth/password/request"
                            className="text-green-700 hover:text-green-600 flex items-center gap-2 transition-colors"
                        >
                            <Key className="h-4 w-4" />
                            {translator(SELECTABLE_STRINGS.FORGOT_PASSWORD)}
                        </Link>
                    </div>
                </div>

                {/* History Section */}
                <div>
                    <h2 className="text-2xl font-bold text-green-700 mb-4 flex items-center gap-2">
                        <History className="h-6 w-6" />
                        {translator(SELECTABLE_STRINGS.HISTORY_HERE)}
                    </h2>
                    <div className="border-t border-gray-200 pt-4">
                        <HistoryDisplay />
                    </div>
                </div>
            </div>
        </div>
    )
}