import type { Metadata } from 'next';
import Link from 'next/link';
import { site } from '@/lib/site';

export const metadata: Metadata = {
  title: 'Services',
  description: 'Medicare, Medicaid, and enrollment support from Enamorado Insurance Company.',
};

const offerings = [
  {
    title: 'Medicare Advantage (Part C)',
    bullets: [
      'Network and specialist access review',
      'Prescription drug (Part D) bundled options',
      'Extra benefits comparison (dental, vision, hearing)',
    ],
  },
  {
    title: 'Medicare Supplement (Medigap)',
    bullets: [
      'Plan letter comparisons (G, N, and others where available)',
      'Coordination with Original Medicare',
      'Rate stability and carrier reputation review',
    ],
  },
  {
    title: 'Standalone Part D',
    bullets: [
      'Formulary checks for your medications',
      'Pharmacy network preferences',
      'LIS / Extra Help eligibility guidance',
    ],
  },
  {
    title: 'Medicaid & Dual Eligible',
    bullets: [
      'DSNP and Medicaid level considerations',
      'Coordination of benefits explanation',
      'Redetermination and renewal support',
    ],
  },
  {
    title: 'New to Medicare',
    bullets: [
      'Turning-65 timeline and IEP planning',
      'Employer coverage vs Medicare decisions',
      'Penalty avoidance for late enrollment',
    ],
  },
  {
    title: 'Plan reviews & renewals',
    bullets: [
      'Annual Enrollment Period (AEP) reviews',
      'Plan change notices explained in plain language',
      'Ongoing follow-up through our client care process',
    ],
  },
];

export default function ServicesPage() {
  return (
    <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6">
      <div className="max-w-3xl">
        <p className="text-sm font-semibold uppercase tracking-wide text-brand-600">Services</p>
        <h1 className="mt-2 font-display text-4xl font-semibold text-brand-900">Coverage options we guide you through</h1>
        <p className="mt-4 text-lg leading-relaxed text-slate-600">
          We are an independent agency — not a single carrier. That means recommendations are based on your needs, not a quota.
        </p>
      </div>

      <div className="mt-12 grid gap-6 md:grid-cols-2">
        {offerings.map((item) => (
          <article key={item.title} className="rounded-2xl border border-slate-200 p-6">
            <h2 className="text-xl font-semibold text-slate-900">{item.title}</h2>
            <ul className="mt-4 space-y-2 text-sm text-slate-600">
              {item.bullets.map((bullet) => (
                <li key={bullet} className="flex gap-2">
                  <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-brand-500" />
                  <span>{bullet}</span>
                </li>
              ))}
            </ul>
          </article>
        ))}
      </div>

      <div className="mt-12 rounded-2xl bg-brand-50 p-8">
        <h2 className="text-xl font-semibold text-brand-900">For agents & staff</h2>
        <p className="mt-2 text-sm text-slate-600">
          Enamorado team members use our internal CRM for client records, pipeline, renewals, and follow-ups.
        </p>
        <Link
          href={`${site.crmUrl}/login`}
          className="mt-4 inline-flex text-sm font-semibold text-brand-700 hover:text-brand-900"
        >
          Sign in to CRM →
        </Link>
      </div>
    </div>
  );
}
