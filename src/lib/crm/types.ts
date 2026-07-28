export const leadStages = [
  "new",
  "contacted",
  "qualified",
  "application_submitted",
  "interview_test",
  "offer_received",
  "finance_submitted",
  "enrolled",
  "not_eligible",
  "lost",
] as const;

export type LeadStage = (typeof leadStages)[number];

export const stageLabels: Record<LeadStage, string> = {
  new: "New enquiry",
  contacted: "Contacted",
  qualified: "Qualified",
  application_submitted: "Application submitted",
  interview_test: "Interview / test",
  offer_received: "Offer received",
  finance_submitted: "Student finance submitted",
  enrolled: "Enrolled",
  not_eligible: "Not eligible",
  lost: "Lost",
};

export type LeadSource = "apply" | "booking" | "quick_qualifier" | "landing";

export type Activity = {
  id: string;
  at: string;
  type: "note" | "stage_change" | "created" | "owner_change" | "field_update" | "attachment";
  body: string;
  author: string;
};

/** Document stored on the client file (passport, CV, certificates, etc.). */
export type LeadAttachment = {
  id: string;
  /** Advisor-chosen label, e.g. "Passport", "CV", "Level 3 Certificate" */
  label: string;
  fileName: string;
  mimeType: string;
  size: number;
  /** Base64 payload (no data: prefix) */
  data: string;
  uploadedAt: string;
  uploadedBy: string;
};

export type Lead = {
  id: string;
  reference: string;
  createdAt: string;
  updatedAt: string;
  source: LeadSource;
  stage: LeadStage;
  owner: string | null;
  score: number;
  scoreBand: "hot" | "warm" | "cold";

  fullName: string;
  email: string;
  phone: string;

  settlementStatus: string | null;
  ukResidency: string | null;
  ageBracket: string | null;
  highestQualification: string | null;
  previousStudentFinance: string | null;

  university: string | null;
  course: string | null;
  courseLevel: string | null;
  studyMode: string | null;
  classPreference: string | null;
  preferredCity: string | null;
  intake: string | null;

  services: string[];
  notes: string | null;

  callDate: string | null;
  callTime: string | null;

  attachments: LeadAttachment[];
  activities: Activity[];
};

/** Editable client-file fields advisors can update in the CRM. */
export type LeadProfilePatch = {
  fullName?: string;
  email?: string;
  phone?: string;
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
};

export type NewLeadInput = Omit<
  Lead,
  | "id"
  | "reference"
  | "createdAt"
  | "updatedAt"
  | "stage"
  | "owner"
  | "score"
  | "scoreBand"
  | "activities"
  | "attachments"
> & {
  stage?: LeadStage;
};

export type LeadFilters = {
  search?: string;
  stage?: LeadStage | "all";
  settlementStatus?: string;
  university?: string;
  studyMode?: string;
  band?: "hot" | "warm" | "cold" | "all";
  source?: LeadSource | "all";
};

export type NewAttachmentInput = {
  label: string;
  fileName: string;
  mimeType: string;
  size: number;
  data: string;
};
