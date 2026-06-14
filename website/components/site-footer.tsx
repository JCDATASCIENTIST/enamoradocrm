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
    <footer className="border-t border-brand-900/20 bg-brand-900 text-slate-200 pb-36 md:pb-0">
      <div className="mx-auto grid max-w-6xl gap-10 px-4 py-14 sm:px-6 md:grid-cols-4">
        <div className="md:col-span-2">
          <div className="font-display text-2xl font-bold text-white">{site.shortName}</div>
          <p className="mt-3 max-w-sm text-base leading-relaxed text-slate-300">{dict.site.tagline}</p>
          <p className="mt-4 text-base text-slate-300">
            {site.address.line1}
            <br />
            {site.address.city}, {site.address.state} {site.address.zip}
          </p>
        </div>

        <div>
          <div className="text-sm font-bold uppercase tracking-[0.12em] text-accent-100">{dict.common.explore}</div>
          <ul className="mt-4 space-y-3 text-base">
            {navKeys.map((key) => (
              <li key={key}>
                <Link href={localePath(locale, `/${key}`)} className="text-slate-200 transition-colors hover:text-white">
                  {dict.nav[key]}
                </Link>
              </li>
            ))}
            <li>
              <a href={`${site.crmUrl}/login`} className="text-slate-200 transition-colors hover:text-white">
                {dict.common.agentLogin}
              </a>
            </li>
          </ul>
        </div>

        <div>
          <div className="text-sm font-bold uppercase tracking-[0.12em] text-accent-100">
            {dict.common.contactHeading}
          </div>
          <ul className="mt-4 space-y-3 text-base">
            <li>
              <a href={`tel:${site.phone.replace(/\D/g, '')}`} className="font-semibold text-white hover:underline">
                {site.phone}
              </a>
            </li>
            <li>
              <a href={`mailto:${site.email}`} className="text-slate-200 transition-colors hover:text-white">
                {site.email}
              </a>
            </li>
            <li className="text-slate-300">{dict.site.hours}</li>
          </ul>
        </div>
      </div>

      <div className="border-t border-white/10 px-4 py-6 text-center text-sm text-slate-300 sm:px-6">
        © {year} {site.name}. {dict.common.allRights}
      </div>
    </footer>
  );
}
