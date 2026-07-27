import type { Metadata } from "next";
import { PageHero } from "@/components/PageHero";
import { Button } from "@/components/Button";
import { CourseCategoryTabs, CourseList } from "@/components/CourseList";
import { undergraduateCourses } from "@/data/universities";

export const metadata: Metadata = {
  title: "Undergraduate Courses",
  description:
    "Undergraduate bachelor’s degrees and top-up courses currently available through UNIADS partner universities across the UK.",
  alternates: { canonical: "/courses/undergraduate" },
};

export default function UndergraduateCoursesPage() {
  const courses = undergraduateCourses();

  return (
    <>
      <PageHero
        eyebrow="Undergraduate"
        title="Undergraduate courses"
        description="Bachelor’s degrees and top-up pathways designed for employability — with flexible daytime, evening and weekend options. Foundation years and HNDs are listed separately."
        ctaMode="apply-only"
      />

      <section className="bg-white">
        <div className="mx-auto max-w-7xl space-y-8 px-4 py-14 sm:px-6 lg:px-8">
          <CourseCategoryTabs active="undergraduate" />
          <div className="flex flex-wrap gap-3">
            <Button href="/courses" variant="ghost">
              All courses
            </Button>
            <Button href="/apply" variant="olive">
              Apply for Undergraduate
            </Button>
          </div>
          <p className="text-sm text-muted">
            Showing <strong className="text-navy">{courses.length}</strong> undergraduate
            courses currently listed for enrolment.
          </p>
          <CourseList courses={courses} />
        </div>
      </section>
    </>
  );
}
