# UNIADS Educational Consulting

Official website and lead-management CRM for **Uniads.co.uk** — a UK educational
consultancy helping students secure university places, student finance, childcare
grant support, English and Maths certification, and job application support.

## Stack

- Next.js (App Router) + TypeScript
- Tailwind CSS v4
- Postgres for CRM storage (with a zero-config JSON file fallback)

## Getting started

```bash
npm install
cp .env.example .env.local   # then set CRM_ADMIN_PASSWORD
npm run dev
```

Open [http://localhost:3000](http://localhost:3000). The CRM lives at
[http://localhost:3000/admin](http://localhost:3000/admin).

## Environment variables

| Variable | Required | Purpose |
| --- | --- | --- |
| `CRM_ADMIN_PASSWORD` | Yes, to use the CRM | Password advisors enter at `/admin` |
| `CRM_SESSION_SECRET` | Recommended | Signs CRM session cookies (falls back to the password) |
| `DATABASE_URL` | Recommended in production | Postgres connection string; leads are stored in Postgres when set |
| `DATABASE_SSL` | No | Set to `false` for a local Postgres without TLS |
| `CRM_DATA_FILE` | No | Overrides the JSON fallback path (default `.data/leads.json`) |

Without `DATABASE_URL` the CRM writes to `.data/leads.json`, which is convenient
locally but does not survive redeploys on serverless hosts — set `DATABASE_URL`
before going live. The `uniads_leads` table is created automatically on first use.

## Public pages

| Route | Purpose |
| --- | --- |
| `/` | Home — hero, qualifier widget, courses, services, partners |
| `/services` | Services hub |
| `/services/university-application` | University Application Made Easy |
| `/services/english-maths-certification` | English and Maths Certification |
| `/services/student-finance` | Student Finance Application Support |
| `/services/childcare-grant` | Childcare Grant Application Support |
| `/services/job-sourcing` | Job Sourcing & Application Support |
| `/courses` | All courses and partner universities |
| `/courses/foundation`, `/courses/undergraduate`, `/courses/postgraduate` | Course types |
| `/courses/[university]` | Per-partner entry requirements and live course list |
| `/about` | About UNIADS and the verified counsellor credential |
| `/apply` | Full application form (dropdowns + checkboxes) |
| `/book` | Phone consultation calendar |
| `/study-without-qualifications` | Landing page for "no GCSEs / no A-Levels" ad traffic |
| `/privacy-policy` | Privacy policy (linked in the footer) |

## Lead qualification

Every enquiry form captures the signals that decide whether a student can get a
place and student finance:

- Settlement / immigration status
- Length of UK residency
- Age bracket and highest qualification
- Whether they have had UK student finance before
- University, course (dependent on the chosen university), study mode,
  class preference, campus city and intake

Answers are scored (0–100) into **hot / warm / cold** bands so advisors can call
the most fundable applicants first, and the same answers are placed into a preset
WhatsApp message so the first message an advisor receives is a full briefing.

## CRM (`/admin`)

- Dashboard with totals, hot-lead count, 7-day volume and enrolments
- Pipeline: New enquiry → Contacted → Qualified → Application submitted →
  Interview/test → Offer received → Student finance submitted → Enrolled
  (plus Not eligible / Lost)
- Filter by stage, settlement status, university, study mode, plus free-text search
- Lead detail with every qualification answer, the exact preset message sent,
  activity timeline, stage changes, advisor assignment and notes
- One-click WhatsApp, call and email actions
- CSV export of all leads

`/admin` and `/api/` are excluded from `robots.txt` and carry `noindex`.

## SEO

- Per-page metadata, canonical URLs and Open Graph tags
- `EducationalOrganization` and `FAQPage` structured data
- Generated `sitemap.xml` and `robots.txt`
- Keyword coverage for study-in-the-UK, mature-student, no-qualification,
  student finance and per-university searches

## Assets

`public/images` holds the UNIADS logo, the British Council logo, the UK Certified
Counsellor badge and the hero photograph. The logo and badge are vector
recreations of the supplied brand artwork — replace them with the original master
files when available, and swap `hero-graduation.jpg` for UNIADS' own photography.

## Contact

- Phone: +44 7368 218457
- WhatsApp: https://wa.me/message/L6NMHZKWMSE7J1
- Email: info@uniads.co.uk
