import type { Metadata } from 'next';
import { site } from '@/lib/site';

export const metadata: Metadata = {
  title: 'About',
  description: 'Learn about Enamorado Insurance Company and our approach to client care.',
};

const values = [
  {
    title: 'Clarity over confusion',
    text: 'Medicare rules are complex. We explain trade-offs in language you can act on.',
  },
  {
    title: 'Relationships, not transactions',
    text: 'Enrollment is the beginning. Renewals, life changes, and questions come with the territory.',
  },
  {
    title: 'Compliance-minded operations',
    text: 'We protect client information and follow industry standards in how we store and share data.',
  },
];

export default function AboutPage() {
  return (
    <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6">
      <div className="max-w-3xl">
        <p className="text-sm font-semibold uppercase tracking-wide text-brand-600">About us</p>
        <h1 className="mt-2 font-display text-4xl font-semibold text-brand-900">{site.name}</h1>
        <p className="mt-6 text-lg leading-relaxed text-slate-600">
          {site.name} is a health insurance agency focused on Medicare and Medicaid beneficiaries. We help individuals and families choose coverage that fits their doctors, medications, and financial situation — then stay available when plans or life circumstances change.
        </p>
        <p className="mt-4 leading-relaxed text-slate-600">
          Our team uses modern tools to track follow-ups, renewals, and enrollments so nothing falls through the cracks. Clients get personal service; our operations stay organized behind the scenes.
        </p>
      </div>

      <div className="mt-12 grid gap-6 md:grid-cols-3">
        {values.map((item) => (
          <article key={item.title} className="rounded-2xl border border-slate-200 bg-slate-50 p-6">
            <h2 className="text-lg font-semibold text-brand-900">{item.title}</h2>
            <p className="mt-3 text-sm leading-relaxed text-slate-600">{item.text}</p>
          </article>
        ))}
      </div>

      <div className="mt-12 rounded-2xl border border-slate-200 p-8">
        <h2 className="text-xl font-semibold text-slate-900">Important notice</h2>
        <p className="mt-3 text-sm leading-relaxed text-slate-600">
          We do not offer every plan available in your area. Any information we provide is limited to the plans we do offer. Please contact Medicare.gov, 1-800-MEDICARE, or your local State Health Insurance Program (SHIP) for all of your options.
        </p>
      </div>
    </div>
  );
}
