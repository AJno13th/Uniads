import type { NewLeadInput } from "./types";

/**
 * The preset WhatsApp message doubles as the advisor's briefing: every
 * qualifying answer the student picked arrives in the first message.
 */
export function buildPresetMessage(
  reference: string | null,
  input: Partial<NewLeadInput> & { fullName?: string }
) {
  const lines = [
    reference
      ? `Hi UNIADS, I'd like to start my application. (Ref ${reference})`
      : "Hi UNIADS, I'd like to start my application.",
    "",
    input.fullName ? `Name: ${input.fullName}` : null,
    input.settlementStatus ? `Settlement status: ${input.settlementStatus}` : null,
    input.ukResidency ? `Time in the UK: ${input.ukResidency}` : null,
    input.ageBracket ? `Age: ${input.ageBracket}` : null,
    input.highestQualification
      ? `Highest qualification: ${input.highestQualification}`
      : null,
    input.previousStudentFinance
      ? `Student finance history: ${input.previousStudentFinance}`
      : null,
    input.university ? `University: ${input.university}` : null,
    input.course ? `Course: ${input.course}` : null,
    input.courseLevel ? `Course level: ${input.courseLevel}` : null,
    input.studyMode ? `Study mode: ${input.studyMode}` : null,
    input.classPreference ? `Class preference: ${input.classPreference}` : null,
    input.preferredCity ? `Preferred city: ${input.preferredCity}` : null,
    input.intake ? `Intake: ${input.intake}` : null,
    input.services?.length ? `Support needed: ${input.services.join(", ")}` : null,
    input.callDate
      ? `Requested call: ${input.callDate}${input.callTime ? ` at ${input.callTime}` : ""}`
      : null,
    input.notes ? `Notes: ${input.notes}` : null,
  ].filter(Boolean);

  return lines.join("\n");
}
