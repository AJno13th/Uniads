import type { Metadata } from "next";
import { Syne, Manrope } from "next/font/google";
import { FitnessProvider } from "@/lib/fitness/context";
import "./globals.css";

const syne = Syne({
  variable: "--font-display",
  subsets: ["latin"],
  display: "swap",
});

const manrope = Manrope({
  variable: "--font-body",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "FORGE — Continuous-rep training & intelligent fuel",
    template: "%s | FORGE",
  },
  description:
    "Track continuous reps with cylinder targets, rank by weight, free body readings, photo food macros, and meal + exercise recommendations that adapt to you.",
  applicationName: "FORGE",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${syne.variable} ${manrope.variable} h-full`}>
      <body className="flex min-h-full flex-col antialiased">
        <FitnessProvider>{children}</FitnessProvider>
      </body>
    </html>
  );
}
