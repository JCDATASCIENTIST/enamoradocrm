# Production launch checklist

## Pre-launch (Week 17–18)

- [ ] All migrations 0001–0004 applied on production Supabase
- [ ] RLS smoke tests passed ([docs/rls-smoke-tests.md](../docs/rls-smoke-tests.md))
- [ ] `CRON_SECRET` set; cron tested once
- [ ] Zapier webhooks configured (optional) with Path B field review
- [ ] UAT sign-off ([UAT-Sign-Off-Checklist.md](./UAT-Sign-Off-Checklist.md))
- [ ] Admin + agent training recordings delivered

## DNS and Vercel

- [ ] `crm.enamoradoinsurancecompany.com` CNAME to Vercel
- [ ] Production env vars match staging
- [ ] SSL certificate active

## Security

- [ ] Rotate Supabase service role if exposed during testing
- [ ] Confirm no secrets in git history
- [ ] Path B data boundary signed in Discovery Document

## Launch day

- [ ] Production deploy from `main`
- [ ] Smoke test login and one contact CRUD
- [ ] 4-hour on-call window documented
- [ ] Handoff packet delivered to client

## Post-launch (30 days)

- [ ] Monitor Vercel and Supabase dashboards
- [ ] Triage bugs via agreed channel
- [ ] Backup restore test scheduled per [sops/Backup-and-Restore-SOP.md](../sops/Backup-and-Restore-SOP.md)
