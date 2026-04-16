import 'server-only';
import type { Locale } from './config';
import ko from './dictionaries/ko.json';
import en from './dictionaries/en.json';

export type Dictionary = typeof ko;

const dictionaries: Record<Locale, Dictionary> = {
  ko: ko as Dictionary,
  en: en as Dictionary,
};

export function getDictionary(locale: Locale): Dictionary {
  return dictionaries[locale];
}
