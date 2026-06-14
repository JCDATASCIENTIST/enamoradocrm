import type { Locale } from './config';

export function localePath(locale: Locale, path = ''): string {
  const normalized = path.startsWith('/') ? path : path ? `/${path}` : '';
  return `/${locale}${normalized}`;
}

export function switchLocalePath(currentLocale: Locale, targetLocale: Locale, pathname: string): string {
  const segments = pathname.split('/').filter(Boolean);
  if (segments[0] === 'en' || segments[0] === 'es') {
    segments[0] = targetLocale;
  } else {
    segments.unshift(targetLocale);
  }
  return `/${segments.join('/')}`;
}
