'use client';

import Link from 'next/link';
import { ColorSchemeToggle } from '../components/ColorSchemeToggle/ColorSchemeToggle';
import { Welcome } from '../components/Welcome/Welcome';
import { useSelector } from 'react-redux';

export default function HomePage() {
  const authObj = useSelector((state) => state.auth);

  return (
    <>
      <Welcome />
      <ColorSchemeToggle />
      <Link href="/prot">Test Prot</Link>
      <Link href="/idk">Test Non</Link>
      <p>{JSON.stringify(authObj)}</p>
    </>
  );
}
