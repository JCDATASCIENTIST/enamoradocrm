# Kickoff Meeting — Deck Outline & Run-of-Show

**Meeting:** Enamorado Insurance CRM — Project Kickoff
**Length:** 60 minutes
**Format:** Live (in-person or video) with screen-share. Recorded.
**Attendees:** Joel (Provider); Enamorado Decision-Maker + 1–2 SMEs (admin lead, lead agent).
**Output:** Aligned start, named Decision-Maker, calendar holds for sprint demos, list of homework due by end of Week 1.

> This is an outline, not finished slides. Use it to build a deck in Google Slides, Keynote, PowerPoint, or whatever you prefer. Each slide has a title, a bullet of what's on it, and speaker notes for what to actually say. Keep total slides ≤ 15 — kickoff meetings die when they turn into a lecture.

---

## Run-of-Show Timing

| Minutes | Section | Slides |
|---------|---------|--------|
| 0–5 | Welcome & purpose | 1–2 |
| 5–15 | What we're building | 3–5 |
| 15–25 | How we'll work together | 6–8 |
| 25–40 | The first two weeks (Phase 0) | 9–11 |
| 40–50 | What we need from you this week | 12–13 |
| 50–60 | Questions, calendar holds, next steps | 14–15 |

---

## Slide 1 — Title

**On the slide:** "Enamorado Insurance CRM — Project Kickoff" • Joel Castillo • [Date].

**Speaker notes:** Welcome everyone, thank them for approving the scope, set the tone — this meeting is short, decisive, and we leave with a plan. Confirm the meeting is recorded and the recording will be shared.

---

## Slide 2 — What this meeting is for

**On the slide:** Three outcomes we leave with:
- A named Decision-Maker.
- A locked-in schedule for the next 18 weeks.
- A short homework list for week 1.

**Speaker notes:** "I'm not going to walk you through the whole plan today — you've read it. I want us to leave here aligned on three things only, and I want the rest of the time for your questions."

---

## Slide 3 — The project in one sentence

**On the slide:** "One CRM, built in two coordinated workstreams, delivered in 18 weeks, deployed to crm.enamoradoinsurancefl.com."

**Speaker notes:** Reframe the scope at the highest level. Don't read it — say it conversationally. This is the line you want them to remember when their cousin asks what they're paying for.

---

## Slide 4 — Workstream A vs Workstream B

**On the slide:** Two columns.

**Workstream A — Weeks 1–12:** Clients & prospects, notes & follow-ups, filtering & exports, sales pipeline.

**Workstream B — Weeks 13–18:** Commissions, renewals, enrollment, automations.

**Speaker notes:** Emphasize that Workstream A produces something *you can use* by end of Week 10. Workstream B is built on top of a system you're already getting value from. We don't make you wait 18 weeks to see results.

---

## Slide 5 — The tech stack (one line each)

**On the slide:** Vercel (the app) • Supabase (the database & login) • Zapier (the automations) • GitHub (the code) • SiteGround (the domain).

**Speaker notes:** Skip the technical depth. The message is "boring, proven, and you own all of it at the end."

---

## Slide 6 — How we'll communicate

**On the slide:** Weekly written update every Friday • Sprint demo every 2 weeks (recorded) • One-business-day email response • Scope changes always in writing.

**Speaker notes:** Set expectations clearly. "You will always know what's happening on Friday. You will see working software every two weeks. If you want to add something to scope, we write it down — that protects both of us."

---

## Slide 7 — Payment milestones

**On the slide:** The five payment milestones at a glance with the percentage and the trigger event.

| # | When | % |
|---|------|---|
| 1 | Discovery sign-off (W2) | 20% |
| 2 | Mid-build acceptance (W6) | 20% |
| 3 | Workstream A MVP (W10) | 20% |
| 4 | Workstream B complete (W17) | 25% |
| 5 | Production launch (W18) | 15% |

**Speaker notes:** "You only pay against work that's delivered and accepted. I don't bill ahead. You don't pay for something you can't see."

---

## Slide 8 — What's out of scope

**On the slide:** Six examples from the scope-exclusions list: mobile app, SMS infrastructure, multi-agency support, AI features, e-signatures, call recording.

**Speaker notes:** This is the most important slide for protecting the project. "These are good ideas that come up on every CRM project. They're not in this engagement. If we want any of them later, we write a change order with a price and a timeline. Same process I'd use for any client."

---

## Slide 9 — Phase 0 (next 2 weeks)

**On the slide:** Week 1 = Discovery work. Week 2 = Sign-off + environment provisioning.

**Speaker notes:** "Most of the first two weeks isn't code — it's nailing down decisions that affect everything downstream. The biggest one is HIPAA posture."

---

## Slide 10 — The HIPAA fork

**On the slide:** Two boxes.

**Box A — PHI in scope:** Sign Supabase BAA. Enable HIPAA project config. Enforce SSL. Audit logging from day one.

**Box B — No PHI:** Define data boundary (no SSNs, no full Medicare IDs). Standard Supabase project. Faster, cheaper, less constrained.

**Speaker notes:** This is the single most important decision in the project. It affects the database design, what we can put in Zapier, even how we name fields. We need a real answer by end of Week 1.

---

## Slide 11 — Phase 0 deliverable

**On the slide:** The signed **Discovery Document** — locks the data dictionary, role matrix, HIPAA decision, integration scope, and CSV import spec.

**Speaker notes:** "When you sign the Discovery Document at the end of Week 2, you've locked in the foundation. Milestone 1 invoice goes out that day. Phase 1 build starts Monday of Week 3."

---

## Slide 12 — Homework due by Friday of Week 1

**On the slide:**
- Confirm Decision-Maker (one named person).
- Brand assets: logo + color hex codes.
- SiteGround login or DNS access plan.
- Sample CSV of existing clients/prospects (raw — we'll clean it together).
- Tentative position on HIPAA.

**Speaker notes:** Walk through each one slowly. Make sure the right person on their side owns each item before they leave the meeting.

---

## Slide 13 — Homework due by Friday of Week 2

**On the slide:**
- Signed Discovery Document.
- Signed SOW (if not already signed).
- Signed Supabase BAA if HIPAA is in scope.
- Final cleaned CSV for import.
- Milestone 1 payment.

**Speaker notes:** "If any of these slips, Phase 1 slips by the same amount. I don't pad the timeline — I want you live as fast as possible. That means we hit our deadlines together."

---

## Slide 14 — Calendar holds

**On the slide:** Sprint demo dates for the next 18 weeks. Pre-fill the dates so they can drop them in their calendars in the meeting.

**Speaker notes:** "Block these now. 30 minutes each. If you can't attend live, we send the recording, but live is better because we can incorporate your feedback into the next sprint."

---

## Slide 15 — Questions & close

**On the slide:** "What hasn't been answered?" • Next sync = Day 3 (mid-Week 1) for Discovery deep-dive.

**Speaker notes:** Open for questions. End with the specific date/time of the next meeting and what they should bring. Don't leave the room without it.

---

## Materials to send 24 hours before the meeting

1. Calendar invite with video link and the recorded-meeting note.
2. Read-aheads: `01-Project-Scope.md`, `02-Project-Plan.md`, `03-Timeline-and-Milestones.md`.
3. The SOW (`05-Statement-of-Work.md`) — even if already signed, attach a clean copy.
4. A short email: "Please come prepared to name a Decision-Maker and to discuss whether the CRM will store Medicare/Medicaid IDs."

---

## Materials to send within 4 hours after the meeting

1. Meeting recording link.
2. Meeting notes (use `templates/Meeting-Notes-Template.md` once that exists).
3. Week 1 homework email — one bulleted list, due dates, owner per item.
4. Calendar invites for the next four sprint demos.
5. The first Weekly Status Update will go out the following Friday — confirm the channel (email / Slack / shared drive).

---

## What "kickoff went well" looks like

You leave the meeting with: a named Decision-Maker, calendar holds confirmed, the HIPAA discussion teed up, the SOW signed (or signing confirmed for that week), and a written homework list emailed within four hours. If any of those is missing, schedule a 20-minute follow-up before Week 1 ends.
