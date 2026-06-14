# Admin onboarding checklist

One-page setup and weekly routine for Enamorado CRM administrators.

## Initial setup (once)

- [ ] Confirm first admin profile in Supabase (`role = admin`)
- [ ] Invite all agents via **Users** (email, name, role, temp password ≥ 8 chars)
- [ ] Invite read-only users if needed (reporting only)
- [ ] Verify Vercel env vars: Supabase keys, `CRON_SECRET`, optional `ZAPIER_*` webhooks
- [ ] Apply migrations 0001–0004 on production Supabase
- [ ] Run RLS smoke tests ([docs/rls-smoke-tests.md](../docs/rls-smoke-tests.md))
- [ ] Configure Zapier Zaps ([workstream-b/Zapier-Automation-List.md](../workstream-b/Zapier-Automation-List.md))
- [ ] Test cron endpoint once with Bearer token
- [ ] Complete UAT ([UAT-Sign-Off-Checklist.md](./UAT-Sign-Off-Checklist.md))
- [ ] Share [Agent-Monday-Morning-Checklist.md](./Agent-Monday-Morning-Checklist.md) with agents

## Weekly admin routine

- [ ] **Dashboard** — overdue renewals, pending follow-ups, commission totals
- [ ] **Users** — deactivate departed staff; never deactivate yourself
- [ ] **Audit log** — spot-check unusual deletes or bulk edits
- [ ] **Renewals** — overdue tab; reassign or escalate stuck clients
- [ ] Review Zapier task history if reminders reported missing

## User management

| Task | Steps |
|------|-------|
| Invite | Users → Invite → email, name, role, password |
| Change role | Users table → role dropdown |
| Deactivate | Users table → active toggle off |
| Reset password | Supabase Dashboard → Authentication (or re-invite flow) |

## Data integrity

- Admins may edit/delete any note and delete contacts (permanent)
- Agents add notes only; cannot edit others' notes
- CSV import: use template from `/contacts/import`; review Path B fields

## Launch and support

- [Launch-Checklist.md](./Launch-Checklist.md)
- [Launch-Day-Runbook.md](../workflows/Launch-Day-Runbook.md)
- [Admin-User-Guide.md](../user-guides/Admin-User-Guide.md)

## HIPAA Path B reminder

Do not enter SSNs or full member IDs. Zapier automations must never receive phone, email, DOB, or address — see [HIPAA-Data-Handling-Flow.md](../workflows/HIPAA-Data-Handling-Flow.md).
