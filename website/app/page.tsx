import Image from 'next/image';
import { ButtonLink } from '@/components/button-link';
import { site } from '@/lib/site';

const services = [
  {
    title: 'Medicare Advantage & Supplement',
    description: 'Compare plans, networks, and prescription coverage for your budget and doctors.',
  },
  {
    title: 'Medicaid & Dual Eligible',
    description: 'Guidance for beneficiaries who qualify for both Medicare and Medicaid programs.',
  },
  {
    title: 'Annual Enrollment Support',
    description: 'Review changes during AEP and OEP so you never miss a deadline or better fit plan.',
  },
  {
    title: 'Ongoing Client Care',
    description: 'Renewals, follow-ups, and policy questions handled by the same team year after year.',
  },
];

const steps = [
  { step: '01', title: 'Listen', text: 'We start with your doctors, medications, and budget — not a one-size plan.' },
  { step: '02', title: 'Compare', text: 'We walk through carrier options side by side in plain language.' },
  { step: '03', title: 'Enroll', text: 'We handle applications and confirm effective dates with you.' },
  { step: '04', title: 'Stay with you', text: 'Renewals and life changes are part of the relationship, not a handoff.' },
];

export default function HomePage() {
  return (
    <>
      <section className="relative overflow-hidden bg-gradient-to-br from-brand-900 via-brand-700 to-brand-600 text-white">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(255,255,255,0.12),transparent_50%)]" />
        <div className="relative mx-auto grid max-w-6xl gap-10 px-4 py-16 sm:px-6 lg:grid-cols-2 lg:items-center lg:py-24">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-brand-100">Enamorado Insurance Company</p>
            <h1 className="mt-4 font-display text-4xl font-semibold leading-tight sm:text-5xl">
              Health coverage guidance that puts people first
            </h1>
            <p className="mt-6 max-w-xl text-lg leading-relaxed text-brand-50/90">
              {site.description}
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <ButtonLink href="/contact" className="bg-white text-brand-800 hover:bg-brand-50">
                Schedule a consultation
              </ButtonLink>
              <ButtonLink href="/services" variant="secondary" className="border-white/40 text-white hover:bg-white/10">
                View services
              </ButtonLink>
            </div>
          </div>

          <div className="relative mx-auto w-full max-w-md lg:max-w-none">
            <div className="overflow-hidden rounded-2xl border border-white/20 bg-white/10 p-6 shadow-2xl backdrop-blur-sm">
              <Image
                src="/enamorado-logo.jpg"
                alt={site.name}
                width={800}
                height={800}
                className="mx-auto h-auto w-full max-w-xs rounded-xl"
                priority
              />
              <p className="mt-6 text-center text-sm text-brand-100">
                Licensed agents serving Medicare & Medicaid beneficiaries
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-16 sm:px-6">
        <div className="max-w-2xl">
          <h2 className="font-display text-3xl font-semibold text-brand-900">How we help</h2>
          <p className="mt-3 text-slate-600">
            Whether you are turning 65, losing employer coverage, or reviewing plans during open enrollment, we simplify the process.
          </p>
        </div>
        <div className="mt-10 grid gap-6 sm:grid-cols-2">
          {services.map((item) => (
            <article
              key={item.title}
              className="rounded-2xl border border-slate-200 bg-slate-50 p-6 transition-shadow hover:shadow-md"
            >
              <h3 className="text-lg font-semibold text-brand-900">{item.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-slate-600">{item.description}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="bg-slate-50 py-16">
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <h2 className="font-display text-3xl font-semibold text-brand-900">Our process</h2>
          <div className="mt-10 grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            {steps.map((item) => (
              <div key={item.step} className="rounded-2xl bg-white p-6 shadow-sm ring-1 ring-slate-200/80">
                <div className="text-sm font-bold text-brand-600">{item.step}</div>
                <h3 className="mt-2 text-lg font-semibold text-slate-900">{item.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-slate-600">{item.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-16 sm:px-6">
        <div className="rounded-3xl bg-brand-900 px-6 py-12 text-center text-white sm:px-12">
          <h2 className="font-display text-3xl font-semibold">Ready to review your options?</h2>
          <p className="mx-auto mt-4 max-w-2xl text-brand-100">
            Contact our team for a no-pressure conversation. We will help you understand what you qualify for and what makes sense for your situation.
          </p>
          <div className="mt-8 flex flex-wrap justify-center gap-3">
            <ButtonLink href="/contact" className="bg-white text-brand-800 hover:bg-brand-50">
              Contact us
            </ButtonLink>
            <a
              href={`tel:${site.phone.replace(/\D/g, '')}`}
              className="inline-flex items-center justify-center rounded-lg border border-white/30 px-5 py-3 text-sm font-semibold text-white hover:bg-white/10"
            >
              Call {site.phone}
            </a>
          </div>
        </div>
      </section>
    </>
  );
}
