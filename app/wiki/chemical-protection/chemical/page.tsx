'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { ExternalLink } from 'lucide-react';
import { toast } from 'sonner';
import { useTranslate } from '@/hooks/useTranslate';
import Errored from '@/components/Errored/Errored';
import LoadingDisplay from '@/components/LoadingDisplay/LoadingDisplay';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { APICaller } from '@/lib/api-util';
import { WikiChemical } from '@/lib/interfaces';
import { SELECTABLE_STRINGS } from '@/lib/LangMap';
import { Log } from '@/lib/logger';

export default function WikiChemicalProtectionChemListPage() {
  const [chems, setChems] = useState<WikiChemical[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);
  const [errored, setErrored] = useState(false);
  const translator = useTranslate();

  useEffect(() => {
    APICaller(
      ['wiki', 'chem protection', 'chemical', 'GET'],
      '/api/wiki/chemical-protection/all-chems',
      'GET'
    )
      .then((res) => {
        if (res.success) {
          setChems(res.data);
        } else {
          Log(['wiki', 'chem protection', 'chemical', 'GET'], `GET failed with: ${res.message}`);
          setErrored(true);
          toast.error(translator(SELECTABLE_STRINGS.TOAST_ERROR_LOADING_DATA), {
            description: translator(SELECTABLE_STRINGS.TOAST_TRY_AGAIN_LATER),
          });
        }
        setLoading(false);
      })
      .catch((error) => {
        Log(['wiki', 'chem protection', 'chemical', 'GET'], `POST failed with: ${error}`);
        setErrored(true);
        toast.error(translator(SELECTABLE_STRINGS.TOAST_ERROR_LOADING_DATA), {
          description: translator(SELECTABLE_STRINGS.TOAST_TRY_AGAIN_LATER),
        });
      });
  }, []);

  const filteredChems = chems.filter((entry) =>
    translator(entry.nameKey).toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (loading) {
    return <LoadingDisplay />;
  }

  if (errored) {
    return <Errored />;
  }

  return (
    <div className="container mx-auto py-2 sm:py-6 px-2 sm:px-4">
      <Card className="w-full max-w-7xl mx-auto">
        <CardHeader className="text-center bg-green-700 px-2 sm:px-4">
          <CardTitle className="text-xl sm:text-2xl md:text-3xl text-white">
            {translator(SELECTABLE_STRINGS.WIKI_CHEMICAL_PROTECTION)}
          </CardTitle>
        </CardHeader>
        <CardContent className="pt-3 sm:pt-4 md:pt-6">
          <div className="flex flex-col items-center">
            <div className="w-full max-w-2xl space-y-3 sm:space-y-4">
              <Input
                type="text"
                placeholder={translator(SELECTABLE_STRINGS.SEARCH_PLACEHOLDER)}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full mb-3 sm:mb-4 text-sm sm:text-base"
              />
              {filteredChems.map((entry) => (
                <Link
                  href={`/wiki/chemical-protection/chemical/${entry.id}`}
                  key={entry.id}
                  className="group block p-3 sm:p-4 bg-green-50 dark:bg-black rounded-lg hover:bg-green-200 dark:hover:bg-green-900/30 transition-colors"
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="text-lg font-semibold text-black dark:text-white">
                        {translator(entry.nameKey)}
                      </div>
                    </div>
                    <ExternalLink className="w-4 h-4 sm:w-5 sm:h-5 text-black dark:text-white" />
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
