import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { getSession } from "@/lib/crm/auth";
import { getLeadStore } from "@/lib/crm/store";
import { stageLabels } from "@/lib/crm/types";
import { buildPresetMessage } from "@/lib/crm/message";
import { siteConfig, whatsappLink } from "@/data/site";
import { LeadControls } from "./LeadControls";

type Params = Promise<{ id: string }>;

const bandStyles: Record<string, string> = {
  hot: "bg-red-100 text-red-800",
  warm: "bg-amber-100 text-amber-800",
  cold: "bg-slate-200 text-slate-700",
};

export default async function LeadDetailPage({ params }: { params: Params }) {
  const session = await getSession();
  if (!session) redirect("/admin/login");

  const { id } = await params;
  const store = await getLeadStore();
  const lead = await store.get(id);
  if (!lead) notFound();

  const fields: [string, string | null][] = [
    ["Residency status", lead.settlementStatus],
    ["Time in the UK", lead.ukResidency],
    ["Age", lead.ageBracket],
    ["Highest qualification", lead.highestQualification],
    ["Student finance history", lead.previousStudentFinance],
    ["University", lead.university],
    ["Course", lead.course],
    ["Course level", lead.courseLevel],
    ["Study mode", lead.studyMode],
    ["Class preference", lead.classPreference],
    ["Preferred city", lead.preferredCity],
    ["Intake", lead.intake],
    ["Requested call", lead.callDate ? `${lead.callDate} ${lead.callTime ?? ""}` : null],
    ["Source", lead.source.replace("_", " ")],
  ];

  const followUp = whatsappLink(
    `Hi ${lead.fullName.split(" ")[0]}, this is UNIADS following up on your application (${lead.reference}).`
  );

  return (
    <div className="mx-auto max-w-6xl space-y-6 px-4 py-8 sm:px-6">
      <Link href="/admin" className="text-sm font-semibold text-teal">
        ← Back to pipeline
      </Link>

      <header className="rounded-xl bg-white p-6 shadow-sm">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <h1 className="display text-3xl text-navy">{lead.fullName}</h1>
            <p className="mt-1 text-sm text-muted">
              {lead.reference} · created{" "}
              {new Date(lead.createdAt).toLocaleString("en-GB")}
            </p>
            <div className="mt-3 flex flex-wrap gap-3 text-sm">
              <a className="font-semibold text-teal" href={`tel:${lead.phone}`}>
                {lead.phone}
              </a>
              {lead.email && (
                <a className="font-semibold text-teal" href={`mailto:${lead.email}`}>
                  {lead.email}
                </a>
              )}
            </div>
          </div>
          <div className="flex flex-col items-end gap-2">
            <span
              className={`rounded px-3 py-1 text-xs font-bold uppercase ${bandStyles[lead.scoreBand]}`}
            >
              {lead.scoreBand} lead · {lead.score}/100
            </span>
            <span className="text-xs font-semibold text-navy">
              {stageLabels[lead.stage]}
            </span>
            <div className="mt-2 flex gap-2">
              <a
                href={followUp}
                target="_blank"
                rel="noopener noreferrer"
                className="rounded-md bg-[#25D366] px-3 py-2 text-xs font-bold text-white"
              >
                WhatsApp
              </a>
              <a
                href={`tel:${lead.phone}`}
                className="rounded-md bg-navy px-3 py-2 text-xs font-bold text-white"
              >
                Call
              </a>
              {lead.email && (
                <a
                  href={`mailto:${lead.email}?subject=Your UNIADS application ${lead.reference}`}
                  className="rounded-md border border-navy/20 px-3 py-2 text-xs font-bold text-navy"
                >
                  Email
                </a>
              )}
            </div>
          </div>
        </div>
      </header>

      <div className="grid gap-6 lg:grid-cols-[1.4fr_1fr]">
        <section className="space-y-6">
          <div className="rounded-xl bg-white p-6 shadow-sm">
            <h2 className="text-sm font-bold uppercase tracking-wider text-teal">
              Qualification answers
            </h2>
            <dl className="mt-4 grid gap-3 sm:grid-cols-2">
              {fields.map(([label, value]) => (
                <div key={label} className="border-b border-line/70 pb-2">
                  <dt className="text-xs uppercase tracking-wider text-muted">
                    {label}
                  </dt>
                  <dd className="text-sm font-medium text-navy">{value || "—"}</dd>
                </div>
              ))}
            </dl>

            {lead.services.length > 0 && (
              <>
                <h3 className="mt-6 text-xs uppercase tracking-wider text-muted">
                  Support requested
                </h3>
                <ul className="mt-2 flex flex-wrap gap-2">
                  {lead.services.map((s) => (
                    <li
                      key={s}
                      className="rounded bg-cream px-2 py-1 text-xs font-semibold text-navy"
                    >
                      {s}
                    </li>
                  ))}
                </ul>
              </>
            )}

            {lead.notes && (
              <>
                <h3 className="mt-6 text-xs uppercase tracking-wider text-muted">
                  Applicant notes
                </h3>
                <p className="mt-2 whitespace-pre-wrap text-sm text-navy">
                  {lead.notes}
                </p>
              </>
            )}
          </div>

          <div className="rounded-xl bg-white p-6 shadow-sm">
            <h2 className="text-sm font-bold uppercase tracking-wider text-teal">
              Preset message sent by this lead
            </h2>
            <pre className="mt-3 overflow-x-auto whitespace-pre-wrap rounded-lg bg-cream p-4 text-xs text-navy">
              {buildPresetMessage(lead.reference, lead)}
            </pre>
          </div>

          <div className="rounded-xl bg-white p-6 shadow-sm">
            <h2 className="text-sm font-bold uppercase tracking-wider text-teal">
              Activity
            </h2>
            <ul className="mt-4 space-y-3">
              {[...lead.activities].reverse().map((activity) => (
                <li key={activity.id} className="border-l-2 border-olive pl-3">
                  <p className="text-sm text-navy">{activity.body}</p>
                  <p className="text-xs text-muted">
                    {new Date(activity.at).toLocaleString("en-GB")} · {activity.author}
                  </p>
                </li>
              ))}
            </ul>
          </div>
        </section>

        <aside className="space-y-6">
          <LeadControls
            leadId={lead.id}
            stage={lead.stage}
            owner={lead.owner}
          />
          <div className="rounded-xl bg-white p-6 text-xs text-muted shadow-sm">
            <p className="font-semibold text-navy">Advisor line</p>
            <p className="mt-1">{siteConfig.phoneDisplay}</p>
            <p className="mt-3 font-semibold text-navy">Team inbox</p>
            <p className="mt-1">{siteConfig.email}</p>
          </div>
        </aside>
      </div>
    </div>
  );
}
