import type { Metadata } from "next";
import Link from "next/link";
import { PageHero } from "@/components/PageHero";
import { Button } from "@/components/Button";
import { foundationCourses } from "@/data/universities";

export const metadata: Metadata = {
  title: "Foundation Year Courses",
  description:
    "Foundation year and CertHE courses currently open for enrolment through UNIADS — pathways into UK higher education with flexible entry.",
  alternates: { canonical: "/courses/foundation" },
};

export default function FoundationCoursesPage() {
  const courses = foundationCourses();

  return (
    <>
      <PageHero
        eyebrow="Foundation Year"
        title="Foundation year courses"
        description="Whether you are returning to education or starting fresh, foundation and CertHE pathways help you progress into higher education — often with no prior qualifications required."
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

          <div className="overflow-hidden border border-line">
            <table className="w-full text-left text-sm">
              <thead className="bg-navy text-white">
                <tr>
                  <th className="px-4 py-3 font-semibold">Course</th>
                  <th className="px-4 py-3 font-semibold">University / College</th>
                  <th className="hidden px-4 py-3 font-semibold md:table-cell">
                    Status
                  </th>
                </tr>
              </thead>
              <tbody>
                {courses.map((c) => (
                  <tr key={`${c.university.slug}-${c.name}`} className="border-t border-line">
                    <td className="px-4 py-3 text-navy">{c.name}</td>
                    <td className="px-4 py-3">
                      <Link
                        href={`/courses/${c.university.slug}`}
                        className="font-medium text-teal hover:underline"
                      >
                        {c.university.shortName}
                      </Link>
                    </td>
                    <td className="hidden px-4 py-3 capitalize text-muted md:table-cell">
                      {c.status === "new"
                        ? "New"
                        : c.status === "contact"
                          ? "Contact us"
                          : "Enrolling"}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>
    </>
  );
}
