-- ============================================================================
-- Migration 0004 — Workstream B: commissions, enrollment activities
-- ============================================================================

create type public.commission_status as enum ('pending', 'paid', 'cancelled');

create type public.enrollment_status as enum (
  'started',
  'in_progress',
  'submitted',
  'approved',
  'declined',
  'cancelled'
);

-- Commissions tied to a contact (policy-level detail on the contact record).
create table public.commissions (
  id uuid primary key default gen_random_uuid(),
  contact_id uuid not null references public.contacts(id) on delete cascade,
  carrier text,
  policy_number text,
  writing_agent_id uuid references public.profiles(id) on delete set null,
  amount numeric(12, 2),
  status public.commission_status not null default 'pending',
  payment_date date,
  notes text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  created_by uuid references public.profiles(id) on delete set null,
  updated_by uuid references public.profiles(id) on delete set null
);

create index commissions_contact_id_idx on public.commissions(contact_id);
create index commissions_status_idx on public.commissions(status);
create index commissions_payment_date_idx on public.commissions(payment_date) where payment_date is not null;

create trigger commissions_set_updated_at
  before update on public.commissions
  for each row execute function public.set_updated_at();

-- Enrollment activity log per contact.
create table public.enrollment_activities (
  id uuid primary key default gen_random_uuid(),
  contact_id uuid not null references public.contacts(id) on delete cascade,
  status public.enrollment_status not null default 'started',
  started_at timestamptz not null default now(),
  completed_at timestamptz,
  external_ref text,
  description text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  created_by uuid references public.profiles(id) on delete set null,
  updated_by uuid references public.profiles(id) on delete set null
);

create index enrollment_activities_contact_id_idx on public.enrollment_activities(contact_id);
create index enrollment_activities_status_idx on public.enrollment_activities(status);

create trigger enrollment_activities_set_updated_at
  before update on public.enrollment_activities
  for each row execute function public.set_updated_at();

-- Audit triggers
create trigger audit_commissions
  after insert or update or delete on public.commissions
  for each row execute function public.audit_row_change();

create trigger audit_enrollment_activities
  after insert or update or delete on public.enrollment_activities
  for each row execute function public.audit_row_change();

-- RLS
alter table public.commissions enable row level security;
alter table public.enrollment_activities enable row level security;

-- Commissions: same read model as contacts; write like contacts assignment rules.
create policy commissions_select_authenticated
  on public.commissions for select
  to authenticated
  using (public.current_user_role() in ('admin', 'agent', 'read_only'));

create policy commissions_insert_agent_or_admin
  on public.commissions for insert
  to authenticated
  with check (
    public.is_agent_or_admin()
    and created_by = auth.uid()
  );

create policy commissions_update_admin
  on public.commissions for update
  to authenticated
  using (public.is_admin())
  with check (public.is_admin());

create policy commissions_update_agent_assigned
  on public.commissions for update
  to authenticated
  using (
    public.current_user_role() = 'agent'
    and exists (
      select 1 from public.contacts c
      where c.id = contact_id
        and (c.assigned_to = auth.uid() or c.assigned_to is null)
    )
  )
  with check (
    public.current_user_role() = 'agent'
    and exists (
      select 1 from public.contacts c
      where c.id = contact_id
        and (c.assigned_to = auth.uid() or c.assigned_to is null)
    )
  );

create policy commissions_delete_admin
  on public.commissions for delete
  to authenticated
  using (public.is_admin());

-- Enrollment activities: mirror commissions policies.
create policy enrollment_select_authenticated
  on public.enrollment_activities for select
  to authenticated
  using (public.current_user_role() in ('admin', 'agent', 'read_only'));

create policy enrollment_insert_agent_or_admin
  on public.enrollment_activities for insert
  to authenticated
  with check (
    public.is_agent_or_admin()
    and created_by = auth.uid()
  );

create policy enrollment_update_admin
  on public.enrollment_activities for update
  to authenticated
  using (public.is_admin())
  with check (public.is_admin());

create policy enrollment_update_agent_assigned
  on public.enrollment_activities for update
  to authenticated
  using (
    public.current_user_role() = 'agent'
    and exists (
      select 1 from public.contacts c
      where c.id = contact_id
        and (c.assigned_to = auth.uid() or c.assigned_to is null)
    )
  )
  with check (
    public.current_user_role() = 'agent'
    and exists (
      select 1 from public.contacts c
      where c.id = contact_id
        and (c.assigned_to = auth.uid() or c.assigned_to is null)
    )
  );

create policy enrollment_delete_admin
  on public.enrollment_activities for delete
  to authenticated
  using (public.is_admin());
