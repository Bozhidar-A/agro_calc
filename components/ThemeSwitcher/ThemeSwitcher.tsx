'use client';

import { Moon, Sun, SunMoon } from 'lucide-react';
import { useTheme } from 'next-themes';
import { useDispatch } from 'react-redux';
import { useTranslate } from '@/app/hooks/useTranslate';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { SELECTABLE_STRINGS } from '@/lib/LangMap';
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
            setTheme(SELECTABLE_STRINGS.THEME_LIGHT);
            dispatch(LocalSetTheme(SELECTABLE_STRINGS.THEME_LIGHT));
          }}
        >
          {translator(SELECTABLE_STRINGS.THEME_LIGHT)}
        </DropdownMenuItem>
        <DropdownMenuItem
          onClick={() => {
            setTheme(SELECTABLE_STRINGS.THEME_DARK);
            dispatch(LocalSetTheme(SELECTABLE_STRINGS.THEME_DARK));
          }}
        >
          {translator(SELECTABLE_STRINGS.THEME_DARK)}
        </DropdownMenuItem>
        <DropdownMenuItem
          onClick={() => {
            setTheme(SELECTABLE_STRINGS.THEME_SYSTEM);
            dispatch(LocalSetTheme(SELECTABLE_STRINGS.THEME_SYSTEM));
          }}
        >
          {translator(SELECTABLE_STRINGS.THEME_SYSTEM)}
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
