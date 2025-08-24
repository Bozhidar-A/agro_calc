'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { ExternalLink } from 'lucide-react';
import { toast } from 'sonner';
import Errored from '@/components/Errored/Errored';
import LoadingDisplay from '@/components/LoadingDisplay/LoadingDisplay';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useTranslate } from '@/hooks/useTranslate';
import { APICaller } from '@/lib/api-util';
import { WikiPlantChemical } from '@/lib/interfaces';
import { SELECTABLE_STRINGS } from '@/lib/LangMap';
import { Log } from '@/lib/logger';

export default function WikiChemicalProtectionPlantListPage() {
  const [plants, setPlants] = useState<WikiPlantChemical[]>([]);
  const [loading, setLoading] = useState(true);
  const [errored, setErrored] = useState(false);
  const translator = useTranslate();

  useEffect(() => {
    APICaller(
      ['wiki', 'chem protection', 'plant', 'GET'],
      '/api/wiki/chemical-protection/all-plants',
      'GET'
    )
      .then((res) => {
        if (res.success) {
          //filter on unique plantid
          const uniquePlants = res.data.filter(
            (plant: WikiPlantChemical, index: number, self: WikiPlantChemical[]) =>
              index === self.findIndex((t) => t.plant.id === plant.plant.id)
          );
          setPlants(uniquePlants);
        } else {
          Log(['wiki', 'chem protection', 'plant', 'GET'], `GET failed with: ${res.message}`);
          setErrored(true);
          toast.error(translator(SELECTABLE_STRINGS.TOAST_ERROR_LOADING_DATA), {
            description: translator(SELECTABLE_STRINGS.TOAST_TRY_AGAIN_LATER),
          });
        }
        setLoading(false);
      })
      .catch((error) => {
        Log(['wiki', 'chem protection', 'plant', 'GET'], `POST failed with: ${error}`);
        setErrored(true);
        toast.error(translator(SELECTABLE_STRINGS.TOAST_ERROR_LOADING_DATA), {
          description: translator(SELECTABLE_STRINGS.TOAST_TRY_AGAIN_LATER),
        });
      });
  }, []);

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
              {plants.map((entry) => (
                <Link
                  href={`/wiki/chemical-protection/plant/${entry.plant.id}`}
                  key={entry.plant.id}
                  className="group block p-3 sm:p-4 bg-green-50 dark:bg-black rounded-lg hover:bg-green-200 dark:hover:bg-green-900/30 transition-colors"
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="text-lg font-semibold text-black dark:text-white">
                        {translator(entry.plant.latinName)}
                      </div>
                      <div className="text-sm text-black dark:text-white">
                        {entry.plant.latinName}
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
