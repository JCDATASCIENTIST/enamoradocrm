import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { MedicareNotice } from '@/components/medicare-notice';
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
    path: '/about',
    title: dict.meta.about.title,
    description: dict.meta.about.description,
    keywords: ['Dalkys Enamorado', 'Medicare broker Lake Worth'],
  });
}

export default function AboutPage({ params }: PageProps) {
  if (!isLocale(params.locale)) notFound();

  const locale = params.locale as Locale;
  const dict = getDictionary(locale);

  return (
    <>
      <PageSeo
        locale={locale}
        dict={dict}
        path="/about"
        title={dict.meta.about.title}
        description={dict.meta.about.description}
        breadcrumbs={[
          { name: dict.common.home, path: '' },
          { name: dict.nav.about, path: '/about' },
        ]}
      />
      <PageHero
        label={`${dict.site.broker.greeting} ${dict.about.label}`}
        title={site.broker.name}
        description={`${dict.site.broker.title} · ${dict.site.serviceArea}`}
      />

      <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6">
        <div className="max-w-3xl">
          <p className="text-lg leading-relaxed text-slate-600">{dict.site.broker.intro}</p>
          <p className="mt-4 leading-relaxed text-slate-600">{dict.site.broker.trust}</p>
          <p className="mt-4 leading-relaxed text-slate-600">{dict.site.agency}</p>
        </div>

        <div className="mt-14 grid gap-5 md:grid-cols-3">
          {dict.about.values.map((item) => (
            <article key={item.title} className="card">
              <h2 className="text-lg font-semibold text-brand-900">{item.title}</h2>
              <p className="mt-3 text-sm leading-relaxed text-slate-600">{item.text}</p>
            </article>
          ))}
        </div>

        <MedicareNotice dict={dict} className="mt-14" />
      </div>
    </>
  );
}
