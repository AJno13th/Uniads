import type { Metadata } from "next";
import Link from "next/link";
import { PageHero } from "@/components/PageHero";
import { Button } from "@/components/Button";
import { postgraduateCourses } from "@/data/universities";
import { whatsappLink } from "@/data/site";

export const metadata: Metadata = {
  title: "Postgraduate Courses",
  description:
    "Postgraduate and master’s pathways available through UNIADS partners. Speak with us for tailored matching and application support.",
  alternates: { canonical: "/courses/postgraduate" },
};

export default function PostgraduateCoursesPage() {
  const courses = postgraduateCourses();

  return (
    <>
      <PageHero
        eyebrow="Postgraduate"
        title="Postgraduate courses"
        description="Specialise and advance your career with master’s and postgraduate pathways. UNIADS matches you with the right programme and supports your application."
      />

      <section className="bg-white">
        <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8">
          <div className="mb-8 flex flex-wrap gap-3">
            <Button href="/courses" variant="ghost">
              All courses
            </Button>
            <Button href="/apply" variant="olive">
              Apply now
            </Button>
            <Button href={whatsappLink()} variant="secondary" external>
              Ask about master’s courses
            </Button>
          </div>

          {courses.length === 0 ? (
            <p className="text-muted">
              Postgraduate availability varies by intake. Contact UNIADS for the
              latest master’s options with our partner institutions.
            </p>
          ) : (
            <div className="grid gap-3">
              {courses.map((c) => (
                <div
                  key={`${c.university.slug}-${c.name}`}
                  className="border border-line px-4 py-4"
                >
                  <p className="font-semibold text-navy">{c.name}</p>
                  <Link
                    href={`/courses/${c.university.slug}`}
                    className="text-sm text-teal hover:underline"
                  >
                    {c.university.name}
                  </Link>
                </div>
              ))}
            </div>
          )}

          <p className="mt-8 rounded-lg bg-cream p-5 text-sm text-muted">
            Several partners offer additional master’s programmes beyond the
            list above. Get in touch and we will match you to the right course.
          </p>
        </div>
      </section>
    </>
  );
}
