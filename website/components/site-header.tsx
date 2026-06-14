import Link from 'next/link';
import Image from 'next/image';
import { LanguageSwitcher } from '@/components/language-switcher';
import { MobileHeaderCallButton } from '@/components/mobile-call-bar';
import type { Dictionary } from '@/lib/i18n/get-dictionary';
import type { Locale } from '@/lib/i18n/config';
import { localePath } from '@/lib/i18n/paths';
import { site } from '@/lib/site';
import { cn } from '@/lib/utils';

type SiteHeaderProps = {
  locale: Locale;
  dict: Dictionary;
};

const navKeys = ['services', 'about', 'contact'] as const;

export function SiteHeader({ locale, dict }: SiteHeaderProps) {
  return (
    <header className="sticky top-0 z-50 border-b border-slate-200/80 bg-white/95 backdrop-blur-md">
      <div className="hidden border-b border-brand-100 bg-brand-50/80 sm:block">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-1.5 text-xs text-slate-600 sm:px-6">
          <span>{dict.site.serviceArea}</span>
          <a href={`tel:${site.phone.replace(/\D/g, '')}`} className="font-semibold text-brand-700 hover:text-brand-900">
            {dict.common.call} {site.phone}
          </a>
        </div>
      </div>

      <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 py-3 sm:px-6">
        <Link href={localePath(locale)} className="flex items-center gap-3">
          <Image
            src="/enamorado-logo.jpg"
            alt={site.name}
            width={120}
            height={120}
            className="h-12 w-12 rounded-full object-cover ring-2 ring-brand-200 shadow-sm"
            priority
          />
          <div className="hidden sm:block">
            <div className="font-display text-lg font-semibold text-brand-900">{site.shortName}</div>
            <div className="text-xs text-slate-500">{dict.common.medicareCoverage}</div>
          </div>
        </Link>

        <nav className="hidden items-center gap-1 md:flex">
          {navKeys.map((key) => (
            <Link
              key={key}
              href={localePath(locale, `/${key}`)}
              className="rounded-lg px-3 py-2 text-sm font-medium text-slate-700 transition-colors hover:bg-surface-muted hover:text-brand-700"
            >
              {dict.nav[key]}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          <MobileHeaderCallButton dict={dict} />
          <LanguageSwitcher locale={locale} />
          <Link
            href={localePath(locale, '/contact')}
            className="hidden rounded-xl border border-brand-600/30 bg-white px-3 py-2 text-sm font-semibold text-brand-700 shadow-sm transition-colors hover:border-brand-600 hover:bg-brand-50 sm:inline-flex"
          >
            {dict.common.getQuote}
          </Link>
          <a
            href={`${site.crmUrl}/login`}
            className="hidden rounded-xl bg-brand-700 px-3 py-2 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-brand-800 md:inline-flex"
          >
            {dict.common.agentLogin}
          </a>
        </div>
      </div>

      <nav className="flex gap-1 overflow-x-auto border-t border-slate-100 px-4 py-2 md:hidden">
        {navKeys.map((key) => (
          <Link
            key={key}
            href={localePath(locale, `/${key}`)}
            className={cn(
              'shrink-0 rounded-full px-3 py-1.5 text-xs font-medium text-slate-600',
              'border border-slate-200 bg-white hover:border-brand-300 hover:text-brand-700',
            )}
          >
            {dict.nav[key]}
          </Link>
        ))}
      </nav>
    </header>
  );
}
