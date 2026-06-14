# Enamorado Brand Override (maps saas-ui-master → production)

The skill generated a cyan palette; **production uses navy + amber** (v0 + Medicare trust). Apply all saas-ui-master **UX rules** with these colors.

## 4-Layer Color System

| Layer | Token | Enamorado value | Usage |
|-------|--------|-----------------|--------|
| L1 Foundation | `surface` | `#f7f9fc` | App/page background (not pure white) |
| L1 Surface | `white` | `#ffffff` | Cards, modals, inputs |
| L2 Brand | `brand-700` | `#163d6b` | Primary nav, headings, links |
| L2 Brand dark | `brand-900` | `#0b2038` | Hero, footer, sidebar header |
| L2 CTA | `accent-600` | `#b45309` | Primary buttons, call bar, step highlights |
| L3 Success | `emerald-600` | `#059669` | Confirmations, completed pipeline |
| L3 Warning | `amber-500` | `#f59e0b` | Renewals due, pending items |
| L3 Danger | `red-600` | `#dc2626` | Errors, delete actions |
| L4 Text | `slate-900` | `#0f172a` | Body primary (4.5:1+ on white) |

## Typography

| App | Headings | Body |
|-----|----------|------|
| Website | Fraunces | DM Sans |
| CRM | Figtree | Noto Sans |

Base body: **17px** (`1.0625rem`) minimum for 65+ readers.

## Mandatory UX (from saas-ui-master)

- Touch targets: **44×44px** minimum (`min-h-[44px]`)
- Focus rings: **3–4px** (`ring-2` + offset or `ring-4`)
- Skip link on public site
- `cursor-pointer` on all clickable cards/links
- Transitions: **150–300ms** (`transition-colors duration-200`)
- `prefers-reduced-motion`: disable scroll-behavior smooth
- `touch-action: manipulation` on interactive controls
- No emoji icons; no layout-shifting hover scale on cards
