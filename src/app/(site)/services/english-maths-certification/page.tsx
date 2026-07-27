import type { Metadata } from "next";
import { PageHero } from "@/components/PageHero";
import { Button } from "@/components/Button";
import { whatsappLink } from "@/data/site";

export const metadata: Metadata = {
  title: "English and Maths Certification",
  description:
    "Get the English and Maths certifications required by many UK universities. UNIADS guides you on the right qualifications and how to achieve them.",
  alternates: { canonical: "/services/english-maths-certification" },
};

export default function EnglishMathsPage() {
  return (
    <>
      <PageHero
        eyebrow="Certifications"
        title="English and Maths Certification"
        description="Many UK university and college pathways ask for evidence of English and Maths ability. UNIADS helps you understand what is required and supports you through the certification process."
      />

      <section className="bg-white">
        <div className="mx-auto max-w-3xl px-4 py-14 sm:px-6 lg:px-8">
          <h2 className="display text-3xl text-navy">What we help with</h2>
          <ul className="mt-6 space-y-4 text-muted">
            <li className="border-l-4 border-olive bg-cream/60 p-4">
              <strong className="text-navy">Identifying requirements</strong>
              <p className="mt-1 text-sm">
                We check the English and Maths expectations for your chosen
                university and course so you apply with the right evidence.
              </p>
            </li>
            <li className="border-l-4 border-olive bg-cream/60 p-4">
              <strong className="text-navy">Choosing the right certification route</strong>
              <p className="mt-1 text-sm">
                From recognised English assessments to Maths qualifications —
                we explain which options fit your background and timeline.
              </p>
            </li>
            <li className="border-l-4 border-olive bg-cream/60 p-4">
              <strong className="text-navy">Application-ready support</strong>
              <p className="mt-1 text-sm">
                We help you prepare documentation and coordinate certification
                alongside your university application.
              </p>
            </li>
          </ul>

          <div className="mt-10 flex flex-wrap gap-3">
            <Button href="/apply" variant="olive">
              Apply for support
            </Button>
            <Button href={whatsappLink()} variant="secondary" external>
              Message us on WhatsApp
            </Button>
            <Button href="/book" variant="ghost">
              Book a phone call
            </Button>
          </div>
        </div>
      </section>
    </>
  );
}
