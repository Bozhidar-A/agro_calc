import React from 'react';
import { Metadata } from 'next';
import { Providers } from '@/store/providers';

import './globals.css';

import Footer from '@/components/Footer/Footer';
import Header from '@/components/Header/Header';
import { ThemeProvider } from '@/components/ThemeProvider/ThemeProvider';
import { Toaster } from '@/components/ui/sonner';

export const metadata: Metadata = {
  title: 'Agro Calc',
  description: 'Agricultural Calculator',
};

export default async function RootLayout({ children }: { children: React.ReactNode }) {
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
        <Providers>
          <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
            <Header />
            <div className="flex flex-col items-center justify-center min-h-screen">{children}</div>
            <Footer />
            <Toaster richColors />
          </ThemeProvider>
        </Providers>
      </body>
    </html>
  );
}
