import { useSelector } from 'react-redux';
import { GetStrFromLangMapKey } from '@/lib/utils';
import { RootState } from '@/store/store';

export function useTranslate() {
  const lang = useSelector((state: RootState) => state.local.lang);

  return (key: string) => GetStrFromLangMapKey(lang, key);
}
