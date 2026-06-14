import type { Metadata } from 'next';
import type { Locale } from '@/lib/i18n/config';
import { openGraphLocales } from '@/lib/i18n/config';
import { site } from '@/lib/site';

const siteUrl = site.url;

type PageMetaInput = {
  locale: Locale;
  path: string;
  title: string;
  description: string;
  keywords?: string[];
};

export function absoluteUrl(locale: Locale, path = ''): string {
  const normalized = path.startsWith('/') ? path : path ? `/${path}` : '';
  return `${siteUrl}/${locale}${normalized}`;
}

export function buildPageMetadata({
  locale,
  path,
  title,
  description,
  keywords = [],
}: PageMetaInput): Metadata {
  const url = absoluteUrl(locale, path);
  const defaultKeywords = [
    'Medicare broker',
    'Medicare insurance',
    'Lake Worth FL',
    'Palm Beach County',
    'Enamorado Insurance',
    'Medicare Advantage',
    'Medicaid dual eligible',
  ];

  return {
    title,
    description,
    keywords: [...defaultKeywords, ...keywords],
    alternates: {
      canonical: url,
      languages: {
        en: absoluteUrl('en', path),
        es: absoluteUrl('es', path),
        'x-default': absoluteUrl('en', path),
      },
    },
    openGraph: {
      title,
      description,
      url,
      siteName: site.name,
      locale: openGraphLocales[locale],
      alternateLocale: locale === 'en' ? [openGraphLocales.es] : [openGraphLocales.en],
      type: 'website',
      images: [{ url: `${siteUrl}/enamorado-logo.jpg`, width: 800, height: 800, alt: site.name }],
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: [`${siteUrl}/enamorado-logo.jpg`],
    },
    robots: {
      index: true,
      follow: true,
      googleBot: { index: true, follow: true, 'max-image-preview': 'large', 'max-snippet': -1 },
    },
  };
}

export function buildRootMetadata(locale: Locale, description: string): Metadata {
  return {
    ...buildPageMetadata({
      locale,
      path: '',
      title: site.name,
      description,
    }),
    title: {
      default: site.name,
      template: `%s · ${site.shortName}`,
    },
  };
}
