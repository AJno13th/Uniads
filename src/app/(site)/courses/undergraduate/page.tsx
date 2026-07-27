import type { Metadata } from "next";
import Link from "next/link";
import { PageHero } from "@/components/PageHero";
import { Button } from "@/components/Button";
import { undergraduateCourses } from "@/data/universities";

export const metadata: Metadata = {
  title: "Undergraduate Courses",
  description:
    "Undergraduate degrees, HNDs and foundation-to-degree pathways currently available through UNIADS partner universities across the UK.",
  alternates: { canonical: "/courses/undergraduate" },
};

export default function UndergraduateCoursesPage() {
  const courses = undergraduateCourses();

  return (
    <>
      <PageHero
        eyebrow="Undergraduate"
        title="Undergraduate courses"
        description="Bachelor’s degrees, HNDs and foundation-linked undergraduate pathways designed for employability — with flexible daytime, evening and weekend options."
      />

      <section className="bg-white">
        <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8">
          <div className="mb-8 flex flex-wrap gap-3">
            <Button href="/courses" variant="ghost">
              All courses
            </Button>
            <Button href="/services" variant="ghost">
              Our services
            </Button>
            <Button href="/apply" variant="olive">
              Apply now
            </Button>
          </div>

          <div className="grid gap-3">
            {courses.map((c) => (
              <div
                key={`${c.university.slug}-${c.name}`}
                className="flex flex-col gap-2 border border-line bg-cream/40 px-4 py-4 sm:flex-row sm:items-center sm:justify-between"
              >
                <div>
                  <p className="font-semibold text-navy">{c.name}</p>
                  <Link
                    href={`/courses/${c.university.slug}`}
                    className="text-sm text-teal hover:underline"
                  >
                    {c.university.name}
                  </Link>
                </div>
                <span className="text-xs font-bold uppercase tracking-wider text-muted">
                  {c.level}
                  {c.status === "new" ? " · New" : ""}
                  {c.status === "contact" ? " · Contact us" : ""}
                </span>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
