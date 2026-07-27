import type { Metadata } from "next";
import Link from "next/link";
import { PageHero } from "@/components/PageHero";
import { Button } from "@/components/Button";
import { courseTypes } from "@/data/site";
import { universities, subjectAreas } from "@/data/universities";

export const metadata: Metadata = {
  title: "Courses & Partner Universities",
  description:
    "Browse UNIADS courses currently open for enrolment and the UK universities and colleges we partner with — foundation, undergraduate and postgraduate pathways.",
  alternates: { canonical: "/courses" },
};

export default function CoursesPage() {
  return (
    <>
      <PageHero
        eyebrow="Courses"
        title="Courses & partner universities"
        description="Explore the courses we are currently enrolling for and the universities and colleges UNIADS partners with. Need application help first? Visit our Services page."
      />

      <section className="bg-white">
        <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
          <div className="flex flex-wrap gap-3">
            <Button href="/services" variant="ghost">
              ← Our services
            </Button>
            <Button href="/apply" variant="olive">
              Apply now
            </Button>
          </div>
        </div>
      </section>

      <section className="bg-cream">
        <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8">
          <h2 className="display text-3xl text-navy">Course types</h2>
          <p className="mt-3 max-w-2xl text-muted">
            Each course type opens a dedicated page with programmes we are
            currently helping students enrol onto.
          </p>
          <div className="mt-8 grid gap-5 md:grid-cols-3">
            {courseTypes.map((c) => (
              <Link
                key={c.slug}
                href={c.href}
                className="bg-white p-6 transition hover:shadow-md"
              >
                <h3 className="display text-2xl text-navy">{c.title}</h3>
                <p className="mt-3 text-sm text-muted">{c.description}</p>
                <span className="mt-4 inline-block text-sm font-bold text-teal">
                  View courses →
                </span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-white">
        <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8">
          <h2 className="display text-3xl text-navy">Subject areas</h2>
          <ul className="mt-6 grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
            {subjectAreas.map((s) => (
              <li key={s} className="border-b border-line py-3 font-medium text-navy">
                {s}
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section className="bg-teal-soft/40">
        <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8">
          <h2 className="display text-3xl text-navy">
            Universities &amp; colleges we partner with
          </h2>
          <p className="mt-3 max-w-2xl text-muted">
            Click a partner to see schedules, entry notes and courses currently
            available through UNIADS.
          </p>
          <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {universities.map((u) => (
              <Link
                key={u.slug}
                href={`/courses/${u.slug}`}
                className="border border-line bg-white p-5 transition hover:border-navy"
              >
                <h3 className="font-bold text-navy">{u.shortName}</h3>
                <p className="mt-1 text-sm text-muted">{u.name}</p>
                <p className="mt-3 text-xs text-teal">
                  {u.locations.slice(0, 3).join(" · ")}
                  {u.locations.length > 3 ? " · +" : ""}
                </p>
                <p className="mt-2 text-xs text-muted">
                  {u.courses.filter((c) => c.status !== "not-running").length}{" "}
                  courses listed
                </p>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
