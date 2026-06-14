import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { MobileCallBar } from '@/components/mobile-call-bar';
import { SiteFooter } from '@/components/site-footer';
import { SiteHeader } from '@/components/site-header';
import { SetHtmlLang } from '@/components/set-html-lang';
import { isLocale, locales, type Locale } from '@/lib/i18n/config';
import { getDictionary } from '@/lib/i18n/get-dictionary';
import { buildRootMetadata } from '@/lib/seo/metadata';

type LayoutProps = {
  children: React.ReactNode;
  params: { locale: string };
};

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

export async function generateMetadata({ params }: { params: { locale: string } }): Promise<Metadata> {
  if (!isLocale(params.locale)) return {};
  const dict = getDictionary(params.locale);
  return buildRootMetadata(params.locale, dict.meta.home.description);
}

export default function LocaleLayout({ children, params }: LayoutProps) {
  if (!isLocale(params.locale)) notFound();

  const locale = params.locale as Locale;
  const dict = getDictionary(locale);

  return (
    <>
      <SetHtmlLang locale={locale} />
      <SiteHeader locale={locale} dict={dict} />
      <main className="pb-36 md:pb-0">{children}</main>
      <SiteFooter locale={locale} dict={dict} />
      <MobileCallBar dict={dict} />
    </>
  );
}
