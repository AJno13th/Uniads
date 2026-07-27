"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { navLinks } from "@/data/site";

export function Header() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 border-b border-line/70 bg-[#f7f8f4]/95 backdrop-blur-md">
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-3 sm:px-6 lg:px-8">
        <Link href="/" className="shrink-0" aria-label="UNIADS home">
          <Image
            src="/images/uniads-logo.svg"
            alt="UNIADS Educational Consulting"
            width={180}
            height={68}
            priority
            className="h-12 w-auto sm:h-14"
          />
        </Link>

        <nav className="hidden items-center gap-1 lg:flex" aria-label="Primary">
          {navLinks.map((link) => {
            const active =
              link.href === "/"
                ? pathname === "/"
                : pathname.startsWith(link.href);
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`rounded-md px-3 py-2 text-sm font-semibold tracking-wide uppercase transition ${
                  active
                    ? "bg-navy text-white"
                    : "text-navy hover:bg-navy/5"
                }`}
              >
                {link.label}
              </Link>
            );
          })}
        </nav>

        <div className="hidden items-center gap-2 lg:flex">
          <Link
            href="/book"
            className="rounded-md border border-navy/20 px-4 py-2 text-sm font-semibold text-navy transition hover:border-navy"
          >
            Book a Call
          </Link>
          <Link
            href="/apply"
            className="rounded-md bg-olive px-4 py-2 text-sm font-bold text-navy-deep transition hover:bg-olive-dark"
          >
            Apply Now
          </Link>
        </div>

        <button
          type="button"
          className="inline-flex items-center justify-center rounded-md border border-navy/15 p-2 text-navy lg:hidden"
          aria-expanded={open}
          aria-controls="mobile-nav"
          onClick={() => setOpen((v) => !v)}
        >
          <span className="sr-only">Toggle menu</span>
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" aria-hidden>
            {open ? (
              <path d="M6 6l12 12M18 6L6 18" stroke="currentColor" strokeWidth="2" />
            ) : (
              <path d="M4 7h16M4 12h16M4 17h16" stroke="currentColor" strokeWidth="2" />
            )}
          </svg>
        </button>
      </div>

      {open && (
        <div id="mobile-nav" className="border-t border-line bg-cream px-4 py-4 lg:hidden">
          <nav className="flex flex-col gap-1" aria-label="Mobile">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setOpen(false)}
                className="rounded-md px-3 py-3 text-sm font-semibold uppercase tracking-wide text-navy hover:bg-navy/5"
              >
                {link.label}
              </Link>
            ))}
            <Link
              href="/book"
              onClick={() => setOpen(false)}
              className="mt-2 rounded-md border border-navy/20 px-3 py-3 text-center text-sm font-semibold text-navy"
            >
              Book a Call
            </Link>
            <Link
              href="/apply"
              onClick={() => setOpen(false)}
              className="rounded-md bg-olive px-3 py-3 text-center text-sm font-bold text-navy-deep"
            >
              Apply Now
            </Link>
          </nav>
        </div>
      )}
    </header>
  );
}
