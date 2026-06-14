# Automation: Daily CRM health

**Schedule:** Weekdays, 8:00 AM (agency local time)  
**Project:** Enamorado Insurance CRM  
**Name:** Daily CRM health

## Prompt

```
Review STATUS.md and yesterday's git diff in this Project.
Summarize: build status, open blockers, Path B compliance, next priority.
Run cd app && npm run typecheck && npm run build if not run recently.
If build is broken, diagnose and propose a minimal fix PR.
Save summary to outputs/daily-health-YYYY-MM-DD.md
```
