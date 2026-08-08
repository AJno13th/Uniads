/**
 * Instant Form passport / permit options for Instagram + TikTok lead ads.
 * Extra statuses can be typed in admin via SelectOrCustom.
 */
export const settlementStatuses = [
  "British",
  "EU",
  "Refugee",
  "ILR (Indefinite Leave to Remain)",
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

/** Instant Form: “Do you have any previous qualification?” */
export const qualificationOptions = ["Yes", "No"] as const;

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

/** Instant Form statuses score as strong; legacy CRM values still get a bump. */
const strongStatuses = new Set<string>(settlementStatuses);

export type ScoreBand = "hot" | "warm" | "cold";

export type ScoreInput = {
  settlementStatus?: string | null;
  ukResidency?: string | null;
  ageBracket?: string | null;
  highestQualification?: string | null;
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

  if (input.highestQualification === "No") score += 8;
  else if (input.highestQualification === "Yes") score += 4;

  if (input.university) score += 6;
  if (input.course) score += 6;
  if (input.studyMode) score += 3;
  if (input.phone) score += 3;

  const capped = Math.min(score, 100);
  const band: ScoreBand = capped >= 70 ? "hot" : capped >= 45 ? "warm" : "cold";
  return { score: capped, band };
}
