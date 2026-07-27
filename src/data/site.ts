export const siteConfig = {
  name: "UNIADS",
  legalName: "Uniads Educational Consulting",
  domain: "https://www.uniads.co.uk",
  tagline: "Educational Consulting",
  phone: "447983651874",
  phoneDisplay: "+44 7983 651874",
  email: "info@uniads.co.uk",
  whatsapp: "447983651874",
  whatsappMessage: "Send Us a message to start your application",
  social: {
    facebook: "https://m.facebook.com/61577408444999/",
    instagram:
      "https://www.instagram.com/uniads.uk?igsh=dGgybmRzaDdkYno2&utm_source=qr",
    tiktok: "https://www.tiktok.com/@uasuk?_t=ZN-8y6oYuMR93m&_r=1",
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
  return `https://wa.me/${siteConfig.whatsapp}?text=${encodeURIComponent(message)}`;
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
      "Bachelor’s degrees and HND pathways across business, health, computing, design, law and more — with flexible full-time, part-time, evening and weekend options.",
    href: "/courses/undergraduate",
  },
  {
    slug: "postgraduate",
    title: "Postgraduate Courses",
    shortTitle: "Postgraduate",
    description:
      "Master’s and advanced programmes for career progression. Speak with UNIADS for tailored postgraduate matching with our partner universities.",
    href: "/courses/postgraduate",
  },
] as const;
