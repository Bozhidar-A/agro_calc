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
import { WikiChemical, WikiPlantChemical } from '@/lib/interfaces';
import { SELECTABLE_STRINGS } from '@/lib/LangMap';
import { Log } from '@/lib/logger';

export default function WikiChemicalProtectionChemListPage() {
  const [chems, setChems] = useState<WikiPlantChemical[]>([]);
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
          //filter on unique chemId
          const uniqueChems = res.data.filter(
            (chem: WikiPlantChemical, index: number, self: WikiPlantChemical[]) =>
              index === self.findIndex((t) => t.chemicalId === chem.chemicalId)
          );
          setChems(uniqueChems);
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
    translator(entry.chemical.nameKey).toLowerCase().includes(searchQuery.toLowerCase())
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
              {filteredChems.map((entry) => (
                <Link
                  href={`/wiki/chemical-protection/chemical/${entry.chemicalId}`}
                  key={entry.chemicalId}
                  className="group block p-4 bg-green-50 dark:bg-black rounded-lg hover:bg-green-200 dark:hover:bg-green-900/30 transition-colors"
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="text-lg text-black dark:text-white">
                        {translator(entry.chemical.nameKey)}
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
