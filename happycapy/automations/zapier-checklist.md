# Automation: Zapier readiness check

**Schedule:** Wednesdays, 10:00 AM  
**Project:** Enamorado Insurance CRM  
**Name:** Zapier readiness check

## Prompt

```
Read workstream-b/Zapier-Automation-List.md and app/lib/zapier/*.
Verify payload shapes match code in app/lib/contacts/actions.ts and app/app/api/cron/zapier-reminders/route.ts.
Produce a test checklist for Joel:
- new prospect webhook test steps
- cron reminder test with CRON_SECRET (GET /api/cron/zapier-reminders)
- Path B forbidden-field audit (no DOB, phone, email, address, member IDs in payloads)
Save to outputs/zapier-test-checklist.md
```
