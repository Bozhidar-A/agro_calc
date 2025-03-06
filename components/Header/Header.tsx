'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Menu } from 'lucide-react';
import { useDispatch, useSelector } from 'react-redux';
import { toast } from 'sonner';
import { ThemeSwitcher } from '@/components/ThemeSwitcher/ThemeSwitcher';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import { BackendLogout } from '@/lib/auth-utils';
import { Log } from '@/lib/logger';
import { AuthLogout } from '@/store/slices/authSLice';

export default function Header() {
  const authObj = useSelector((state) => state.auth);
  const dispatch = useDispatch();

  const [open, setOpen] = useState(false);

  async function HandleLogout() {
    const backendWork = await BackendLogout(authObj.user.id);

    if (backendWork.success) {
      dispatch(AuthLogout());
      toast.success('Logged out successfully');
      return;
    }

    Log(['auth', 'logout'], backendWork.message);
  }

  return (
    <header className="w-full py-4 shadow-md shadow-green-500/50 h-max-20vh">
      <div className="container mx-auto flex justify-between items-center px-6">
        <Link href="/">
          <h1 className="text-2xl font-bold text-green-500">Agro-Calc</h1>
        </Link>

        <div className="flex items-center space-x-4">
          <ThemeSwitcher />

          <Sheet open={open} onOpenChange={setOpen}>
            <SheetTrigger asChild data-testid="open-sheet-button">
              <Button variant="ghost" size="icon" name="menu">
                <Menu className="h-6 w-6" />
                <span className="sr-only">Menu Icon</span>
              </Button>
            </SheetTrigger>

            <SheetContent data-testid="sheet-content">
              {authObj.isAuthenticated ? (
                <SheetTitle>Welcome, {authObj.user.email}</SheetTitle>
              ) : (
                <SheetTitle>Menu</SheetTitle>
              )}

              <div className="flex flex-col space-y-6 mt-6">
                {authObj.isAuthenticated ? (
                  <Button
                    onClick={() => {
                      HandleLogout();
                      setOpen(false);
                    }}
                  >
                    Logout
                  </Button>
                ) : (
                  <div className="flex flex-row justify-center space-x-4">
                    <Button asChild>
                      <Link
                        href="/auth/login"
                        className="hover:underline"
                        onClick={() => setOpen(false)}
                      >
                        Login
                      </Link>
                    </Button>
                    <Button asChild>
                      <Link
                        href="/auth/register"
                        className="hover:underline"
                        onClick={() => setOpen(false)}
                      >
                        Register
                      </Link>
                    </Button>

                  </div>
                )}
                <Link href="/" className="hover:underline" onClick={() => setOpen(false)}>
                  Home
                </Link>
                <Link href="/idk" className="hover:underline" onClick={() => setOpen(false)}>
                  NOT prot
                </Link>
                <Link href="/prot" className="hover:underline" onClick={() => setOpen(false)}>
                  prot
                </Link>
                <Link href="/calculators/combined" className="hover:underline" onClick={() => setOpen(false)}>
                  Combined
                </Link>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}
