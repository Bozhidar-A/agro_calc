'use client';

import Link from 'next/link';

import Sidebar from '@/components/Sidebar/Sidebar';

export default function Header() {
  return (
    <header className="w-full py-4 shadow-md shadow-green-500/50 h-max-20vh">
      <div className="w-full px-6 flex justify-between items-center">
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
