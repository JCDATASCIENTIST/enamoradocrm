# Project status — Enamorado Insurance CRM

**Last updated:** 2026-06-14

## Done

- Synced full project tree to GitHub repo `JCDATASCIENTIST/enamoradocrm`
- Root README, `.gitignore`, repo layout with `app/` as Vercel root
- Happy Capy prompt pack: `happycapy/MASTER-PROMPT.md`, sessions, automations
- Workflow runbooks: `workflows/*.md` (5 flows + COVERAGE-GAP)
- Extended `workstream-b/Zapier-Automation-List.md` with Zap recipes and tests
- Launch checklists: Agent Monday Morning, Admin Onboarding
- Fixed `assigned_to_name` in new prospect Zapier payload (`app/lib/contacts/actions.ts`)

## In progress

- None

## Build verification (2026-06-14)

- `npm run typecheck` — pass
- `npm run build` — pass

## Blocked

- None

## GitHub

- Initial commit pushed to `main` at https://github.com/JCDATASCIENTIST/enamoradocrm
- Set Vercel **Root Directory** to `app/` when linking the repo

## Path B audit (integrations)

- `notifyNewProspect` now includes `assigned_to_name` from profiles lookup
- No PHI fields added to webhook payloads
- Cron route unchanged; payloads match `payload.ts` types

## Next 3 actions

1. Push `main` to GitHub; set Vercel root directory to `app/`
2. Run production Zapier test procedures from Zapier-Automation-List.md
3. Client UAT sign-off on staging

## Questions for Joel

- Confirm agency timezone for cron adjustment (currently 13:00 UTC)
- Confirm Zapier destination (email vs Slack) for each of the 3 Zaps
- Any carrier/enrollment tool for future change-order scope?
