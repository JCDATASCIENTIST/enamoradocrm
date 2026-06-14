// Shared option sets for form selects and list filters.
// Keeping these in one place ensures the contact form, filters, and exports
// never drift out of sync.

export interface Option {
  value: string;
  label: string;
}

// Look up a display label for a stored value; falls back to the raw value
// (so legacy / free-text entries still render) or null when empty.
export function labelFor(options: Option[], value: string | null | undefined): string | null {
  if (!value) return null;
  return options.find((o) => o.value === value)?.label ?? value;
}

// US states + DC. Stored as the 2-letter postal code.
export const US_STATES: Option[] = [
  { value: 'AL', label: 'Alabama' },
  { value: 'AK', label: 'Alaska' },
  { value: 'AZ', label: 'Arizona' },
  { value: 'AR', label: 'Arkansas' },
  { value: 'CA', label: 'California' },
  { value: 'CO', label: 'Colorado' },
  { value: 'CT', label: 'Connecticut' },
  { value: 'DE', label: 'Delaware' },
  { value: 'DC', label: 'District of Columbia' },
  { value: 'FL', label: 'Florida' },
  { value: 'GA', label: 'Georgia' },
  { value: 'HI', label: 'Hawaii' },
  { value: 'ID', label: 'Idaho' },
  { value: 'IL', label: 'Illinois' },
  { value: 'IN', label: 'Indiana' },
  { value: 'IA', label: 'Iowa' },
  { value: 'KS', label: 'Kansas' },
  { value: 'KY', label: 'Kentucky' },
  { value: 'LA', label: 'Louisiana' },
  { value: 'ME', label: 'Maine' },
  { value: 'MD', label: 'Maryland' },
  { value: 'MA', label: 'Massachusetts' },
  { value: 'MI', label: 'Michigan' },
  { value: 'MN', label: 'Minnesota' },
  { value: 'MS', label: 'Mississippi' },
  { value: 'MO', label: 'Missouri' },
  { value: 'MT', label: 'Montana' },
  { value: 'NE', label: 'Nebraska' },
  { value: 'NV', label: 'Nevada' },
  { value: 'NH', label: 'New Hampshire' },
  { value: 'NJ', label: 'New Jersey' },
  { value: 'NM', label: 'New Mexico' },
  { value: 'NY', label: 'New York' },
  { value: 'NC', label: 'North Carolina' },
  { value: 'ND', label: 'North Dakota' },
  { value: 'OH', label: 'Ohio' },
  { value: 'OK', label: 'Oklahoma' },
  { value: 'OR', label: 'Oregon' },
  { value: 'PA', label: 'Pennsylvania' },
  { value: 'PR', label: 'Puerto Rico' },
  { value: 'RI', label: 'Rhode Island' },
  { value: 'SC', label: 'South Carolina' },
  { value: 'SD', label: 'South Dakota' },
  { value: 'TN', label: 'Tennessee' },
  { value: 'TX', label: 'Texas' },
  { value: 'UT', label: 'Utah' },
  { value: 'VT', label: 'Vermont' },
  { value: 'VA', label: 'Virginia' },
  { value: 'WA', label: 'Washington' },
  { value: 'WV', label: 'West Virginia' },
  { value: 'WI', label: 'Wisconsin' },
  { value: 'WY', label: 'Wyoming' },
];

export const GENDERS: Option[] = [
  { value: 'male', label: 'Male' },
  { value: 'female', label: 'Female' },
  { value: 'other', label: 'Other' },
  { value: 'prefer_not_to_say', label: 'Prefer not to say' },
];

export const LANGUAGES: Option[] = [
  { value: 'English', label: 'English' },
  { value: 'Spanish', label: 'Spanish' },
  { value: 'Haitian Creole', label: 'Haitian Creole' },
  { value: 'Portuguese', label: 'Portuguese' },
  { value: 'Other', label: 'Other' },
];

// Standard dual-eligible Medicaid categories. Stored as the code.
export const MEDICAID_LEVELS: Option[] = [
  { value: 'QMB', label: 'QMB — Qualified Medicare Beneficiary' },
  { value: 'QMB+', label: 'QMB+ (with full Medicaid)' },
  { value: 'SLMB', label: 'SLMB — Specified Low-Income Medicare Beneficiary' },
  { value: 'SLMB+', label: 'SLMB+ (with full Medicaid)' },
  { value: 'QI', label: 'QI — Qualifying Individual' },
  { value: 'FBDE', label: 'FBDE — Full Benefit Dual Eligible' },
  { value: 'QDWI', label: 'QDWI — Qualified Disabled & Working Individual' },
  { value: 'N/A', label: 'Not applicable' },
];

// Common Medicare carriers. Used as type-ahead suggestions (free text still allowed).
export const CARRIERS: string[] = [
  'UnitedHealthcare',
  'Humana',
  'Aetna',
  'Cigna',
  'WellCare',
  'Blue Cross Blue Shield',
  'Anthem',
  'Wellpoint',
  'Kaiser Permanente',
  'Centene',
  'Molina Healthcare',
  'Devoted Health',
  'Florida Blue',
  'CarePlus',
];
