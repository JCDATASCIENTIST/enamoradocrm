// Server-side queries for the contacts feature.
// All queries go through the authenticated Supabase server client so RLS
// applies — agents see what they're allowed to see.

import { createClient } from '@/lib/supabase/server';
import { todayInAppTz } from '@/lib/format';
import type {
  Contact,
  ContactType,
  PipelineStage,
  PlanType,
  FollowUpStatus,
} from '@/types/database.types';

export interface ContactFilters {
  search?: string;
  contact_type?: ContactType | 'all';
  stage?: PipelineStage | 'all';
  plan_type?: PlanType | 'all';
  medicaid_level?: string | 'all';
  assigned_to?: string | 'all' | 'unassigned';
  follow_up_status?: FollowUpStatus | 'all' | 'overdue';
  minAge?: number;
  maxAge?: number;
}

export interface ListResult {
  rows: Contact[];
  total: number;
  page: number;
  pageSize: number;
}

const DEFAULT_PAGE_SIZE = 25;

export async function listContacts(
  filters: ContactFilters = {},
  page = 1,
  pageSize = DEFAULT_PAGE_SIZE,
): Promise<ListResult> {
  const supabase = createClient();
  const from = (page - 1) * pageSize;
  const to = from + pageSize - 1;

  let query = supabase
    .from('contacts')
    .select('*', { count: 'exact' })
    .order('updated_at', { ascending: false })
    .range(from, to);

  if (filters.search && filters.search.trim()) {
    const term = filters.search.trim().replace(/[%_]/g, (m) => `\\${m}`);
    query = query.or(
      `first_name.ilike.%${term}%,last_name.ilike.%${term}%,email.ilike.%${term}%,primary_phone.ilike.%${term}%`,
    );
  }
  if (filters.contact_type && filters.contact_type !== 'all') {
    query = query.eq('contact_type', filters.contact_type);
  }
  if (filters.stage && filters.stage !== 'all') {
    query = query.eq('stage', filters.stage);
  }
  if (filters.plan_type && filters.plan_type !== 'all') {
    query = query.eq('plan_type', filters.plan_type);
  }
  if (filters.medicaid_level && filters.medicaid_level !== 'all') {
    query = query.eq('medicaid_level', filters.medicaid_level);
  }
  if (filters.assigned_to) {
    if (filters.assigned_to === 'unassigned') {
      query = query.is('assigned_to', null);
    } else if (filters.assigned_to !== 'all') {
      query = query.eq('assigned_to', filters.assigned_to);
    }
  }
  if (filters.follow_up_status) {
    if (filters.follow_up_status === 'overdue') {
      query = query.eq('follow_up_status', 'pending').lt('follow_up_date', todayInAppTz());
    } else if (filters.follow_up_status !== 'all') {
      query = query.eq('follow_up_status', filters.follow_up_status);
    }
  }
  if (filters.minAge != null || filters.maxAge != null) {
    const today = new Date();
    if (filters.maxAge != null) {
      const minDob = new Date(today.getFullYear() - filters.maxAge - 1, today.getMonth(), today.getDate() + 1);
      query = query.gte('date_of_birth', minDob.toISOString().slice(0, 10));
    }
    if (filters.minAge != null) {
      const maxDob = new Date(today.getFullYear() - filters.minAge, today.getMonth(), today.getDate());
      query = query.lte('date_of_birth', maxDob.toISOString().slice(0, 10));
    }
  }

  const { data, count, error } = await query;
  if (error) throw error;

  return {
    rows: (data ?? []) as Contact[],
    total: count ?? 0,
    page,
    pageSize,
  };
}

export async function getContact(id: string): Promise<Contact | null> {
  const supabase = createClient();
  const { data, error } = await supabase.from('contacts').select('*').eq('id', id).maybeSingle();
  if (error) throw error;
  return data as Contact | null;
}

export async function listAgentsForAssignment() {
  const supabase = createClient();
  const { data } = await supabase
    .from('profiles')
    .select('id, email, full_name, role, is_active')
    .in('role', ['admin', 'agent'])
    .eq('is_active', true)
    .order('full_name', { ascending: true });
  return data ?? [];
}

export type PipelineCard = Pick<
  Contact,
  | 'id'
  | 'first_name'
  | 'last_name'
  | 'preferred_name'
  | 'contact_type'
  | 'stage'
  | 'plan_type'
  | 'assigned_to'
  | 'follow_up_date'
  | 'follow_up_status'
>;

export interface PipelineFilters {
  contact_type?: ContactType | 'all';
  assigned_to?: string | 'all' | 'unassigned';
}

const PIPELINE_LIMIT = 200;

/** Contacts for the kanban board (capped per request for performance). */
export async function listPipelineContacts(filters: PipelineFilters = {}): Promise<PipelineCard[]> {
  const supabase = createClient();
  let query = supabase
    .from('contacts')
    .select(
      'id, first_name, last_name, preferred_name, contact_type, stage, plan_type, assigned_to, follow_up_date, follow_up_status',
    )
    .order('updated_at', { ascending: false })
    .limit(PIPELINE_LIMIT);

  if (filters.contact_type && filters.contact_type !== 'all') {
    query = query.eq('contact_type', filters.contact_type);
  }
  if (filters.assigned_to) {
    if (filters.assigned_to === 'unassigned') {
      query = query.is('assigned_to', null);
    } else if (filters.assigned_to !== 'all') {
      query = query.eq('assigned_to', filters.assigned_to);
    }
  }

  const { data, error } = await query;
  if (error) throw error;
  return (data ?? []) as PipelineCard[];
}
