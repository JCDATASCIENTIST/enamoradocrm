# Backup and restore SOP

## Supabase backups

1. Confirm **Point-in-Time Recovery (PITR)** is enabled on the production Supabase project (Pro plan or add-on).
2. Weekly: note the latest backup timestamp in the project runbook.
3. Quarterly: perform a **test restore** to a throwaway branch project:
   - Create a new Supabase branch or project.
   - Restore from backup per [Supabase docs](https://supabase.com/docs/guides/platform/backups).
   - Run migrations if needed; verify login and sample contact count.

## Application code

- Source of truth: GitHub `main` branch.
- Vercel retains deployment history for rollback.

## Restore decision

| Scenario | Action |
|----------|--------|
| Bad data in last hour | PITR to timestamp before incident |
| Deleted single contact | Prefer undelete from audit_log + manual re-entry; admin delete is rare |
| Full region outage | Wait for Supabase status; communicate to client |

## Contacts after restore

Re-run `npm run db:types` if schema changed. Verify RLS policies match migrations 0001–0004.
