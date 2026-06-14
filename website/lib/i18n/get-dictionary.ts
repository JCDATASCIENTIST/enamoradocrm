import type { Locale } from './config';
import { en, type Dictionary } from './dictionaries/en';
import { es } from './dictionaries/es';

const dictionaries = { en: en as Dictionary, es } satisfies Record<Locale, Dictionary>;

export function getDictionary(locale: Locale): Dictionary {
  return dictionaries[locale];
}

export type { Dictionary } from './dictionaries/en';
