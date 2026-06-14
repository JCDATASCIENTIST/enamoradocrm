import Link from 'next/link';
import Image from 'next/image';
import { site, navLinks } from '@/lib/site';
import { cn } from '@/lib/utils';

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-50 border-b border-slate-200/80 bg-white/90 backdrop-blur-md">
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 py-3 sm:px-6">
        <Link href="/" className="flex items-center gap-3">
          <Image
            src="/enamorado-logo.jpg"
            alt={site.name}
            width={120}
            height={120}
            className="h-12 w-12 rounded-full object-cover ring-2 ring-brand-100"
            priority
          />
          <div className="hidden sm:block">
            <div className="font-display text-lg font-semibold text-brand-900">{site.shortName}</div>
            <div className="text-xs text-slate-500">Medicare & health coverage</div>
          </div>
        </Link>

        <nav className="hidden items-center gap-1 md:flex">
          {navLinks.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="rounded-lg px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-100 hover:text-brand-700"
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          <Link
            href="/contact"
            className="hidden rounded-lg border border-brand-600 px-3 py-2 text-sm font-medium text-brand-700 hover:bg-brand-50 sm:inline-flex"
          >
            Get a quote
          </Link>
          <a
            href={`${site.crmUrl}/login`}
            className="rounded-lg bg-brand-600 px-3 py-2 text-sm font-medium text-white hover:bg-brand-700"
          >
            Agent login
          </a>
        </div>
      </div>

      <nav className="flex gap-1 overflow-x-auto border-t border-slate-100 px-4 py-2 md:hidden">
        {navLinks.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className={cn(
              'shrink-0 rounded-full px-3 py-1.5 text-xs font-medium text-slate-600',
              'border border-slate-200 hover:border-brand-300 hover:text-brand-700',
            )}
          >
            {item.label}
          </Link>
        ))}
      </nav>
    </header>
  );
}
