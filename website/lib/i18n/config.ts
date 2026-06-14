export const locales = ['en', 'es'] as const;
export type Locale = (typeof locales)[number];
export const defaultLocale: Locale = 'en';

export function isLocale(value: string): value is Locale {
  return locales.includes(value as Locale);
}

export const localeLabels: Record<Locale, string> = {
  en: 'English',
  es: 'Español',
};

export const openGraphLocales: Record<Locale, string> = {
  en: 'en_US',
  es: 'es_US',
};
