# Enamorado Insurance — Marketing Website

Public marketing site for **enamoradoinsurancefl.com**. The CRM lives separately at **crm.enamoradoinsurancefl.com** (`../app/`).

## Stack

Next.js 14 · Tailwind CSS · Vercel

## Local development

```bash
cd website
npm install
npm run dev
```

Runs on http://localhost:3001 (CRM uses 3000).

## Before launch

Edit contact details in [`lib/site.ts`](lib/site.ts):

- Phone, email, office address
- Confirm `url` and `crmUrl`

### Contact form (`/en/contact`, `/es/contact`)

The form uses a Next.js Server Action (`app/[locale]/contact/contact-form.tsx` + `lib/contact-action.ts`). It validates input, rejects obvious SSN / full-MBI / full-Medicaid-ID patterns, then delivers the lead by **Brevo email** (recommended) or an optional Zapier webhook fallback.

**Launch setup (Brevo free):**

1. Sign up at [brevo.com](https://www.brevo.com) (free tier).
2. **Senders & IP** → verify `hello@enamoradoinsurancecompany.com`.
3. **SMTP & API** → create an API key.
4. Add to Vercel **website** project → Settings → Environment Variables (Production):

```env
BREVO_API_KEY=xkeysib-...
CONTACT_NOTIFY_EMAIL=hello@enamoradoinsurancecompany.com
BREVO_SENDER_EMAIL=hello@enamoradoinsurancecompany.com
BREVO_SENDER_NAME=Enamorado Insurance
```

5. Redeploy the website, then submit a test on `/en/contact`.

If `BREVO_API_KEY` is unset, the action falls back to `WEBSITE_CONTACT_WEBHOOK` (Zapier). If neither is set, the form still returns success locally but **no email is sent**.

See [`.env.local.example`](.env.local.example) for all variables.

## Deploy on Vercel

Use a **separate Vercel project** from the CRM:

| Project | Root directory | Domain |
|---------|----------------|--------|
| Enamorado Website | `website` | `enamoradoinsurancefl.com`, `www` |
| Enamorado CRM | `app` | `crm.enamoradoinsurancefl.com` |

See [../docs/deployment-domains.md](../docs/deployment-domains.md) for SiteGround DNS records.
