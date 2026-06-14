# Enamorado Insurance — Claude Code instructions

Project-specific context for AI agents working in this repository.

## What this is

**Enamorado Insurance Company** — Medicare/Medicaid agency software in one monorepo:

| App | Folder | Production URL | Vercel root |
|-----|--------|----------------|-------------|
| Marketing website | `website/` | `enamoradoinsurancefl.com` | `website` |
| Internal CRM | `app/` | `crm.enamoradoinsurancefl.com` | `app` |

**Stack:** Next.js 14, TypeScript, Tailwind, Supabase (CRM only), Zapier webhooks (CRM + website contact form).

**GitHub:** `JCDATASCIENTIST/enamoradocrm`

## Compliance (read before touching integrations)

**Current posture: Path B** — operational CRM without full PHI in automations.

- No full SSN, Medicare/MBI, or Medicaid IDs in Zapier payloads
- CRM Zapier events: `new_prospect`, `follow_up_reminder`, `renewal_reminder` — see `app/lib/zapier/payload.ts`
- Website contact form may collect name/phone/email (prospect intake) via `WEBSITE_CONTACT_WEBHOOK` — see `website/lib/contact-action.ts`
- Member ID in CRM: last 4 digits only (`member_id_last4`)
- **Path A (v2, not started):** encrypted PHI columns + MCP server — gated on Supabase BAA. See `STATUS.md` v2 section and `app/supabase/migrations/0005_path_a_phi.sql` (draft)

Full runbook: [`workflows/HIPAA-Data-Handling-Flow.md`](workflows/HIPAA-Data-Handling-Flow.md)

## Repository map

```
enamoradocrm/
├── CLAUDE.md              ← you are here
├── AGENTS.md              ← skill index for .agents/skills/
├── STATUS.md              ← latest work log — update when you finish a session
├── README.md
├── website/               ← public marketing site (port 3001 in dev)
├── app/                   ← CRM (port 3000 in dev)
│   ├── app/(app)/         ← authenticated routes
│   ├── lib/               ← Server Actions, domain logic
│   └── supabase/migrations/
├── workflows/             ← operational runbooks
├── workstream-b/          ← commissions, renewals, Zapier specs
├── handoff/               ← launch, UAT, onboarding checklists
├── user-guides/           ← admin & agent guides
├── docs/                  ← deployment, RLS smoke tests
├── happycapy/             ← Happy Capy.ai prompts
├── 01-Project-Scope.md …  ← contractual scope (v1 boundary)
└── .agents/skills/        ← project agent skills (load when relevant)
```

## Engineering conventions

- **CRM data flow:** Server Components + Server Actions in `app/lib/*` — not a public REST API for CRUD
- **Auth:** Supabase SSR cookies; roles `admin` | `agent` | `read_only`; RLS on every table
- **Zapier:** fire-and-forget from `app/lib/zapier/send.ts` — failures must not block CRM writes
- **Cron:** `GET /app/api/cron/zapier-reminders` — Bearer `CRON_SECRET`, daily 13:00 UTC
- **Minimal diffs:** match existing patterns; no new frameworks without approval
- **Scope:** carrier APIs, Stripe, public API, Path A PHI — change-order / v2 only unless Joel approves

## Commands

```bash
# CRM
cd app && npm run dev          # :3000
cd app && npm run typecheck && npm run build

# Website
cd website && npm run dev      # :3001
cd website && npm run typecheck && npm run build

# DB types (CRM, needs SUPABASE_PROJECT_REF)
cd app && npm run db:types
```

Migrations: apply `app/supabase/migrations/` in order (0001–0004 production; 0005 draft for Path A).

## Agent skills (`.agents/skills/`)

Load the relevant `SKILL.md` before specialized work:

| Skill | Use when |
|-------|----------|
| `nextjs-app-router-patterns` | Routes, Server Components, Server Actions, caching |
| `nextjs-supabase-auth` | Auth, middleware, session, RLS-aware clients |
| `supabase-postgres-best-practices` | Schema, indexes, RLS performance, queries |
| `tailwind-design-system` | UI components, tokens, responsive layout |
| `kpi-dashboard-design` | CRM dashboard metrics and admin views |
| `mcp-builder` | Future MCP server for CRM tools (v2) |

See [`AGENTS.md`](AGENTS.md) for full index.

## Default task: audit and improve

Unless given a narrower task:

1. Read `STATUS.md` and `01-Project-Scope.md`
2. Run typecheck + build in both `app/` and `website/`
3. Audit gaps vs scope and docs drift
4. Implement highest-impact fixes with minimal diffs
5. Update `STATUS.md` when done

## Out of scope (flag, don’t build silently)

- Carrier / enrollment-tool APIs
- Stripe or payments
- Public REST API keys
- Path A PHI storage without BAA
- Scope items in `01-Project-Scope.md` marked as change-order

## Key docs

- Deploy: [`docs/deployment-domains.md`](docs/deployment-domains.md)
- Zapier: [`workstream-b/Zapier-Automation-List.md`](workstream-b/Zapier-Automation-List.md)
- Happy Capy: [`happycapy/MASTER-PROMPT.md`](happycapy/MASTER-PROMPT.md)

Ask Joel only for blocking credentials (Supabase, Vercel, Zapier) or real business contact info for `website/lib/site.ts`.
