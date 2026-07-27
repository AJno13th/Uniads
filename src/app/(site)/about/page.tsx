import type { Metadata } from "next";
import Image from "next/image";
import { PageHero } from "@/components/PageHero";
import { Button } from "@/components/Button";
import { VerifiedBadge } from "@/components/VerifiedBadge";
import { siteConfig, whatsappLink } from "@/data/site";

export const metadata: Metadata = {
  title: "About Us",
  description:
    "About UNIADS Educational Consulting — UK Certified Counsellor supporting university applications, student finance and course guidance across partner institutions.",
  alternates: { canonical: "/about" },
};

export default function AboutPage() {
  return (
    <>
      <PageHero
        eyebrow="About UNIADS"
        title="Your trusted educational consultancy"
        description="Personalised guidance, an extensive partner network and a clear process — UNIADS empowers students with tailored solutions and continuous support to unlock academic excellence."
      />

      <section className="bg-white">
        <div className="mx-auto grid max-w-7xl gap-12 px-4 py-14 sm:px-6 lg:grid-cols-2 lg:px-8">
          <div>
            <h2 className="display text-3xl text-navy">Who we are</h2>
            <p className="mt-4 text-muted">
              <strong className="text-navy">UNIADS Educational Consulting</strong>{" "}
              helps prospective students start — or return to — university
              education in the UK. From choosing the right course to completing
              applications, interviews, student finance and childcare grant
              support, we stay with you every step of the way.
            </p>
            <p className="mt-4 text-muted">
              We work with reputable universities and colleges across London,
              Birmingham, Manchester, Leeds and other UK cities, offering
              flexible study options including online, on-campus, full-time,
              part-time, evening and weekend schedules.
            </p>
            <ul className="mt-6 space-y-3 text-sm text-navy">
              {[
                "Free counselling and guidance",
                "Student admission services",
                "Student finance application support",
                "Childcare grant application support",
                "English and Maths certification guidance",
                "Job sourcing and application support",
              ].map((item) => (
                <li key={item} className="flex gap-2">
                  <span className="text-olive">✓</span>
                  {item}
                </li>
              ))}
            </ul>
          </div>

          <div className="space-y-6">
            <Image
              src="/images/uk-certified-counsellor.svg"
              alt="UK Certified Counsellor badge"
              width={420}
              height={240}
              className="h-auto w-full max-w-md"
            />
            <VerifiedBadge />
          </div>
        </div>
      </section>

      <section className="bg-cream">
        <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8">
          <h2 className="display text-3xl text-navy">Our promise</h2>
          <div className="mt-8 grid gap-5 md:grid-cols-3">
            {[
              {
                t: "Clear & honest advice",
                d: "We explain options, requirements and timelines without jargon.",
              },
              {
                t: "Student-first process",
                d: "Applications, finance and enrolment are coordinated around your goals.",
              },
              {
                t: "Ongoing support",
                d: "From first enquiry to admission offer — and beyond — UNIADS is here for you.",
              },
            ].map((i) => (
              <div key={i.t} className="bg-white p-6">
                <h3 className="font-bold text-navy">{i.t}</h3>
                <p className="mt-2 text-sm text-muted">{i.d}</p>
              </div>
            ))}
          </div>

          <div className="mt-10 flex flex-wrap gap-3">
            <Button href="/apply" variant="olive">
              Apply now
            </Button>
            <Button href="/book" variant="primary">
              Book a phone call
            </Button>
            <Button href={whatsappLink()} variant="secondary" external>
              WhatsApp {siteConfig.phoneDisplay}
            </Button>
          </div>
        </div>
      </section>
    </>
  );
}
