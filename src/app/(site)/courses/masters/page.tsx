import type { Metadata } from "next";
import { PageHero } from "@/components/PageHero";
import { Button } from "@/components/Button";
import { CourseCategoryTabs, CourseList } from "@/components/CourseList";
import { mastersCourses } from "@/data/universities";
import { whatsappLink } from "@/data/site";

export const metadata: Metadata = {
  title: "Master’s / Postgraduate Courses",
  description:
    "Master’s and postgraduate pathways available through UNIADS partners. Speak with us for tailored matching and application support.",
  alternates: { canonical: "/courses/masters" },
};

export default function MastersCoursesPage() {
  const courses = mastersCourses();

  return (
    <>
      <PageHero
        eyebrow="Master’s"
        title="Master’s / postgraduate courses"
        description="Specialise and advance your career with master’s pathways. UNIADS matches you with the right programme and supports your application."
        ctaMode="apply-only"
      />

      <section className="bg-white">
        <div className="mx-auto max-w-7xl space-y-8 px-4 py-14 sm:px-6 lg:px-8">
          <CourseCategoryTabs active="masters" />
          <div className="flex flex-wrap gap-3">
            <Button href="/courses" variant="ghost">
              All courses
            </Button>
            <Button href="/apply" variant="olive">
              Apply for Master’s
            </Button>
            <Button href={whatsappLink()} variant="secondary" external>
              Ask about master’s courses
            </Button>
          </div>
          <p className="text-sm text-muted">
            Showing <strong className="text-navy">{courses.length}</strong> master’s /
            postgraduate courses currently listed. Availability varies by intake —
            contact us for the latest options.
          </p>
          <CourseList
            courses={courses}
            emptyMessage="Master’s availability varies by intake. Contact UNIADS for the latest postgraduate options with our partner institutions."
          />
          <p className="rounded-lg bg-cream p-5 text-sm text-muted">
            Several partners offer additional master’s programmes beyond the list
            above. Get in touch and we will match you to the right course.
          </p>
        </div>
      </section>
    </>
  );
}
