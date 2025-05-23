import React from 'react';
import { Metadata } from 'next';
import { Providers } from '@/store/providers';

import './globals.css';

import Header from '@/components/Header/Header';
import { ThemeProvider } from '@/components/ThemeProvider/ThemeProvider';
import { Toaster } from '@/components/ui/sonner';
import { cookies } from 'next/headers';
import { OAuthClientStateCookie } from '@/lib/interfaces';

export const metadata: Metadata = {
  title: 'Agro Calc',
  description: 'Agricultural Calculator',
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  //handle oauth bounce from callback
  //this is absolutely terrible but just handles client side state
  //real auth is double checked on the server
  const cookieStore = await cookies();
  const authStateCookie = cookieStore.get('oAuthClientState');

  let initialAuthState: OAuthClientStateCookie | null = null;
  if (authStateCookie) {
    try {
      const parsedState = JSON.parse(authStateCookie.value);
      //check if the auth state is less than 5 seconds old
      //this prevents ghost logins from old cookies
      //even more scuffed
      if (parsedState.timestamp && (Date.now() - parsedState.timestamp) < 5000) {
        initialAuthState = parsedState;
      }
    } catch (e) {
      //invalid json I DO NOT CARE
    }
  }

  return (
    <html lang="en">
      <head>
        <link rel="icon" href="/favicon.ico" />
        <meta
          name="viewport"
          content="minimum-scale=1, initial-scale=1, width=device-width, user-scalable=no"
        />
      </head>
      <body>
        <Providers initialAuthState={initialAuthState!}>
          <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
            <Header />
            {children}
            <Toaster />
          </ThemeProvider>
        </Providers>
      </body>
    </html>
  );
}
