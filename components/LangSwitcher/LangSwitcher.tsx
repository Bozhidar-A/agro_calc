'use client';

import { useDispatch, useSelector } from 'react-redux';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { SUPPORTED_LANGS } from '@/lib/LocalSettingsMaps';
import { LocalSetLang } from '@/store/slices/localSettingsSlice';

function ThemeIcon(theme: string | undefined) {
  switch (theme) {
    case 'BG':
      return SUPPORTED_LANGS.BG.flag;
    case 'EN':
      return SUPPORTED_LANGS.EN.flag;
    default:
      return <span className="sr-only">?</span>;
  }
}

export function LangSwitcher() {
  const dispatch = useDispatch();
  const lang = useSelector((state) => state.local.lang);

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="icon">
          {ThemeIcon(lang)}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem
          onClick={() => {
            dispatch(LocalSetLang(SUPPORTED_LANGS.BG.code));
          }}
        >
          {SUPPORTED_LANGS.BG.flag} {SUPPORTED_LANGS.BG.name}
        </DropdownMenuItem>
        <DropdownMenuItem
          onClick={() => {
            dispatch(LocalSetLang(SUPPORTED_LANGS.EN.code));
          }}
        >
          {SUPPORTED_LANGS.EN.flag} {SUPPORTED_LANGS.EN.name}
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
