"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const links = [
  { href: "/app", label: "Home" },
  { href: "/app/train", label: "Train" },
  { href: "/app/nutrition", label: "Fuel" },
  { href: "/app/records", label: "Ranks" },
  { href: "/app/body", label: "Body" },
];

export function AppNav() {
  const pathname = usePathname();

  return (
    <header className="sticky top-0 z-40 border-b border-line/80 bg-fog/90 backdrop-blur-md">
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 py-3">
        <Link href="/" className="font-display text-2xl tracking-tight text-ink">
          FORGE
        </Link>
        <nav className="flex flex-wrap items-center gap-1 text-sm">
          {links.map((l) => {
            const active =
              l.href === "/app"
                ? pathname === "/app"
                : pathname.startsWith(l.href);
            return (
              <Link
                key={l.href}
                href={l.href}
                className={`rounded-sm px-3 py-2 transition ${
                  active
                    ? "bg-ink text-fog"
                    : "text-muted hover:bg-stone hover:text-ink"
                }`}
              >
                {l.label}
              </Link>
            );
          })}
        </nav>
      </div>
    </header>
  );
}

export function MarketingNav() {
  return (
    <header className="absolute inset-x-0 top-0 z-40">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-5">
        <Link href="/" className="font-display text-3xl tracking-tight text-white">
          FORGE
        </Link>
        <div className="flex items-center gap-3">
          <Link
            href="/free-reading"
            className="hidden text-sm text-white/85 underline-offset-4 hover:underline sm:inline"
          >
            Free reading
          </Link>
          <Link
            href="/app"
            className="rounded-sm bg-signal px-4 py-2 text-sm font-semibold text-white transition hover:bg-signal-deep"
          >
            Open app
          </Link>
        </div>
      </div>
    </header>
  );
}
