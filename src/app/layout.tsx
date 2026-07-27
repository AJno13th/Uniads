import type { Metadata } from "next";
import { Outfit, Oswald } from "next/font/google";
import { siteConfig } from "@/data/site";
import "./globals.css";

const outfit = Outfit({
  variable: "--font-outfit",
  subsets: ["latin"],
  display: "swap",
});

const oswald = Oswald({
  variable: "--font-oswald",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(siteConfig.domain),
  title: {
    default:
      "UNIADS Educational Consulting | Study in the UK · University Applications & Student Finance",
    template: "%s | UNIADS Educational Consulting",
  },
  description:
    "UNIADS helps students apply to top UK universities, secure student finance and childcare grants, and enrol on foundation, undergraduate and postgraduate courses — free counselling and guidance.",
  keywords: [
    "UNIADS",
    "Uniads Educational Consulting",
    "study in the UK",
    "UK university application",
    "student finance application support",
    "foundation year courses UK",
    "undergraduate courses London",
    "education consultant UK",
    "childcare grant application",
    "British Council certified counsellor",
    "GBS",
    "Arden University",
    "London Metropolitan University",
  ],
  authors: [{ name: siteConfig.legalName }],
  creator: siteConfig.legalName,
  openGraph: {
    type: "website",
    locale: "en_GB",
    url: siteConfig.domain,
    siteName: siteConfig.legalName,
    title: "UNIADS Educational Consulting | Study in the UK",
    description:
      "Start your university journey today. Free counselling, university applications, student finance and course matching across top UK partner institutions.",
    images: [{ url: "/images/uniads-logo-mark.svg", width: 280, height: 120, alt: "UNIADS" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "UNIADS Educational Consulting",
    description:
      "Study in the UK with expert application, finance and course guidance from UNIADS.",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true, "max-image-preview": "large" },
  },
  alternates: { canonical: siteConfig.domain },
  category: "education",
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "EducationalOrganization",
  name: siteConfig.legalName,
  url: siteConfig.domain,
  logo: `${siteConfig.domain}/images/uniads-logo.svg`,
  email: siteConfig.email,
  telephone: `+${siteConfig.phone}`,
  sameAs: [
    siteConfig.social.facebook,
    siteConfig.social.instagram,
    siteConfig.social.tiktok,
  ],
  description:
    "UK educational consultancy offering university application support, student finance guidance, childcare grant support and course matching.",
  areaServed: "GB",
  knowsAbout: [
    "University admissions",
    "Student finance",
    "Foundation year courses",
    "Undergraduate study",
    "Postgraduate study",
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en-GB" className={`${outfit.variable} ${oswald.variable} h-full`}>
      <body className="flex min-h-full flex-col antialiased">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
        {children}
      </body>
    </html>
  );
}
