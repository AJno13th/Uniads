import type { Metadata } from "next";
import Link from "next/link";
import { InstagramLeadForm } from "@/components/InstagramLeadForm";
import { siteConfig, whatsappLink } from "@/data/site";

export const metadata: Metadata = {
  title: "Apply with UNIADS",
  description:
    "British, EU, Refugee or ILR? Pick your course and start your UNIADS application from Instagram.",
  alternates: { canonical: "/ig" },
  openGraph: {
    title: "UNIADS — Go to uni",
    description:
      "No A-levels? Still possible. British · EU · Refugee · ILR — apply free with UNIADS.",
    url: `${siteConfig.domain}/ig`,
  },
};

export default function InstagramBioPage() {
  return (
    <div className="mx-auto flex min-h-screen max-w-md flex-col px-4 py-8 sm:px-5">
      <header className="mb-7 text-center">
        <p className="text-[11px] font-bold uppercase tracking-[0.28em] text-teal">
          UNIADS
        </p>
        <h1 className="display mt-2 text-[1.85rem] leading-tight text-navy">
          Go to uni — free support
        </h1>
        <p className="mt-2 text-sm text-muted">
          British · EU · Refugee · ILR. Tell us your course and we’ll take it from
          there.
        </p>
      </header>

      <InstagramLeadForm />

      <div className="mt-6 space-y-3 text-center">
        <a
          href={whatsappLink("Hi UNIADS — I came from Instagram. Can you help me apply?")}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex min-h-11 w-full items-center justify-center rounded-full border border-navy/15 bg-white px-4 text-sm font-semibold text-navy"
        >
          Prefer WhatsApp? Message us
        </a>
        <p className="text-xs text-muted">
          <Link href="/" className="underline-offset-2 hover:underline">
            uniads.co.uk
          </Link>
          {" · "}
          <Link href="/apply" className="underline-offset-2 hover:underline">
            Full apply form
          </Link>
        </p>
      </div>
    </div>
  );
}
