import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { MedicareNotice } from '@/components/medicare-notice';
import { PageHero } from '@/components/page-hero';
import { PageSeo } from '@/components/page-seo';
import { isLocale, type Locale } from '@/lib/i18n/config';
import { getDictionary } from '@/lib/i18n/get-dictionary';
import { buildPageMetadata } from '@/lib/seo/metadata';
import { site } from '@/lib/site';
import { ContactForm } from './contact-form';

type PageProps = { params: { locale: string } };

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  if (!isLocale(params.locale)) return {};
  const locale = params.locale as Locale;
  const dict = getDictionary(locale);
  return buildPageMetadata({
    locale,
    path: '/contact',
    title: dict.meta.contact.title,
    description: dict.meta.contact.description,
    keywords: ['Medicare consultation Lake Worth', 'Medicare insurance agent Palm Beach'],
  });
}

export default function ContactPage({ params }: PageProps) {
  if (!isLocale(params.locale)) notFound();

  const locale = params.locale as Locale;
  const dict = getDictionary(locale);
  const t = dict.contact;

  return (
    <>
      <PageSeo
        locale={locale}
        dict={dict}
        path="/contact"
        title={dict.meta.contact.title}
        description={dict.meta.contact.description}
        breadcrumbs={[
          { name: dict.common.home, path: '' },
          { name: dict.nav.contact, path: '/contact' },
        ]}
      />
      <PageHero label={t.label} title={t.title} description={t.description} />

      <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6">
        <div className="grid gap-12 lg:grid-cols-2">
          <div>
            <dl className="space-y-6">
              <div className="card">
                <dt className="text-sm font-bold uppercase tracking-wide text-slate-600">{t.phone}</dt>
                <dd className="mt-2">
                  <a
                    href={`tel:${site.phone.replace(/\D/g, '')}`}
                    className="text-3xl font-bold text-brand-700 hover:underline"
                  >
                    {site.phone}
                  </a>
                </dd>
              </div>
              <div className="card">
                <dt className="text-sm font-bold uppercase tracking-wide text-slate-600">{t.email}</dt>
                <dd className="mt-2">
                  <a href={`mailto:${site.email}`} className="text-xl font-semibold text-brand-700 hover:underline">
                    {site.email}
                  </a>
                </dd>
              </div>
              <div className="card">
                <dt className="text-sm font-bold uppercase tracking-wide text-slate-600">{t.office}</dt>
                <dd className="mt-2 text-lg text-slate-800">
                  {site.address.line1}
                  <br />
                  {site.address.city}, {site.address.state} {site.address.zip}
                </dd>
                <dd className="mt-3 text-base text-slate-600">{dict.site.hours}</dd>
              </div>
              <div className="card bg-surface-muted">
                <dt className="text-sm font-bold uppercase tracking-wide text-slate-600">{t.serviceArea}</dt>
                <dd className="mt-2 text-lg text-slate-800">{dict.site.serviceArea}</dd>
              </div>
            </dl>

            <MedicareNotice dict={dict} className="mt-8" />
          </div>

          <div className="card border-brand-100 bg-white p-8 shadow-card">
            <h2 className="text-2xl font-bold text-brand-900">{t.callbackTitle}</h2>
            <p className="mt-2 text-base leading-relaxed text-slate-700">{t.callbackText}</p>
            <ContactForm locale={locale} dict={dict} />
          </div>
        </div>
      </div>
    </>
  );
}
