import type { Metadata } from "next";
import Link from "next/link";
import { PageHero } from "@/components/PageHero";
import { Button } from "@/components/Button";
import { CourseCategoryTabs, CourseList } from "@/components/CourseList";
import { courseTypes } from "@/data/site";
import {
  courseCounts,
  universities,
  subjectAreas,
  foundationCourses,
  undergraduateCourses,
  mastersCourses,
  otherCourses,
} from "@/data/universities";

export const metadata: Metadata = {
  title: "Courses & Partner Universities",
  description:
    "Browse UNIADS courses clearly separated into Foundation Year, Undergraduate, Master’s and Other pathways (HND & CertHE), plus partner universities across the UK.",
  alternates: { canonical: "/courses" },
};

export default function CoursesPage() {
  const counts = courseCounts();
  const preview = {
    foundation: foundationCourses().slice(0, 4),
    undergraduate: undergraduateCourses().slice(0, 4),
    masters: mastersCourses().slice(0, 4),
    other: otherCourses().slice(0, 4),
  };

  return (
    <>
      <PageHero
        eyebrow="Courses"
        title="Courses & partner universities"
        description="Browse our current enrolments by pathway. Foundation, Undergraduate, Master’s and Other routes are listed separately so you can find the right fit quickly."
        ctaMode="apply-only"
      />

      <section className="bg-white">
        <div className="mx-auto max-w-7xl space-y-6 px-4 py-8 sm:px-6 lg:px-8">
          <Button href="/services" variant="ghost">
            ← Our services
          </Button>
          <CourseCategoryTabs active="all" />
        </div>
      </section>

      <section className="bg-cream">
        <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8">
          <h2 className="display text-3xl text-navy">Choose your pathway</h2>
          <p className="mt-3 max-w-2xl text-muted">
            Each category opens a dedicated list of courses we are currently helping
            students enrol onto.
          </p>
          <div className="mt-8 grid gap-5 sm:grid-cols-2">
            {courseTypes.map((c) => {
              const count =
                c.slug === "foundation"
                  ? counts.foundation
                  : c.slug === "undergraduate"
                    ? counts.undergraduate
                    : c.slug === "masters"
                      ? counts.masters
                      : counts.other;
              return (
                <Link
                  key={c.slug}
                  href={c.href}
                  className="border border-transparent bg-white p-6 transition hover:border-navy hover:shadow-md"
                >
                  <div className="flex items-start justify-between gap-3">
                    <h3 className="display text-2xl text-navy">{c.title}</h3>
                    <span className="shrink-0 bg-olive px-2.5 py-1 text-xs font-bold text-navy-deep">
                      {count} courses
                    </span>
                  </div>
                  <p className="mt-3 text-sm text-muted">{c.description}</p>
                  <span className="mt-4 inline-block text-sm font-bold text-teal">
                    View {c.shortTitle.toLowerCase()} courses →
                  </span>
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      {(
        [
          ["Foundation Year", "/courses/foundation", preview.foundation],
          ["Undergraduate", "/courses/undergraduate", preview.undergraduate],
          ["Master’s", "/courses/masters", preview.masters],
          ["Other Pathways", "/courses/other", preview.other],
        ] as const
      ).map(([title, href, courses]) => (
        <section key={title} className="border-t border-line bg-white">
          <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
            <div className="mb-5 flex flex-wrap items-end justify-between gap-3">
              <h2 className="display text-2xl text-navy sm:text-3xl">{title}</h2>
              <Link href={href} className="text-sm font-bold text-teal hover:underline">
                See all {title.toLowerCase()} →
              </Link>
            </div>
            <CourseList courses={[...courses]} />
          </div>
        </section>
      ))}

      <section className="bg-cream">
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
            Click a partner to see schedules, entry notes and courses grouped by
            Foundation, Undergraduate, Master’s and Other pathways.
          </p>
          <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {universities.map((u) => {
              const active = u.courses.filter((c) => c.status !== "not-running");
              return (
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
                    {active.length} courses listed
                  </p>
                </Link>
              );
            })}
          </div>
        </div>
      </section>
    </>
  );
}
