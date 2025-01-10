'use client';

import Link from 'next/link';
import { ColorSchemeToggle } from '../components/ColorSchemeToggle/ColorSchemeToggle';
import { Welcome } from '../components/Welcome/Welcome';
import { useSelector } from 'react-redux';
import LogoutButton from '@/components/LogoutButton/LogoutButton';

export default function HomePage() {
  // const { user, isAuthenticated, loading, error, authType } = useSelector((state) => state.auth);
  const authObj = useSelector((state) => state.auth);

  return (
    <>
      <Welcome />
      <ColorSchemeToggle />
      <Link href="auth/login">Login</Link>
      <Link href="auth/register">Register</Link>
      <LogoutButton />
      <Link href="/prot">Test Prot</Link>
      <Link href="/idk">Test Non</Link>
      <p>{JSON.stringify(authObj)}</p>
    </>
  );
}
