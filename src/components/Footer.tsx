import Image from "next/image";
import Link from "next/link";
import { navLinks, siteConfig, services, courseTypes } from "@/data/site";

export function Footer() {
  return (
    <footer className="mt-auto bg-navy-deep text-white">
      <div className="mx-auto grid max-w-7xl gap-10 px-4 py-14 sm:px-6 lg:grid-cols-4 lg:px-8">
        <div className="space-y-4 lg:col-span-1">
          <Image
            src="/images/uniads-logo-mark.svg"
            alt="UNIADS Educational Consulting"
            width={200}
            height={86}
            className="h-16 w-auto"
          />
          <p className="text-sm leading-relaxed text-white/75">
            UNIADS Educational Consulting helps students secure university places,
            student finance and childcare grant support across top UK partner
            institutions.
          </p>
          <div className="rounded-lg bg-white/95 p-3">
            <Image
              src="/images/british-council-logo.svg"
              alt="British Council"
              width={220}
              height={64}
              className="h-10 w-auto"
            />
            <p className="mt-2 text-xs font-medium text-navy">
              UK Certified Counsellor · UK Agent Quality Framework
            </p>
          </div>
        </div>

        <div>
          <h3 className="mb-4 text-sm font-semibold tracking-[0.15em] text-olive">
            Explore
          </h3>
          <ul className="space-y-2 text-sm text-white/80">
            {navLinks.map((l) => (
              <li key={l.href}>
                <Link href={l.href} className="hover:text-olive">
                  {l.label}
                </Link>
              </li>
            ))}
            <li>
              <Link href="/apply" className="hover:text-olive">
                Apply Now
              </Link>
            </li>
            <li>
              <Link href="/book" className="hover:text-olive">
                Book a Phone Call
              </Link>
            </li>
            <li>
              <Link href="/privacy-policy" className="hover:text-olive">
                Privacy Policy
              </Link>
            </li>
          </ul>
        </div>

        <div>
          <h3 className="mb-4 text-sm font-semibold tracking-[0.15em] text-olive">
            Services
          </h3>
          <ul className="space-y-2 text-sm text-white/80">
            {services.map((s) => (
              <li key={s.slug}>
                <Link href={s.href} className="hover:text-olive">
                  {s.shortTitle}
                </Link>
              </li>
            ))}
            {courseTypes.map((c) => (
              <li key={c.slug}>
                <Link href={c.href} className="hover:text-olive">
                  {c.shortTitle}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h3 className="mb-4 text-sm font-semibold tracking-[0.15em] text-olive">
            Contact
          </h3>
          <ul className="space-y-3 text-sm text-white/80">
            <li>
              <a href={`tel:+${siteConfig.phone}`} className="hover:text-olive">
                {siteConfig.phoneDisplay}
              </a>
            </li>
            <li>
              <a href={`mailto:${siteConfig.email}`} className="hover:text-olive">
                {siteConfig.email}
              </a>
            </li>
            <li className="pt-2">
              <p className="mb-3 text-xs uppercase tracking-[0.2em] text-white/50">
                Follow us
              </p>
              <div className="flex flex-wrap gap-3">
                <a
                  href={siteConfig.social.facebook}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="rounded-md bg-white/10 px-3 py-2 text-xs font-semibold hover:bg-olive hover:text-navy-deep"
                >
                  Facebook
                </a>
                <a
                  href={siteConfig.social.instagram}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="rounded-md bg-white/10 px-3 py-2 text-xs font-semibold hover:bg-olive hover:text-navy-deep"
                >
                  Instagram
                </a>
                <a
                  href={siteConfig.social.tiktok}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="rounded-md bg-white/10 px-3 py-2 text-xs font-semibold hover:bg-olive hover:text-navy-deep"
                >
                  TikTok
                </a>
              </div>
            </li>
          </ul>
        </div>
      </div>

      <div className="border-t border-white/10">
        <div className="mx-auto flex max-w-7xl flex-col gap-2 px-4 py-5 text-xs text-white/55 sm:flex-row sm:items-center sm:justify-between sm:px-6 lg:px-8">
          <p>
            © {new Date().getFullYear()} {siteConfig.legalName}. All rights
            reserved.
          </p>
          <p>Study in the UK · Free counselling &amp; application guidance</p>
        </div>
      </div>
    </footer>
  );
}
