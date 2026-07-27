import Link from "next/link";
import { ReactNode } from "react";

type Variant = "primary" | "secondary" | "olive" | "ghost" | "white";

const styles: Record<Variant, string> = {
  primary:
    "bg-navy text-white hover:bg-navy-deep shadow-sm hover:-translate-y-0.5",
  secondary:
    "bg-teal text-white hover:brightness-110 shadow-sm hover:-translate-y-0.5",
  olive:
    "bg-olive text-navy-deep hover:bg-olive-dark font-semibold shadow-sm hover:-translate-y-0.5",
  ghost:
    "border border-navy/20 text-navy hover:border-navy hover:bg-navy/5",
  white:
    "bg-white text-navy hover:bg-cream shadow-sm hover:-translate-y-0.5",
};

export function Button({
  href,
  children,
  variant = "primary",
  className = "",
  external = false,
}: {
  href: string;
  children: ReactNode;
  variant?: Variant;
  className?: string;
  external?: boolean;
}) {
  const cls = `inline-flex min-h-12 items-center justify-center gap-2 rounded-md px-5 py-3 text-sm font-semibold tracking-wide transition duration-200 ${styles[variant]} ${className}`;
  if (external) {
    return (
      <a href={href} className={cls} target="_blank" rel="noopener noreferrer">
        {children}
      </a>
    );
  }
  return (
    <Link href={href} className={cls}>
      {children}
    </Link>
  );
}
