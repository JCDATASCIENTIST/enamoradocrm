# Enamorado Insurance CRM — Application

Custom CRM for Enamorado Insurance Company. **Next.js 14 (App Router) + Supabase + Tailwind.**  
Production: **crm.enamoradoinsurancecompany.com**

> **HIPAA posture:** Path B (no PHI stored). See `../04-Risk-Register.md` and `../templates/Discovery-Document-Template.md` § 4.

## Design source (v0)

Iterate CRM **UI** in [v0.dev](https://v0.dev) and push to GitHub repo **[JCDATASCIENTIST/enamorado-insurance-crm](https://github.com/JCDATASCIENTIST/enamorado-insurance-crm)** (create on first connect).

| Doc | Purpose |
|-----|---------|
| [design/V0-PROMPT.md](./design/V0-PROMPT.md) | Paste into v0 to generate login, shell, dashboard, pipeline |
| [design/V0-SETUP.md](./design/V0-SETUP.md) | Connect GitHub, Vercel, merge into this monorepo |

After you connect v0 → Git, add your project link here (like the website README):

`Continue in v0 → (paste link from v0 project menu)`

Merge v0 updates into this `app/` folder; keep `lib/`, `supabase/`, and API routes from the monorepo.

---

## What's included

### Workstream A (core CRM)

- Authentication (email/password, invitation-only signup via admin)
- Roles: `admin`, `agent`, `read_only` — route guards + RLS
- Clients & prospects: list, filters (incl. Medicaid level), detail, create/edit, CSV export, print views
- Notes: add (agents); edit/delete (admins); author displayed
- Pipeline kanban with drag-and-drop and stage history
- Follow-ups daily view
- Birthday report with month picker
- Admin: user invite, role/active toggles, audit log UI

### Workstream B

- Renewals dashboard (overdue / due / upcoming)
- Commissions tracking
- Enrollment activity log
- Zapier webhooks (Path B payloads) + daily cron for reminders

### Database

Migrations in `supabase/migrations/`:

1. `0001_initial_schema.sql`
2. `0002_rls_policies.sql`
3. `0003_audit_log.sql`
4. `0004_workstream_b.sql`

---

## Quick start

```bash
cd app
npm install
cp .env.local.example .env.local
# Fill Supabase URL, anon key, service role, project ref
```

Apply migrations via Supabase SQL Editor (in order) or `supabase db push`.

Create first admin in Supabase Dashboard → Authentication, then:

```sql
update public.profiles
set role = 'admin', full_name = 'Your Name'
where email = 'you@example.com';
```

```bash
npm run dev
```

Open http://localhost:3000

---

## Scripts

| Command | Purpose |
|---------|---------|
| `npm run dev` | Development server |
| `npm run build` | Production build |
| `npm run typecheck` | TypeScript check |
| `npm run db:types` | Regenerate `types/database.types.ts` from Supabase |

---

## Deploy

See [../docs/deployment-staging.md](../docs/deployment-staging.md) and [vercel.json](./vercel.json) for cron setup.

---

## Docs

| Path | Purpose |
|------|---------|
| `../user-guides/` | Admin and agent guides |
| `../workstream-b/` | Workstream B specs |
| `../handoff/` | Launch and UAT checklists |
| `../docs/rls-smoke-tests.md` | RLS test matrix |

---

## Directory map

```
app/
├── app/(app)/          # Authenticated routes
│   ├── dashboard/
│   ├── contacts/       # List, detail, edit, print
│   ├── pipeline/       # Kanban
│   ├── follow-ups/
│   ├── birthdays/
│   ├── renewals/
│   ├── commissions/
│   ├── enrollments/
│   └── admin/          # users, audit
├── app/api/            # CSV export, cron
├── components/
├── lib/                # auth, contacts, admin, zapier, …
└── supabase/migrations/
```
