import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Log } from "@/lib/logger";
import { APICaller } from "@/lib/api-util";
import { useTranslate } from "@/hooks/useTranslate";
import { SELECTABLE_STRINGS } from "@/lib/LangMap";
import { toast } from "sonner";
import Errored from "../Errored/Errored";
import LoadingDisplay from "../LoadingDisplay/LoadingDisplay";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Key } from "lucide-react";

export default function LoggedInInstances({ userId }: { userId: string }) {
    const translator = useTranslate();
    const router = useRouter();
    const [tokens, setTokens] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [errored, setErrored] = useState(false);

    async function FetchSessions() {
        setLoading(true);
        try {
            const result = await APICaller(["user", "sessions", "fetch"], "/api/auth/sessions/fetch", "GET");

            if (!result.success) {
                setErrored(true);
                toast.error(translator(SELECTABLE_STRINGS.TOAST_ERROR_LOADING_DATA), {
                    description: translator(SELECTABLE_STRINGS.TOAST_TRY_AGAIN_LATER),
                });
                return;
            }

            setTokens(result.data);
        } catch (error: unknown) {
            const errorMessage = (error as Error)?.message ?? 'An unknown error occurred';
            Log(["instances", "fetch"], errorMessage);
            setErrored(true);
        }
        setLoading(false);
    }

    useEffect(() => {
        FetchSessions();
    }, [userId]);

    async function HandleKillSession(tokenId: string) {
        const result = await APICaller(["user", "sessions", "fetch"], "/api/auth/sessions/endSession", "POST", { tokenId });

        if (!result.success) {
            setErrored(true);
            toast.error(translator(SELECTABLE_STRINGS.TOAST_ERROR_LOADING_DATA), {
                description: translator(SELECTABLE_STRINGS.TOAST_TRY_AGAIN_LATER),
            });
            return;
        }

        await FetchSessions();
    }

    async function HandleKillAllSessions() {
        const result = await APICaller(["user", "sessions", "fetch"], "/api/auth/sessions/endAllSessions", "GET");

        if (!result.success) {
            setErrored(true);
            toast.error(translator(SELECTABLE_STRINGS.TOAST_ERROR_LOADING_DATA), {
                description: translator(SELECTABLE_STRINGS.TOAST_TRY_AGAIN_LATER),
            });
            return;
        }

        router.push('/auth/login?updateAuthState=forceLogout');
    }

    if (errored) {
        return <Errored />;
    }

    if (loading) {
        return <LoadingDisplay />;
    }

    return (
        <div className="max-w-3xl mx-auto p-4">
            <div className="bg-white dark:bg-zinc-900 rounded-xl shadow-lg p-6 border border-zinc-200 dark:border-zinc-800">
                <div className="flex flex-col sm:flex-row items-center justify-between mb-6 gap-4">
                    <h2 className="text-2xl font-bold text-zinc-900 dark:text-zinc-100">{translator(SELECTABLE_STRINGS.ACTIVE_SESSIONS)}</h2>
                    <Link
                        href="/auth/password/request"
                        className="inline-flex items-center gap-2 px-4 py-2 rounded-md bg-green-600 text-white hover:bg-green-500 transition-colors text-sm shadow-sm"
                    >
                        <Key className="h-4 w-4" />
                        {translator(SELECTABLE_STRINGS.FORGOT_PASSWORD)}
                    </Link>
                </div>
                <Button onClick={HandleKillAllSessions} className="mb-4 w-full sm:w-auto" variant="outline">Logout All</Button>
                <div className="overflow-x-auto">
                    <table className="min-w-full border border-zinc-200 dark:border-zinc-800 rounded-lg">
                        <thead className="bg-zinc-100 dark:bg-zinc-800">
                            <tr>
                                <th className="px-4 py-2 text-left text-sm font-semibold text-zinc-700 dark:text-zinc-200">User Info</th>
                                <th className="px-4 py-2 text-left text-sm font-semibold text-zinc-700 dark:text-zinc-200">Created</th>
                                <th className="px-4 py-2 text-left text-sm font-semibold text-zinc-700 dark:text-zinc-200">Expires</th>
                                <th className="px-4 py-2 text-left text-sm font-semibold text-zinc-700 dark:text-zinc-200">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {tokens.map((token) => (
                                <tr key={token.id} className="border-t border-zinc-200 dark:border-zinc-800">
                                    <td className="px-4 py-2 whitespace-pre-wrap text-xs text-zinc-800 dark:text-zinc-100 max-w-xs break-words">
                                        <pre className="whitespace-pre-wrap break-words">{token.userInfo}</pre>
                                    </td>
                                    <td className="px-4 py-2 text-xs text-zinc-700 dark:text-zinc-300">{new Date(token.createdAt).toLocaleString()}</td>
                                    <td className="px-4 py-2 text-xs text-zinc-700 dark:text-zinc-300">{new Date(token.expiresAt).toLocaleString()}</td>
                                    <td className="px-4 py-2">
                                        <Button onClick={() => HandleKillSession(token.id)} variant="destructive" size="sm">Logout</Button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}
