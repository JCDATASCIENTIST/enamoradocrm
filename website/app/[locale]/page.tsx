import type { Metadata } from 'next';
import Image from 'next/image';
import { ButtonLink } from '@/components/button-link';
import { PageSeo } from '@/components/page-seo';
import { TrustBar } from '@/components/trust-bar';
import { isLocale, type Locale } from '@/lib/i18n/config';
import { getDictionary } from '@/lib/i18n/get-dictionary';
import { localePath } from '@/lib/i18n/paths';
import { buildPageMetadata } from '@/lib/seo/metadata';
import { site } from '@/lib/site';
import { notFound } from 'next/navigation';

type PageProps = { params: { locale: string } };

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  if (!isLocale(params.locale)) return {};
  const locale = params.locale as Locale;
  const dict = getDictionary(locale);
  return buildPageMetadata({
    locale,
    path: '',
    title: dict.meta.home.title,
    description: dict.meta.home.description,
    keywords: ['Medicare broker Lake Worth', 'Medicare help Palm Beach County'],
  });
}

export default function HomePage({ params }: PageProps) {
  if (!isLocale(params.locale)) notFound();

  const locale = params.locale as Locale;
  const dict = getDictionary(locale);
  const t = dict.home;

  return (
    <>
      <PageSeo
        locale={locale}
        dict={dict}
        path=""
        title={dict.meta.home.title}
        description={dict.meta.home.description}
        breadcrumbs={[{ name: dict.common.home, path: '' }]}
        faqs={t.faq}
      />
      <section className="relative overflow-hidden bg-gradient-to-br from-brand-900 via-brand-800 to-brand-700 text-white">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(199,107,58,0.18),transparent_50%)]" />
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGRlZnM+PHBhdHRlcm4gaWQ9ImEiIHdpZHRoPSI2MCIgaGVpZ2h0PSI2MCIgcGF0dGVyblVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+PHBhdGggZD0iTTAgMGg2MHY2MEgweiIgZmlsbD0ibm9uZSIvPjxwYXRoIGQ9Ik0zMCAwaDEwdjEwSDMweiIgZmlsbD0icmdiYSgyNTUsMjU1LDI1NSwwLjAzKSIvPjwvcGF0dGVybj48L2RlZnM+PHJlY3Qgd2lkdGg9IjEwMCUiIGhlaWdodD0iMTAwJSIgZmlsbD0idXJsKCNhKSIvPjwvc3ZnPg==')] opacity-40" />
        <TrustBar dict={dict} />
        <div className="relative mx-auto grid max-w-6xl gap-12 px-4 py-16 sm:px-6 lg:grid-cols-[1.1fr_0.9fr] lg:items-center lg:py-24">
          <div>
            <p className="section-label text-accent-100">{dict.site.broker.heroLabel}</p>
            <h1 className="mt-4 font-display text-4xl font-bold leading-[1.1] sm:text-5xl lg:text-[3.25rem]">
              {t.heroTitle}
            </h1>
            <p className="mt-6 max-w-xl text-xl leading-relaxed text-white">{dict.site.broker.intro}</p>
            <p className="mt-4 max-w-xl text-lg leading-relaxed text-brand-100">{dict.site.broker.trust}</p>
            <div className="mt-9 flex flex-wrap gap-3">
              <ButtonLink href={localePath(locale, '/contact')} className="bg-accent-600 text-white shadow-card hover:bg-accent-500">
                {t.scheduleConsultation}
              </ButtonLink>
              <ButtonLink
                href={localePath(locale, '/services')}
                variant="secondary"
                className="border-2 border-white/50 text-white hover:border-white hover:bg-white/10"
              >
                {t.viewServices}
              </ButtonLink>
            </div>
          </div>

          <div className="relative mx-auto w-full max-w-md lg:max-w-none">
            <div className="absolute -inset-4 rounded-[2rem] bg-accent-500/20 blur-2xl" aria-hidden />
            <div className="relative overflow-hidden rounded-[1.75rem] border border-white/20 bg-white/10 p-8 shadow-2xl backdrop-blur-sm">
              <Image
                src="/enamorado-logo.jpg"
                alt={site.name}
                width={800}
                height={800}
                className="mx-auto h-auto w-full max-w-[320px] rounded-2xl shadow-lg ring-4 ring-white/20 sm:max-w-[360px]"
                priority
              />
              <div className="mt-8 text-center">
                <p className="font-display text-2xl font-bold text-white">{site.broker.name}</p>
                <p className="mt-1 text-base text-brand-100">{dict.site.broker.title}</p>
                <p className="mt-4 inline-flex rounded-full bg-accent-600 px-4 py-1.5 text-sm font-semibold text-white">
                  {t.photoBadge}
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="border-b border-slate-200/80 bg-white py-12">
        <div className="mx-auto max-w-4xl px-4 text-center sm:px-6">
          <p className="text-xl leading-relaxed text-slate-800">{dict.site.agency}</p>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-16 sm:px-6 lg:py-20">
        <div className="max-w-2xl">
          <p className="section-label">{t.whatWeDo}</p>
          <h2 className="section-title mt-2">{t.howWeHelp}</h2>
          <p className="mt-4 text-lg leading-relaxed text-slate-700">{t.howWeHelpIntro}</p>
        </div>
        <div className="mt-12 grid gap-5 sm:grid-cols-2">
          {t.services.map((item, index) => (
            <article key={item.title} className="card group">
              <div className="flex items-start gap-4">
                <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-brand-700 font-display text-base font-bold text-white">
                  {String(index + 1).padStart(2, '0')}
                </span>
                <div>
                  <h3 className="text-xl font-bold text-brand-900">{item.title}</h3>
                  <p className="mt-2 text-base leading-relaxed text-slate-700">{item.description}</p>
                </div>
              </div>
            </article>
          ))}
        </div>
      </section>

      <section className="bg-surface-muted py-16 lg:py-20">
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <p className="section-label">{t.ourApproach}</p>
          <h2 className="section-title mt-2">{t.ourProcess}</h2>
          <div className="mt-12 grid gap-5 md:grid-cols-2 lg:grid-cols-4">
            {t.steps.map((item) => (
              <div key={item.step} className="card border-brand-100">
                <div className="font-display text-2xl font-bold text-accent-600">{item.step}</div>
                <h3 className="mt-3 text-xl font-bold text-brand-900">{item.title}</h3>
                <p className="mt-2 text-base leading-relaxed text-slate-700">{item.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-16 sm:px-6 lg:py-20" aria-labelledby="faq-heading">
        <div className="max-w-3xl">
          <p className="section-label">{t.faqTitle}</p>
          <h2 id="faq-heading" className="section-title mt-2">
            {t.faqTitle}
          </h2>
        </div>
        <dl className="mt-10 space-y-4">
          {t.faq.map((item) => (
            <div key={item.question} className="card">
              <dt className="text-xl font-bold text-brand-900">{item.question}</dt>
              <dd className="mt-2 text-base leading-relaxed text-slate-700">{item.answer}</dd>
            </div>
          ))}
        </dl>
      </section>

      <section className="mx-auto max-w-6xl px-4 pb-16 sm:px-6 lg:pb-20">
        <div className="relative overflow-hidden rounded-[2rem] bg-gradient-to-br from-brand-900 to-brand-700 px-6 py-14 text-center text-white shadow-card sm:px-12">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_bottom_left,rgba(199,107,58,0.2),transparent_55%)]" />
          <div className="relative">
            <h2 className="font-display text-3xl font-bold sm:text-4xl">{t.ctaTitle}</h2>
            <p className="mx-auto mt-4 max-w-2xl text-lg leading-relaxed text-brand-100">{t.ctaText}</p>
            <div className="mt-9 flex flex-wrap justify-center gap-3">
              <ButtonLink href={localePath(locale, '/contact')} className="bg-accent-600 text-white hover:bg-accent-500">
                {t.contactUs}
              </ButtonLink>
              <a
                href={`tel:${site.phone.replace(/\D/g, '')}`}
                className="inline-flex items-center justify-center rounded-xl border-2 border-white/50 px-5 py-3 text-base font-semibold text-white transition-colors hover:bg-white/10"
              >
                {dict.common.call} {site.phone}
              </a>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
