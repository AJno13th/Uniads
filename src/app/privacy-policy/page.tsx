import type { Metadata } from "next";
import { PageHero } from "@/components/PageHero";
import { siteConfig } from "@/data/site";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description:
    "Privacy Policy for UNIADS Educational Consulting — how we collect, use and protect your personal information.",
  alternates: { canonical: "/privacy-policy" },
};

export default function PrivacyPolicyPage() {
  return (
    <>
      <PageHero
        eyebrow="Legal"
        title="Privacy Policy"
        description="This policy explains how UNIADS Educational Consulting collects and uses personal information when you use our website or contact us."
        showCtas={false}
      />

      <section className="bg-white">
        <div className="mx-auto max-w-3xl space-y-8 px-4 py-14 text-sm leading-relaxed text-muted sm:px-6 lg:px-8">
          <div>
            <h2 className="display text-2xl text-navy">Who we are</h2>
            <p className="mt-3">
              {siteConfig.legalName} (“UNIADS”, “we”, “us”) provides educational
              consultancy services including university application guidance,
              student finance support and related advice. Contact:{" "}
              <a className="text-teal" href={`mailto:${siteConfig.email}`}>
                {siteConfig.email}
              </a>{" "}
              ·{" "}
              <a className="text-teal" href={`tel:+${siteConfig.phone}`}>
                {siteConfig.phoneDisplay}
              </a>
              .
            </p>
          </div>

          <div>
            <h2 className="display text-2xl text-navy">Information we collect</h2>
            <p className="mt-3">
              When you apply, book a consultation or message us, we may collect
              your name, email address, phone number, course interests,
              preferred universities, study preferences and any notes you share.
            </p>
          </div>

          <div>
            <h2 className="display text-2xl text-navy">How we use your information</h2>
            <ul className="mt-3 list-disc space-y-2 pl-5">
              <li>To respond to enquiries and provide consultancy services</li>
              <li>To process applications and booking requests</li>
              <li>To communicate about courses, intakes and next steps</li>
              <li>To improve our website and services</li>
            </ul>
          </div>

          <div>
            <h2 className="display text-2xl text-navy">Sharing</h2>
            <p className="mt-3">
              We only share information with partner universities/colleges or
              service providers when needed to deliver the services you request,
              or where required by law.
            </p>
          </div>

          <div>
            <h2 className="display text-2xl text-navy">Your rights</h2>
            <p className="mt-3">
              You may request access to, correction of, or deletion of your
              personal data by contacting us at {siteConfig.email}.
            </p>
          </div>

          <div>
            <h2 className="display text-2xl text-navy">Updates</h2>
            <p className="mt-3">
              We may update this policy from time to time. The latest version
              will always be published on this page.
            </p>
          </div>
        </div>
      </section>
    </>
  );
}
