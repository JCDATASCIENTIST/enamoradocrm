// Path B HIPAA guard: server-side regex check that rejects strings containing
// obvious PHI/PII patterns. We don't store full SSNs, MBIs, or Medicaid IDs.
//
// This is a best-effort filter — UI banners + admin training are the primary
// defense. Patterns here aim to catch the common cases without producing too
// many false positives.

// xxx-xx-xxxx or 9 contiguous digits not part of a longer number.
const SSN = /(?:(?<!\d)\d{3}-\d{2}-\d{4}(?!\d)|(?<!\d)\d{9}(?!\d))/;

// CMS MBI: 11 chars, fixed positional rules — start with non-zero numeric,
// alternating digit/letter pattern, no S/L/O/B/I/Z. Conservative: 11-char
// alphanumeric block that contains both letters and digits.
const MBI = /(?<![A-Za-z0-9])(?=[A-Za-z0-9]{11})(?=.*[A-Za-z])(?=.*\d)[A-Za-z0-9]{11}(?![A-Za-z0-9])/;

export type PhiCheckResult = { ok: true } | { ok: false; reason: string };

export function checkForPhi(value: string | null | undefined): PhiCheckResult {
  if (!value) return { ok: true };
  if (SSN.test(value)) {
    return { ok: false, reason: 'Looks like a Social Security Number. Per Path B, only the last 4 may be stored.' };
  }
  if (MBI.test(value)) {
    return { ok: false, reason: 'Looks like a full Medicare Beneficiary Identifier (MBI). Path B prohibits full IDs.' };
  }
  return { ok: true };
}

// Soft length cap for free-text identifier-style fields (medicaid_level, etc.)
export function checkShortIdField(value: string | null | undefined, max = 32): PhiCheckResult {
  if (!value) return { ok: true };
  if (value.length > max) {
    return { ok: false, reason: `Value is too long (${value.length} chars). Use short category names only; full IDs are not allowed under Path B.` };
  }
  return checkForPhi(value);
}
