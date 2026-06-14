-- ============================================================================
-- Migration 0001 — Initial schema for Enamorado Insurance CRM
-- ============================================================================
-- HIPAA posture: Path B (no PHI stored).
-- See ../../../04-Risk-Register.md Risk 1 and the Discovery Document
-- for the explicit data boundary enforced here.
--
-- Tables created:
--   profiles         — extends auth.users with role + display info
--   contacts         — unified clients + prospects
--   notes            — notes/issues on a contact
--   follow_ups       — scheduled follow-up tasks
--   pipeline_history — every stage transition for a contact
--
-- RLS policies are in 0002_rls_policies.sql.
-- Audit log is in 0003_audit_log.sql.
-- ============================================================================

-- ----- ENUM types ---------------------------------------------------------

create type user_role as enum ('admin', 'agent', 'read_only');

create type contact_type as enum ('prospect', 'client');

create type pipeline_stage as enum ('new', 'requested', 'in_progress', 'done');

create type plan_type as enum (
  'medicare_advantage',
  'medicare_supplement',
  'part_d',
  'medicaid',
  'dual_eligible',
  'other'
);

create type follow_up_status as enum ('pending', 'completed', 'skipped');

create type contact_method as enum ('phone', 'email', 'text', 'mail');

-- ----- profiles -----------------------------------------------------------
-- Mirrors auth.users with our application-specific fields.
-- Created automatically by trigger on auth.users insert.

create table public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  email text not null,
  full_name text,
  role user_role not null default 'agent',
  is_active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

comment on table public.profiles is 'Application profile per authenticated user. Role drives RLS.';
comment on column public.profiles.role is 'admin = full access; agent = own + assigned; read_only = view only';

create index profiles_role_idx on public.profiles(role);
create index profiles_is_active_idx on public.profiles(is_active);

-- Auto-create a profile when an auth user is created.
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer set search_path = public
as $$
begin
  insert into public.profiles (id, email, full_name, role)
  values (
    new.id,
    new.email,
    coalesce(new.raw_user_meta_data->>'full_name', split_part(new.email, '@', 1)),
    coalesce((new.raw_user_meta_data->>'role')::user_role, 'agent')
  );
  return new;
end;
$$;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- ----- contacts -----------------------------------------------------------
-- Unified table for clients and prospects.
-- contact_type distinguishes the two; the same person can be promoted
-- from prospect to client by updating contact_type.
--
-- Data boundary (Path B):
--   - NO Social Security Numbers.
--   - NO full Medicare Beneficiary Identifiers (MBIs).
--   - NO full Medicaid IDs.
--   - NO medical conditions, diagnoses, or treatment information.
--   - Last-4 identifiers OK in member_id_last4.
-- These constraints are enforced by application logic + UI + admin training,
-- not by database constraints (no good way to detect SSN in a text field).

create table public.contacts (
  id uuid primary key default gen_random_uuid(),
  contact_type contact_type not null default 'prospect',

  -- Demographic
  first_name text not null,
  last_name text not null,
  preferred_name text,
  date_of_birth date,
  gender text,
  language_preference text,

  -- Contact
  primary_phone text,
  secondary_phone text,
  email text,
  address_line_1 text,
  address_line_2 text,
  city text,
  state text,
  zip text,
  preferred_contact_method contact_method,

  -- Plan & Insurance (NO full identifiers; last 4 only)
  carrier text,
  plan_name text,
  plan_type plan_type,
  medicaid_level text,
  effective_date date,
  renewal_date date,
  member_id_last4 text check (member_id_last4 is null or length(member_id_last4) <= 4),

  -- Pipeline & Status
  stage pipeline_stage not null default 'new',
  assigned_to uuid references public.profiles(id) on delete set null,
  follow_up_date date,
  follow_up_status follow_up_status,

  -- System
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  created_by uuid references public.profiles(id) on delete set null,
  updated_by uuid references public.profiles(id) on delete set null
);

comment on table public.contacts is 'Unified clients and prospects. contact_type distinguishes; no PHI stored.';

create index contacts_contact_type_idx on public.contacts(contact_type);
create index contacts_stage_idx on public.contacts(stage);
create index contacts_assigned_to_idx on public.contacts(assigned_to);
create index contacts_follow_up_date_idx on public.contacts(follow_up_date) where follow_up_date is not null;
create index contacts_renewal_date_idx on public.contacts(renewal_date) where renewal_date is not null;
create index contacts_date_of_birth_idx on public.contacts(date_of_birth) where date_of_birth is not null;
create index contacts_last_name_idx on public.contacts(lower(last_name));

-- ----- notes --------------------------------------------------------------
-- Free-form notes / issues / activity entries on a contact.

create table public.notes (
  id uuid primary key default gen_random_uuid(),
  contact_id uuid not null references public.contacts(id) on delete cascade,
  body text not null check (length(body) > 0),
  category text,
  created_at timestamptz not null default now(),
  created_by uuid references public.profiles(id) on delete set null
);

comment on table public.notes is 'Activity history on a contact: calls, emails, concerns, follow-ups.';
create index notes_contact_id_idx on public.notes(contact_id);
create index notes_created_at_idx on public.notes(created_at desc);

-- ----- follow_ups ---------------------------------------------------------
-- Scheduled tasks tied to a contact.

create table public.follow_ups (
  id uuid primary key default gen_random_uuid(),
  contact_id uuid not null references public.contacts(id) on delete cascade,
  due_date date not null,
  description text,
  status follow_up_status not null default 'pending',
  completed_at timestamptz,
  completed_by uuid references public.profiles(id) on delete set null,
  created_at timestamptz not null default now(),
  created_by uuid references public.profiles(id) on delete set null
);

comment on table public.follow_ups is 'Scheduled follow-up tasks on a contact.';
create index follow_ups_contact_id_idx on public.follow_ups(contact_id);
create index follow_ups_due_date_status_idx on public.follow_ups(due_date, status);

-- ----- pipeline_history ---------------------------------------------------
-- Every stage transition is logged here.

create table public.pipeline_history (
  id uuid primary key default gen_random_uuid(),
  contact_id uuid not null references public.contacts(id) on delete cascade,
  from_stage pipeline_stage,
  to_stage pipeline_stage not null,
  changed_at timestamptz not null default now(),
  changed_by uuid references public.profiles(id) on delete set null,
  note text
);

comment on table public.pipeline_history is 'Append-only log of every pipeline stage transition.';
create index pipeline_history_contact_id_idx on public.pipeline_history(contact_id);
create index pipeline_history_changed_at_idx on public.pipeline_history(changed_at desc);

-- Trigger: when contacts.stage changes, write a pipeline_history row.
create or replace function public.log_pipeline_stage_change()
returns trigger
language plpgsql
security definer set search_path = public
as $$
begin
  if (tg_op = 'INSERT') then
    insert into public.pipeline_history (contact_id, from_stage, to_stage, changed_by)
    values (new.id, null, new.stage, new.created_by);
  elsif (tg_op = 'UPDATE' and old.stage is distinct from new.stage) then
    insert into public.pipeline_history (contact_id, from_stage, to_stage, changed_by)
    values (new.id, old.stage, new.stage, new.updated_by);
  end if;
  return new;
end;
$$;

create trigger contacts_pipeline_history
  after insert or update of stage on public.contacts
  for each row execute function public.log_pipeline_stage_change();

-- ----- updated_at triggers -----------------------------------------------

create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create trigger profiles_set_updated_at
  before update on public.profiles
  for each row execute function public.set_updated_at();

create trigger contacts_set_updated_at
  before update on public.contacts
  for each row execute function public.set_updated_at();
