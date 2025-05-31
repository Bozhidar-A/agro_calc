'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { ExternalLink } from 'lucide-react';
import { toast } from 'sonner';
import { useTranslate } from '@/app/hooks/useTranslate';
import Errored from '@/components/Errored/Errored';
import LoadingDisplay from '@/components/LoadingDisplay/LoadingDisplay';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { APICaller } from '@/lib/api-util';
import { WikiEnemy } from '@/lib/interfaces';
import { SELECTABLE_STRINGS } from '@/lib/LangMap';
import { Log } from '@/lib/logger';

export default function WikiChemicalProtectionEnemyListPage() {
  const [enemies, setEnemies] = useState<WikiEnemy[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);
  const [errored, setErrored] = useState(false);
  const translator = useTranslate();

  useEffect(() => {
    APICaller(
      ['wiki', 'chem protection', 'enemy', 'GET'],
      '/api/wiki/chemical-protection/all-enemies',
      'GET'
    )
      .then((res) => {
        if (res.success) {
          setEnemies(res.data);
        } else {
          Log(['wiki', 'chem protection', 'enemy', 'GET'], `GET failed with: ${res.message}`);
          setErrored(true);
          toast.error(translator(SELECTABLE_STRINGS.TOAST_ERROR_LOADING_DATA), {
            description: translator(SELECTABLE_STRINGS.TOAST_TRY_AGAIN_LATER),
          });
        }
        setLoading(false);
      })
      .catch((error) => {
        Log(['wiki', 'chem protection', 'enemy', 'GET'], `POST failed with: ${error}`);
        setErrored(true);
        toast.error(translator(SELECTABLE_STRINGS.TOAST_ERROR_LOADING_DATA), {
          description: translator(SELECTABLE_STRINGS.TOAST_TRY_AGAIN_LATER),
        });
      });
  }, []);

  const filteredEnemies = enemies.filter(
    (entry) =>
      entry.latinName &&
      translator(entry.latinName as keyof typeof SELECTABLE_STRINGS)
        ?.toLowerCase()
        .includes(searchQuery.toLowerCase())
  );

  if (loading) {
    return <LoadingDisplay />;
  }

  if (errored) {
    return <Errored />;
  }

  return (
    <div className="container mx-auto py-4 sm:py-8 px-2 sm:px-4">
      <Card className="w-full max-w-7xl mx-auto">
        <CardHeader className="text-center bg-green-700">
          <CardTitle className="text-2xl sm:text-3xl text-black dark:text-white">
            {translator(SELECTABLE_STRINGS.WIKI_CHEMICAL_PROTECTION)}
          </CardTitle>
        </CardHeader>
        <CardContent className="pt-4 sm:pt-6">
          <div className="flex flex-col items-center">
            <div className="w-full max-w-2xl space-y-4">
              <Input
                type="text"
                placeholder={translator(SELECTABLE_STRINGS.SEARCH_PLACEHOLDER)}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full mb-4"
              />
              {filteredEnemies.map((entry) => (
                <Link
                  href={`/wiki/chemical-protection/enemy/${entry.id}`}
                  key={entry.id}
                  className="group block p-4 bg-green-50 dark:bg-black rounded-lg hover:bg-green-200 dark:hover:bg-green-900/30 transition-colors"
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="text-lg text-black dark:text-white">
                        {translator(entry.latinName as keyof typeof SELECTABLE_STRINGS)}
                      </div>
                    </div>
                    <ExternalLink className="w-5 h-5 text-black dark:text-white" />
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
