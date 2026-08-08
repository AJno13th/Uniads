import { AttributionCapture } from "@/components/AttributionCapture";
import { AdPixels } from "@/components/AdPixels";

/** Lean chrome for Instagram bio / ad traffic — form first, no site footer noise. */
export default function InstagramLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <>
      <AttributionCapture />
      <AdPixels />
      <main className="min-h-screen bg-[#f6f4ef] text-navy">{children}</main>
    </>
  );
}
