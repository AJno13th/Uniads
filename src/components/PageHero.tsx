import { Button } from "@/components/Button";
import { whatsappLink } from "@/data/site";
import type { ReactNode } from "react";

type CtaMode = "default" | "apply-only" | "none" | "custom";

export function PageHero({
  eyebrow,
  title,
  description,
  showCtas = true,
  ctaMode = "default",
  actions,
}: {
  eyebrow?: string;
  title: string;
  description: string;
  showCtas?: boolean;
  /** Prefer fewer CTAs — mature students decide faster with one clear next step. */
  ctaMode?: CtaMode;
  actions?: ReactNode;
}) {
  const mode = !showCtas ? "none" : ctaMode;

  return (
    <section className="hero-atmosphere border-b border-line/60">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8 lg:py-16">
        {eyebrow && (
          <p className="mb-3 text-xs font-bold uppercase tracking-[0.22em] text-teal">
            {eyebrow}
          </p>
        )}
        <h1 className="display max-w-4xl text-[2.15rem] leading-[1.05] text-navy sm:text-5xl lg:text-6xl">
          {title}
        </h1>
        <p className="mt-5 max-w-2xl text-base leading-relaxed text-muted sm:text-lg">
          {description}
        </p>
        {mode === "custom" && actions}
        {mode === "apply-only" && (
          <div className="mt-8 flex flex-wrap gap-3">
            <Button href="/apply" variant="olive">
              Apply Now
            </Button>
            <Button href="/book" variant="ghost">
              Book a Call
            </Button>
          </div>
        )}
        {mode === "default" && (
          <div className="mt-8 flex flex-wrap gap-3">
            <Button href="/apply" variant="olive">
              Apply Now
            </Button>
            <Button href={whatsappLink()} variant="secondary" external>
              WhatsApp Us
            </Button>
          </div>
        )}
      </div>
    </section>
  );
}
