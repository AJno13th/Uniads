export type CourseLevel =
  | "foundation"
  | "undergraduate"
  | "postgraduate"
  | "certhe"
  | "hnd";

export type CourseCategory = "foundation" | "undergraduate" | "masters" | "other";

export const courseCategoryMeta: Record<
  CourseCategory,
  { label: string; href: string; blurb: string }
> = {
  foundation: {
    label: "Foundation Year",
    href: "/courses/foundation",
    blurb: "Foundation years attached to full degree pathways",
  },
  undergraduate: {
    label: "Undergraduate",
    href: "/courses/undergraduate",
    blurb: "Bachelor’s degrees and top-up courses",
  },
  masters: {
    label: "Master’s",
    href: "/courses/masters",
    blurb: "Master’s and postgraduate programmes",
  },
  other: {
    label: "Other Pathways",
    href: "/courses/other",
    blurb: "HND and CertHE vocational pathways",
  },
};

export function courseCategory(level: CourseLevel): CourseCategory {
  if (level === "foundation") return "foundation";
  if (level === "undergraduate") return "undergraduate";
  if (level === "postgraduate") return "masters";
  return "other";
}

export function levelLabel(level: CourseLevel) {
  switch (level) {
    case "foundation":
      return "Foundation Year";
    case "undergraduate":
      return "Undergraduate";
    case "postgraduate":
      return "Master’s";
    case "certhe":
      return "CertHE";
    case "hnd":
      return "HND";
  }
}

export type University = {
  slug: string;
  name: string;
  shortName: string;
  schedule: string;
  interview: string;
  minAge: string;
  qualifications: string;
  locations: string[];
  requirements: string[];
  notes?: string[];
  courses: {
    name: string;
    level: CourseLevel;
    status?: "available" | "not-running" | "new" | "contact";
  }[];
};

export const universities: University[] = [
  {
    slug: "gbs",
    name: "GBS Global Banking School",
    shortName: "GBS",
    schedule: "2 days a week",
    interview: "Interview and test on campus",
    minAge: "21+",
    qualifications: "No qualification needed",
    locations: ["London – Stratford / Greenford", "Birmingham", "Manchester", "Leeds"],
    requirements: ["Minimum age 21+", "No prior qualification required for many courses"],
    courses: [
      { name: "BA (Hons) Global Business and Entrepreneurship with Foundation Year", level: "foundation" },
      { name: "BSc (Hons) Accounting & Financial Management with Foundation", level: "foundation" },
      { name: "BSc (Hons) Business and Tourism Management with Foundation Year", level: "foundation" },
      { name: "BSc (Hons) Construction Management with Foundation Year", level: "foundation" },
      { name: "BSc (Hons) Health and Social Care with Foundation Year in Health and Care", level: "foundation" },
      { name: "BSc (Hons) Health, Wellbeing and Social Care with Foundation Year", level: "foundation" },
      { name: "HND in Business", level: "hnd" },
      { name: "HND in Digital Technologies", level: "hnd" },
    ],
  },
  {
    slug: "lcca",
    name: "LCCA – London School of Contemporary Arts",
    shortName: "LCCA",
    schedule: "1 day online / 1 day on campus · Morning, evening & week-evening classes",
    interview: "Interview and test online (Duolingo). UK-born applicants typically do not need Duolingo.",
    minAge: "18+",
    qualifications: "Work experience or Level 3",
    locations: ["London – Tower Hill / Commercial Road"],
    requirements: ["Minimum age 18+", "Work experience or Level 3"],
    courses: [
      { name: "BA (Hons) Business Management with Foundation", level: "foundation" },
      { name: "BA (Hons) Fashion", level: "undergraduate" },
      { name: "BA (Hons) Fashion Management and Marketing", level: "undergraduate" },
      { name: "BA (Hons) Fashion Media and Promotion", level: "undergraduate" },
      { name: "BA (Hons) Graphic Design", level: "undergraduate" },
      { name: "BA (Hons) Hospitality Management", level: "undergraduate" },
      { name: "MA Fashion Business and Management", level: "postgraduate" },
    ],
  },
  {
    slug: "dghe",
    name: "DGHE – David Game Higher Education",
    shortName: "DGHE",
    schedule: "1 day online / 1 day on campus",
    interview: "Interview and test on campus",
    minAge: "21+",
    qualifications: "Work reference or Level 3 / GCSE",
    locations: ["London"],
    requirements: ["Minimum age 21+", "Work reference or Level 3 / GCSE"],
    courses: [
      { name: "HND Business", level: "hnd" },
      { name: "HND Public Services", level: "hnd" },
      { name: "HND Cyber Security", level: "hnd" },
      { name: "HND Digital Technology", level: "hnd" },
      { name: "HND Web Design", level: "hnd" },
      { name: "BA (Hons) Business Management with Foundation", level: "foundation" },
      { name: "BSc Health and Social Care Leadership and Management", level: "undergraduate" },
    ],
  },
  {
    slug: "arden",
    name: "Arden University",
    shortName: "Arden",
    schedule: "2 days a week · Morning and evening classes",
    interview: "Interview and test online (Duolingo)",
    minAge: "18+ (CertHE) / 21+ (degree pathways)",
    qualifications: "Qualification / Level 3 / GCSE for degree pathways · No qualification needed for CertHE",
    locations: ["London", "Birmingham", "Manchester", "Leeds"],
    requirements: [
      "Degree pathways: minimum age 21+, Level 3 / GCSE or equivalent",
      "CertHE pathways: minimum age 18+, no qualification needed",
    ],
    notes: ["CertHE intakes available", "Flexible online interview process"],
    courses: [
      { name: "BA (Hons) Business Management with Foundation Year", level: "foundation" },
      { name: "BSc (Hons) Health and Care Management with Foundation Year", level: "foundation" },
      { name: "BSc (Hons) Accounting and Finance with Foundation Year", level: "foundation" },
      { name: "BSc (Hons) Computing with Foundation Year", level: "foundation" },
      { name: "BSc (Hons) Project Management with Foundation Year", level: "foundation" },
      { name: "BSc (Hons) Digital Marketing with Foundation Year", level: "foundation" },
      {
        name: "BSc (Hons) International Hospitality and Tourism Management with Foundation Year",
        level: "foundation",
        status: "new",
      },
      { name: "BSc (Hons) Supply Chain Management with Foundation Year", level: "foundation" },
      { name: "BA (Hons) Psychology with Foundation Year", level: "foundation" },
      { name: "BA (Hons) Psychology and Counselling with Foundation Year", level: "foundation" },
      { name: "BA (Hons) Criminology and Psychology with Foundation Year", level: "foundation" },
      { name: "BA (Hons) Criminology with Foundation Year", level: "foundation" },
      { name: "LLB (Hons) Law with Foundation Year", level: "foundation" },
      { name: "CertHE Business Management", level: "certhe" },
      { name: "CertHE Health and Care", level: "certhe" },
      { name: "CertHE Computing", level: "certhe" },
    ],
  },
  {
    slug: "lsst",
    name: "LSST – London School of Science and Technology",
    shortName: "LSST",
    schedule: "2 days a week",
    interview: "Interview and test on campus",
    minAge: "18+",
    qualifications: "No qualification required",
    locations: ["London", "Birmingham", "Luton"],
    requirements: [
      "CV",
      "Personal statement (150 words)",
      "Confirm whether you have submitted a previous application",
    ],
    courses: [
      { name: "BA (Hons) Business Management with Foundation Year", level: "foundation" },
      {
        name: "BSc (Hons) Digital Marketing with Foundation",
        level: "foundation",
        status: "not-running",
      },
      { name: "BSc (Hons) Health and Social Science with Foundation Year", level: "foundation" },
    ],
  },
  {
    slug: "uwtsd",
    name: "UWTSD – University of Wales Trinity Saint David",
    shortName: "UWTSD",
    schedule: "2 days a week",
    interview: "On-campus interviews and test",
    minAge: "18+",
    qualifications: "No qualification required for CertHE · Level 3 (120 credits) for full degrees",
    locations: ["Birmingham", "London"],
    requirements: [
      "CertHE: no qualification required, minimum age 18+",
      "BA/BSc pathways: Level 3 with 120 credits (home-country diploma certificates accepted)",
    ],
    courses: [
      { name: "CertHE Business Skills for the Workplace", level: "certhe" },
      { name: "CertHE Health and Social Care Skills for the Workplace", level: "certhe" },
      { name: "CertHE Computing for the Workplace", level: "certhe" },
      { name: "BA (Hons) Business Management", level: "undergraduate" },
      { name: "BSc Computing", level: "undergraduate" },
    ],
  },
  {
    slug: "lccm",
    name: "LCCM – London College of Creative Media",
    shortName: "LCCM",
    schedule: "2 days a week",
    interview: "Interview and test on campus",
    minAge: "21+",
    qualifications: "Portfolio · Work experience or Level 3 / GCSE",
    locations: ["London"],
    requirements: ["Portfolio", "Work experience or Level 3 / GCSE", "Minimum age 21+"],
    courses: [
      { name: "Creative media and design pathways — contact UNIADS for current enrolment list", level: "undergraduate", status: "contact" },
    ],
  },
  {
    slug: "qahe",
    name: "QA Higher Education (QAHE)",
    shortName: "QAHE",
    schedule: "1 day online / 1 day on campus",
    interview: "Interview and test on campus",
    minAge: "21+",
    qualifications: "Level 3 or 2 years’ relevant work experience",
    locations: ["London", "Birmingham", "Manchester"],
    requirements: [
      "Level 3 or 2 years of work experience on CV",
      "If self-employed: HMRC evidence or accountant’s letter",
      "Master’s courses available — get in touch for details",
    ],
    courses: [
      { name: "Business Management with Foundation", level: "foundation" },
      { name: "Health and Social Care with Foundation", level: "foundation" },
      { name: "Master’s programmes — contact UNIADS", level: "postgraduate", status: "contact" },
    ],
  },
  {
    slug: "lmu",
    name: "London Metropolitan University (LMU)",
    shortName: "LMU",
    schedule: "2 days a week",
    interview: "Interview and test on campus",
    minAge: "21+",
    qualifications: "No qualification required · Minimum 5 years’ work history",
    locations: ["London"],
    requirements: [
      "Minimum age 21+",
      "Minimum 5 years of work history",
      "No formal qualification required for listed foundation pathways",
      "Master’s courses available — get in touch for details",
    ],
    courses: [
      { name: "Business Management with Foundation", level: "foundation" },
      { name: "Health and Social Care with Foundation", level: "foundation" },
      { name: "Master’s programmes — contact UNIADS", level: "postgraduate", status: "contact" },
    ],
  },
  {
    slug: "lsc-cccu",
    name: "LSC / Canterbury Christ Church University (CCCU)",
    shortName: "LSC / CCCU",
    schedule: "On-campus interview with writing test",
    interview: "Verbal interview (approx. 10 min) and basic English writing test on campus",
    minAge: "21+",
    qualifications: "Work reference required on CV",
    locations: ["Within approx. 1 hr 10 min travel time of campus"],
    requirements: [
      "Minimum age 21+",
      "Work reference on CV",
      "Bring original documents uploaded for the application to interview",
      "Address accepted within approx. 1 hr 10 min travel time",
    ],
    courses: [
      { name: "Business Management with Foundation", level: "foundation" },
      { name: "Health and Social Care with Foundation", level: "foundation" },
    ],
  },
  {
    slug: "elizabeth-school",
    name: "Elizabeth School of London",
    shortName: "Elizabeth School",
    schedule: "2 days a week · Morning and evening classes",
    interview: "Interview and test on campus",
    minAge: "21+",
    qualifications: "Level 3 / GCSE · 3 years’ work experience with P60 or payslip evidence",
    locations: ["London", "Birmingham", "Manchester", "Leeds", "Leicester", "Northampton"],
    requirements: [
      "Minimum age 21+",
      "Qualification / Level 3 / GCSE",
      "3 years’ work experience with P60 or payslip evidence",
    ],
    courses: [
      { name: "Undergraduate pathways across partner programmes — contact UNIADS for current enrolment", level: "undergraduate", status: "contact" },
    ],
  },
  {
    slug: "apex",
    name: "Apex College",
    shortName: "Apex",
    schedule: "2 days a week · Morning classes",
    interview: "Interview and test on campus",
    minAge: "18+",
    qualifications: "Level 3 / GCSE · 1 year work experience with P60 or payslip evidence",
    locations: ["London", "Leicester"],
    requirements: [
      "Minimum age 18+",
      "Qualification / Level 3 / GCSE",
      "1 year of work experience with P60 or payslip evidence",
    ],
    courses: [
      { name: "BTEC Level 5 Higher National Diploma in Business", level: "hnd" },
    ],
  },
  {
    slug: "cecos",
    name: "CECOS College",
    shortName: "CECOS",
    schedule: "1½ days on campus · ½ day online · Weekdays, weekends & evenings",
    interview: "Interview online and BKSB test on campus",
    minAge: "21+",
    qualifications: "Level 3 / GCSE · 2 years’ work experience with P60 or payslip evidence",
    locations: ["Birmingham", "London", "Bradford"],
    requirements: [
      "Minimum age 21+",
      "Qualification / Level 3 / GCSE",
      "2 years’ work experience with P60 or payslip evidence",
    ],
    courses: [
      { name: "BA (Hons) Business Management and Sustainability – 4 years", level: "undergraduate" },
      { name: "BA (Hons) Business Management and Sustainability – 3 years", level: "undergraduate" },
      { name: "BA (Hons) Business Management (Top-up)", level: "undergraduate" },
      { name: "HNC & HND in Business", level: "hnd" },
    ],
  },
  {
    slug: "ukmc",
    name: "UKMC College",
    shortName: "UKMC",
    schedule: "2 days a week · Morning classes",
    interview: "Interview and test on campus",
    minAge: "21+",
    qualifications: "Level 3 / GCSE · 2 years’ work experience with P60 or payslip evidence",
    locations: ["Newcastle", "Manchester", "Derby"],
    requirements: [
      "Minimum age 21+",
      "Qualification / Level 3 / GCSE",
      "2 years’ work experience with P60 or payslip evidence",
    ],
    courses: [
      { name: "BA (Hons) Business Management with Foundation", level: "foundation" },
      { name: "Digital Marketing with Foundation", level: "foundation" },
      { name: "BA (Hons) Business Management (Top-up)", level: "undergraduate" },
      { name: "Business Management Year 1", level: "undergraduate" },
      { name: "Construction Management with Foundation (Manchester only)", level: "foundation" },
    ],
  },
];

export const subjectAreas = [
  "Business Management",
  "Health and Social Care",
  "Digital Marketing",
  "Fashion",
  "Graphic Design",
  "Cyber Security",
  "Accounting and Finance",
  "Computing & Technology",
  "Law",
  "Psychology & Criminology",
  "Hospitality & Tourism",
  "Construction Management",
  "Project & Supply Chain Management",
] as const;

export function getUniversity(slug: string) {
  return universities.find((u) => u.slug === slug);
}

export type ListedCourse = University["courses"][number] & {
  university: University;
  category: CourseCategory;
};

function listActiveCourses(
  predicate: (course: University["courses"][number]) => boolean
): ListedCourse[] {
  return universities.flatMap((uni) =>
    uni.courses
      .filter((c) => c.status !== "not-running" && predicate(c))
      .map((c) => ({ ...c, university: uni, category: courseCategory(c.level) }))
  );
}

export function coursesByCategory(category: CourseCategory) {
  return listActiveCourses((c) => courseCategory(c.level) === category);
}

export function foundationCourses() {
  return coursesByCategory("foundation");
}

export function undergraduateCourses() {
  return coursesByCategory("undergraduate");
}

export function mastersCourses() {
  return coursesByCategory("masters");
}

/** @deprecated Use mastersCourses() */
export function postgraduateCourses() {
  return mastersCourses();
}

export function otherCourses() {
  return coursesByCategory("other");
}

export function coursesGroupedByCategory(courses: ListedCourse[]) {
  const groups: Record<CourseCategory, ListedCourse[]> = {
    foundation: [],
    undergraduate: [],
    masters: [],
    other: [],
  };
  for (const course of courses) {
    groups[course.category].push(course);
  }
  return groups;
}

export function courseCounts() {
  return {
    foundation: foundationCourses().length,
    undergraduate: undergraduateCourses().length,
    masters: mastersCourses().length,
    other: otherCourses().length,
  };
}

