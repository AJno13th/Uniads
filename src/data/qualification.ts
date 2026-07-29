/**
 * Residency statuses for the UNIADS eligibility funnel — the same list used in
 * TikTok creatives (British/Irish, ILR, EU Settled, Refugee, Humanitarian,
 * Ukraine Scheme). Non-eligible catch-alls are omitted so only the target
 * audience can progress on the form.
 */
export const settlementStatuses = [
  "British Citizen",
  "Irish Citizen",
  "ILR (Indefinite Leave to Remain)",
  "EU Settled Status",
  "Refugee / Asylum Granted",
  "Humanitarian Protection",
  "Ukraine Scheme",
] as const;

export const residencyOptions = [
  "Less than 6 months",
  "6 months – 1 year",
  "1 – 3 years",
  "3 – 5 years",
  "5+ years",
  "Born in the UK",
] as const;

export const ageBrackets = [
  "18 – 20",
  "21 – 24",
  "25 – 34",
  "35 – 44",
  "45+",
] as const;

export const qualificationOptions = [
  "No formal qualifications",
  "GCSEs only",
  "Level 3 / BTEC / A-Levels",
  "Access to HE Diploma",
  "Overseas qualification / diploma",
  "HND / CertHE / Foundation completed",
  "Bachelor’s degree",
  "Master’s degree",
] as const;

export const studyModes = ["Full-time", "Part-time"] as const;

export const classPreferences = [
  "Weekday – morning",
  "Weekday – evening",
  "Weekend",
  "Online",
  "Blended (online + campus)",
  "No preference",
] as const;

export const financeHistoryOptions = [
  "No — I have never received student finance",
  "Yes — I have received student finance before",
  "Not sure",
] as const;

export const intakeOptions = [
  "Next available intake",
  "September",
  "January",
  "May / June",
  "Not sure yet",
] as const;

export const preferredCities = [
  "London",
  "Birmingham",
  "Manchester",
  "Leeds",
  "Leicester",
  "Bradford",
  "Luton",
  "Newcastle",
  "Derby",
  "Northampton",
  "Online only",
  "No preference",
] as const;

/**
 * Every status on the public form is an eligibility-target status, so they all
 * score as strong. Legacy CRM values outside the list still get a small bump.
 */
const strongStatuses = new Set<string>(settlementStatuses);

export type ScoreBand = "hot" | "warm" | "cold";

export type ScoreInput = {
  settlementStatus?: string | null;
  ukResidency?: string | null;
  ageBracket?: string | null;
  highestQualification?: string | null
  previousStudentFinance?: string | null;
  university?: string | null;
  course?: string | null;
  studyMode?: string | null;
  phone?: string | null;
  email?: string | null;
};

export function scoreLead(input: ScoreInput): { score: number; band: ScoreBand } {
  let score = 0;

  const status = input.settlementStatus ?? "";
  if (strongStatuses.has(status)) score += 35;
  else if (status) score += 5;

  const residency = input.ukResidency ?? "";
  if (residency === "Born in the UK" || residency === "5+ years") score += 20;
  else if (residency === "3 – 5 years") score += 15;
  else if (residency === "1 – 3 years") score += 8;

  const age = input.ageBracket ?? "";
  // 21+ applicants can enrol without formal qualifications on many pathways.
  if (age && age !== "18 – 20") score += 12;
  else if (age === "18 – 20") score += 6;

  if (input.previousStudentFinance?.startsWith("No")) score += 15;
  else if (input.previousStudentFinance?.startsWith("Yes")) score += 4;

  if (input.university) score += 6;
  if (input.course) score += 6;
  if (input.studyMode) score += 3;
  if (input.phone) score += 3;

  const capped = Math.min(score, 100);
  const band: ScoreBand = capped >= 70 ? "hot" : capped >= 45 ? "warm" : "cold";
  return { score: capped, band };
}
