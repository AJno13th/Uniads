import type { Metadata } from "next";
import { PageHero } from "@/components/PageHero";
import { Button } from "@/components/Button";
import { whatsappLink } from "@/data/site";
import { subjectAreas, universities } from "@/data/universities";
import Link from "next/link";

export const metadata: Metadata = {
  title: "University Application Made Easy",
  description:
    "Find your perfect UK course and apply today with UNIADS. Flexible schedules, partner universities across the UK, and a simple application process.",
  alternates: { canonical: "/services/university-application" },
};

export default function UniversityApplicationPage() {
  return (
    <>
      <PageHero
        eyebrow="Admissions"
        title="University Application Made Easy"
        description="Find your perfect course and apply today. Explore a wide range of programmes across top UK universities — with flexible schedules and a simple application process."
      />

      <section className="bg-white">
        <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8">
          <h2 className="display text-3xl text-navy">Available courses</h2>
          <ul className="mt-6 grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
            {subjectAreas.map((s) => (
              <li key={s} className="border-b border-line py-3 text-navy">
                {s}
              </li>
            ))}
            <li className="py-3 font-semibold text-teal">And many more…</li>
          </ul>

          <h2 className="display mt-14 text-3xl text-navy">Top universities</h2>
          <ul className="mt-6 grid gap-3 sm:grid-cols-2">
            {universities.map((u) => (
              <li key={u.slug}>
                <Link href={`/courses/${u.slug}`} className="font-medium text-navy hover:text-teal">
                  {u.name}
                </Link>
              </li>
            ))}
          </ul>

          <h2 className="display mt-14 text-3xl text-navy">Flexible study options</h2>
          <ul className="mt-6 grid gap-3 sm:grid-cols-2">
            {[
              "Online and on-campus courses available",
              "Full-time and part-time schedules",
              "Evening, morning and weekend classes",
              "No qualification required for many courses",
            ].map((item) => (
              <li key={item} className="flex gap-2 text-sm text-navy">
                <span className="text-olive">✓</span> {item}
              </li>
            ))}
          </ul>

          <h2 className="display mt-14 text-3xl text-navy">How it works</h2>
          <ol className="mt-6 grid gap-4 md:grid-cols-4">
            {[
              "Choose your course from top UK universities.",
              "Apply online — complete the form and submit documents.",
              "Prepare for the interview and test with our guidance.",
              "Accept your offer and complete admission.",
            ].map((step, i) => (
              <li key={step} className="bg-cream p-5">
                <span className="display text-2xl text-olive">0{i + 1}</span>
                <p className="mt-2 text-sm text-muted">{step}</p>
              </li>
            ))}
          </ol>

          <div className="mt-10 flex flex-wrap gap-3">
            <Button href="/apply" variant="olive">
              Apply now
            </Button>
            <Button href="/courses" variant="ghost">
              Browse courses
            </Button>
            <Button href={whatsappLink()} variant="secondary" external>
              WhatsApp us
            </Button>
          </div>
        </div>
      </section>
    </>
  );
}
