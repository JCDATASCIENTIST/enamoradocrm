import { cn } from '@/lib/utils';

type SkipLinkProps = {
  label: string;
};

export function SkipLink({ label }: SkipLinkProps) {
  return (
    <a
      href="#main-content"
      className={cn(
        'sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-[100]',
        'rounded-lg bg-brand-900 px-4 py-3 text-base font-semibold text-white',
        'shadow-lg ring-4 ring-brand-600/40 focus:outline-none',
      )}
    >
      {label}
    </a>
  );
}
