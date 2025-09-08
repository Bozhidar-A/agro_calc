'use client';

import Link from 'next/link';
import Sidebar from '@/components/Sidebar/Sidebar';
import { Log } from '@/lib/logger';

//simple log for build info on load
function BuildInfoLogger() {
  const commit = process.env.NEXT_PUBLIC_COMMIT_SHA;
  const hostUrl = process.env.NEXT_PUBLIC_HOST_URL;

  Log(
    ['Build Info'],
    `Agro-Calc (https://github.com/bozhidar-a/agro_calc)\n Running @ ${hostUrl}\n Build: ${commit}`
  );

  // No UI component, just logging
  return null;
}

export default function Header() {
  return (
    <header className="w-full py-4 shadow-md shadow-green-500/50 h-max-20vh">
      <div className="w-full px-6 flex justify-between items-center">
        <BuildInfoLogger />
        <Link href="/">
          <h1 className="text-2xl font-bold text-green-700">Agro-Calc</h1>
        </Link>

        <div className="flex items-center space-x-4">
          <Sidebar />
        </div>
      </div>
    </header>
  );
}
