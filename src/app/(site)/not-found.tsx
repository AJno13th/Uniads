import Link from "next/link";
import { Button } from "@/components/Button";

export default function NotFound() {
  return (
    <section className="hero-atmosphere">
      <div className="mx-auto max-w-3xl px-4 py-24 text-center sm:px-6">
        <p className="text-xs font-bold uppercase tracking-[0.25em] text-teal">
          404
        </p>
        <h1 className="display mt-3 text-4xl text-navy sm:text-5xl">
          Page not found
        </h1>
        <p className="mt-4 text-muted">
          The page you are looking for does not exist or has moved.
        </p>
        <div className="mt-8 flex flex-wrap justify-center gap-3">
          <Button href="/" variant="olive">
            Go home
          </Button>
          <Button href="/courses" variant="ghost">
            Browse courses
          </Button>
          <Link href="/services" className="text-sm font-semibold text-teal underline">
            Our services
          </Link>
        </div>
      </div>
    </section>
  );
}
