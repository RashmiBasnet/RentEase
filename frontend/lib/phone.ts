/**
 * Phone helpers shared by sign-up, booking, and profile so every screen accepts
 * the same range of formats and stores the same normalized value (Postel's Law).
 */

/**
 * Strip formatting (spaces, dashes, parentheses, "+") and any Nepal country /
 * trunk prefix down to the 10-digit local number. Liberal in what it accepts:
 * "+977 98-1234-5678", "0981234567", "981 234 5678" all reduce to "9812345678".
 */
export function normalizePhone(input: string): string {
  let digits = (input ?? "").replace(/\D/g, "");
  if (digits.length === 13 && digits.startsWith("977")) digits = digits.slice(3);
  if (digits.length === 11 && digits.startsWith("0")) digits = digits.slice(1);
  return digits;
}

/** True when the input reduces to a valid 10-digit local number. */
export function isValidNepaliPhone(input: string): boolean {
  return /^\d{10}$/.test(normalizePhone(input));
}
