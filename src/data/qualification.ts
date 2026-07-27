export const settlementStatuses = [
  "British citizen",
  "Irish citizen",
  "EU Settled Status (EUSS)",
  "EU Pre-Settled Status (EUSS)",
  "Indefinite Leave to Remain (ILR)",
  "Indefinite Leave to Enter (ILE)",
  "Limited Leave to Remain (LLR)",
  "Refugee status",
  "Humanitarian Protection",
  "Discretionary Leave to Remain",
  "Spouse / partner visa",
  "Dependant visa",
  "Student visa",
  "Other / Not sure",
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
 * Student finance eligibility in England generally requires settled or
 * pre-settled/protected status plus a UK residency history, so these signals
 * drive how a lead is prioritised for the advisor team.
 */
const strongStatuses = new Set<string>([
  "British citizen",
  "Irish citizen",
  "EU Settled Status (EUSS)",
  "Indefinite Leave to Remain (ILR)",
  "Indefinite Leave to Enter (ILE)",
  "Refugee status",
  "Humanitarian Protection",
]);

const mediumStatuses = new Set<string>([
  "EU Pre-Settled Status (EUSS)",
  "Discretionary Leave to Remain",
  "Limited Leave to Remain (LLR)",
  "Spouse / partner visa",
]);

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
  else if (mediumStatuses.has(status)) score += 20;
  else if (status && status !== "Other / Not sure") score += 5;

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
