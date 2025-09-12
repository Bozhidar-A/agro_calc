'use client';

import Link from 'next/link';
import Sidebar from '@/components/Sidebar/Sidebar';
import { Log } from '@/lib/logger';

//simple log for build info on load
function BuildInfoLogger() {
  // Only public, non-sensitive vars
  const hostUrl = process.env.NEXT_PUBLIC_HOST_URL;
  const commit = process.env.NEXT_PUBLIC_COMMIT_SHA;
  const branchName = process.env.NEXT_PUBLIC_BRANCH_NAME;
  const dockerTag = process.env.NEXT_PUBLIC_DOCKER_IMG_TAG;

  // Allow turning logging off in prod unless explicitly enabled
  const shouldLog =
    process.env.NODE_ENV !== "production" ||
    process.env.NEXT_PUBLIC_LOG_BUILD_INFO === "1";

  if (!shouldLog) {
    return null;
  }

  let buildInfo =
    `Agro-Calc (https://github.com/bozhidar-a/agro_calc)` +
    `\n Running @ ${hostUrl ?? "(unknown)"}`;

  if (commit || branchName) {
    buildInfo += `\n Built from:`;

    if (commit) {
      buildInfo += `\n - commit: ${commit}`;
    }

    if (branchName) {
      buildInfo += `\n - branch: ${branchName}`;
    }
  }

  if (dockerTag) {
    buildInfo += `\n Docker image tag: ${dockerTag}`;
  }

  Log(["Build Info"], buildInfo); // your existing logger

  return null; // no UI
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
