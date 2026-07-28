import Link from "next/link";
import { redirect } from "next/navigation";
import { getSession } from "@/lib/crm/auth";
import { getLeadStore, isDurableStorage } from "@/lib/crm/store";
import { leadStages, stageLabels, type LeadStage } from "@/lib/crm/types";
import { settlementStatuses, studyModes } from "@/data/qualification";
import { universities } from "@/data/universities";

export const dynamic = "force-dynamic";

const bandStyles: Record<string, string> = {
  hot: "bg-red-100 text-red-800",
  warm: "bg-amber-100 text-amber-800",
  cold: "bg-slate-200 text-slate-700",
};

type SearchParams = Promise<{
  search?: string;
  stage?: string;
  settlementStatus?: string;
  university?: string;
  studyMode?: string;
  band?: string;
}>;

export default async function AdminDashboard({
  searchParams,
}: {
  searchParams: SearchParams;
}) {
  const session = await getSession();
  if (!session) redirect("/admin/login");

  const params = await searchParams;
  const store = await getLeadStore();
  const stats = await store.stats();
  const durable = isDurableStorage();
  const leads = await store.list({
    search: params.search,
    stage: (params.stage as LeadStage) ?? "all",
    settlementStatus: params.settlementStatus,
    university: params.university,
    studyMode: params.studyMode,
    band: params.band as "hot" | "warm" | "cold" | "all" | undefined,
  });

  return (
    <div className="mx-auto max-w-7xl space-y-8 px-4 py-8 sm:px-6">
      <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {[
          { label: "Total leads", value: stats.total },
          { label: "Hot leads", value: stats.hot },
          { label: "New in last 7 days", value: stats.last7Days },
          { label: "Enrolled", value: stats.byStage.enrolled ?? 0 },
        ].map((card) => (
          <div key={card.label} className="rounded-xl bg-white p-5 shadow-sm">
            <p className="text-xs font-semibold uppercase tracking-wider text-muted">
              {card.label}
            </p>
            <p className="display mt-2 text-4xl text-navy">{card.value}</p>
          </div>
        ))}
      </section>

      <section className="rounded-xl bg-white p-5 shadow-sm">
        <h2 className="text-sm font-bold uppercase tracking-wider text-teal">
          Pipeline
        </h2>
        <div className="mt-4 flex flex-wrap gap-2">
          {leadStages.map((stage) => (
            <Link
              key={stage}
              href={`/admin?stage=${stage}`}
              className="rounded-lg border border-line px-3 py-2 text-xs font-semibold text-navy hover:border-navy"
            >
              {stageLabels[stage]}
              <span className="ml-2 rounded bg-cream px-1.5 py-0.5 text-navy">
                {stats.byStage[stage] ?? 0}
              </span>
            </Link>
          ))}
        </div>
      </section>

      <section className="rounded-xl bg-white p-5 shadow-sm">
        <form className="grid gap-3 sm:grid-cols-2 lg:grid-cols-6" action="/admin">
          <input
            name="search"
            defaultValue={params.search ?? ""}
            placeholder="Search name, phone, ref…"
            className="input lg:col-span-2"
          />
          <select name="stage" defaultValue={params.stage ?? "all"} className="input">
            <option value="all">All stages</option>
            {leadStages.map((s) => (
              <option key={s} value={s}>
                {stageLabels[s]}
              </option>
            ))}
          </select>
          <select
            name="settlementStatus"
            defaultValue={params.settlementStatus ?? "all"}
            className="input"
          >
            <option value="all">Any residency status</option>
            {settlementStatuses.map((s) => (
              <option key={s} value={s}>
                {s}
              </option>
            ))}
          </select>
          <select
            name="university"
            defaultValue={params.university ?? "all"}
            className="input"
          >
            <option value="all">Any university</option>
            {universities.map((u) => (
              <option key={u.slug} value={u.name}>
                {u.shortName}
              </option>
            ))}
          </select>
          <div className="flex gap-2">
            <select
              name="studyMode"
              defaultValue={params.studyMode ?? "all"}
              className="input"
            >
              <option value="all">Any mode</option>
              {studyModes.map((m) => (
                <option key={m} value={m}>
                  {m}
                </option>
              ))}
            </select>
            <button
              type="submit"
              className="shrink-0 rounded-md bg-navy px-4 text-sm font-bold text-white hover:bg-navy-deep"
            >
              Filter
            </button>
          </div>
        </form>

        <div className="mt-5 overflow-x-auto">
          <table className="w-full min-w-[900px] text-left text-sm">
            <thead className="border-b border-line text-xs uppercase tracking-wider text-muted">
              <tr>
                <th className="py-3 pr-4">Lead</th>
                <th className="py-3 pr-4">Score</th>
                <th className="py-3 pr-4">Residency status</th>
                <th className="py-3 pr-4">University / course</th>
                <th className="py-3 pr-4">Mode</th>
                <th className="py-3 pr-4">Stage</th>
                <th className="py-3">Created</th>
              </tr>
            </thead>
            <tbody>
              {leads.map((lead) => (
                <tr key={lead.id} className="border-b border-line/70 align-top">
                  <td className="py-3 pr-4">
                    <Link
                      href={`/admin/leads/${lead.id}`}
                      className="font-semibold text-navy hover:text-teal"
                    >
                      {lead.fullName}
                    </Link>
                    <p className="text-xs text-muted">{lead.reference}</p>
                    <p className="text-xs text-muted">{lead.phone}</p>
                  </td>
                  <td className="py-3 pr-4">
                    <span
                      className={`rounded px-2 py-1 text-xs font-bold uppercase ${bandStyles[lead.scoreBand]}`}
                    >
                      {lead.scoreBand} · {lead.score}
                    </span>
                  </td>
                  <td className="py-3 pr-4 text-xs text-navy">
                    {lead.settlementStatus ?? "—"}
                    <p className="text-muted">{lead.ukResidency ?? ""}</p>
                  </td>
                  <td className="py-3 pr-4 text-xs">
                    <p className="font-semibold text-navy">{lead.university ?? "—"}</p>
                    <p className="text-muted">{lead.course ?? ""}</p>
                  </td>
                  <td className="py-3 pr-4 text-xs text-navy">
                    {lead.studyMode ?? "—"}
                  </td>
                  <td className="py-3 pr-4 text-xs font-semibold text-teal">
                    {stageLabels[lead.stage]}
                  </td>
                  <td className="py-3 text-xs text-muted">
                    {new Date(lead.createdAt).toLocaleDateString("en-GB")}
                  </td>
                </tr>
              ))}
              {leads.length === 0 && (
                <tr>
                  <td colSpan={7} className="py-10 text-center text-muted">
                    {durable
                      ? "No leads match these filters yet."
                      : "No leads here — CRM storage is ephemeral. Add DATABASE_URL (Postgres) so bookings are saved."}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}
