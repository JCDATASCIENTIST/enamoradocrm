# Brevo setup meeting — Joel + Dalkys

Use this checklist during your call. The website contact form is **already built**; it will start emailing leads once Brevo is connected in Vercel.

**Until this is done:** form submissions show “Thanks — we’ll be in touch” but **no email is sent** (unless a Zapier webhook is added separately).

---

## Before the meeting (Joel — 5 min)

- [ ] Open Vercel: [enamorado-insurance-website](https://vercel.com/joelcastillomarketingexpert-7985s-projects/enamorado-insurance-website) → **Settings → Environment Variables**
- [ ] Have this doc open on screen share
- [ ] Test page ready: https://enamoradoinsurancecompany.com/en/contact

---

## Part 1 — Create Brevo account (Dalkys’s Gmail)

1. Go to **[brevo.com](https://www.brevo.com)** → **Sign up free**
2. Sign up with **Dalkys’s Gmail** (the inbox she checks daily)
3. Complete Brevo onboarding (company name: **Enamorado Insurance Company**)

**Why her Gmail:** She owns the account long-term; Joel can be added as a team member later in Brevo if needed.

---

## Part 2 — Verify sender email

Leads will come **from** the agency address so replies look professional.

1. In Brevo: **Settings** (gear) → **Senders, domains & dedicated IPs** → **Senders**
2. Click **Add a sender**
3. Enter:
   - **Name:** `Dalkys Enamorado` or `Enamorado Insurance`
   - **Email:** `hello@enamoradoinsurancecompany.com`
4. Brevo sends a verification email to that address
5. **Open that inbox** (SiteGround email or wherever `hello@` is hosted) and click **Verify**

> If `hello@enamoradoinsurancecompany.com` is not set up yet, use Dalkys’s Gmail temporarily as sender for testing — then switch to `hello@` once agency email is live.

---

## Part 3 — Create API key

1. Brevo → **Settings** → **SMTP & API** → **API keys**
2. **Generate a new API key** → name it `Enamorado Website`
3. Copy the key (starts with `xkeysib-...`) — **shown once only**
4. Paste into a secure note (1Password, etc.) — do not email the key in plain text

---

## Part 4 — Add to Vercel (Joel)

Vercel project: **enamorado-insurance-website** → **Settings → Environment Variables** → **Production**

| Name | Value |
|------|--------|
| `BREVO_API_KEY` | `xkeysib-...` (paste from Part 3) |
| `CONTACT_NOTIFY_EMAIL` | Email where Dalkys wants leads (e.g. her Gmail or `hello@enamoradoinsurancecompany.com`) |
| `BREVO_SENDER_EMAIL` | Verified sender from Part 2 |
| `BREVO_SENDER_NAME` | `Enamorado Insurance` |

Click **Save**, then **Redeploy** the latest production deployment (Deployments → ⋮ → Redeploy).

---

## Part 5 — Test together

1. Open https://enamoradoinsurancecompany.com/en/contact
2. Submit a test:
   - Name: `Test Lead`
   - Phone: `(561) 555-0100`
   - Email: Joel’s email (so Reply-To works)
   - Message: `Brevo test — please ignore`
3. Check **CONTACT_NOTIFY_EMAIL** inbox within 1–2 minutes
4. Expected subject: **`Website lead: Test Lead (EN)`**
5. Repeat on `/es/contact` to confirm Spanish locale shows `(ES)` in subject

**If no email:**

- Brevo → **Transactional** → **Logs** — check for bounces or “sender not verified”
- Vercel → **Deployments** → latest → **Functions** logs for errors
- Confirm all four env vars are set on **Production** and site was redeployed after adding them

---

## Part 6 — Daily workflow for Dalkys

When a lead email arrives:

1. Read name, phone, email, message
2. **Reply** directly (Reply-To is the visitor if they left email)
3. Log the person in CRM: **Clients & Prospects → + New contact** (type: prospect)

---

## Free tier limits (good for launch)

| Item | Brevo free |
|------|------------|
| Transactional emails (form alerts) | 300/day |
| Cost | $0 |

Newsletter / marketing lists can be added later on the same Brevo account.

---

## Optional later (not needed for launch)

- Add Joel as Brevo team member
- Switch sender from Gmail to `hello@enamoradoinsurancecompany.com` when agency email is ready
- Brevo marketing list + website newsletter opt-in (English/Spanish)

---

## Reference

- Code: `website/lib/brevo.ts`, `website/lib/contact-action.ts`
- Env template: `website/.env.local.example`
- Full deploy notes: `website/README.md`
