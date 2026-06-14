This repo is **Enamorado Insurance Company** — a Medicare/Medicaid agency with two Next.js apps on Vercel, one GitHub repo.

## What this project is

- **Public website** → `enamoradoinsurancefl.com` (marketing)
- **Internal CRM** → `crm.enamoradoinsurancefl.com` (agents & admins)
- **Stack:** Next.js 14, TypeScript, Tailwind, Supabase (CRM only), Zapier webhooks (CRM only)
- **Compliance:** HIPAA Path B — no full Medicare/Medicaid IDs; Zapier payloads must never include DOB, phone, email, address, or member IDs

## How the repo is organized

| Folder / file | What it is |
|---------------|------------|
| `website/` | Marketing site. Deploy on Vercel with root directory = `website`. Pages: home, services, about, contact. Config: `website/lib/site.ts` (phone, email, URLs). |
| `app/` | CRM app. Deploy on Vercel with root directory = `app`. Login, contacts, pipeline, follow-ups, renewals, commissions, enrollments, admin. |
| `app/supabase/migrations/` | Database schema (0001–0004): contacts, RLS, audit log, commissions, enrollments. |
| `app/lib/` | Business logic — contacts, auth, zapier, hipaa guards, etc. Server Actions, not a public REST API. |
| `app/app/api/cron/zapier-reminders/` | Daily cron: follow-up + renewal reminders → Zapier. |
| `workflows/` | Operational runbooks (renewal reminders, enrollment flow, HIPAA, launch, prospect intake). |
| `workstream-b/` | Specs for commissions, renewals, enrollments, Zapier automation list. |
| `handoff/` | Launch checklist, UAT, admin/agent onboarding checklists, architecture diagram. |
| `user-guides/` | How admins and agents use the CRM day to day. |
| `docs/` | Deployment guides (`deployment-domains.md`, `deployment-staging.md`, RLS smoke tests). |
| `01-Project-Scope.md` … `07-*.md` | Approved scope, plan, timeline, risks, SOW — source of truth for what belongs in v1. |
| `happycapy/` | Prompts for you (this file). |
| `STATUS.md` | Latest project status — update when you finish a session. |

## Domains & deploy

- **Two Vercel projects**, same repo, different root folders: `website` vs `app`
- DNS at SiteGround: apex + www → website project; `crm` subdomain → CRM project
- See `docs/deployment-domains.md` for DNS records

## Your job

**Audit this entire repo, then make it better.**

1. **Read first** — skim `README.md`, `01-Project-Scope.md`, and the folders above so you understand intent before changing code.
2. **Audit** — for both `website/` and `app/`, report:
   - What works vs what’s incomplete or placeholder
   - UX, copy, and design gaps on the marketing site
   - CRM gaps vs scope (dashboard, enrollments on contact detail, RLS, Zapier wiring)
   - Docs that are wrong, missing, or out of sync with code
   - Build/type errors (`npm run typecheck && npm run build` in each app folder)
   - Path B / HIPAA issues anywhere (especially Zapier payloads)
3. **Improve** — after the audit, implement the highest-impact fixes yourself:
   - Better marketing site (content, layout, contact form, real info in `website/lib/site.ts`)
   - CRM polish that agents/admins will feel day one
   - Tighter docs and workflows where they help operations
   - Keep changes minimal and match existing patterns (Server Actions, Tailwind, no new frameworks)
4. **Don’t expand scope** without flagging it — carrier APIs, Stripe, public API, full PHI/BAA are out of v1 unless I approve.

## Output I want from you

Start with a short **audit summary** (bullets: critical / should fix / nice to have).

Then **do the work** — don’t stop at recommendations unless blocked.

When done, update `STATUS.md` with what you changed and what’s left.

Ask me only if you need real phone/email/office address, Vercel/Supabase credentials, or Zapier account access. Otherwise proceed.
