import type { Metadata } from "next";
import { PageHero } from "@/components/PageHero";
import { Button } from "@/components/Button";
import { CourseCategoryTabs, CourseList } from "@/components/CourseList";
import { foundationCourses } from "@/data/universities";

export const metadata: Metadata = {
  title: "Foundation Year Courses",
  description:
    "Foundation year courses currently open for enrolment through UNIADS — pathways into UK higher education with flexible entry.",
  alternates: { canonical: "/courses/foundation" },
};

export default function FoundationCoursesPage() {
  const courses = foundationCourses();

  return (
    <>
      <PageHero
        eyebrow="Foundation Year"
        title="Foundation year courses"
        description="Whether you are returning to education or starting fresh, foundation year pathways help you progress into higher education — often with no prior qualifications required."
        ctaMode="apply-only"
      />

      <section className="bg-white">
        <div className="mx-auto max-w-7xl space-y-8 px-4 py-14 sm:px-6 lg:px-8">
          <CourseCategoryTabs active="foundation" />
          <div className="flex flex-wrap gap-3">
            <Button href="/courses" variant="ghost">
              All courses
            </Button>
            <Button href="/apply" variant="olive">
              Apply for Foundation Year
            </Button>
          </div>
          <p className="text-sm text-muted">
            Showing <strong className="text-navy">{courses.length}</strong> foundation
            year courses currently listed for enrolment.
          </p>
          <CourseList courses={courses} />
        </div>
      </section>
    </>
  );
}
