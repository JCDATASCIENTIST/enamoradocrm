// Path B — only non-PHI fields in Zapier payloads (no DOB, phones, addresses, member IDs).

export interface ZapierProspectPayload {
  event: 'new_prospect';
  contact_id: string;
  display_name: string;
  contact_type: string;
  stage: string;
  plan_type: string | null;
  assigned_to_name: string | null;
}

export interface ZapierFollowUpPayload {
  event: 'follow_up_reminder';
  contact_id: string;
  display_name: string;
  follow_up_date: string;
  follow_up_status: string | null;
}

export interface ZapierRenewalPayload {
  event: 'renewal_reminder';
  contact_id: string;
  display_name: string;
  renewal_date: string;
  days_until: number;
  carrier: string | null;
  plan_name: string | null;
}
