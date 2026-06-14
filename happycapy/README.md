# Happy Capy.ai — Enamorado Insurance CRM

Use this folder to configure a Happy Capy **Project** named `Enamorado Insurance CRM`.

## One-time setup

1. Create a new Happy Capy Project with that name.
2. Clone this repo into the Project workspace (or connect GitHub after push).
3. Set Vercel **Root Directory** to `app/` when linking the repo.
4. Install Skills (search in Happy Capy): Next.js, Supabase, Vercel deploy, Zapier webhook, GitHub PR workflow.
5. Optional: enable **Agent Teams** (Settings → Experimental) for parallel sessions.
6. Never paste secrets into prompts — reference env var names only.

## Files in this folder

| File | Use |
|------|-----|
| [`MASTER-PROMPT.md`](MASTER-PROMPT.md) | Paste into the first session |
| [`sessions/`](sessions/) | Parallel session openers (Dev, Workflows, Launch, QA) |
| [`automations/`](automations/) | Scheduled automation prompts for Happy Capy Automations panel |

## Workflow

1. Open Project → new session → paste **MASTER-PROMPT.md**
2. Open + sessions with prompts from **sessions/**
3. Create Automations from **automations/** (Automations → Create Automation)

After each session, the agent should update [`STATUS.md`](../STATUS.md) at repo root.
