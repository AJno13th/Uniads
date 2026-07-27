import type { Metadata } from "next";
import { PageHero } from "@/components/PageHero";
import { Button } from "@/components/Button";
import { CourseCategoryTabs, CourseList } from "@/components/CourseList";
import { otherCourses } from "@/data/universities";

export const metadata: Metadata = {
  title: "Other Pathways — HND & CertHE Courses",
  description:
    "HND and CertHE pathways currently available through UNIADS partners — vocational and shorter routes into higher education and work.",
  alternates: { canonical: "/courses/other" },
};

export default function OtherCoursesPage() {
  const courses = otherCourses();
  const hnds = courses.filter((c) => c.level === "hnd");
  const certhes = courses.filter((c) => c.level === "certhe");

  return (
    <>
      <PageHero
        eyebrow="Other Pathways"
        title="HND & CertHE courses"
        description="Shorter and vocational pathways that sit alongside full undergraduate and master’s degrees. Listed separately so you can compare your options clearly."
        ctaMode="apply-only"
      />

      <section className="bg-white">
        <div className="mx-auto max-w-7xl space-y-10 px-4 py-14 sm:px-6 lg:px-8">
          <CourseCategoryTabs active="other" />
          <div className="flex flex-wrap gap-3">
            <Button href="/courses" variant="ghost">
              All courses
            </Button>
            <Button href="/apply" variant="olive">
              Apply now
            </Button>
          </div>

          <div>
            <h2 className="display text-2xl text-navy">HND courses</h2>
            <p className="mt-2 mb-4 text-sm text-muted">
              Higher National Diplomas — practical, career-focused qualifications.
            </p>
            <CourseList
              courses={hnds}
              emptyMessage="No HND courses listed right now. Contact UNIADS for current options."
            />
          </div>

          <div>
            <h2 className="display text-2xl text-navy">CertHE courses</h2>
            <p className="mt-2 mb-4 text-sm text-muted">
              Certificate of Higher Education pathways — often with flexible entry.
            </p>
            <CourseList
              courses={certhes}
              emptyMessage="No CertHE courses listed right now. Contact UNIADS for current options."
            />
          </div>
        </div>
      </section>
    </>
  );
}
