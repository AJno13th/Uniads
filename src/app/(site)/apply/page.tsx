import type { Metadata } from "next";
import { PageHero } from "@/components/PageHero";
import { ApplyForm } from "@/components/ApplyForm";

export const metadata: Metadata = {
  title: "Apply Now",
  description:
    "Apply with UNIADS in under a minute. Tell us your passport or permit, course and qualifications — we’ll take it from there.",
  alternates: { canonical: "/apply" },
};

export default function ApplyPage() {
  return (
    <>
      <PageHero
        eyebrow="Apply"
        title="Apply now"
        description="British, EU, Refugee or ILR? Pick your course and we’ll help you enrol — free."
        showCtas={false}
      />
      <section className="bg-cream/50">
        <div className="mx-auto max-w-xl px-4 py-10 sm:px-6 lg:px-8 lg:py-14">
          <ApplyForm />
        </div>
      </section>
    </>
  );
}
