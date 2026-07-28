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

const ogImage = {
  url: "/images/og-uniads.jpg",
  width: 1200,
  height: 630,
  alt: "UNIADS Educational Consulting — Study in the UK",
};

export const metadata: Metadata = {
  metadataBase: new URL(siteConfig.domain),
  title: {
    default:
      "UNIADS | Educational Consulting — UK University Applications & Student Finance",
    template: `%s | ${siteConfig.name}`,
  },
  description:
    "UNIADS (Uniads Educational Consulting) helps students apply to top UK universities, secure student finance and childcare grants, and enrol on foundation, undergraduate, master’s and pathway courses. Free counselling at www.uniads.co.uk.",
  keywords: [
    "UNIADS",
    "uniads",
    "uniads.co.uk",
    "Uniads Educational Consulting",
    "UNIADS Educational Consulting",
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
  authors: [{ name: siteConfig.legalName, url: siteConfig.domain }],
  creator: siteConfig.name,
  publisher: siteConfig.legalName,
  applicationName: siteConfig.name,
  openGraph: {
    type: "website",
    locale: "en_GB",
    url: siteConfig.domain,
    siteName: "UNIADS",
    title: "UNIADS | Educational Consulting — Study in the UK",
    description:
      "Free counselling for UK university applications, student finance, childcare grants and course matching. Book a call with UNIADS.",
    images: [ogImage],
  },
  twitter: {
    card: "summary_large_image",
    title: "UNIADS | Educational Consulting",
    description:
      "Study in the UK with expert application, finance and course guidance from UNIADS.",
    images: [ogImage.url],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
      "max-video-preview": -1,
    },
  },
  alternates: {
    canonical: siteConfig.domain,
  },
  category: "education",
  verification: process.env.GOOGLE_SITE_VERIFICATION
    ? { google: process.env.GOOGLE_SITE_VERIFICATION }
    : undefined,
};

const organizationLd = {
  "@context": "https://schema.org",
  "@type": "EducationalOrganization",
  "@id": `${siteConfig.domain}/#organization`,
  name: "UNIADS",
  legalName: siteConfig.legalName,
  alternateName: [
    "UNIADS Educational Consulting",
    "Uniads Educational Consulting",
    "uniads",
    "uniads.co.uk",
  ],
  url: siteConfig.domain,
  logo: {
    "@type": "ImageObject",
    url: `${siteConfig.domain}/images/uniads-logo.svg`,
  },
  image: `${siteConfig.domain}/images/og-uniads.jpg`,
  email: siteConfig.email,
  telephone: `+${siteConfig.phone}`,
  sameAs: [
    siteConfig.social.facebook,
    siteConfig.social.instagram,
    siteConfig.social.tiktok,
  ],
  description:
    "UK educational consultancy offering university application support, student finance guidance, childcare grant support and course matching.",
  areaServed: {
    "@type": "Country",
    name: "United Kingdom",
  },
  knowsAbout: [
    "University admissions",
    "Student finance",
    "Foundation year courses",
    "Undergraduate study",
    "Postgraduate study",
    "Childcare grant",
  ],
  contactPoint: [
    {
      "@type": "ContactPoint",
      telephone: `+${siteConfig.phone}`,
      contactType: "customer service",
      areaServed: "GB",
      availableLanguage: ["English"],
    },
  ],
};

const websiteLd = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  "@id": `${siteConfig.domain}/#website`,
  name: "UNIADS",
  alternateName: ["UNIADS Educational Consulting", "uniads.co.uk"],
  url: siteConfig.domain,
  publisher: { "@id": `${siteConfig.domain}/#organization` },
  inLanguage: "en-GB",
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
          dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationLd) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteLd) }}
        />
        {children}
      </body>
    </html>
  );
}
