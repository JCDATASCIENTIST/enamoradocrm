import type { MetadataRoute } from 'next';
import { locales } from '@/lib/i18n/config';
import { site } from '@/lib/site';

const routes = ['', '/services', '/about', '/contact'] as const;

export default function sitemap(): MetadataRoute.Sitemap {
  const lastModified = new Date();

  return locales.flatMap((locale) =>
    routes.map((route) => ({
      url: `${site.url}/${locale}${route}`,
      lastModified,
      changeFrequency: route === '' ? 'weekly' : 'monthly',
      priority: route === '' ? 1 : 0.8,
      alternates: {
        languages: Object.fromEntries(
          locales.map((alt) => [alt, `${site.url}/${alt}${route}`]),
        ),
      },
    })),
  );
}
