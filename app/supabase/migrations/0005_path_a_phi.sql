-- ============================================================================
-- Migration 0005 — Path A PHI (encrypted full identifiers)
-- ============================================================================
-- HIPAA posture change: Path B -> Path A.
--
-- v1 deliberately stored NO full identifiers (Path B). v2 adds the ability to
-- store full SSN, full Medicare Beneficiary Identifier (MBI), and full Medicaid
-- ID so the agency has everything it needs in one place. To do that safely:
--
--   1. Ciphertext only. The plaintext is encrypted in the application
--      (AES-256-GCM, key in PHI_ENCRYPTION_KEY env var) BEFORE it ever reaches
--      Postgres. The database never holds the key, so a DB compromise yields
--      only ciphertext. Columns store base64 ciphertext as text.
--
--   2. Least privilege. PHI lives in a SEPARATE table (contact_phi) whose RLS
--      only admits admins. Postgres RLS is row-level, so putting PHI in its own
--      1:1 table is how we get effectively column-level restriction: agents and
--      read_only users cannot SELECT the row at all.
--
--   3. Access logging. Every decrypt ("reveal") is recorded in phi_access_log
--      via a SECURITY DEFINER function — who saw which field on which contact,
--      when, and why.
--
--   4. Audit redaction. The shared audit trigger is updated to strip any
--      *_ciphertext column from old_values/new_values/changed_fields so the
--      audit log never accumulates copies of the ciphertext.
--
-- LEGAL GATE: Do not enter REAL PHI until a Supabase BAA is signed
-- (see ../../../04-Risk-Register.md Risk 1). This migration only creates the
-- structure; columns stay empty until the agency is cleared to use them.
-- ============================================================================

-- ----- contact_phi --------------------------------------------------------
-- One row per contact, created lazily the first time a sensitive identifier
-- is saved. Admin-only by RLS.

create table public.contact_phi (
  contact_id uuid primary key references public.contacts(id) on delete cascade,

  -- SSN: base64 AES-256-GCM ciphertext + last-4 for masked display (•••-••-1234)
  ssn_ciphertext text,
  ssn_last4 text check (ssn_last4 is null or ssn_last4 ~ '^[0-9]{4}$'),

  -- Medicare Beneficiary Identifier (MBI): 11-char alphanumeric
  mbi_ciphertext text,
  mbi_last4 text check (mbi_last4 is null or length(mbi_last4) <= 4),

  -- Full Medicaid ID (format varies by state)
  medicaid_id_ciphertext text,
  medicaid_id_last4 text check (medicaid_id_last4 is null or length(medicaid_id_last4) <= 4),

  updated_at timestamptz not null default now(),
  updated_by uuid references public.profiles(id) on delete set null
);

comment on table public.contact_phi is
  'Path A encrypted identifiers (SSN/MBI/Medicaid ID), one row per contact. Admin-only via RLS. Ciphertext is AES-256-GCM, encrypted in the app; the DB never holds the key.';

create trigger contact_phi_set_updated_at
  before update on public.contact_phi
  for each row execute function public.set_updated_at();

-- ----- contact_phi RLS ----------------------------------------------------
-- Admin-only for every operation. agent / read_only cannot see the row at all,
-- which is the whole point of the separate table. Service role bypasses RLS for
-- server-side / MCP operations.

alter table public.contact_phi enable row level security;

create policy contact_phi_admin_all
  on public.contact_phi for all
  to authenticated
  using (public.is_admin())
  with check (public.is_admin());

-- ----- phi_access_log -----------------------------------------------------
-- Append-only record of every time a plaintext identifier is revealed.

create table public.phi_access_log (
  id bigserial primary key,
  occurred_at timestamptz not null default now(),
  actor_id uuid references public.profiles(id) on delete set null,
  actor_email text,
  contact_id uuid references public.contacts(id) on delete set null,
  field text not null check (field in ('ssn', 'mbi', 'medicaid_id')),
  action text not null default 'reveal' check (action in ('reveal', 'export')),
  source text not null default 'crm' check (source in ('crm', 'mcp')),
  reason text
);

comment on table public.phi_access_log is
  'Append-only log of every plaintext PHI reveal. Who saw which field on which contact, when, why.';
create index phi_access_log_occurred_at_idx on public.phi_access_log(occurred_at desc);
create index phi_access_log_contact_id_idx on public.phi_access_log(contact_id);
create index phi_access_log_actor_id_idx on public.phi_access_log(actor_id);

alter table public.phi_access_log enable row level security;

-- Admins can read the access log. Nobody can write/delete via SQL — inserts go
-- through log_phi_access() (SECURITY DEFINER) only.
create policy phi_access_log_select_admin
  on public.phi_access_log for select
  to authenticated
  using (public.is_admin());

-- ----- log_phi_access() ---------------------------------------------------
-- Called by the app immediately after a successful decrypt. SECURITY DEFINER so
-- an authenticated admin can append to the otherwise write-blocked log.

create or replace function public.log_phi_access(
  p_contact_id uuid,
  p_field text,
  p_action text default 'reveal',
  p_source text default 'crm',
  p_reason text default null
)
returns void
language plpgsql
security definer set search_path = public
as $$
declare
  v_actor uuid;
  v_email text;
begin
  v_actor := auth.uid();
  select email into v_email from public.profiles where id = v_actor;
  insert into public.phi_access_log (actor_id, actor_email, contact_id, field, action, source, reason)
  values (v_actor, v_email, p_contact_id, p_field, coalesce(p_action, 'reveal'), coalesce(p_source, 'crm'), p_reason);
end;
$$;

grant execute on function public.log_phi_access(uuid, text, text, text, text) to authenticated;

-- ----- audit trigger: redact ciphertext -----------------------------------
-- Replace the shared audit function so any column ending in _ciphertext is
-- stripped from the snapshots and the diff. No behavior change for tables
-- without such columns (contacts, profiles, follow_ups).

create or replace function public.audit_row_change()
returns trigger
language plpgsql
security definer set search_path = public
as $$
declare
  actor_uuid uuid;
  actor_mail text;
  changed jsonb;
  old_json jsonb;
  new_json jsonb;
begin
  actor_uuid := auth.uid();
  select email into actor_mail from public.profiles where id = actor_uuid;

  if (tg_op = 'INSERT') then
    select coalesce(jsonb_object_agg(key, value), '{}'::jsonb) into new_json
      from jsonb_each(to_jsonb(new)) where key !~ 'ciphertext$';
    insert into public.audit_log (actor_id, actor_email, action, table_name, row_id, new_values)
    values (actor_uuid, actor_mail, 'insert', tg_table_name, new.id::text, new_json);
    return new;
  elsif (tg_op = 'UPDATE') then
    select coalesce(jsonb_object_agg(key, value), '{}'::jsonb) into old_json
      from jsonb_each(to_jsonb(old)) where key !~ 'ciphertext$';
    select coalesce(jsonb_object_agg(key, value), '{}'::jsonb) into new_json
      from jsonb_each(to_jsonb(new)) where key !~ 'ciphertext$';
    select jsonb_object_agg(key, new_json->key)
      into changed
      from jsonb_object_keys(new_json) as key
      where old_json->key is distinct from new_json->key;
    insert into public.audit_log (actor_id, actor_email, action, table_name, row_id, changed_fields, old_values, new_values)
    values (actor_uuid, actor_mail, 'update', tg_table_name, new.id::text, changed, old_json, new_json);
    return new;
  elsif (tg_op = 'DELETE') then
    select coalesce(jsonb_object_agg(key, value), '{}'::jsonb) into old_json
      from jsonb_each(to_jsonb(old)) where key !~ 'ciphertext$';
    insert into public.audit_log (actor_id, actor_email, action, table_name, row_id, old_values)
    values (actor_uuid, actor_mail, 'delete', tg_table_name, old.id::text, old_json);
    return old;
  end if;
  return null;
end;
$$;

-- Audit contact_phi changes (who set/changed an identifier). Ciphertext is
-- redacted by the function above; the *_last4 columns remain so the audit shows
-- which identifier changed without exposing it.
create trigger audit_contact_phi
  after insert or update or delete on public.contact_phi
  for each row execute function public.audit_row_change();
