import { useSelector } from 'react-redux';
import { GetStrFromLangMapKey } from '@/lib/utils';

export function useTranslate() {
  const lang = useSelector((state) => state.local.lang);

  return (key: string) => GetStrFromLangMapKey(lang, key);
}
