# v0 Prompt — Enamorado Insurance CRM

Paste this into [v0.dev](https://v0.dev) to iterate on CRM **UI only**. Connect the chat to GitHub repo **`enamorado-insurance-crm`** (see [V0-SETUP.md](./V0-SETUP.md)).

---

## Prompt

Build the **authenticated app shell and key screens** for **Enamorado Insurance CRM** — an internal Medicare insurance agency tool used by agents and admins in Palm Beach County, Florida. Match the public website brand: trustworthy navy blue + warm amber accents.

**Audience:** Insurance agents (often 50+), office admins. Large tap targets, high contrast, readable type. Desktop-first with solid mobile navigation.

**Visual direction (see `design-system/enamorado-insurance/MASTER.md` + `BRAND-OVERRIDE.md`):**
- Brand navy: `#0b2038` → `#163d6b` → `#2563a8`
- Amber accent for primary actions: `#b45309`, `#d2691e`
- Surfaces: `#f7f9fc`, white cards, `border-slate-200`
- Typography: system UI stack (or DM Sans if easy). No purple SaaS gradients.
- Style: clean operational dashboard — rounded-lg cards, subtle shadows, clear hierarchy
- Logo: `/enamorado-logo.jpg` (circular or rectangular in sidebar, ~160px wide on desktop)

**App structure:**

1. **`/login`** — Centered card, logo, email + password, “Sign in”, footer “Access by invitation only”
2. **Authenticated layout** — Left sidebar (desktop) + top mobile menu:
   - Nav: Dashboard, Clients & Prospects, Pipeline, Follow-ups, Birthdays, Renewals, Commissions, Enrollments, Users (admin), Audit Log (admin)
   - Footer: signed-in user name, role badge, Sign out
3. **`/dashboard`** — Welcome line, role hint, 6 stat cards (Clients, Prospects, Pending follow-ups, Renewals due 7d, Overdue renewals, Pending commissions), Quick links section
4. **`/pipeline`** — Kanban with 4 columns: New, Requested, In Progress, Done. Cards show name, plan type, assignee. Drag-and-drop styling (mock interaction OK)
5. **`/contacts`** — Filter bar + data table (name, type, phone, stage, assignee). “New contact” button

**Use mock/static data** for lists and counts. Do not wire Supabase — design only.

**Tech:** Next.js 14 App Router, Tailwind CSS, TypeScript. Server components where possible; client components for mobile menu and kanban drag UI stubs.

**Compliance note (UI copy only):** Small badge in sidebar: “Path B — no PHI in automations”. Never show SSN or full Medicare ID fields in mock forms.

**Generate in this order:**
1. Login page + authenticated app shell (sidebar + mobile nav)
2. Dashboard with stat cards
3. Pipeline kanban page

Reuse the shell across all pages. Keep routes exactly as listed above.

---

## After v0 generates

1. Push from v0 → GitHub (`enamorado-insurance-crm`)
2. Merge **design files** into monorepo `app/` — see [V0-SETUP.md](./V0-SETUP.md) § Merge into monorepo
3. **Do not overwrite** `lib/`, `supabase/`, `app/api/`, or Server Action logic without review
4. Run `cd app && npm run typecheck && npm run build`
5. Deploy Vercel project **enamorado-insurance-crm** (root `app` if monorepo-connected)

**Production URL:** `https://crm.enamoradoinsurancecompany.com`
