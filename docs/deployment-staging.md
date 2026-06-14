# Staging deployment (Vercel + Supabase)

## Prerequisites

- GitHub repo with the `app/` folder as project root (or set Root Directory to `app` in Vercel).
- Supabase project with migrations `0001`–`0004` applied.
- First admin user created (Dashboard invite + SQL role update).

## Vercel setup

1. Import the repository in [Vercel](https://vercel.com).
2. **Root Directory:** `app` (if the repo includes the parent `Enamorado Insurance CRM` folder).
3. **Framework:** Next.js (auto-detected).
4. Add environment variables (Production and Preview):

| Variable | Notes |
|----------|--------|
| `NEXT_PUBLIC_SUPABASE_URL` | Supabase API URL |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Anon public key |
| `SUPABASE_SERVICE_ROLE_KEY` | Server-only — user invite |
| `SUPABASE_PROJECT_REF` | For `npm run db:types` locally |
| `NEXT_PUBLIC_APP_URL` | Staging URL, e.g. `https://crm-staging.vercel.app` |
| `CRON_SECRET` | Random string; matches `Authorization: Bearer` on cron route |
| `ZAPIER_*_WEBHOOK` | Optional Zapier catch-hook URLs |

5. Deploy. Verify `/login` and sign in as admin.

## Post-deploy checks

- [ ] Login / logout
- [ ] Contacts list, create, edit
- [ ] Pipeline drag-and-drop (agent + admin)
- [ ] CSV export shows assignee **names**
- [ ] Admin: invite user, audit log, delete contact
- [ ] Commissions / renewals / enrollments (after migration 0004)
- [ ] Cron: `curl -H "Authorization: Bearer $CRON_SECRET" https://YOUR-APP/api/cron/zapier-reminders`

## RLS smoke tests

See [rls-smoke-tests.md](./rls-smoke-tests.md).
