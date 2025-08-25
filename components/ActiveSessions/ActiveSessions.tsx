import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Key } from 'lucide-react';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { useTranslate } from '@/hooks/useTranslate';
import { APICaller } from '@/lib/api-util';
import { SELECTABLE_STRINGS } from '@/lib/LangMap';
import { Log } from '@/lib/logger';
import Errored from '../Errored/Errored';
import LoadingDisplay from '../LoadingDisplay/LoadingDisplay';

export default function ActiveSessions() {
  const translator = useTranslate();
  const router = useRouter();
  const [tokens, setTokens] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [errored, setErrored] = useState(false);

  async function FetchSessions() {
    setLoading(true);
    try {
      const result = await APICaller(
        ['user', 'sessions', 'fetch'],
        '/api/auth/sessions/fetch',
        'GET'
      );

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
      Log(['instances', 'fetch'], errorMessage);
      setErrored(true);
    }
    setLoading(false);
  }

  useEffect(() => {
    FetchSessions();
  }, []);

  async function HandleKillSession(tokenId: string) {
    const result = await APICaller(
      ['user', 'sessions', 'fetch'],
      '/api/auth/sessions/endSession',
      'POST',
      { tokenId }
    );

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
    const result = await APICaller(
      ['user', 'sessions', 'fetch'],
      '/api/auth/sessions/endAllSessions',
      'GET'
    );

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
    <div className="container mx-auto p-2 sm:p-4 flex flex-col items-center">
      <div className="w-full max-w-4xl">
        <div className="mb-3 sm:mb-4 flex flex-col sm:flex-row gap-2 sm:gap-4 items-center justify-between">
          <h2 className="text-xl sm:text-2xl font-bold text-zinc-900 dark:text-zinc-100">
            {translator(SELECTABLE_STRINGS.ACTIVE_OTHER_SESSIONS)}
          </h2>
          <Link
            href="/auth/password/request"
            className="inline-flex items-center gap-2 px-4 py-2 rounded-md bg-green-600 text-white hover:bg-green-500 transition-colors text-sm shadow-sm"
          >
            <Key className="h-4 w-4" />
            {translator(SELECTABLE_STRINGS.FORGOT_PASSWORD)}
          </Link>
        </div>
        <div className="mb-3 sm:mb-4 flex flex-col sm:flex-row gap-2 sm:gap-4">
          <Button onClick={HandleKillAllSessions} className="w-full sm:w-auto" variant="outline">
            {translator(SELECTABLE_STRINGS.LOGOUT_ALL_SESSIONS)}
          </Button>
        </div>
        <div className="grid gap-3 sm:gap-4">
          {tokens.length > 0 ? (
            tokens.map((token) => (
              <div
                key={token.id}
                className="bg-card rounded-xl shadow-lg border border-zinc-200 dark:border-zinc-800"
              >
                <div className="p-3 sm:p-6 flex flex-col sm:flex-row sm:justify-between gap-1 sm:gap-0">
                  <span className="text-base sm:text-lg font-semibold text-zinc-800 dark:text-zinc-100">
                    {translator(SELECTABLE_STRINGS.ACTIVE_OTHER_SESSIONS)}
                  </span>
                  <span className="text-xs sm:text-sm text-gray-500">
                    {new Date(token.createdAt).toLocaleString()}
                  </span>
                </div>
                <div className="p-3 sm:p-6">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                    <div>
                      <p className="text-xs sm:text-sm font-medium">
                        {translator(SELECTABLE_STRINGS.SESSION_USER_INFO)}
                      </p>
                      <pre className="whitespace-pre-wrap break-words text-xs text-zinc-800 dark:text-zinc-100 max-w-xs">
                        {token.userInfo}
                      </pre>
                    </div>
                    <div>
                      <p className="text-xs sm:text-sm font-medium">
                        {translator(SELECTABLE_STRINGS.SESSION_EXPIRES)}
                      </p>
                      <p className="text-base sm:text-lg">
                        {new Date(token.expiresAt).toLocaleString()}
                      </p>
                    </div>
                    <div className="col-span-1 sm:col-span-2 flex justify-end mt-2">
                      <Button
                        onClick={() => HandleKillSession(token.id)}
                        variant="destructive"
                        size="sm"
                      >
                        {translator(SELECTABLE_STRINGS.LOGOUT_SESSION)}
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="text-center text-gray-500 text-sm sm:text-base">
              {translator(SELECTABLE_STRINGS.NO_OTHER_SESSIONS)}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
