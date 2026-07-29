export const siteConfig = {
  name: "UNIADS",
  legalName: "Uniads Educational Consulting",
  domain: "https://www.uniads.co.uk",
  tagline: "Educational Consulting",
  phone: "447368218457",
  phoneDisplay: "+44 7368 218457",
  email: "info@uniads.co.uk",
  /** Digits only — used for wa.me links so form messages can prefill. */
  whatsapp: "447368218457",
  whatsappMessage: "Send Us a message to start your application",
  social: {
    facebook: "https://www.facebook.com/61577408444999/",
    instagram: "https://www.instagram.com/uniads.uk/",
    tiktok: "https://www.tiktok.com/@uasuk",
  },
  credential: {
    badgeName: "UK Knowledge Trained Counsellor",
    issuer: "British Council Agent and Counsellor Training Hub",
    holder: "Anthony Joshua",
    issuedOn: "28 June 2025",
    expiresOn: "25 June 2027",
    authCode: "QELEZNSLVXSSRWBL",
    verifyUrl:
      "https://enetbadges.com/MyBadges/Details?authCode=QELEZNSLVXSSRWBL",
  },
  locations: [
    "London",
    "Birmingham",
    "Manchester",
    "Leeds",
    "Leicester",
    "Bradford",
    "Luton",
    "Newcastle",
    "Derby",
    "Northampton",
  ],
} as const;

export function whatsappLink(message: string = siteConfig.whatsappMessage) {
  // Phone-based wa.me links keep ?text= so booking/apply form answers prefill.
  // Business invite QR links (/message/...) drop the text on redirect.
  return `https://wa.me/${siteConfig.whatsapp}?text=${encodeURIComponent(message)}`;
}

/**
 * Normalise a phone into digits for wa.me (no +).
 * Accepts E.164 (+447…), UK local (07…), or bare international digits.
 */
export function toWhatsAppDigits(phone: string): string | null {
  const trimmed = phone.trim();
  if (!trimmed) return null;

  let digits = trimmed.replace(/[^\d+]/g, "");
  if (digits.startsWith("00")) digits = digits.slice(2);
  if (digits.startsWith("+")) digits = digits.slice(1);
  digits = digits.replace(/\D/g, "");

  if (!digits) return null;

  // UK local mobile/landline → add country code 44
  if (digits.startsWith("0") && digits.length >= 10 && digits.length <= 11) {
    digits = `44${digits.slice(1)}`;
  }

  if (digits.length < 10 || digits.length > 15) return null;
  return digits;
}

/** Advisor → student WhatsApp chat (uses the lead's phone, not UNIADS). */
export function whatsappToStudent(
  phone: string,
  message: string
): string | null {
  const digits = toWhatsAppDigits(phone);
  if (!digits) return null;
  // Never link advisors back to the UNIADS inbox by mistake
  if (digits === siteConfig.whatsapp) return null;
  return `https://wa.me/${digits}?text=${encodeURIComponent(message)}`;
}

export const navLinks = [
  { href: "/", label: "Home" },
  { href: "/services", label: "Services" },
  { href: "/courses", label: "Courses" },
  { href: "/about", label: "About Us" },
] as const;

export const services = [
  {
    slug: "university-application",
    title: "University Application Made Easy",
    shortTitle: "University Application",
    description:
      "From choosing the right course to submitting your documents and preparing for interviews — we guide you through every step of your university application.",
    href: "/services/university-application",
  },
  {
    slug: "english-maths-certification",
    title: "English and Maths Certification",
    shortTitle: "English & Maths Certification",
    description:
      "Secure the English and Maths certifications many UK universities require, with clear guidance on which qualifications you need and how to achieve them.",
    href: "/services/english-maths-certification",
  },
  {
    slug: "student-finance",
    title: "Student Finance Application Support",
    shortTitle: "Student Finance",
    description:
      "Expert step-by-step support with tuition fee loans, maintenance loans, grants, bursaries and scholarships — so funding never holds you back.",
    href: "/services/student-finance",
  },
  {
    slug: "childcare-grant",
    title: "Childcare Grant Application Support",
    shortTitle: "Childcare Grant",
    description:
      "Dedicated help applying for childcare grants so student parents can focus on studying with confidence.",
    href: "/services/childcare-grant",
  },
  {
    slug: "job-sourcing",
    title: "Job Sourcing & Application Support",
    shortTitle: "Job Sourcing",
    description:
      "From job search and CV polishing to interview prep — we help you land roles that match your skills and career goals.",
    href: "/services/job-sourcing",
  },
] as const;

export const courseTypes = [
  {
    slug: "foundation",
    title: "Foundation Year Courses",
    shortTitle: "Foundation Year",
    description:
      "Start higher education with a foundation year attached to a full degree pathway — ideal if you are returning to study or need an entry route without standard qualifications.",
    href: "/courses/foundation",
  },
  {
    slug: "undergraduate",
    title: "Undergraduate Courses",
    shortTitle: "Undergraduate",
    description:
      "Bachelor’s degrees and top-up pathways across business, health, computing, design, law and more — with flexible full-time, part-time, evening and weekend options.",
    href: "/courses/undergraduate",
  },
  {
    slug: "masters",
    title: "Master’s / Postgraduate Courses",
    shortTitle: "Master’s",
    description:
      "Master’s and advanced programmes for career progression. Speak with UNIADS for tailored matching with our partner universities.",
    href: "/courses/masters",
  },
  {
    slug: "other",
    title: "Other Pathways (HND & CertHE)",
    shortTitle: "Other Pathways",
    description:
      "HND and CertHE programmes for students who want a shorter or more vocational route into higher education and work.",
    href: "/courses/other",
  },
] as const;
