"use client";

import { getAttribution, trackLeadConversion } from "@/lib/attribution";

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
  utmSource?: string | null;
  utmMedium?: string | null;
  utmCampaign?: string | null;
  utmContent?: string | null;
  utmTerm?: string | null;
  fbclid?: string | null;
  ttclid?: string | null;
  gclid?: string | null;
  landingPage?: string | null;
  referrer?: string | null;
};

export type LeadResponse = {
  ok: true;
  reference: string | null;
  scoreBand?: "hot" | "warm" | "cold";
  whatsappUrl?: string;
};

export async function submitLead(payload: LeadPayload): Promise<LeadResponse> {
  const attribution = getAttribution();
  const response = await fetch("/api/leads", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      ...payload,
      utmSource: payload.utmSource ?? attribution.utmSource,
      utmMedium: payload.utmMedium ?? attribution.utmMedium,
      utmCampaign: payload.utmCampaign ?? attribution.utmCampaign,
      utmContent: payload.utmContent ?? attribution.utmContent,
      utmTerm: payload.utmTerm ?? attribution.utmTerm,
      fbclid: payload.fbclid ?? attribution.fbclid,
      ttclid: payload.ttclid ?? attribution.ttclid,
      gclid: payload.gclid ?? attribution.gclid,
      landingPage: payload.landingPage ?? attribution.landingPage,
      referrer: payload.referrer ?? attribution.referrer,
    }),
  });

  if (!response.ok) {
    const data = (await response.json().catch(() => ({}))) as { error?: string };
    throw new Error(data.error ?? "Something went wrong. Please try again.");
  }

  const result = (await response.json()) as LeadResponse;
  trackLeadConversion(result.reference);
  return result;
}
