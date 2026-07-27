import Image from "next/image";
import { siteConfig } from "@/data/site";

/**
 * Displays the British Council counsellor badge alongside its verifiable
 * credential so prospective students can check it independently.
 */
export function VerifiedBadge({ variant = "light" }: { variant?: "light" | "dark" }) {
  const { credential } = siteConfig;
  const dark = variant === "dark";

  return (
    <div
      className={`rounded-lg p-4 ${dark ? "bg-white/95" : "border border-line bg-white"}`}
    >
      <div className="flex flex-col gap-3">
        <Image
          src="/images/british-council-logo.svg"
          alt="British Council"
          width={220}
          height={64}
          className="h-9 w-auto shrink-0 self-start"
        />
        <Image
          src="/images/uk-certified-counsellor.svg"
          alt="I am a UK Certified Counsellor — UK Agent Quality Framework"
          width={200}
          height={114}
          className="h-auto w-full max-w-[200px] shrink-0 rounded"
        />
      </div>
      <p className="mt-3 text-sm font-bold text-navy">{credential.badgeName}</p>
      <p className="mt-1 text-xs text-muted">
        Issued to {credential.holder} by {credential.issuer} on{" "}
        {credential.issuedOn}. Valid until {credential.expiresOn}.
      </p>
      <a
        href={credential.verifyUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="mt-2 inline-block text-xs font-bold text-teal underline"
      >
        Verify this badge (code {credential.authCode})
      </a>
    </div>
  );
}
