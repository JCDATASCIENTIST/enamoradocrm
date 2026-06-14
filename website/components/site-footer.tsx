import Link from 'next/link';
import type { Dictionary } from '@/lib/i18n/get-dictionary';
import type { Locale } from '@/lib/i18n/config';
import { localePath } from '@/lib/i18n/paths';
import { site } from '@/lib/site';

type SiteFooterProps = {
  locale: Locale;
  dict: Dictionary;
};

const navKeys = ['services', 'about', 'contact'] as const;

export function SiteFooter({ locale, dict }: SiteFooterProps) {
  const year = new Date().getFullYear();

  return (
    <footer className="border-t border-brand-900/20 bg-brand-900 text-slate-300 pb-36 md:pb-0">
      <div className="mx-auto grid max-w-6xl gap-10 px-4 py-14 sm:px-6 md:grid-cols-4">
        <div className="md:col-span-2">
          <div className="font-display text-xl font-semibold text-white">{site.shortName}</div>
          <p className="mt-3 max-w-sm text-sm leading-relaxed text-slate-400">{dict.site.tagline}</p>
          <p className="mt-4 text-sm text-slate-400">
            {site.address.line1}
            <br />
            {site.address.city}, {site.address.state} {site.address.zip}
          </p>
        </div>

        <div>
          <div className="text-xs font-semibold uppercase tracking-[0.15em] text-slate-500">{dict.common.explore}</div>
          <ul className="mt-4 space-y-2.5 text-sm">
            {navKeys.map((key) => (
              <li key={key}>
                <Link href={localePath(locale, `/${key}`)} className="transition-colors hover:text-white">
                  {dict.nav[key]}
                </Link>
              </li>
            ))}
            <li>
              <a href={`${site.crmUrl}/login`} className="transition-colors hover:text-white">
                {dict.common.agentLogin}
              </a>
            </li>
          </ul>
        </div>

        <div>
          <div className="text-xs font-semibold uppercase tracking-[0.15em] text-slate-500">
            {dict.common.contactHeading}
          </div>
          <ul className="mt-4 space-y-2.5 text-sm">
            <li>
              <a href={`tel:${site.phone.replace(/\D/g, '')}`} className="font-medium text-white hover:underline">
                {site.phone}
              </a>
            </li>
            <li>
              <a href={`mailto:${site.email}`} className="transition-colors hover:text-white">
                {site.email}
              </a>
            </li>
            <li className="text-slate-400">{dict.site.hours}</li>
          </ul>
        </div>
      </div>

      <div className="border-t border-white/10 px-4 py-6 text-center text-xs text-slate-500 sm:px-6">
        © {year} {site.name}. {dict.common.allRights}
      </div>
    </footer>
  );
}
