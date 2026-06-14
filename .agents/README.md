# `.agents/` — project agent configuration

This folder contains skills and reference material for AI coding agents (Claude Code, Cursor, Happy Capy, etc.).

## Structure

```
.agents/
└── skills/
    ├── nextjs-app-router-patterns/
    ├── nextjs-supabase-auth/
    ├── supabase-postgres-best-practices/
    ├── tailwind-design-system/
    ├── kpi-dashboard-design/
    └── mcp-builder/
```

Each skill directory:

- `SKILL.md` — when to use the skill and core patterns
- `references/` or `reference/` — deeper docs (optional)

## Project instructions

| File | Purpose |
|------|---------|
| [`../CLAUDE.md`](../CLAUDE.md) | Main project context and rules |
| [`../AGENTS.md`](../AGENTS.md) | Skill index and loading guide |
| [`../STATUS.md`](../STATUS.md) | Current status — update after agent sessions |
| [`../happycapy/MASTER-PROMPT.md`](../happycapy/MASTER-PROMPT.md) | Happy Capy entry prompt |

## Adding skills

Drop new skill folders under `skills/<name>/` with a `SKILL.md` frontmatter block (`name`, `description`). Register them in `AGENTS.md`.
