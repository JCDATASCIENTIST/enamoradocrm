'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { localeLabels, type Locale } from '@/lib/i18n/config';
import { switchLocalePath } from '@/lib/i18n/paths';
import { cn } from '@/lib/utils';

type LanguageSwitcherProps = {
  locale: Locale;
};

export function LanguageSwitcher({ locale }: LanguageSwitcherProps) {
  const pathname = usePathname();

  return (
    <div
      className="flex items-center rounded-lg border border-slate-200 bg-white p-0.5 text-xs font-semibold"
      role="group"
      aria-label="Language"
    >
      {(['en', 'es'] as const).map((code) => {
        const active = locale === code;
        return (
          <Link
            key={code}
            href={switchLocalePath(locale, code, pathname)}
            className={cn(
              'rounded-md px-2.5 py-1 transition-colors',
              active ? 'bg-brand-700 text-white' : 'text-slate-600 hover:text-brand-700',
            )}
            aria-current={active ? 'page' : undefined}
          >
            {code === 'en' ? 'EN' : 'ES'}
            <span className="sr-only"> ({localeLabels[code]})</span>
          </Link>
        );
      })}
    </div>
  );
}
