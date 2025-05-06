'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Menu } from 'lucide-react';
import { useDispatch, useSelector } from 'react-redux';
import { toast } from 'sonner';
import { useTranslate } from '@/app/hooks/useTranslate';
import { ThemeSwitcher } from '@/components/ThemeSwitcher/ThemeSwitcher';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import { APICaller } from '@/lib/api-util';
import { SELECTABLE_STRINGS } from '@/lib/LangMap';
import { Log } from '@/lib/logger';
import { AuthLogout } from '@/store/slices/authSlice';
import { LangSwitcher } from '../LangSwitcher/LangSwitcher';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '../ui/dialog';
import { Label } from '../ui/label';
import { Input } from '../ui/input';
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from '../ui/select';
import MeasurementSwitcher from '../MeasurementSwitcher/MeasurementSwitcher';

export default function Header() {
  const authObj = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const translator = useTranslate();

  const [open, setOpen] = useState(false);

  async function HandleLogout() {
    const backendWork = await APICaller(['auth', 'logout'], '/api/auth/logout', 'POST', {
      userId: authObj.user.id,
    });

    if (backendWork.success) {
      dispatch(AuthLogout());
      toast.success(translator(SELECTABLE_STRINGS.TOAST_LOGOUT_SUCCESS));
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
          {/* <ThemeSwitcher />
          <LangSwitcher /> */}

          <Sheet open={open} onOpenChange={setOpen}>
            <SheetTrigger asChild data-testid="open-sheet-button">
              <Button variant="ghost" size="icon" name="menu">
                <Menu className="h-6 w-6" />
                <span className="sr-only">Menu Icon</span>
              </Button>
            </SheetTrigger>

            <SheetContent data-testid="sheet-content">
              {authObj.isAuthenticated ? (
                <SheetTitle>
                  {translator(SELECTABLE_STRINGS.HEADER_WELCOME)}, {authObj.user.email}
                </SheetTitle>
              ) : (
                <SheetTitle>{translator(SELECTABLE_STRINGS.MENU)}</SheetTitle>
              )}

              <div className="flex flex-col space-y-6 mt-6">
                {authObj.isAuthenticated ? (
                  <Button
                    onClick={() => {
                      HandleLogout();
                      setOpen(false);
                    }}
                  >
                    {translator(SELECTABLE_STRINGS.LOGOUT)}
                  </Button>
                ) : (
                  <div className="flex flex-row justify-center space-x-4">
                    <Button asChild>
                      <Link
                        href="/auth/login"
                        className="hover:underline"
                        onClick={() => setOpen(false)}
                      >
                        {translator(SELECTABLE_STRINGS.LOGIN)}
                      </Link>
                    </Button>
                    <Button asChild>
                      <Link
                        href="/auth/register"
                        className="hover:underline"
                        onClick={() => setOpen(false)}
                      >
                        {translator(SELECTABLE_STRINGS.REGISTER)}
                      </Link>
                    </Button>
                  </div>
                )}
                <hr />
                <div className="flex flex-row justify-center">
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button>{translator(SELECTABLE_STRINGS.SETTINGS)}</Button>
                    </DialogTrigger>
                    <DialogContent className="sm:max-w-[600px]"> {/* Increased width */}
                      <DialogHeader>
                        <DialogTitle>{translator(SELECTABLE_STRINGS.SETTINGS)}</DialogTitle>
                      </DialogHeader>
                      <div className="grid gap-4 py-4">
                        <div className="grid grid-cols-4 items-center gap-4">
                          <Label htmlFor="theme" className="text-right col-span-1">
                            {translator(SELECTABLE_STRINGS.SETTINGS_THEME)}:
                          </Label>
                          <ThemeSwitcher />
                        </div>
                        <div className="grid grid-cols-4 items-center gap-4">
                          <Label htmlFor="language" className="text-right col-span-1">
                            {translator(SELECTABLE_STRINGS.SETTINGS_LANGUAGE)}:
                          </Label>
                          <LangSwitcher />
                        </div>
                        <div className="grid grid-cols-4 items-center gap-4">
                          <Label htmlFor="unit" className="text-right col-span-1">
                            {translator(SELECTABLE_STRINGS.SETTINGS_PREF_UNIT_OF_MEASUREMENT)}:
                          </Label>
                          <div className="col-span-3">
                            <MeasurementSwitcher />
                          </div>
                        </div>
                      </div>
                    </DialogContent>
                  </Dialog>
                </div>

                <Link href="/" className="hover:underline" onClick={() => setOpen(false)}>
                  Home
                </Link>
                <Link href="/idk" className="hover:underline" onClick={() => setOpen(false)}>
                  NOT prot
                </Link>
                <Link href="/prot" className="hover:underline" onClick={() => setOpen(false)}>
                  prot
                </Link>
                <Link
                  href="/calculators/combined"
                  className="hover:underline"
                  onClick={() => setOpen(false)}
                >
                  Combined
                </Link>
                <Link
                  href="/calculators/sowing"
                  className="hover:underline"
                  onClick={() => setOpen(false)}
                >
                  Sowing Rate
                </Link>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}
