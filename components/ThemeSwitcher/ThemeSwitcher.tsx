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
    case SELECTABLE_STRINGS.THEME_LIGHT:
      return <Sun />;
    case SELECTABLE_STRINGS.THEME_DARK:
      return <Moon />;
    case SELECTABLE_STRINGS.THEME_SYSTEM:
      return <SunMoon />;
    default:
      return <span className="sr-only">Toggle theme</span>;
  }
}

export function ThemeSwitcher() {
  const dispatch = useDispatch();
  const translator = useTranslate();
  const { theme, setTheme } = useTheme();

  //i dont understand why this is not working
  //useTheme ONLY WORKS WITH STRINGS
  //not enum members, only string ???

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="icon">
          {ThemeIcon(theme)}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem
          data-testid="light-theme-option"
          onClick={() => {
            setTheme('light');
            dispatch(LocalSetTheme(SELECTABLE_STRINGS.THEME_LIGHT));
          }}
        >
          {translator(SELECTABLE_STRINGS.THEME_LIGHT)}
        </DropdownMenuItem>
        <DropdownMenuItem
          data-testid="dark-theme-option"
          onClick={() => {
            setTheme('dark');
            dispatch(LocalSetTheme(SELECTABLE_STRINGS.THEME_DARK));
          }}
        >
          {translator(SELECTABLE_STRINGS.THEME_DARK)}
        </DropdownMenuItem>
        <DropdownMenuItem
          data-testid="system-theme-option"
          onClick={() => {
            setTheme('system');
            dispatch(LocalSetTheme(SELECTABLE_STRINGS.THEME_SYSTEM));
          }}
        >
          {translator(SELECTABLE_STRINGS.THEME_SYSTEM)}
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
