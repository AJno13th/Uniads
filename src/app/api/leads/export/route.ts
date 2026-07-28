import { getSession } from "@/lib/crm/auth";
import { getLeadStore } from "@/lib/crm/store";
import { stageLabels } from "@/lib/crm/types";

function csvCell(value: unknown) {
  const text = value === null || value === undefined ? "" : String(value);
  return `"${text.replace(/"/g, '""').replace(/\r?\n/g, " ")}"`;
}

export async function GET() {
  const session = await getSession();
  if (!session) {
    return new Response("Unauthorised", { status: 401 });
  }

  const store = await getLeadStore();
  const leads = await store.list();

  const headers = [
    "Reference",
    "Created",
    "Stage",
    "Score",
    "Band",
    "Owner",
    "Name",
    "Email",
    "Phone",
    "Residency status",
    "Time in UK",
    "Age",
    "Highest qualification",
    "Student finance history",
    "University",
    "Course",
    "Course level",
    "Study mode",
    "Class preference",
    "Preferred city",
    "Intake",
    "Services",
    "Call date",
    "Call time",
    "Source",
    "UTM source",
    "UTM medium",
    "UTM campaign",
    "UTM content",
    "Landing page",
    "Notes",
  ];

  const rows = leads.map((lead) =>
    [
      lead.reference,
      lead.createdAt,
      stageLabels[lead.stage],
      lead.score,
      lead.scoreBand,
      lead.owner,
      lead.fullName,
      lead.email,
      lead.phone,
      lead.settlementStatus,
      lead.ukResidency,
      lead.ageBracket,
      lead.highestQualification,
      lead.previousStudentFinance,
      lead.university,
      lead.course,
      lead.courseLevel,
      lead.studyMode,
      lead.classPreference,
      lead.preferredCity,
      lead.intake,
      lead.services.join(" | "),
      lead.callDate,
      lead.callTime,
      lead.source,
      lead.utmSource,
      lead.utmMedium,
      lead.utmCampaign,
      lead.utmContent,
      lead.landingPage,
      lead.notes,
    ]
      .map(csvCell)
      .join(",")
  );

  const csv = [headers.map(csvCell).join(","), ...rows].join("\n");
  const filename = `uniads-leads-${new Date().toISOString().slice(0, 10)}.csv`;

  return new Response(csv, {
    headers: {
      "Content-Type": "text/csv; charset=utf-8",
      "Content-Disposition": `attachment; filename="${filename}"`,
    },
  });
}
