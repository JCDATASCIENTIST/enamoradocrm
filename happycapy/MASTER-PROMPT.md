This repo is **Enamorado Insurance Company** — Medicare/Medicaid agency software. Read **`CLAUDE.md`** at the repo root first; it has the full project map, compliance rules, and commands.

## Quick orientation

- **Website** (`website/`) → `enamoradoinsurancefl.com` — marketing, contact form
- **CRM** (`app/`) → `crm.enamoradoinsurancefl.com` — agents, pipeline, renewals, commissions
- **Agent skills** → `.agents/skills/` (see `AGENTS.md` for when to load each)
- **Status log** → `STATUS.md` (update when you finish)

## Your job

**Audit this entire repo, then build it better.**

1. Read `CLAUDE.md`, `STATUS.md`, and `01-Project-Scope.md`
2. Run `npm run typecheck && npm run build` in both `website/` and `app/`
3. Audit: gaps, placeholders, UX, docs drift, Path B / HIPAA issues
4. Use skills from `.agents/skills/` when relevant (Next.js, Supabase auth, Postgres RLS, Tailwind UI, dashboard design)
5. Implement highest-impact fixes — minimal diffs, match existing Server Action patterns
6. Don’t expand scope (carrier APIs, Stripe, Path A PHI, MCP) without approval

Start with a short audit (critical / should fix / nice to have), then do the work. Update `STATUS.md` when done.

Ask me only for credentials or real contact info if blocked.
