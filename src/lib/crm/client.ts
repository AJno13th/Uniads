"use client";

export type LeadPayload = {
  source: "apply" | "booking" | "quick_qualifier" | "landing";
  fullName: string;
  email?: string;
  phone: string;
  settlementStatus?: string | null;
  ukResidency?: string | null;
  ageBracket?: string | null;
  highestQualification?: string | null;
  previousStudentFinance?: string | null;
  university?: string | null;
  course?: string | null;
  courseLevel?: string | null;
  studyMode?: string | null;
  classPreference?: string | null;
  preferredCity?: string | null;
  intake?: string | null;
  services?: string[];
  notes?: string | null;
  callDate?: string | null;
  callTime?: string | null;
  company?: string;
};

export type LeadResponse = {
  ok: true;
  reference: string | null;
  scoreBand?: "hot" | "warm" | "cold";
  whatsappUrl?: string;
};

export async function submitLead(payload: LeadPayload): Promise<LeadResponse> {
  const response = await fetch("/api/leads", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    const data = (await response.json().catch(() => ({}))) as { error?: string };
    throw new Error(data.error ?? "Something went wrong. Please try again.");
  }

  return (await response.json()) as LeadResponse;
}
