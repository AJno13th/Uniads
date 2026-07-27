import type { Metadata } from "next";
import { PageHero } from "@/components/PageHero";
import { Button } from "@/components/Button";
import { whatsappLink } from "@/data/site";

export const metadata: Metadata = {
  title: "Childcare Grant Application Support",
  description:
    "UNIADS helps student parents apply for childcare grants so you can study with confidence and the right funding support.",
  alternates: { canonical: "/services/childcare-grant" },
};

export default function ChildcareGrantPage() {
  return (
    <>
      <PageHero
        eyebrow="Family funding"
        title="Childcare Grant Application Support"
        description="Balancing study and parenting is demanding. UNIADS provides dedicated support with childcare grant applications so eligible students can access the help they need."
      />

      <section className="bg-white">
        <div className="mx-auto max-w-3xl px-4 py-14 sm:px-6 lg:px-8">
          <h2 className="display text-3xl text-navy">How UNIADS supports you</h2>
          <ul className="mt-6 space-y-4">
            {[
              "Clarify eligibility for childcare grant support linked to your course and circumstances.",
              "Guide you through forms, evidence and submission requirements.",
              "Coordinate childcare grant applications alongside student finance where relevant.",
              "Keep you informed on next steps, deadlines and follow-up queries.",
            ].map((item) => (
              <li key={item} className="flex gap-3 text-muted">
                <span className="mt-1 text-olive">✓</span>
                <span>{item}</span>
              </li>
            ))}
          </ul>
          <div className="mt-10 flex flex-wrap gap-3">
            <Button href="/apply" variant="olive">
              Request childcare grant help
            </Button>
            <Button href="/book" variant="ghost">
              Book a phone call
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
