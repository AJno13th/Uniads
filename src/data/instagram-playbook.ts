/**
 * UNIADS Instagram growth system — filled from the viral 8-prompt playbook
 * (growth blueprint → audience → 50 ideas → reels → sales → 60-day system).
 * Use with @uniads.uk bio link: https://www.uniads.co.uk/ig
 */

export const instagramBio = {
  name: "UNIADS | UK Uni & Student Finance",
  handle: "@uniads.uk",
  bioLines: [
    "Go to uni with no A-levels",
    "British · EU · Refugee · ILR",
    "Free application + student finance help",
  ],
  linkInBio: "https://www.uniads.co.uk/ig",
  ctaButton: "Apply free",
} as const;

export const contentPillars = [
  {
    name: "Eligibility myths",
    themes: ["No qualifications", "Passport/permit list", "Age 21+", "Student finance myths"],
  },
  {
    name: "Money & loans",
    themes: ["Tuition fee loan", "Maintenance loan", "Childcare grant", "What you repay"],
  },
  {
    name: "Pathways",
    themes: ["Foundation Year", "HND / CertHE", "Business / Health / IT courses", "2 days a week"],
  },
  {
    name: "Proof & process",
    themes: ["British Council trained", "WhatsApp support", "Documents checklist", "From DM to enrolled"],
  },
] as const;

export const audienceProfile = {
  niche: "UK university access & student finance for mature / non-traditional students",
  audience:
    "Adults in the UK (often 21–45) with British, EU, Refugee or ILR status who want university without traditional A-levels",
  frustrations: [
    "Told they need A-levels / GCSEs to study",
    "Confused by student finance eligibility",
    "Fear of debt or “not for people like me”",
    "Don’t know which university/course fits work + kids",
  ],
  goals: [
    "Better job / career change",
    "Degree while working part-time",
    "Tuition + living costs covered by loans/grants",
    "Clear next step without paperwork overwhelm",
  ],
  fears: [
    "Wasting time if not eligible",
    "Scams / fake agents",
    "Failing after enrolling",
    "Childcare / schedule clash",
  ],
  objections: [
    "I have no qualifications",
    "I already used student finance",
    "I’m too old",
    "My English/Maths isn’t enough",
  ],
  buyingTriggers: [
    "Sees passport statuses that match them",
    "Hears “no A-levels” + free help",
    "WhatsApp reply within minutes",
    "Clear cities / 2-day timetable",
  ],
} as const;

/** 50 Instant-Form-aligned content ideas for Reels / carousels. */
export const contentIdeas: string[] = [
  "POV: you thought no A-levels meant no uni",
  "4 passports/permits that can unlock student finance",
  "British vs EU vs Refugee vs ILR — who can apply?",
  "If you’re 21+ this pathway changes everything",
  "Stop scrolling if you have ILR",
  "Refugee status and university — what actually happens",
  "EU settled? You might still get home fees",
  "Myth: you need GCSEs for every degree",
  "Myth: student finance is only for 18-year-olds",
  "Unpopular opinion: Foundation Year is a cheat code",
  "Tuition fee loan vs maintenance loan in 20 seconds",
  "Will I repay student finance if I earn low?",
  "Student parents: childcare grant exists",
  "2 days a week uni — yes it’s real",
  "Documents checklist before you apply",
  "What UNIADS does for free (and what we don’t)",
  "From Instagram → WhatsApp → enrolled",
  "London / Birmingham / Manchester — pick a city",
  "Business Management with no A-levels",
  "Health & Social Care pathway explainer",
  "Digital Marketing career switch story angle",
  "Cyber Security without a tech degree yet",
  "Accounting & Finance for career changers",
  "Day in the life: mature student + kids",
  "What happens on a university interview",
  "English & Maths certification — who needs it",
  "I already got a loan before — can I still study?",
  "ILR just granted — when can I apply?",
  "Don’t apply as international if you’re home-eligible",
  "Red flags of fake education agents",
  "Why we ask passport before course",
  "Yes/No: previous qualifications (and why No is OK)",
  "Save this: eligibility checklist",
  "Comment APPLY for the form",
  "Duet/stitch: “uni is only for A-level kids”",
  "Hook: They’re not advertising this pathway",
  "3 mistakes that delay student finance",
  "How long from first message to start date",
  "Part-time vs full-time — which fits work",
  "Weekend / evening classes exist",
  "What “home fees” actually means",
  "Ukraine Scheme / Refugee — common mix-ups (keep on-brand to Instant Form)",
  "Before/after: stuck in warehouse → student",
  "Advisor voice note style: eligibility FAQ",
  "Carousel: step 1 name, step 2 passport, step 3 course",
  "Story poll: British / EU / Refugee / ILR",
  "Live: 10-minute eligibility Q&A",
  "Repost student win (with permission)",
  "Soft CTA: link in bio → uniads.co.uk/ig",
  "Hard CTA: WhatsApp us today — seats fill by intake",
];

export const reelScripts = [
  {
    title: "Passport list",
    hook: "If you’ve got one of these… you can still go to uni.",
    beats: [
      "British.",
      "EU.",
      "Refugee.",
      "Or ILR.",
      "No A-levels? Ask us about Foundation pathways.",
    ],
    cta: "Link in bio — free UNIADS application help.",
    onScreen: ["British", "EU", "Refugee", "ILR", "uniads.co.uk/ig"],
  },
  {
    title: "No qualifications",
    hook: "No GCSEs. No A-levels. Still uni.",
    beats: [
      "If you’re 21+ many routes don’t need formal quals.",
      "We match you to the right course and city.",
      "Then we help with student finance.",
    ],
    cta: "Comment APPLY or tap the link in bio.",
    onScreen: ["21+", "No A-levels", "Free help", "APPLY"],
  },
  {
    title: "Money hook",
    hook: "Tuition fee loan + maintenance loan — most people don’t know.",
    beats: [
      "Eligible statuses can get home student support.",
      "You don’t pay upfront like international fees.",
      "We check eligibility before you waste time.",
    ],
    cta: "WhatsApp UNIADS — link in bio.",
    onScreen: ["Tuition loan", "Maintenance loan", "Check free"],
  },
] as const;

export const salesContentIdeas: string[] = [
  "You’re not behind — you’re eligible",
  "Free counselling vs paying an agent",
  "Objection: I’m scared of debt → repayment reality",
  "Objection: I’m too old → mature student proof",
  "Objection: No quals → Foundation / Access routes",
  "Offer: free uni application + finance support",
  "CTA: Instant Form in bio (4 questions)",
  "CTA: Book a call if you hate forms",
  "Social proof: British Council trained counsellor",
  "Urgency: next intake seats",
  "City choice content → then apply CTA",
  "Childcare grant angle for parents",
  "Career outcome: Health & Social Care jobs",
  "Career outcome: Business / digital roles",
  "DM keyword: ELIGIBLE",
  "Story sticker: “Am I eligible?” quiz",
  "Carousel: what we need from you (passport, ID, etc.)",
  "Comparison: international fees vs home route",
  "Soft sell: save this checklist",
  "Hard sell: apply today — advisor replies on WhatsApp",
];

export const growthSystem60Days = {
  posting: {
    reelsPerWeek: "5–7",
    carouselsPerWeek: "1–2",
    storiesPerDay: "3–5 (polls, quizzes, WA sticker)",
    bestSlotsUk: ["07:30–08:30", "12:00–13:30", "19:00–21:30"],
  },
  weeklyCadence: [
    "Mon: eligibility myth Reel",
    "Tue: passport/permit list Reel",
    "Wed: course pathway carousel",
    "Thu: money/finance Reel",
    "Fri: proof / process / WhatsApp CTA",
    "Sat: student-parent or day-in-life",
    "Sun: intake urgency + link in bio",
  ],
  engagement: [
    "Reply to every comment within 1 hour (peak)",
    "DM anyone who comments APPLY / ELIGIBLE with /ig link",
    "Like + reply stories that mention uni/finance",
    "Collab/duet education creators carefully (no false claims)",
  ],
  leadGen: [
    "Bio link → https://www.uniads.co.uk/ig",
    "Comment-to-DM: APPLY → Instant Form link",
    "WhatsApp deep link from Stories",
    "UTM: utm_source=instagram&utm_medium=social&utm_campaign=organic_reel",
  ],
  tracking: [
    "Saves + shares on eligibility Reels",
    "Profile visits → link taps",
    "CRM source=instagram leads",
    "WhatsApp conversations started",
    "Double down on winning hooks weekly",
  ],
  monetizationNote:
    "UNIADS monetises via university partner enrolments — Instagram job is qualified Instant Form + WhatsApp leads, not course sales on-platform.",
} as const;

export const captionFormulas = [
  "Hook line.\n\nShort proof.\n\nCTA: link in bio → Apply free.\n\n#StudentFinance #UKUniversity #MatureStudent #ILR #UNIADS",
  "Save this if you’re British / EU / Refugee / ILR.\n\nComment APPLY and we’ll send the form.\n\n#NoAlevels #FoundationYear #UNIADS",
] as const;
