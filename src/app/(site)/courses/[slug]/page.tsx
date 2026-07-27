import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { PageHero } from "@/components/PageHero";
import { Button } from "@/components/Button";
import { CourseCategoryTabs } from "@/components/CourseList";
import {
  courseCategory,
  courseCategoryMeta,
  getUniversity,
  levelLabel,
  universities,
  type CourseCategory,
} from "@/data/universities";
import { whatsappLink } from "@/data/site";

type Props = { params: Promise<{ slug: string }> };

const categoryOrder: CourseCategory[] = [
  "foundation",
  "undergraduate",
  "masters",
  "other",
];

export function generateStaticParams() {
  return universities.map((u) => ({ slug: u.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const uni = getUniversity(slug);
  if (!uni) return { title: "University" };
  return {
    title: `${uni.name} Courses`,
    description: `Explore ${uni.name} courses, entry requirements, study modes and locations available through UNIADS Educational Consulting.`,
    alternates: { canonical: `/courses/${uni.slug}` },
  };
}

export default async function UniversityPage({ params }: Props) {
  const { slug } = await params;
  const uni = getUniversity(slug);
  if (!uni) notFound();

  const activeCourses = uni.courses.filter((c) => c.status !== "not-running");
  const grouped: Record<CourseCategory, typeof activeCourses> = {
    foundation: [],
    undergraduate: [],
    masters: [],
    other: [],
  };
  for (const course of activeCourses) {
    grouped[courseCategory(course.level)].push(course);
  }
  const availableCategories = categoryOrder.filter(
    (category) => grouped[category].length > 0,
  );

  return (
    <>
      <PageHero
        eyebrow="Partner institution"
        title={uni.name}
        description={`${uni.schedule}. ${uni.interview}. Locations: ${uni.locations.join(", ")}.`}
      />

      <section className="bg-white">
        <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8">
          <div className="mb-6 flex flex-wrap gap-3">
            <Button href="/courses" variant="ghost">
              ← All courses
            </Button>
            <Button href="/services" variant="ghost">
              Our services
            </Button>
            <Button href="/apply" variant="olive">
              Apply for {uni.shortName}
            </Button>
          </div>

          <div className="mb-8">
            <CourseCategoryTabs active="all" />
          </div>

          <div className="grid gap-6 lg:grid-cols-3">
            <div className="space-y-4 lg:col-span-1">
              <div className="bg-cream p-5">
                <h2 className="text-sm font-bold uppercase tracking-wider text-teal">
                  At a glance
                </h2>
                <ul className="mt-4 space-y-3 text-sm text-navy">
                  <li>
                    <strong>Schedule:</strong> {uni.schedule}
                  </li>
                  <li>
                    <strong>Interview / test:</strong> {uni.interview}
                  </li>
                  <li>
                    <strong>Minimum age:</strong> {uni.minAge}
                  </li>
                  <li>
                    <strong>Qualifications:</strong> {uni.qualifications}
                  </li>
                </ul>
              </div>
              <div className="border border-line p-5">
                <h3 className="font-bold text-navy">Locations</h3>
                <ul className="mt-3 space-y-1 text-sm text-muted">
                  {uni.locations.map((l) => (
                    <li key={l}>• {l}</li>
                  ))}
                </ul>
              </div>
              <div className="border border-line p-5">
                <h3 className="font-bold text-navy">Pathways here</h3>
                <ul className="mt-3 space-y-2 text-sm text-muted">
                  {availableCategories.map((category) => (
                    <li key={category} className="flex justify-between gap-3">
                      <Link
                        href={courseCategoryMeta[category].href}
                        className="font-medium text-teal hover:underline"
                      >
                        {courseCategoryMeta[category].label}
                      </Link>
                      <span>{grouped[category].length}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            <div className="space-y-10 lg:col-span-2">
              <div>
                <h2 className="display text-3xl text-navy">
                  Courses by pathway
                </h2>
                <p className="mt-2 text-sm text-muted">
                  Foundation, Undergraduate, Master’s and Other pathways are listed
                  separately for this partner.
                </p>
              </div>

              {availableCategories.map((category) => (
                <div key={category}>
                  <div className="mb-3 flex flex-wrap items-end justify-between gap-2">
                    <h3 className="display text-2xl text-navy">
                      {courseCategoryMeta[category].label}
                    </h3>
                    <Link
                      href={courseCategoryMeta[category].href}
                      className="text-sm font-bold text-teal hover:underline"
                    >
                      Browse all {courseCategoryMeta[category].label.toLowerCase()} →
                    </Link>
                  </div>
                  <ul className="space-y-0 border border-line">
                    {grouped[category].map((c) => (
                      <li
                        key={`${category}-${c.name}`}
                        className="flex flex-col gap-1 border-b border-line px-4 py-3 last:border-b-0 sm:flex-row sm:items-center sm:justify-between"
                      >
                        <span className="font-medium text-navy">{c.name}</span>
                        <span className="text-xs uppercase tracking-wider text-muted">
                          {levelLabel(c.level)}
                          {c.status === "new" ? " · New" : ""}
                          {c.status === "contact" ? " · Contact UNIADS" : ""}
                        </span>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}

              <div>
                <h3 className="font-bold text-navy">Requirements</h3>
                <ul className="mt-3 space-y-2 text-sm text-muted">
                  {uni.requirements.map((r) => (
                    <li key={r} className="flex gap-2">
                      <span className="text-olive">✓</span>
                      {r}
                    </li>
                  ))}
                </ul>
              </div>

              {uni.notes && uni.notes.length > 0 && (
                <div>
                  <h3 className="font-bold text-navy">Notes</h3>
                  <ul className="mt-3 space-y-2 text-sm text-muted">
                    {uni.notes.map((n) => (
                      <li key={n}>• {n}</li>
                    ))}
                  </ul>
                </div>
              )}

              <div className="flex flex-wrap gap-3">
                <Button href="/apply" variant="olive">
                  Apply now
                </Button>
                <Button href="/book" variant="ghost">
                  Book a phone call
                </Button>
                <Button href={whatsappLink()} variant="secondary" external>
                  WhatsApp us
                </Button>
              </div>

              <p className="text-sm text-muted">
                Looking for another pathway?{" "}
                <Link href="/courses" className="font-semibold text-teal">
                  Browse all courses
                </Link>{" "}
                or{" "}
                <Link href="/services" className="font-semibold text-teal">
                  our services
                </Link>
                .
              </p>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
