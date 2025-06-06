'use client';

import Link from 'next/link';
import { ExternalLink } from 'lucide-react';
import { useTranslate } from '@/app/hooks/useTranslate';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { SELECTABLE_STRINGS } from '@/lib/LangMap';

export default function WikiChemicalProtectionPage() {
  const translator = useTranslate();

  return (
    <div className="container mx-auto py-2 sm:py-6 px-2 sm:px-4">
      <Card className="w-full max-w-7xl mx-auto">
        <CardHeader className="text-center bg-green-700 px-2 sm:px-4">
          <CardTitle className="text-xl sm:text-2xl md:text-3xl text-black dark:text-white">
            {translator(SELECTABLE_STRINGS.WIKI_CHEMICAL_PROTECTION)}
          </CardTitle>
        </CardHeader>
        <CardContent className="pt-3 sm:pt-4 md:pt-6">
          <div className="flex flex-col items-center">
            <div className="w-full max-w-2xl space-y-3 sm:space-y-4">
              <p className="text-base sm:text-lg text-black dark:text-white text-center mb-6">
                {translator(SELECTABLE_STRINGS.WIKI_CHEMICAL_PROTECTION_START_HERE)}
              </p>
              <Link
                href="/wiki/chemical-protection/plant"
                className="group block p-3 sm:p-4 bg-green-50 dark:bg-black rounded-lg hover:bg-green-200 dark:hover:bg-green-900/30 transition-colors"
              >
                <div className="flex items-center justify-between">
                  <div className="text-lg font-semibold text-black dark:text-white">
                    {translator(SELECTABLE_STRINGS.WIKI_CHEMICAL_PROTECTION_PLANTS)}
                  </div>
                  <ExternalLink className="w-4 h-4 sm:w-5 sm:h-5 text-black dark:text-white" />
                </div>
              </Link>
              <Link
                href="/wiki/chemical-protection/enemy"
                className="group block p-3 sm:p-4 bg-green-50 dark:bg-black rounded-lg hover:bg-green-200 dark:hover:bg-green-900/30 transition-colors"
              >
                <div className="flex items-center justify-between">
                  <div className="text-lg font-semibold text-black dark:text-white">
                    {translator(SELECTABLE_STRINGS.WIKI_CHEMICAL_PROTECTION_ENEMIES)}
                  </div>
                  <ExternalLink className="w-4 h-4 sm:w-5 sm:h-5 text-black dark:text-white" />
                </div>
              </Link>
              <Link
                href="/wiki/chemical-protection/chemical"
                className="group block p-3 sm:p-4 bg-green-50 dark:bg-black rounded-lg hover:bg-green-200 dark:hover:bg-green-900/30 transition-colors"
              >
                <div className="flex items-center justify-between">
                  <div className="text-lg font-semibold text-black dark:text-white">
                    {translator(SELECTABLE_STRINGS.WIKI_CHEMICAL_PROTECTION_CHEMICALS)}
                  </div>
                  <ExternalLink className="w-4 h-4 sm:w-5 sm:h-5 text-black dark:text-white" />
                </div>
              </Link>
              <Link
                href="/wiki/chemical-protection/active-ingredient"
                className="group block p-3 sm:p-4 bg-green-50 dark:bg-black rounded-lg hover:bg-green-200 dark:hover:bg-green-900/30 transition-colors"
              >
                <div className="flex items-center justify-between">
                  <div className="text-lg font-semibold text-black dark:text-white">
                    {translator(SELECTABLE_STRINGS.WIKI_CHEMICAL_PROTECTION_ACTIVE_INGREDIENTS)}
                  </div>
                  <ExternalLink className="w-4 h-4 sm:w-5 sm:h-5 text-black dark:text-white" />
                </div>
              </Link>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
