-- ============================================================================
-- Migration 0003 — Audit log
-- ============================================================================
-- Append-only record of who did what to which row, when.
-- Triggered on insert/update/delete of the most sensitive tables.
-- Read-only to all users (even admins can't modify it via the app —
-- only the service role for retention cleanup).
-- ============================================================================

create table public.audit_log (
  id bigserial primary key,
  occurred_at timestamptz not null default now(),
  actor_id uuid references public.profiles(id) on delete set null,
  actor_email text,
  action text not null check (action in ('insert', 'update', 'delete')),
  table_name text not null,
  row_id text not null,
  changed_fields jsonb,
  old_values jsonb,
  new_values jsonb
);

comment on table public.audit_log is 'Append-only audit log for sensitive table changes.';
create index audit_log_occurred_at_idx on public.audit_log(occurred_at desc);
create index audit_log_actor_id_idx on public.audit_log(actor_id);
create index audit_log_table_row_idx on public.audit_log(table_name, row_id);

-- Generic audit trigger function.
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
    new_json := to_jsonb(new);
    insert into public.audit_log (actor_id, actor_email, action, table_name, row_id, new_values)
    values (actor_uuid, actor_mail, 'insert', tg_table_name, new.id::text, new_json);
    return new;
  elsif (tg_op = 'UPDATE') then
    old_json := to_jsonb(old);
    new_json := to_jsonb(new);
    -- Diff: list of keys whose value changed.
    select jsonb_object_agg(key, new_json->key)
      into changed
      from jsonb_object_keys(new_json) as key
      where old_json->key is distinct from new_json->key;
    insert into public.audit_log (actor_id, actor_email, action, table_name, row_id, changed_fields, old_values, new_values)
    values (actor_uuid, actor_mail, 'update', tg_table_name, new.id::text, changed, old_json, new_json);
    return new;
  elsif (tg_op = 'DELETE') then
    old_json := to_jsonb(old);
    insert into public.audit_log (actor_id, actor_email, action, table_name, row_id, old_values)
    values (actor_uuid, actor_mail, 'delete', tg_table_name, old.id::text, old_json);
    return old;
  end if;
  return null;
end;
$$;

-- Attach triggers to the tables we care about.
create trigger audit_contacts
  after insert or update or delete on public.contacts
  for each row execute function public.audit_row_change();

create trigger audit_profiles
  after insert or update or delete on public.profiles
  for each row execute function public.audit_row_change();

create trigger audit_follow_ups
  after insert or update or delete on public.follow_ups
  for each row execute function public.audit_row_change();

-- audit_log RLS: read-only for admins; nobody can write or delete via SQL.
alter table public.audit_log enable row level security;

create policy audit_log_select_admin
  on public.audit_log for select
  to authenticated
  using (public.is_admin());

-- No INSERT / UPDATE / DELETE policies = blocked for all authenticated users.
-- Trigger function is SECURITY DEFINER so it bypasses RLS for inserts.
