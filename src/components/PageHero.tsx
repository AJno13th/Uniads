import { Button } from "@/components/Button";
import { whatsappLink } from "@/data/site";

export function PageHero({
  eyebrow,
  title,
  description,
  showCtas = true,
}: {
  eyebrow?: string;
  title: string;
  description: string;
  showCtas?: boolean;
}) {
  return (
    <section className="hero-atmosphere border-b border-line/60">
      <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8 lg:py-20">
        {eyebrow && (
          <p className="mb-3 text-xs font-bold uppercase tracking-[0.22em] text-teal">
            {eyebrow}
          </p>
        )}
        <h1 className="display max-w-4xl text-4xl text-navy sm:text-5xl lg:text-6xl">
          {title}
        </h1>
        <p className="mt-5 max-w-2xl text-base text-muted sm:text-lg">
          {description}
        </p>
        {showCtas && (
          <div className="mt-8 flex flex-wrap gap-3">
            <Button href="/apply" variant="olive">
              Apply Now
            </Button>
            <Button href={whatsappLink()} variant="secondary" external>
              WhatsApp Us
            </Button>
            <Button href="/book" variant="ghost">
              Book a Phone Call
            </Button>
          </div>
        )}
      </div>
    </section>
  );
}
