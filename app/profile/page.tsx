'use client'

import { SELECTABLE_STRINGS } from "@/lib/LangMap";
import { useTranslate } from "@/app/hooks/useTranslate";
import { useSelector } from "react-redux";
import { RootState } from "@/store/store";
import Link from "next/link";
import HistoryDisplay from "@/components/HistoryDisplay/HistoryDisplay";

export default function Profile() {
    const translator = useTranslate();
    const authObj = useSelector((state: RootState) => state.auth);

    return (
        <div className="container mx-auto px-4 py-8">
            <h1 className="text-2xl font-bold mb-4">Profile</h1>
            <p className="font-semiBold">{translator(SELECTABLE_STRINGS.HEADER_WELCOME)} {authObj.user.email}</p>

            <Link href="/auth/password/request" className="hover:underline">
                {translator(SELECTABLE_STRINGS.FORGOT_PASSWORD)}
            </Link>

            <p className="text-lg font-bold mb-4">{translator(SELECTABLE_STRINGS.HISTORY_HERE)}</p>

            <HistoryDisplay />
        </div>
    )

}