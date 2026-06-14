# Launch day runbook

Hour-by-hour sequence for production launch of Enamorado Insurance CRM.

**Target URL:** `https://crm.enamoradoinsurancefl.com`  
**Deploy root:** `app/` on Vercel  
**Owner:** Joel Castillo (consultant) + Enamorado decision-maker

## Pre-launch (T-24 hours)

Confirm all items in [handoff/Launch-Checklist.md](../handoff/Launch-Checklist.md):

- [ ] Migrations 0001–0004 on production Supabase
- [ ] RLS smoke tests passed ([docs/rls-smoke-tests.md](../docs/rls-smoke-tests.md))
- [ ] UAT signed ([handoff/UAT-Sign-Off-Checklist.md](../handoff/UAT-Sign-Off-Checklist.md))
- [ ] Production env vars match staging (no secrets in git)
- [ ] DNS CNAME to Vercel; SSL active
- [ ] `CRON_SECRET` set; cron endpoint tested once
- [ ] Zapier Zaps published (optional) — Path B review complete

## Launch day timeline

| Time | Action | Owner |
|------|--------|-------|
| T-0 | Merge `main`; trigger Vercel production deploy | Joel |
| T+15 min | Verify deploy green in Vercel dashboard | Joel |
| T+20 min | Smoke: admin login / logout | Joel + client |
| T+25 min | Smoke: create test contact → delete (admin) | Joel |
| T+30 min | Smoke: agent login; verify RLS (cannot access admin) | Client agent |
| T+35 min | Smoke: pipeline drag one card | Client agent |
| T+40 min | Trigger cron manually (Bearer `CRON_SECRET`); confirm 200 JSON | Joel |
| T+45 min | Confirm Zapier received test hook (if configured) | Joel |
| T+60 min | Announce go-live to staff; share [Agent-Monday-Morning-Checklist.md](../handoff/Agent-Monday-Morning-Checklist.md) | Client admin |
| T+0 to T+4h | On-call window for P1 bugs | Joel |
| T+4h | Handoff packet delivered (guides, credentials index, this runbook) | Joel |

## Smoke test script

```bash
# Cron test (replace URL and secret)
curl -s -H "Authorization: Bearer YOUR_CRON_SECRET" \
  "https://crm.enamoradoinsurancefl.com/api/cron/zapier-reminders"
# Expect: {"follow_ups":N,"renewals":M}
```

## Rollback criteria

Rollback production deploy if:

- Any user role can access data they should not (RLS failure)
- Login broken for all users
- Data loss on contact create/update

**Rollback steps:**

1. Vercel → Deployments → promote previous production deployment
2. Notify client; pause Zapier Zaps
3. Root-cause in staging before re-launch

## Post-launch (first 30 days)

- Monitor Vercel errors and Supabase logs weekly
- Triage bugs via agreed channel ([templates/Bug-Report-Template.md](../templates/Bug-Report-Template.md) when published)
- Schedule backup restore test per [sops/Backup-and-Restore-SOP.md](../sops/Backup-and-Restore-SOP.md)

## Communication template (go-live email)

> Subject: Enamorado CRM is live  
>  
> The CRM is available at crm.enamoradoinsurancefl.com.  
> Use your invited email and password to sign in.  
> Start with Follow-ups and Pipeline each morning (see attached checklist).  
> Questions during the first 4 hours: [on-call contact].

## Related docs

- [Launch-Checklist.md](../handoff/Launch-Checklist.md)
- [Architecture-Diagram.md](../handoff/Architecture-Diagram.md)
- [Renewal-Reminder-Flow.md](./Renewal-Reminder-Flow.md)
