import Link from "next/link";

const items = [
  { label: "100% free student support", href: "/services" },
  { label: "Student finance help", href: "/services/student-finance" },
  { label: "2 days a week study options", href: "/courses" },
  { label: "British Council trained", href: "/about" },
] as const;

export function TrustStrip({ tone = "light" }: { tone?: "light" | "dark" }) {
  const dark = tone === "dark";
  return (
    <div
      className={`border-y ${dark ? "border-white/10 bg-navy-deep" : "border-line/70 bg-white"}`}
    >
      <div className="mx-auto flex max-w-7xl flex-wrap items-center gap-2 px-4 py-3 sm:px-6 lg:gap-3 lg:px-8">
        {items.map((item) => (
          <Link
            key={item.label}
            href={item.href}
            className={`trust-chip ${dark ? "border-white/15 bg-white/10 text-white" : ""}`}
          >
            <span className={dark ? "text-olive" : "text-teal"} aria-hidden>
              ✓
            </span>
            {item.label}
          </Link>
        ))}
      </div>
    </div>
  );
}
