import type { Locale } from '@/lib/i18n/config';
import type { Dictionary } from '@/lib/i18n/get-dictionary';
import { site } from '@/lib/site';
import { absoluteUrl } from './metadata';

const SCHEMA_CONTEXT = 'https://schema.org';

function phoneE164(): string {
  return `+1${site.phone.replace(/\D/g, '')}`;
}

export function buildOrganizationSchema(locale: Locale, dict: Dictionary) {
  return {
    '@type': 'InsuranceAgency',
    '@id': `${site.url}/#organization`,
    name: site.name,
    alternateName: site.shortName,
    url: absoluteUrl(locale),
    logo: `${site.url}/enamorado-logo.jpg`,
    image: `${site.url}/enamorado-logo.jpg`,
    telephone: phoneE164(),
    email: site.email,
    description: dict.meta.home.description,
    address: {
      '@type': 'PostalAddress',
      streetAddress: site.address.line1,
      addressLocality: site.address.city,
      addressRegion: site.address.state,
      postalCode: site.address.zip,
      addressCountry: 'US',
    },
    areaServed: {
      '@type': 'AdministrativeArea',
      name: dict.site.serviceArea,
    },
    openingHoursSpecification: [
      {
        '@type': 'OpeningHoursSpecification',
        dayOfWeek: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
        opens: '09:00',
        closes: '18:00',
      },
    ],
    knowsAbout: [
      'Medicare',
      'Medicare Advantage',
      'Medicare Supplement',
      'Medicaid',
      'Dual Eligible Medicare',
      'Medicare Part D',
      'Health insurance enrollment',
    ],
    availableLanguage: ['English', 'Spanish'],
    employee: {
      '@type': 'Person',
      name: site.broker.name,
      jobTitle: dict.site.broker.title,
      worksFor: { '@id': `${site.url}/#organization` },
    },
  };
}

export function buildWebSiteSchema(locale: Locale) {
  return {
    '@type': 'WebSite',
    '@id': `${site.url}/#website`,
    name: site.name,
    url: absoluteUrl(locale),
    inLanguage: locale === 'es' ? 'es-US' : 'en-US',
    publisher: { '@id': `${site.url}/#organization` },
  };
}

export function buildWebPageSchema(
  locale: Locale,
  path: string,
  title: string,
  description: string,
) {
  return {
    '@type': 'WebPage',
    '@id': `${absoluteUrl(locale, path)}#webpage`,
    url: absoluteUrl(locale, path),
    name: title,
    description,
    isPartOf: { '@id': `${site.url}/#website` },
    about: { '@id': `${site.url}/#organization` },
    inLanguage: locale === 'es' ? 'es-US' : 'en-US',
  };
}

export function buildBreadcrumbSchema(
  locale: Locale,
  items: { name: string; path: string }[],
) {
  return {
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      item: absoluteUrl(locale, item.path),
    })),
  };
}

export function buildFaqSchema(faqs: readonly { question: string; answer: string }[]) {
  return {
    '@type': 'FAQPage',
    mainEntity: faqs.map((faq) => ({
      '@type': 'Question',
      name: faq.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: faq.answer,
      },
    })),
  };
}

export function buildPageGraph(
  locale: Locale,
  dict: Dictionary,
  page: {
    path: string;
    title: string;
    description: string;
    breadcrumbs: { name: string; path: string }[];
    faqs?: readonly { question: string; answer: string }[];
  },
) {
  const graph: Record<string, unknown>[] = [
    buildOrganizationSchema(locale, dict),
    buildWebSiteSchema(locale),
    buildWebPageSchema(locale, page.path, page.title, page.description),
    buildBreadcrumbSchema(locale, page.breadcrumbs),
  ];

  if (page.faqs?.length) {
    graph.push(buildFaqSchema(page.faqs));
  }

  return {
    '@context': SCHEMA_CONTEXT,
    '@graph': graph,
  };
}
