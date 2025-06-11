'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { ExternalLink } from 'lucide-react';
import { toast } from 'sonner';
import { useTranslate } from '@/hooks/useTranslate';
import Errored from '@/components/Errored/Errored';
import LoadingDisplay from '@/components/LoadingDisplay/LoadingDisplay';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { APICaller } from '@/lib/api-util';
import { WikiEnemy } from '@/lib/interfaces';
import { SELECTABLE_STRINGS } from '@/lib/LangMap';
import { Log } from '@/lib/logger';
import { FormatInterval, FormatQuarantine } from '@/lib/utils';

export default function WikiChemicalProtectionEnemyPage() {
  const params = useParams();
  const translator = useTranslate();
  const [enemy, setEnemy] = useState<WikiEnemy>();
  const [loading, setLoading] = useState(true);
  const [errored, setErrored] = useState(false);

  useEffect(() => {
    APICaller(
      ['wiki', 'chem protection', 'enemy', 'POST'],
      `/api/wiki/chemical-protection/enemy`,
      'POST',
      { id: params.enemyId }
    )
      .then((res) => {
        if (res.success) {
          setEnemy(res.data);
        } else {
          Log(['wiki', 'chem protection', 'enemy', 'POST'], `POST failed with: ${res.message}`);
          setErrored(true);
          toast.error(translator(SELECTABLE_STRINGS.TOAST_ERROR_LOADING_DATA), {
            description: translator(SELECTABLE_STRINGS.TOAST_TRY_AGAIN_LATER),
          });
        }
        setLoading(false);
      })
      .catch((error) => {
        Log(['wiki', 'chem protection', 'enemy', 'POST'], `POST failed with: ${error}`);
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

  if (!enemy) {
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
              <div className="w-full max-w-2xl space-y-6">
                <div className="bg-green-700/10 p-4 rounded-lg text-center">
                  <p className="text-lg text-black dark:text-white">
                    No Chemical Protection Data Available
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-4 sm:py-8 px-2 sm:px-4">
      <Card className="w-full">
        <CardHeader className="text-center bg-green-700">
          <CardTitle className="text-2xl sm:text-3xl text-black dark:text-white">
            {translator(enemy.latinName as keyof typeof SELECTABLE_STRINGS)}
          </CardTitle>
        </CardHeader>
        <CardContent className="pt-4 sm:pt-6">
          <div className="flex flex-col">
            <div className="w-full space-y-6">
              {/* Chemicals that work on this enemy */}
              <div className="bg-green-50 dark:bg-black p-4 rounded-lg">
                <h4 className="font-semibold mb-2 text-black dark:text-white">
                  {translator(SELECTABLE_STRINGS.WIKI_CHEMICAL_PROTECTION_EFFECTIVE_CHEMICALS)}
                </h4>
                <div className="space-y-4">
                  {enemy.chemicals.map((chemRelation) => (
                    <Card
                      key={chemRelation.chemical.id}
                      className="overflow-hidden border-2 border-green-700"
                    >
                      <CardHeader className="bg-green-700 pb-2">
                        <div className="flex flex-col gap-2">
                          <Link
                            href={`/wiki/chemical-protection/chemical/${chemRelation.chemical.id}`}
                            className="group flex items-center gap-2"
                          >
                            <CardTitle className="text-lg text-black dark:text-white">
                              {translator(chemRelation.chemical.nameKey)}
                            </CardTitle>
                            <ExternalLink className="w-5 h-5 text-black dark:text-white" />
                          </Link>
                          <div className="flex flex-wrap gap-2">
                            <span className="px-2 py-1 bg-white/20 text-black dark:text-white rounded-md text-sm font-medium">
                              {translator(chemRelation.chemical.type)}
                            </span>
                            <span className="px-2 py-1 bg-white/20 text-black dark:text-white rounded-md text-sm font-medium">
                              {translator(chemRelation.chemical.applicationStage)}
                            </span>
                          </div>
                        </div>
                      </CardHeader>
                      <CardContent className="pt-4">
                        <div className="space-y-4">
                          {/* Dosage Information */}
                          <div className="bg-green-50 dark:bg-black p-4 rounded-lg">
                            <h4 className="font-semibold mb-2 text-black dark:text-white">
                              {translator(
                                SELECTABLE_STRINGS.WIKI_CHEMICAL_PROTECTION_ACTIVE_INGREDIENT_DOSAGE_INFO
                              )}
                            </h4>
                            <div className="space-y-2 text-black dark:text-white">
                              <p>
                                {translator(
                                  SELECTABLE_STRINGS.WIKI_CHEMICAL_PROTECTION_ACTIVE_INGREDIENT_DOSAGE
                                )}
                                : {chemRelation.chemical.dosage}{' '}
                                {translator(chemRelation.chemical.dosageUnit)}
                              </p>
                              <p>
                                {translator(
                                  SELECTABLE_STRINGS.WIKI_CHEMICAL_PROTECTION_ACTIVE_INGREDIENT_MAX_APPLICATIONS
                                )}
                                : {chemRelation.chemical.maxApplications}
                              </p>
                              <p>
                                {translator(
                                  SELECTABLE_STRINGS.WIKI_CHEMICAL_PROTECTION_ACTIVE_INGREDIENT_INTERVAL
                                )}
                                {FormatInterval(
                                  chemRelation.chemical.minIntervalBetweenApplicationsDays,
                                  chemRelation.chemical.maxIntervalBetweenApplicationsDays
                                )}
                              </p>
                              <p>
                                {translator(
                                  SELECTABLE_STRINGS.WIKI_CHEMICAL_PROTECTION_ACTIVE_INGREDIENT_QUARANTINE
                                )}
                                : {FormatQuarantine(chemRelation.chemical.quarantinePeriodDays)}
                              </p>
                            </div>
                          </div>

                          <Separator className="border-[0.5px] border-black dark:border-white" />

                          {/* Pricing Information */}
                          <div className="bg-green-50 dark:bg-black p-4 rounded-lg">
                            <h4 className="font-semibold mb-2 text-black dark:text-white">
                              {translator(
                                SELECTABLE_STRINGS.WIKI_CHEMICAL_PROTECTION_ACTIVE_INGREDIENT_PRICING
                              )}
                            </h4>
                            <div className="space-y-2 text-black dark:text-white">
                              <p>
                                {translator(
                                  SELECTABLE_STRINGS.WIKI_CHEMICAL_PROTECTION_ACTIVE_INGREDIENT_PRICE_PER_LITER
                                )}
                                : {chemRelation.chemical.pricePer1LiterBGN} BGN
                              </p>
                              <p>
                                {translator(
                                  SELECTABLE_STRINGS.WIKI_CHEMICAL_PROTECTION_ACTIVE_INGREDIENT_PRICE_PER_ACRE
                                )}
                                : {chemRelation.chemical.pricePerAcreBGN} BGN
                              </p>
                            </div>
                          </div>

                          <Separator className="border-[0.5px] border-black dark:border-white" />

                          {/* Active Ingredients */}
                          <div className="bg-green-50 dark:bg-black p-4 rounded-lg">
                            <h4 className="font-semibold mb-2 text-black dark:text-white">
                              {translator(
                                SELECTABLE_STRINGS.WIKI_CHEMICAL_PROTECTION_ACTIVE_INGREDIENT_CHEMICALS_USING
                              )}
                            </h4>
                            <div className="space-y-2">
                              {chemRelation.chemical.activeIngredients.map((ingredient) => (
                                <div
                                  key={ingredient.id}
                                  className="flex justify-between items-center text-black dark:text-white"
                                >
                                  <Link
                                    href={`/wiki/chemical-protection/active-ingredient/${ingredient.id}`}
                                    className="group flex items-center gap-2 px-2 py-1 rounded-md hover:bg-green-100 dark:hover:bg-black/50 transition-colors"
                                  >
                                    {translator(ingredient.activeIngredient.nameKey)}
                                    <ExternalLink className="w-4 h-4 text-black dark:text-white" />
                                  </Link>
                                  <span>
                                    {ingredient.quantity}{' '}
                                    {translator(ingredient.activeIngredient.unit)}
                                  </span>
                                </div>
                              ))}
                            </div>
                          </div>

                          <Separator className="border-[0.5px] border-black dark:border-white" />

                          {/* Affected Plants */}
                          <div className="bg-green-50 dark:bg-black p-4 rounded-lg">
                            <h4 className="font-semibold mb-2 text-black dark:text-white">
                              {translator(
                                SELECTABLE_STRINGS.WIKI_CHEMICAL_PROTECTION_ACTIVE_INGREDIENT_AFFECTED_PLANTS
                              )}
                            </h4>
                            <div className="flex flex-wrap gap-2">
                              {chemRelation.chemical.plantUsages.map((usage) => (
                                <Link
                                  key={usage.plant.id}
                                  href={`/wiki/chemical-protection/plant/${usage.plant.id}`}
                                  className="group inline-flex items-center gap-1 px-2 py-1 bg-green-100 dark:bg-black/50 text-black dark:text-white rounded-md text-sm hover:bg-green-200 dark:hover:bg-black transition-colors"
                                >
                                  {translator(
                                    usage.plant.latinName as keyof typeof SELECTABLE_STRINGS
                                  )}
                                  <ExternalLink className="w-3 h-3 text-black dark:text-white" />
                                </Link>
                              ))}
                            </div>
                          </div>

                          <Separator className="border-[0.5px] border-black dark:border-white" />

                          {/* Additional Information */}
                          {(chemRelation.chemical.additionalInfo ||
                            chemRelation.chemical.additionalInfoNotes) && (
                              <div className="bg-green-50 dark:bg-black p-4 rounded-lg">
                                <h4 className="font-semibold mb-2 text-black dark:text-white">
                                  {translator(
                                    SELECTABLE_STRINGS.WIKI_CHEMICAL_PROTECTION_ACTIVE_INGREDIENT_ADDITIONAL_INFO
                                  )}
                                </h4>
                                <div className="space-y-2 text-black dark:text-white">
                                  {chemRelation.chemical.additionalInfo && (
                                    <p>{translator(chemRelation.chemical.additionalInfo)}</p>
                                  )}
                                  {chemRelation.chemical.additionalInfoNotes && (
                                    <p className="text-sm text-black dark:text-white">
                                      {translator(chemRelation.chemical.additionalInfoNotes)}
                                    </p>
                                  )}
                                </div>
                              </div>
                            )}
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
