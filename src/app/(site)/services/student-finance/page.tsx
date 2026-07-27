import type { Metadata } from "next";
import { PageHero } from "@/components/PageHero";
import { Button } from "@/components/Button";
import { whatsappLink } from "@/data/site";

export const metadata: Metadata = {
  title: "Student Finance Application Support",
  description:
    "Secure your funding with UNIADS student finance support — tuition fee loans, maintenance loans, grants, bursaries and budgeting guidance.",
  alternates: { canonical: "/services/student-finance" },
};

export default function StudentFinancePage() {
  return (
    <>
      <PageHero
        eyebrow="Funding"
        title="Secure your funding with our student finance support"
        description="Applying for student finance can feel overwhelming — we make it clear. With expert support you can access the financial assistance you need and focus on your education."
      />

      <section className="bg-white">
        <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8">
          <h2 className="display text-3xl text-navy">What we offer</h2>
          <div className="mt-8 grid gap-5 md:grid-cols-2">
            {[
              {
                t: "Guidance on finance applications",
                d: "Step-by-step support through the entire student finance process.",
              },
              {
                t: "Help with eligibility",
                d: "We help you determine eligibility for loans, grants and other financial aid.",
              },
              {
                t: "Budgeting advice",
                d: "Plan your finances with practical tips to manage student funding wisely.",
              },
              {
                t: "Loan repayment guidance",
                d: "Understand repayments and how to manage them after graduation.",
              },
            ].map((i) => (
              <div key={i.t} className="bg-cream p-5">
                <h3 className="font-bold text-navy">{i.t}</h3>
                <p className="mt-2 text-sm text-muted">{i.d}</p>
              </div>
            ))}
          </div>

          <h2 className="display mt-14 text-3xl text-navy">
            Get financial aid for your course
          </h2>
          <ul className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            {[
              "Tuition Fee Loans",
              "Maintenance Loans",
              "Bursaries & Scholarships",
              "Grants for Low-Income Students",
            ].map((item) => (
              <li
                key={item}
                className="border border-line px-4 py-4 text-center text-sm font-semibold text-navy"
              >
                {item}
              </li>
            ))}
          </ul>

          <h2 className="display mt-14 text-3xl text-navy">How we help you</h2>
          <ol className="mt-6 grid gap-4 md:grid-cols-4">
            {[
              "Choose your course — pick the pathway that fits your goals.",
              "Apply for finance — we guide loans and grants applications.",
              "Track your application — stay updated on status and deadlines.",
              "Manage your finances — personalised budgeting and repayment tips.",
            ].map((step, i) => (
              <li key={step} className="border-t-4 border-olive pt-4">
                <span className="text-xs font-bold uppercase tracking-widest text-teal">
                  Step {i + 1}
                </span>
                <p className="mt-2 text-sm text-muted">{step}</p>
              </li>
            ))}
          </ol>

          <div className="mt-10 flex flex-wrap gap-3">
            <Button href="/apply" variant="olive">
              Start finance support
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
