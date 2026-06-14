# Enrollment workflow spec

## Purpose

Log enrollment activity per contact with status progression and optional external reference (enrollment tool ID).

## Status enum

`started` → `in_progress` → `submitted` → `approved` | `declined` | `cancelled`

Setting terminal status sets `completed_at`.

## Schema

Table `enrollment_activities` (migration `0004`).

## RLS

Same assignment rules as commissions (via parent contact).

## UI

- `/enrollments` — list, filter by status, inline create form
- Contact detail may add enrollment form in a future pass

## Integration

**Default:** manual entry with `external_ref` text field.

**Optional (change order):** one carrier/enrollment-tool integration named in Discovery Document §8.
