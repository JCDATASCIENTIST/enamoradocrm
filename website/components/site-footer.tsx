import Link from 'next/link';
import { site, navLinks } from '@/lib/site';

export function SiteFooter() {
  const year = new Date().getFullYear();

  return (
    <footer className="border-t border-slate-200 bg-slate-900 text-slate-300">
      <div className="mx-auto grid max-w-6xl gap-10 px-4 py-12 sm:px-6 md:grid-cols-3">
        <div>
          <div className="font-display text-lg font-semibold text-white">{site.shortName}</div>
          <p className="mt-3 text-sm leading-relaxed text-slate-400">{site.tagline}</p>
        </div>

        <div>
          <div className="text-sm font-semibold uppercase tracking-wide text-slate-500">Explore</div>
          <ul className="mt-4 space-y-2 text-sm">
            {navLinks.map((item) => (
              <li key={item.href}>
                <Link href={item.href} className="hover:text-white">
                  {item.label}
                </Link>
              </li>
            ))}
            <li>
              <a href={`${site.crmUrl}/login`} className="hover:text-white">
                Agent login
              </a>
            </li>
          </ul>
        </div>

        <div>
          <div className="text-sm font-semibold uppercase tracking-wide text-slate-500">Contact</div>
          <ul className="mt-4 space-y-2 text-sm">
            <li>
              <a href={`tel:${site.phone.replace(/\D/g, '')}`} className="hover:text-white">
                {site.phone}
              </a>
            </li>
            <li>
              <a href={`mailto:${site.email}`} className="hover:text-white">
                {site.email}
              </a>
            </li>
          </ul>
        </div>
      </div>

      <div className="border-t border-slate-800 px-4 py-6 text-center text-xs text-slate-500 sm:px-6">
        © {year} {site.name}. All rights reserved.
      </div>
    </footer>
  );
}
