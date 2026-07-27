import type { Metadata } from "next";
import Link from "next/link";
import { PageHero } from "@/components/PageHero";
import { Button } from "@/components/Button";
import { services, courseTypes } from "@/data/site";

export const metadata: Metadata = {
  title: "Services",
  description:
    "UNIADS services: university applications made easy, English and Maths certification, foundation, undergraduate, master’s and other pathways, student finance and childcare grant support.",
  alternates: { canonical: "/services" },
};

export default function ServicesPage() {
  return (
    <>
      <PageHero
        eyebrow="Our services"
        title="University Application Made Easy"
        description="From free counselling to admissions, certifications, student finance and childcare grant support — UNIADS makes every stage of your university journey clearer and simpler."
        ctaMode="apply-only"
      />

      <section className="bg-white">
        <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8">
          <div className="grid gap-5">
            {services.map((s) => (
              <Link
                key={s.slug}
                href={s.href}
                className="group flex flex-col gap-3 border border-line bg-cream/40 p-6 transition hover:border-teal hover:bg-white sm:flex-row sm:items-center sm:justify-between"
              >
                <div>
                  <h2 className="display text-2xl text-navy group-hover:text-teal">
                    {s.title}
                  </h2>
                  <p className="mt-2 max-w-3xl text-sm text-muted">{s.description}</p>
                </div>
                <span className="shrink-0 text-sm font-bold text-olive">
                  Learn more →
                </span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-cream">
        <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8">
          <h2 className="display text-3xl text-navy">Course pathways</h2>
          <p className="mt-3 max-w-2xl text-muted">
            Each course type links to current enrolment options and partner
            universities. You can also browse everything on our Courses page.
          </p>
          <div className="mt-8 grid gap-5 sm:grid-cols-2">
            {courseTypes.map((c) => (
              <Link
                key={c.slug}
                href={c.href}
                className="border-l-4 border-olive bg-white p-6 transition hover:shadow-md"
              >
                <h3 className="display text-xl text-navy">{c.title}</h3>
                <p className="mt-3 text-sm text-muted">{c.description}</p>
              </Link>
            ))}
          </div>
          <div className="mt-8">
            <Button href="/courses" variant="primary">
              View all courses &amp; universities
            </Button>
          </div>
        </div>
      </section>
    </>
  );
}
