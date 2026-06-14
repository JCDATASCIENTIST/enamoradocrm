# v0 Prompt — Enamorado Insurance Website

Paste this into [v0.dev](https://v0.dev) to iterate on the marketing site. After generating, copy components into `website/` (Next.js App Router, Tailwind, DM Sans + Fraunces).

---

## Prompt

Build a multi-page marketing website for **Enamorado Insurance Company**, an independent Medicare insurance agency in West Palm Beach, Florida. Broker: **Dalkys Enamorado**. Audience: seniors 65+, people new to Medicare, Palm Beach County families.

**Tone:** Warm, trustworthy, bilingual-friendly (subtle "Hola!" greeting), never pushy or salesy. Plain language. Human-first — not a generic SaaS landing page.

**Visual direction:**
- Follow `design-system/enamorado-insurance/MASTER.md` and `BRAND-OVERRIDE.md` in the monorepo
- Palette: trusted navy `#0b2038` → `#2563a8`, clean slate background `#f7f9fc`, amber accent `#b45309` for CTAs
- Typography: Fraunces (display/headlines), DM Sans (body/UI)
- Style: editorial healthcare — soft shadows, rounded-2xl cards, subtle gradient heroes, no stock-photo clichés
- Avoid: purple gradients, Inter-only layouts, generic "AI startup" aesthetics

**Pages (4, each in EN + ES):**
- `/en` and `/es` — Home
- `/en/services` and `/es/services`
- `/en/about` and `/es/about`
- `/en/contact` and `/es/contact`
- Header language switcher: EN | ES

**Copy highlights:**
- Tagline: "Clear Medicare guidance — no pressure, year-round support"
- Independent broker who works for clients, not carriers
- Social services & savings programs
- Year-round renewals and follow-ups

**Components:**
- Sticky header with logo, nav (Services, About, Contact), "Get a quote" + "Agent login" (external CRM link)
- Footer: address `3554 Lake Worth Rd, Lake Worth, FL 33461`, hours Mon–Fri 9–6, Saturday by appointment
- Mobile-responsive with horizontal scroll nav on small screens
- Accessible contrast, focus states, semantic HTML

**Tech:** React, Tailwind CSS, Next.js App Router compatible. Use server components where possible; contact form can be client component with server action stub.

**Compliance:** Include Medicare disclaimer: "We do not offer every plan available in your area…" Contact form must warn users not to submit SSN or Medicare IDs.

Generate the **Home page** first with full header/footer shell reusable across pages.

---

## After v0 generates

1. Compare output to existing `website/components/` and merge best sections
2. Keep `website/lib/site.ts` as single source for contact info
3. Deploy: `cd website && vercel --prod`
4. Domains: `enamoradoinsurancecompany.com`, `www.enamoradoinsurancecompany.com`
