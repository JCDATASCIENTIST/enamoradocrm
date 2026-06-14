-- ============================================================================
-- Migration 0002 — Row-Level Security policies
-- ============================================================================
-- Every table has RLS enabled. No exceptions. Service role bypasses RLS
-- (intended), so server-side admin operations work; client-side queries
-- via @supabase/ssr always go through these policies.
--
-- Role model:
--   admin     — full read/write on everything; can invite users
--   agent     — full read on all contacts; write only on assigned or unassigned
--   read_only — read-only on all contacts; cannot write
--
-- Helper functions:
--   public.current_user_role()    — returns the user_role of auth.uid()
--   public.is_admin()             — boolean shortcut
--   public.is_agent_or_admin()    — boolean shortcut
-- ============================================================================

-- ----- helper functions ---------------------------------------------------

create or replace function public.current_user_role()
returns user_role
language sql
stable
security definer set search_path = public
as $$
  select role from public.profiles where id = auth.uid() and is_active = true;
$$;

create or replace function public.is_admin()
returns boolean
language sql
stable
security definer set search_path = public
as $$
  select public.current_user_role() = 'admin';
$$;

create or replace function public.is_agent_or_admin()
returns boolean
language sql
stable
security definer set search_path = public
as $$
  select public.current_user_role() in ('admin', 'agent');
$$;

-- ----- profiles RLS -------------------------------------------------------

alter table public.profiles enable row level security;

-- Everyone authenticated can read their own profile.
create policy profiles_select_own
  on public.profiles for select
  to authenticated
  using (id = auth.uid());

-- Admins can read every profile.
create policy profiles_select_admin
  on public.profiles for select
  to authenticated
  using (public.is_admin());

-- Users can update their own non-role fields (name, etc.) — role changes
-- must come through admin path (server action using service role).
create policy profiles_update_own
  on public.profiles for update
  to authenticated
  using (id = auth.uid())
  with check (id = auth.uid() and role = (select role from public.profiles where id = auth.uid()));

-- Admins can update anyone (including role changes).
create policy profiles_update_admin
  on public.profiles for update
  to authenticated
  using (public.is_admin())
  with check (public.is_admin());

-- Inserts come from the auth trigger (security definer), so no insert policy
-- for authenticated users is needed. Admins can insert manually via service role.

-- ----- contacts RLS -------------------------------------------------------

alter table public.contacts enable row level security;

-- Admin and agent can SELECT all contacts.
-- read_only can also SELECT all contacts (it's a "view-only seat").
create policy contacts_select_authenticated
  on public.contacts for select
  to authenticated
  using (
    public.current_user_role() in ('admin', 'agent', 'read_only')
  );

-- Admin can INSERT any contact.
-- Agent can INSERT contacts (defaults to unassigned or self-assigned).
create policy contacts_insert_agent_or_admin
  on public.contacts for insert
  to authenticated
  with check (
    public.is_agent_or_admin()
    and (created_by = auth.uid() or created_by is null)
  );

-- Admin can UPDATE any contact.
-- Agent can UPDATE contacts they are assigned to, or that are unassigned.
create policy contacts_update_admin
  on public.contacts for update
  to authenticated
  using (public.is_admin())
  with check (public.is_admin());

create policy contacts_update_agent_assigned
  on public.contacts for update
  to authenticated
  using (
    public.current_user_role() = 'agent'
    and (assigned_to = auth.uid() or assigned_to is null)
  )
  with check (
    public.current_user_role() = 'agent'
    and (assigned_to = auth.uid() or assigned_to is null)
  );

-- Only admins can DELETE.
create policy contacts_delete_admin
  on public.contacts for delete
  to authenticated
  using (public.is_admin());

-- ----- notes RLS ----------------------------------------------------------

alter table public.notes enable row level security;

-- Anyone authenticated can SELECT notes (visibility follows contact).
create policy notes_select_authenticated
  on public.notes for select
  to authenticated
  using (
    public.current_user_role() in ('admin', 'agent', 'read_only')
  );

-- Admins and agents can INSERT notes; read_only cannot.
create policy notes_insert_agent_or_admin
  on public.notes for insert
  to authenticated
  with check (
    public.is_agent_or_admin()
    and created_by = auth.uid()
  );

-- Notes are immutable by default — only admins can update or delete them
-- (for typo fixes / cleanup). This preserves activity history integrity.
create policy notes_update_admin
  on public.notes for update
  to authenticated
  using (public.is_admin())
  with check (public.is_admin());

create policy notes_delete_admin
  on public.notes for delete
  to authenticated
  using (public.is_admin());

-- ----- follow_ups RLS -----------------------------------------------------

alter table public.follow_ups enable row level security;

create policy follow_ups_select_authenticated
  on public.follow_ups for select
  to authenticated
  using (
    public.current_user_role() in ('admin', 'agent', 'read_only')
  );

create policy follow_ups_insert_agent_or_admin
  on public.follow_ups for insert
  to authenticated
  with check (
    public.is_agent_or_admin()
    and created_by = auth.uid()
  );

create policy follow_ups_update_agent_or_admin
  on public.follow_ups for update
  to authenticated
  using (public.is_agent_or_admin())
  with check (public.is_agent_or_admin());

create policy follow_ups_delete_admin
  on public.follow_ups for delete
  to authenticated
  using (public.is_admin());

-- ----- pipeline_history RLS -----------------------------------------------

alter table public.pipeline_history enable row level security;

-- Read by any authenticated user.
create policy pipeline_history_select_authenticated
  on public.pipeline_history for select
  to authenticated
  using (
    public.current_user_role() in ('admin', 'agent', 'read_only')
  );

-- INSERTs come only from the trigger (security definer) — no insert policy
-- for authenticated users. Append-only by design.

-- No UPDATE, no DELETE policies — the table is append-only forever.
