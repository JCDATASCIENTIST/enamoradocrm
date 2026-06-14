import type { Dictionary } from '@/lib/i18n/get-dictionary';
import { site } from '@/lib/site';

type TrustBarProps = {
  dict: Dictionary;
};

export function TrustBar({ dict }: TrustBarProps) {
  return (
    <div className="border-b border-brand-800/20 bg-brand-900/95">
      <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-center gap-x-8 gap-y-2 px-4 py-2.5 text-center sm:px-6">
        {dict.trustBar.map((item) => (
          <span key={item} className="flex items-center gap-2 text-xs font-medium text-brand-100 sm:text-sm">
            <span className="h-1.5 w-1.5 rounded-full bg-accent-500" aria-hidden />
            {item}
          </span>
        ))}
        <a
          href={`tel:${site.phone.replace(/\D/g, '')}`}
          className="text-xs font-semibold text-white underline-offset-2 hover:underline sm:text-sm"
        >
          {site.phone}
        </a>
      </div>
    </div>
  );
}
