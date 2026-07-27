import type { Metadata } from "next";
import { PageHero } from "@/components/PageHero";
import { ApplyForm } from "@/components/ApplyForm";

export const metadata: Metadata = {
  title: "Apply Now",
  description:
    "Apply to study in the UK with UNIADS. Specify the services and courses you need using our guided application form — dropdowns and checkboxes included.",
  alternates: { canonical: "/apply" },
};

export default function ApplyPage() {
  return (
    <>
      <PageHero
        eyebrow="Apply"
        title="Apply now with UNIADS"
        description="Use the form below to tell us precisely what you need — university applications, certifications, finance, childcare grants, course level and more. We’ll take it from there."
        showCtas={false}
      />
      <section className="bg-cream/50">
        <div className="mx-auto max-w-3xl px-4 py-14 sm:px-6 lg:px-8">
          <ApplyForm />
        </div>
      </section>
    </>
  );
}
