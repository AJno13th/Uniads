import type { Metadata } from "next";
import { PageHero } from "@/components/PageHero";
import { BookingCalendar } from "@/components/BookingCalendar";

export const metadata: Metadata = {
  title: "Book a Phone Consultation",
  description:
    "Book a UNIADS phone consultation using our calendar. Choose a date and time for expert advice on courses, applications and student finance.",
  alternates: { canonical: "/book" },
};

export default function BookPage() {
  return (
    <>
      <PageHero
        eyebrow="Consultations"
        title="Book a phone call"
        description="Pick a date and time that suits you. A UNIADS advisor will call to discuss your goals, courses and next steps."
        showCtas={false}
      />
      <section className="bg-cream/50">
        <div className="mx-auto max-w-5xl px-4 py-14 sm:px-6 lg:px-8">
          <BookingCalendar />
        </div>
      </section>
    </>
  );
}
