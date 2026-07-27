import type { Metadata } from "next";
import { PageHero } from "@/components/PageHero";
import { Button } from "@/components/Button";
import { whatsappLink } from "@/data/site";

export const metadata: Metadata = {
  title: "Job Sourcing & Application Support",
  description:
    "Find your dream job with UNIADS job sourcing, CV support, tailored alerts and interview preparation across business, health, tech and creative industries.",
  alternates: { canonical: "/services/job-sourcing" },
};

export default function JobSourcingPage() {
  return (
    <>
      <PageHero
        eyebrow="Careers"
        title="Find your dream job with our job sourcing & application support"
        description="Navigating the job market can be tough. From job search to application submission and interview prep, UNIADS guides you every step of the way."
      />

      <section className="bg-white">
        <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8">
          <h2 className="display text-3xl text-navy">What we offer</h2>
          <div className="mt-8 grid gap-5 md:grid-cols-2">
            {[
              ["Job sourcing", "Access opportunities that match your skills and goals."],
              ["Tailored job alerts", "Personalised recommendations to your inbox."],
              ["Application support", "Help crafting your CV, cover letter and materials."],
              ["Interview preparation", "Mock interviews and tips to impress hiring managers."],
            ].map(([t, d]) => (
              <div key={t} className="bg-cream p-5">
                <h3 className="font-bold text-navy">{t}</h3>
                <p className="mt-2 text-sm text-muted">{d}</p>
              </div>
            ))}
          </div>

          <h2 className="display mt-14 text-3xl text-navy">
            Opportunities across industries
          </h2>
          <ul className="mt-6 grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
            {[
              "Business Management",
              "Health & Social Care",
              "Marketing & Digital Media",
              "Design & Creative Roles",
              "Finance & Accounting",
              "Technology & Cybersecurity",
            ].map((i) => (
              <li key={i} className="border-b border-line py-3 text-navy">
                {i}
              </li>
            ))}
            <li className="py-3 font-semibold text-teal">And many more…</li>
          </ul>

          <h2 className="display mt-14 text-3xl text-navy">How we help you</h2>
          <ol className="mt-6 grid gap-4 md:grid-cols-4">
            {[
              "Find your ideal job — browse listings or receive tailored matches.",
              "Polish your application — standout CV and cover letter support.",
              "Apply with confidence — submit knowing you’ve put your best forward.",
              "Ace your interview — personalised tips and mock sessions.",
            ].map((step, i) => (
              <li key={step} className="bg-navy p-5 text-white">
                <span className="display text-2xl text-olive">0{i + 1}</span>
                <p className="mt-3 text-sm text-white/80">{step}</p>
              </li>
            ))}
          </ol>

          <div className="mt-10 flex flex-wrap gap-3">
            <Button href="/apply" variant="olive">
              Get career support
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
