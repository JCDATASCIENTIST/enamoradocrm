# v0 + GitHub setup — Enamorado Insurance CRM

Use this workflow to design the CRM in v0, push to GitHub, and merge into the monorepo (`enamoradocrm/app/`).

Same pattern as the marketing site (`enamorado-insurance-website` → `enamoradocrm/website/`).

---

## 1. Start a v0 project

1. Open [v0.dev](https://v0.dev) → **New chat** (or New project).
2. Paste the full prompt from [V0-PROMPT.md](./V0-PROMPT.md).
3. Iterate until login, sidebar, dashboard, and pipeline look right.

---

## 2. Connect GitHub (one-time)

1. In the v0 chat sidebar → **Git** → **Connect**.
2. Git scope: **`JCDATASCIENTIST`**
3. Repository name: **`enamorado-insurance-crm`**
4. v0 creates a private repo and a branch like `v0/main-xxxxxxxx`.
5. Each design change auto-commits to that branch.

**Repo URL (after connect):**  
`https://github.com/JCDATASCIENTIST/enamorado-insurance-crm`

When connected, add the v0 project link to `app/README.md` under **Design source (v0)** (same as the website README).

---

## 3. Open a PR and merge to `main`

1. In v0 → **Publish** → **Open PR** → merge to `main` on `enamorado-insurance-crm`.
2. Or merge the PR on GitHub.

---

## 4. Link Vercel (optional preview deploys)

| Setting | Value |
|---------|--------|
| Vercel project | `enamorado-insurance-crm` |
| Git repo | `JCDATASCIENTIST/enamorado-insurance-crm` **or** monorepo with root `app` |
| Root directory | `.` (standalone v0 repo) or `app` (monorepo) |
| Domain | `crm.enamoradoinsurancecompany.com` |

Env vars (Production): see `app/.env.local.example` — Supabase URL/keys, `NEXT_PUBLIC_APP_URL`, `CRON_SECRET`, etc.

---

## 5. Merge v0 design into monorepo

When v0 pushes updates you want in production code:

```bash
cd /path/to/enamoradocrm

# Clone latest v0 repo (or git pull if you keep a local clone)
rm -rf .tmp-v0-crm
git clone --depth 1 https://github.com/JCDATASCIENTIST/enamorado-insurance-crm.git .tmp-v0-crm

# Sync UI-facing files into app/ (adjust list as needed)
rsync -a --delete \
  --exclude '.git' \
  --exclude 'node_modules' \
  --exclude '.next' \
  --exclude '.vercel' \
  --exclude '.env*' \
  --exclude 'supabase' \
  --exclude 'lib' \
  --exclude 'types' \
  --exclude 'app/api' \
  .tmp-v0-crm/ app/

# Always keep monorepo secrets template
# (rsync excludes .env* so app/.env.local.example stays)

rm -rf .tmp-v0-crm

cd app && npm run typecheck && npm run build
```

Then commit from monorepo root:

```bash
git add app/
git commit -m "Merge v0 CRM design from enamorado-insurance-crm."
git push origin main
```

### Files v0 usually owns (safe to sync)

- `app/globals.css`, `tailwind.config.ts`
- `app/(app)/layout.tsx` — **re-apply** `requireProfile()`, nav items, and admin links after merge
- `app/(app)/_components/mobile-nav.tsx`
- `app/login/*`
- Page layouts and `_components/*` — **re-apply** Supabase queries and Server Actions after merge
- `components/ui/*`

### Files to never blind-overwrite from v0

- `lib/**` (auth, contacts, Supabase, Zapier)
- `supabase/migrations/**`
- `app/api/**`
- `types/database.types.ts`
- `middleware.ts` (auth redirects)

If v0 changes routing, diff carefully before merging.

---

## 6. Ask Cursor to merge

You can say:

> “Merge the latest v0 CRM design from `enamorado-insurance-crm` into `app/` and fix any broken Server Actions.”

---

## Troubleshooting

| Issue | Fix |
|-------|-----|
| New v0 chat not pushing to Git | Sidebar **Git → Connect** again (forks don’t inherit Git) |
| Build fails after merge | v0 used mock data — restore `lib/` imports and server queries in page files |
| Two sources of truth | **Design:** v0 repo. **Production logic:** monorepo `app/`. Merge regularly. |
