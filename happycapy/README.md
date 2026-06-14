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
| [`../CLAUDE.md`](../CLAUDE.md) | Full project context for any AI agent |
| [`../AGENTS.md`](../AGENTS.md) | Index of skills in `.agents/skills/` |
| [`MASTER-PROMPT.md`](MASTER-PROMPT.md) | Short Happy Capy entry prompt (points to CLAUDE.md) |
| [`sessions/`](sessions/) | Optional parallel session openers |
| [`automations/`](automations/) | Optional scheduled automation prompts |

## Workflow

1. Clone repo into Happy Capy Project
2. Paste **MASTER-PROMPT.md** (or point the agent at **CLAUDE.md** for full context)
3. Agent loads skills from `.agents/skills/` as needed (see **AGENTS.md**)
4. Optional: parallel sessions from **sessions/**; automations from **automations/**

After each session, update [`STATUS.md`](../STATUS.md).
