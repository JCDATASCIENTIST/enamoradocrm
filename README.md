# Enamorado Insurance CRM

Custom CRM for **Enamorado Insurance Company** — Medicare/Medicaid agency operations, pipeline, renewals, commissions, and enrollments.

## Stack

| Layer | Technology |
|-------|------------|
| App | Next.js 14, React 18, TypeScript, Tailwind |
| Data / Auth | Supabase (Postgres + RLS) |
| Hosting | Vercel — website on apex domain, CRM on `crm.` subdomain |
| Automations | Zapier webhooks (HIPAA Path B payloads) |

## Repository layout

| Path | Purpose |
|------|---------|
| [`website/`](website/) | Public marketing site — **Vercel root** for apex domain |
| [`app/`](app/) | CRM application — **Vercel root** for `crm.` subdomain |
| [`workflows/`](workflows/) | Operational runbooks (renewals, enrollments, launch) |
| [`workstream-b/`](workstream-b/) | Commissions, renewals, Zapier specs |
| [`happycapy/`](happycapy/) | Happy Capy.ai prompts, sessions, and automations |
| [`handoff/`](handoff/) | Launch, UAT, and onboarding checklists |
| [`user-guides/`](user-guides/) | Admin and agent guides |
| [`docs/`](docs/) | Deployment and RLS smoke tests |
| `01-Project-Scope.md` … `07-*.md` | Project planning documents |

## Quick start

```bash
cd app
npm install
cp .env.local.example .env.local
# Fill Supabase URL, keys, CRON_SECRET, optional ZAPIER_* webhooks
npm run dev
```

Apply SQL migrations in order from `app/supabase/migrations/` (0001–0004).

See [`app/README.md`](app/README.md) for CRM setup and [`docs/deployment-domains.md`](docs/deployment-domains.md) for dual-domain Vercel + SiteGround DNS.

## HIPAA

**Path B:** No full SSN, Medicare/MBI, or Medicaid IDs. Member ID last-4 only. Zapier payloads exclude DOB, phone, email, and address. See [`workflows/HIPAA-Data-Handling-Flow.md`](workflows/HIPAA-Data-Handling-Flow.md).

## Happy Capy

Use [`happycapy/MASTER-PROMPT.md`](happycapy/MASTER-PROMPT.md) to configure a Happy Capy Project for ongoing development and workflow work.
