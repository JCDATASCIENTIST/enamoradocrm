import type { Dictionary } from '@/lib/i18n/get-dictionary';
import { site } from '@/lib/site';

type MobileCallBarProps = {
  dict: Dictionary;
};

function PhoneIcon() {
  return (
    <svg
      className="h-8 w-8 shrink-0"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
    >
      <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
    </svg>
  );
}

export function MobileCallBar({ dict }: MobileCallBarProps) {
  const tel = site.phone.replace(/\D/g, '');

  return (
    <div
      className="fixed inset-x-0 bottom-0 z-50 border-t-2 border-accent-600/30 bg-white/98 px-4 pb-[max(0.75rem,env(safe-area-inset-bottom))] pt-3 shadow-[0_-8px_32px_rgba(30,58,138,0.15)] backdrop-blur-md md:hidden"
      role="complementary"
      aria-label={dict.common.callNow}
    >
      <a
        href={`tel:${tel}`}
        className="flex min-h-[4.25rem] w-full items-center justify-center gap-4 rounded-2xl bg-accent-600 px-5 py-4 text-white shadow-lg ring-2 ring-accent-600/20 transition-transform active:scale-[0.98] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-700"
      >
        <span className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-white/20">
          <PhoneIcon />
        </span>
        <span className="min-w-0 flex-1 text-left">
          <span className="block font-display text-xl font-bold leading-tight tracking-tight">
            {dict.common.callNow}
          </span>
          <span className="mt-0.5 block text-lg font-semibold leading-none">{site.phone}</span>
        </span>
        <span className="sr-only">{dict.common.callNowHint}</span>
      </a>
      <p className="mt-2 text-center text-sm font-medium text-slate-600">{dict.common.callNowHint}</p>
    </div>
  );
}

export function MobileHeaderCallButton({ dict }: MobileCallBarProps) {
  const tel = site.phone.replace(/\D/g, '');

  return (
    <a
      href={`tel:${tel}`}
      className="inline-flex min-h-[44px] min-w-[44px] shrink-0 items-center justify-center gap-1.5 rounded-xl bg-accent-600 px-3 py-2.5 text-sm font-bold text-white shadow-md md:hidden"
      aria-label={`${dict.common.callNow}: ${site.phone}`}
    >
      <PhoneIcon />
      <span>{dict.common.call}</span>
    </a>
  );
}
