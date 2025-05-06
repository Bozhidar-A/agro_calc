'use client';

import { Moon, Sun, SunMoon } from 'lucide-react';
import { useTheme } from 'next-themes';
import { useDispatch, useSelector } from 'react-redux';
import { useTranslate } from '@/app/hooks/useTranslate';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { THEMES } from '@/lib/LocalSettingsMaps';
import { LocalSetTheme } from '@/store/slices/localSettingsSlice';

function ThemeIcon(theme: string | undefined) {
  switch (theme) {
    case 'light':
      return <Sun />;
    case 'dark':
      return <Moon />;
    case 'system':
      return <SunMoon />;
    default:
      return <span className="sr-only">Toggle theme</span>;
  }
}

export function ThemeSwitcher() {
  const dispatch = useDispatch();
  const translator = useTranslate();
  const { theme, setTheme } = useTheme();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="icon">
          {ThemeIcon(theme)}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem
          onClick={() => {
            setTheme(THEMES.THEME_LIGHT);
            dispatch(LocalSetTheme(THEMES.THEME_LIGHT));
          }}
        >
          {translator(THEMES.THEME_LIGHT)}
        </DropdownMenuItem>
        <DropdownMenuItem
          onClick={() => {
            setTheme(THEMES.THEME_DARK);
            dispatch(LocalSetTheme(THEMES.THEME_DARK));
          }}
        >
          {translator(THEMES.THEME_DARK)}
        </DropdownMenuItem>
        <DropdownMenuItem
          onClick={() => {
            setTheme(THEMES.THEME_SYSTEM);
            dispatch(LocalSetTheme(THEMES.THEME_SYSTEM));
          }}
        >
          {translator(THEMES.THEME_SYSTEM)}
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
