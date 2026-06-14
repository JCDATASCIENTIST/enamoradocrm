In this session, own P1 + P2 only. Write and maintain workflows/*.md and workstream-b/Zapier-Automation-List.md with complete Zap recipes. No schema changes.

Context: Enamorado Insurance CRM — Medicare/Medicaid agency. Zapier is outbound-only; Path B means no DOB, phone, email, address, or member IDs in webhook payloads.

Start by:
1. Read existing workflows/ and workstream-b/Zapier-Automation-List.md
2. Ensure each of the 3 webhook events has: Zap name, Catch Hook setup, sample JSON, field mapping, test steps
3. Ensure each workflow doc has a mermaid diagram and step-by-step runbook for agency staff

Reference app/lib/zapier/payload.ts and app/app/api/cron/zapier-reminders/route.ts for accuracy.
