// ============================================================================
// Database types — generated stub
// ----------------------------------------------------------------------------
// In a real workflow, regenerate this file by running:
//   npm run db:types
// which calls the Supabase CLI with your project ref.
//
// This file is a hand-written stub that matches migrations 0001–0004
// so the app type-checks before you've connected to a real Supabase project.
// Once connected, replace this entire file with the generated output.
// ============================================================================

export type UserRole = 'admin' | 'agent' | 'read_only';
export type ContactType = 'prospect' | 'client';
export type PipelineStage = 'new' | 'requested' | 'in_progress' | 'done';
export type PlanType =
  | 'medicare_advantage'
  | 'medicare_supplement'
  | 'part_d'
  | 'medicaid'
  | 'dual_eligible'
  | 'other';
export type FollowUpStatus = 'pending' | 'completed' | 'skipped';
export type ContactMethod = 'phone' | 'email' | 'text' | 'mail';
export type CommissionStatus = 'pending' | 'paid' | 'cancelled';
export type EnrollmentStatus =
  | 'started'
  | 'in_progress'
  | 'submitted'
  | 'approved'
  | 'declined'
  | 'cancelled';

export interface Profile {
  id: string;
  email: string;
  full_name: string | null;
  role: UserRole;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface Contact {
  id: string;
  contact_type: ContactType;
  first_name: string;
  last_name: string;
  preferred_name: string | null;
  date_of_birth: string | null;
  gender: string | null;
  language_preference: string | null;
  primary_phone: string | null;
  secondary_phone: string | null;
  email: string | null;
  address_line_1: string | null;
  address_line_2: string | null;
  city: string | null;
  state: string | null;
  zip: string | null;
  preferred_contact_method: ContactMethod | null;
  carrier: string | null;
  plan_name: string | null;
  plan_type: PlanType | null;
  medicaid_level: string | null;
  effective_date: string | null;
  renewal_date: string | null;
  member_id_last4: string | null;
  stage: PipelineStage;
  assigned_to: string | null;
  follow_up_date: string | null;
  follow_up_status: FollowUpStatus | null;
  created_at: string;
  updated_at: string;
  created_by: string | null;
  updated_by: string | null;
}

export interface Note {
  id: string;
  contact_id: string;
  body: string;
  category: string | null;
  created_at: string;
  created_by: string | null;
}

export interface FollowUp {
  id: string;
  contact_id: string;
  due_date: string;
  description: string | null;
  status: FollowUpStatus;
  completed_at: string | null;
  completed_by: string | null;
  created_at: string;
  created_by: string | null;
}

export interface PipelineHistory {
  id: string;
  contact_id: string;
  from_stage: PipelineStage | null;
  to_stage: PipelineStage;
  changed_at: string;
  changed_by: string | null;
  note: string | null;
}

export interface Commission {
  id: string;
  contact_id: string;
  carrier: string | null;
  policy_number: string | null;
  writing_agent_id: string | null;
  amount: number | null;
  status: CommissionStatus;
  payment_date: string | null;
  notes: string | null;
  created_at: string;
  updated_at: string;
  created_by: string | null;
  updated_by: string | null;
}

export interface EnrollmentActivity {
  id: string;
  contact_id: string;
  status: EnrollmentStatus;
  started_at: string;
  completed_at: string | null;
  external_ref: string | null;
  description: string | null;
  created_at: string;
  updated_at: string;
  created_by: string | null;
  updated_by: string | null;
}

export interface AuditLogRow {
  id: number;
  occurred_at: string;
  actor_id: string | null;
  actor_email: string | null;
  action: 'insert' | 'update' | 'delete';
  table_name: string;
  row_id: string;
  changed_fields: Record<string, unknown> | null;
  old_values: Record<string, unknown> | null;
  new_values: Record<string, unknown> | null;
}

export type Database = {
  public: {
    Tables: {
      profiles: { Row: Profile; Insert: Partial<Profile> & { id: string; email: string }; Update: Partial<Profile> };
      contacts: { Row: Contact; Insert: Partial<Contact> & { first_name: string; last_name: string }; Update: Partial<Contact> };
      notes: { Row: Note; Insert: Partial<Note> & { contact_id: string; body: string }; Update: Partial<Note> };
      follow_ups: { Row: FollowUp; Insert: Partial<FollowUp> & { contact_id: string; due_date: string }; Update: Partial<FollowUp> };
      pipeline_history: { Row: PipelineHistory; Insert: never; Update: never };
      audit_log: { Row: AuditLogRow; Insert: never; Update: never };
      commissions: {
        Row: Commission;
        Insert: Partial<Commission> & { contact_id: string };
        Update: Partial<Commission>;
      };
      enrollment_activities: {
        Row: EnrollmentActivity;
        Insert: Partial<EnrollmentActivity> & { contact_id: string };
        Update: Partial<EnrollmentActivity>;
      };
    };
  };
};
