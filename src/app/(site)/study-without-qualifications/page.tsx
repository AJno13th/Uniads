import type { Metadata } from "next";
import Link from "next/link";
import { LeadQualifier } from "@/components/LeadQualifier";
import { Button } from "@/components/Button";
import { VerifiedBadge } from "@/components/VerifiedBadge";
import { universities } from "@/data/universities";

export const metadata: Metadata = {
  title: "Study at University Without Qualifications | No GCSEs or A-Levels Needed",
  description:
    "No GCSEs? No A-Levels? No problem. If you are 21+ you can start university this year with no formal qualifications — and 18–21 with a Level 3. Free UNIADS support with your place and student finance.",
  keywords: [
    "university without qualifications UK",
    "study at university with no GCSEs",
    "no A-levels university course UK",
    "mature student university 21+",
    "start university without qualifications",
    "student finance mature student",
    "2 days a week university course",
    "evening and weekend university courses UK",
  ],
  alternates: { canonical: "/study-without-qualifications" },
  openGraph: {
    title: "No GCSEs? No A-Levels? No problem — start university this year",
    description:
      "21+ can start with no formal qualifications. 18–21 need a Level 3. Free support with your place and student finance.",
  },
};

const faqs = [
  {
    q: "Can I go to university without GCSEs or A-Levels?",
    a: "Yes. If you are 21 or over, many of our partner universities and colleges will consider you without formal qualifications, using work experience and an interview or short assessment instead. If you are 18–21, you will usually need a Level 3 qualification.",
  },
  {
    q: "How many days a week will I study?",
    a: "Most partner programmes run just 2 days a week, with morning, evening, weekend and blended online options so you can keep working.",
  },
  {
    q: "Does it cost anything to use UNIADS?",
    a: "Our counselling, application support and student finance guidance are free to you. Tuition is normally covered by a tuition fee loan if you are eligible.",
  },
  {
    q: "What passport or permit do I need?",
    a: "For our pathway, tell us which passport or permit you have: British, EU, Refugee, or ILR (Indefinite Leave to Remain). We confirm the full detail with you before you apply — extra statuses can be noted by an advisor if needed.",
  },
  {
    q: "Can I get a maintenance loan as well as tuition fees?",
    a: "Eligible students can apply for a maintenance loan to help with living costs, and student parents may also be able to apply for a childcare grant. We support both applications.",
  },
];

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: faqs.map((f) => ({
    "@type": "Question",
    name: f.q,
    acceptedAnswer: { "@type": "Answer", text: f.a },
  })),
};

export default function StudyWithoutQualificationsPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <section className="section-navy text-white">
        <div className="mx-auto grid max-w-7xl items-start gap-8 px-4 py-12 sm:px-6 lg:grid-cols-[1.05fr_0.95fr] lg:gap-10 lg:px-8 lg:py-16">
          <div className="fade-up order-2 lg:order-1">
            <p className="text-xs font-bold uppercase tracking-[0.25em] text-olive">
              Applications open · Next intakes filling fast
            </p>
            <h1 className="display mt-4 text-[2.1rem] leading-[1.05] sm:text-5xl xl:text-6xl">
              No GCSEs? No A-Levels? No problem.
            </h1>
            <p className="mt-5 text-base text-white/85 sm:text-lg">
              UNIADS makes university possible for everyone. Tell us your passport or
              permit, the university and course you want, and whether you want
              full-time or part-time study — we will confirm your options.
            </p>
            <ul className="mt-7 space-y-3 text-sm">
              {[
                "If you are 21+, you can start university this year with no formal qualifications",
                "If you are 18–21, all you need is a Level 3",
                "Free expert support — from choosing your course to sorting your student finance",
                "Study your way — weekday, evening or weekend classes, only 2 days a week",
              ].map((item) => (
                <li key={item} className="flex gap-3 text-white/90">
                  <span className="text-olive">✓</span>
                  <span>{item}</span>
                </li>
              ))}
            </ul>
            <div className="mt-8 hidden flex-wrap gap-3 lg:flex">
              <Button href="/apply" variant="olive">
                Apply Now — it&apos;s free
              </Button>
              <Button href="/book" variant="white">
                Book a Call
              </Button>
            </div>
          </div>

          <div className="fade-up-delay order-1 lg:order-2">
            <LeadQualifier variant="dark" source="landing" />
          </div>
        </div>
      </section>

      <section className="bg-white">
        <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8">
          <h2 className="display text-3xl text-navy sm:text-4xl">
            Where you can study
          </h2>
          <p className="mt-3 max-w-2xl text-muted">
            Choose from partner universities and colleges across London, Birmingham,
            Manchester, Leeds and more — many with no qualification requirement for
            applicants aged 21 and over.
          </p>
          <div className="mt-8 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {universities.map((u) => (
              <Link
                key={u.slug}
                href={`/courses/${u.slug}`}
                className="border border-line p-4 transition hover:border-navy"
              >
                <p className="font-bold text-navy">{u.shortName}</p>
                <p className="mt-1 text-xs text-muted">{u.name}</p>
                <p className="mt-2 text-xs text-teal">Minimum age {u.minAge}</p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-cream">
        <div className="mx-auto grid max-w-7xl gap-10 px-4 py-14 sm:px-6 lg:grid-cols-[1.3fr_1fr] lg:px-8">
          <div>
            <h2 className="display text-3xl text-navy sm:text-4xl">
              Common questions
            </h2>
            <dl className="mt-8 space-y-6">
              {faqs.map((faq) => (
                <div key={faq.q} className="border-l-4 border-olive bg-white p-5">
                  <dt className="font-bold text-navy">{faq.q}</dt>
                  <dd className="mt-2 text-sm text-muted">{faq.a}</dd>
                </div>
              ))}
            </dl>
          </div>
          <div className="space-y-6">
            <VerifiedBadge />
            <div className="bg-navy p-6 text-white">
              <h3 className="display text-2xl text-olive">Ready to start?</h3>
              <p className="mt-2 text-sm text-white/80">
                Your university journey starts today. Apply now and let UNIADS handle
                the rest.
              </p>
              <div className="mt-5 flex flex-wrap gap-3">
                <Button href="/apply" variant="olive">
                  Apply Now
                </Button>
                <Button href="/book" variant="white">
                  Book a call
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
