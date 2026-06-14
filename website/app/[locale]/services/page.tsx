import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { PageHero } from '@/components/page-hero';
import { PageSeo } from '@/components/page-seo';
import { isLocale, type Locale } from '@/lib/i18n/config';
import { getDictionary } from '@/lib/i18n/get-dictionary';
import { buildPageMetadata } from '@/lib/seo/metadata';
import { site } from '@/lib/site';

type PageProps = { params: { locale: string } };

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  if (!isLocale(params.locale)) return {};
  const locale = params.locale as Locale;
  const dict = getDictionary(locale);
  return buildPageMetadata({
    locale,
    path: '/services',
    title: dict.meta.services.title,
    description: dict.meta.services.description,
    keywords: ['Medicare Advantage Lake Worth', 'Medigap Florida', 'Medicare Part D'],
  });
}

export default function ServicesPage({ params }: PageProps) {
  if (!isLocale(params.locale)) notFound();

  const locale = params.locale as Locale;
  const dict = getDictionary(locale);
  const t = dict.services;

  return (
    <>
      <PageSeo
        locale={locale}
        dict={dict}
        path="/services"
        title={dict.meta.services.title}
        description={dict.meta.services.description}
        breadcrumbs={[
          { name: dict.common.home, path: '' },
          { name: dict.nav.services, path: '/services' },
        ]}
      />
      <PageHero label={t.label} title={t.title} description={t.description} />

      <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6">
        <div className="grid gap-5 md:grid-cols-2">
          {t.offerings.map((item) => (
            <article key={item.title} className="card">
              <h2 className="text-xl font-semibold text-brand-900">{item.title}</h2>
              <ul className="mt-4 space-y-2.5 text-sm text-slate-600">
                {item.bullets.map((bullet) => (
                  <li key={bullet} className="flex gap-3">
                    <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-accent-500" />
                    <span>{bullet}</span>
                  </li>
                ))}
              </ul>
            </article>
          ))}
        </div>

        <div className="card mt-14 border-brand-100 bg-brand-50/50">
          <h2 className="text-xl font-semibold text-brand-900">{t.staffTitle}</h2>
          <p className="mt-2 text-sm text-slate-600">{t.staffText}</p>
          <Link
            href={`${site.crmUrl}/login`}
            className="mt-4 inline-flex text-sm font-semibold text-brand-700 hover:text-brand-900"
          >
            {dict.common.signInCrm}
          </Link>
        </div>
      </div>
    </>
  );
}
