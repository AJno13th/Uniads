/** Common calling codes for UNIADS applicants (UK-first). */
export const phoneCountries = [
  { code: "44", label: "United Kingdom", flag: "🇬🇧", example: "07368 218457" },
  { code: "353", label: "Ireland", flag: "🇮🇪", example: "085 123 4567" },
  { code: "234", label: "Nigeria", flag: "🇳🇬", example: "0803 123 4567" },
  { code: "233", label: "Ghana", flag: "🇬🇭", example: "024 123 4567" },
  { code: "91", label: "India", flag: "🇮🇳", example: "98765 43210" },
  { code: "92", label: "Pakistan", flag: "🇵🇰", example: "0300 1234567" },
  { code: "880", label: "Bangladesh", flag: "🇧🇩", example: "01712 345678" },
  { code: "1", label: "USA / Canada", flag: "🇺🇸", example: "202 555 0123" },
  { code: "33", label: "France", flag: "🇫🇷", example: "06 12 34 56 78" },
  { code: "49", label: "Germany", flag: "🇩🇪", example: "0151 23456789" },
  { code: "34", label: "Spain", flag: "🇪🇸", example: "612 34 56 78" },
  { code: "39", label: "Italy", flag: "🇮🇹", example: "312 345 6789" },
  { code: "351", label: "Portugal", flag: "🇵🇹", example: "912 345 678" },
  { code: "48", label: "Poland", flag: "🇵🇱", example: "512 345 678" },
  { code: "40", label: "Romania", flag: "🇷🇴", example: "0712 345 678" },
  { code: "380", label: "Ukraine", flag: "🇺🇦", example: "050 123 4567" },
  { code: "90", label: "Turkey", flag: "🇹🇷", example: "0532 123 4567" },
  { code: "971", label: "UAE", flag: "🇦🇪", example: "050 123 4567" },
  { code: "966", label: "Saudi Arabia", flag: "🇸🇦", example: "051 234 5678" },
  { code: "254", label: "Kenya", flag: "🇰🇪", example: "0712 345678" },
  { code: "27", label: "South Africa", flag: "🇿🇦", example: "082 123 4567" },
  { code: "61", label: "Australia", flag: "🇦🇺", example: "0412 345 678" },
  { code: "86", label: "China", flag: "🇨🇳", example: "138 0013 8000" },
  { code: "852", label: "Hong Kong", flag: "🇭🇰", example: "9123 4567" },
  { code: "65", label: "Singapore", flag: "🇸🇬", example: "8123 4567" },
] as const;

export type PhoneCountryCode = (typeof phoneCountries)[number]["code"];

export const defaultPhoneCountryCode: PhoneCountryCode = "44";

/**
 * Build E.164-style phone (+447…) from country dial code + national number.
 * Strips a leading 0 from the national part (common UK/local format).
 */
export function composeInternationalPhone(
  countryCode: string,
  nationalNumber: string
): string | null {
  const cc = countryCode.replace(/\D/g, "");
  let national = nationalNumber.replace(/\D/g, "");
  if (!cc || !national) return null;

  // If user pasted a full international number into the national field, keep it
  if (national.startsWith(cc) && national.length > cc.length + 6) {
    return `+${national}`;
  }
  if (national.startsWith("00") && national.length > 8) {
    return `+${national.slice(2)}`;
  }

  // Drop trunk prefix 0 (UK 07…, FR 06…, etc.)
  if (national.startsWith("0")) national = national.slice(1);
  if (!national) return null;

  return `+${cc}${national}`;
}

/** Best-effort split of a stored phone into dial code + national number. */
export function splitInternationalPhone(phone: string): {
  country: string;
  national: string;
} {
  let digits = phone.trim().replace(/[^\d+]/g, "");
  if (digits.startsWith("00")) digits = digits.slice(2);
  if (digits.startsWith("+")) digits = digits.slice(1);
  digits = digits.replace(/\D/g, "");

  if (!digits) {
    return { country: defaultPhoneCountryCode, national: "" };
  }

  if (digits.startsWith("0")) {
    return { country: defaultPhoneCountryCode, national: digits };
  }

  const sorted = [...phoneCountries].sort(
    (a, b) => b.code.length - a.code.length
  );
  for (const c of sorted) {
    if (digits.startsWith(c.code) && digits.length >= c.code.length + 6) {
      return { country: c.code, national: digits.slice(c.code.length) };
    }
  }

  return { country: defaultPhoneCountryCode, national: digits };
}
