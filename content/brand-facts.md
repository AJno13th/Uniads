# UNIADS brand facts — the only approved claim set

**This file is the source of truth for every post.** If a fact is not in here or
in a linked GOV.UK page, it does not go in a post. Do not round numbers up, do
not "approximately" your way to a better one, and do not reuse a competitor's
statistic because it sounds plausible.

Sourced from the codebase and from GOV.UK. Every figure below carries its source.
Last verified 22 September 2026.

---

## 1. Identity

| Field | Value | Source |
| --- | --- | --- |
| Brand | UNIADS | `src/data/site.ts` |
| Legal name | Uniads Educational Consulting | `src/data/site.ts` |
| Site | https://www.uniads.co.uk | `src/data/site.ts` |
| Phone / WhatsApp | +44 7368 218457 | `src/data/site.ts` |
| Email | info@uniads.co.uk | `src/data/site.ts` |
| Facebook | facebook.com/61577408444999 | `src/data/site.ts` |
| Instagram | @uniads.uk | `src/data/site.ts` |
| TikTok | @uasuk | `src/data/site.ts` |

**Open issue:** the site links TikTok `@uasuk` (4 followers, 2 videos) but a
second account `@Uniadsuk` also exists (0 followers, 0 videos). Pick one, update
`src/data/site.ts`, and publish only to that one. Content cannot be scheduled
against an undecided handle.

## 2. The credential — UNIADS' strongest differentiator

| Field | Value |
| --- | --- |
| Badge | UK Knowledge Trained Counsellor |
| Issuer | British Council Agent and Counsellor Training Hub |
| Holder | Anthony Joshua |
| Issued | 28 June 2025 |
| Expires | 25 June 2027 |
| Verification | https://enetbadges.com/MyBadges/Details?authCode=QELEZNSLVXSSRWBL |

Source: `src/data/site.ts`. This is publicly verifiable, which neither competitor
can match — neither Just Educated nor UNISEF names an accountable, credentialled
individual anywhere on their sites. Lean on it.

Say: "British Council trained counsellor — you can verify the badge yourself."
Do **not** say: "British Council accredited/approved/partnered", "endorsed by the
British Council", or anything implying the British Council backs UNIADS as an
organisation. The credential is training held by a named individual.

## 3. Services — exactly six

From `src/data/site.ts`:

1. University Application Made Easy
2. English and Maths Certification
3. Student Finance Application Support
4. Childcare Grant Application Support
5. Job Sourcing & Application Support
6. Free counselling and guidance

What UNIADS charges the student: **nothing** for counselling, application support
and student finance guidance. Source: `/about`, `/study-without-qualifications`.

Approved phrasing: "Our support is free." / "We don't charge you a penny for our
help." Tuition is a separate matter — see section 6.

## 4. Entry routes — what is actually true

From `/study-without-qualifications` and `src/data/universities.ts`:

- **21+**: many partner universities and colleges will consider you **without
  formal qualifications**, assessing work experience plus an interview or short
  assessment instead.
- **18–21**: you will **usually need a Level 3** qualification.
- Most partner programmes run **2 days a week**, with morning, evening, weekend
  and blended online options.

Partners genuinely advertising no formal qualification requirement:

| Partner | Min age | Requirement |
| --- | --- | --- |
| GBS Global Banking School | 21+ | No prior qualification for many courses |
| LSST | 18+ | No qualification required; CV + 150-word personal statement |
| UWTSD (CertHE routes) | 18+ | No qualification required |
| Arden University (CertHE routes) | 18+ | No qualification required |
| London Metropolitan University | 21+ | No formal qualification; minimum 5 years' work history |

Partners requiring Level 3 or evidenced work experience: DGHE, LCCA, LCCM, QAHE,
Elizabeth School, Apex, CECOS, UKMC, LSC/CCCU, and Arden's degree pathways.

Several partners require documentary proof of work history — P60s or payslips
(Elizabeth School 3 years, CECOS 2 years, UKMC 2 years, Apex 1 year), or an
accountant's letter / HMRC evidence if self-employed (QAHE). **Mention this.**
It is the practical detail people need and competitors skip.

## 5. Partners, cities and subjects

14 partner institutions: GBS, LCCA, DGHE, Arden University, LSST, UWTSD, LCCM,
QAHE, London Metropolitan University, LSC / Canterbury Christ Church University,
Elizabeth School of London, Apex College, CECOS College, UKMC College.

Cities: London, Birmingham, Manchester, Leeds, Leicester, Bradford, Luton,
Newcastle, Derby, Northampton. Plus online and blended options.

Subject areas: Business Management, Health and Social Care, Digital Marketing,
Fashion, Graphic Design, Cyber Security, Accounting and Finance, Computing &
Technology, Law, Psychology & Criminology, Hospitality & Tourism, Construction
Management, Project & Supply Chain Management.

Course levels available: Foundation Year, Undergraduate (including top-ups),
Master's, HND, CertHE.

**Note for content planning:** Arden offers *BA (Hons) Psychology and Counselling
with Foundation Year* and *BA (Hons) Criminology and Psychology with Foundation
Year*. UNISEF has four live ads behind exactly this vertical, so it is
pre-validated demand that UNIADS can serve. See the hook library, Tier 1.5.

Do not name a partner as offering a course unless it appears against that partner
in `src/data/universities.ts`. Entry requirements differ per partner, so a
generic "our universities accept you with no qualifications" is false for most of
the list.

## 6. Funding — GOV.UK figures only

Never quote a funding figure that is not in this table.

### Tuition Fee Loan (paid to the university, repayable)

| | 2025/26 | 2026/27 |
| --- | --- | --- |
| Full-time | up to £9,535 | up to £9,790 |
| Accelerated degree | up to £11,440 | up to £11,750 |
| Foundation year — classroom-based (business, social science, humanities) | up to £5,760 | up to £5,760 |
| Foundation year — partly practical (science, engineering, allied to medicine, creative/performing arts) | up to £9,535 | up to £9,790 |
| Part-time | — | up to £7,335 |

### Maintenance Loan — maximum, depends on where you live (repayable)

| | 2025/26 | 2026/27 |
| --- | --- | --- |
| Living with parents | up to £8,877 | up to £9,118 |
| Living away, outside London | up to £10,544 | up to £10,830 |
| Living away, in London | up to £13,762 | up to £14,135 |
| Year of a UK course studying abroad | up to £12,076 | up to £12,403 |
| Aged 60+ on day one | up to £4,461 | up to £4,582 |

Source: https://www.gov.uk/student-finance/new-fulltime-students

**£14,135 is the ceiling.** A competitor advertises "up to £16,000 per year",
which is above every published rate. Never match it.

The maximum is means-tested on household income — most people get less than the
maximum. Any post mentioning a maintenance loan figure must say "up to" and
"depending on your household income".

### Non-repayable extras

| | Amount | Source |
| --- | --- | --- |
| Childcare Grant | 85% of childcare costs, capped at **£199.62/week** for one child or **£342.24/week** for two or more — whichever is lower | gov.uk/childcare-grant/what-youll-get |
| Parents' Learning Allowance | between **£50 and £2,024** per year, depending on household income | gov.uk/parents-learning-allowance/what-youll-get |

### Eligible course types for a Tuition Fee Loan

First degree, Certificate of Higher Education (CertHE), Diploma of Higher
Education (DipHE), HNC, HND, and Level 4/5 courses with Higher Technical
Qualification approval. Source: gov.uk/student-finance/who-qualifies

### Residency

Full support (Tuition Fee Loan + Maintenance Loan) generally requires: home in
England, and **3 years' continuous residence** in the UK, Channel Islands or Isle
of Man before the first day of the first academic year, aside from temporary
absences. Source: gov.uk/student-finance/who-qualifies

Eligibility also depends on the provider, the course, how much previous study you
have done, and your age.

### Repayment

Repayments start only after the course and only above the income threshold for
the relevant plan. Do not state a specific threshold figure without checking
GOV.UK on the day — it changes.

---

## 6b. Courses starting on or after 1 January 2027 — a different system

**This is the most important section in this file.** Everything in section 6 applies
to courses starting **before** 1 January 2027. Courses starting on or after that
date fall under a new system, the **Lifelong Learning Entitlement (LLE)**, and
applications for it opened in **September 2026** — now.

Which means: a January 2027 intake, the next one UNIADS would be selling, is an
**LLE** intake. Quoting section 6 figures for a January 2027 start is inaccurate.

Source: https://www.gov.uk/student-finance-on-or-after-1-january-2027 and
https://www.gov.uk/government/publications/lifelong-learning-entitlement-lle-overview/lifelong-learning-entitlement-overview

| Fact | Value |
| --- | --- |
| Applies to | Most courses and modules at levels 4–6 and some level 7, starting on or after 1 Jan 2027 |
| Apply from | September 2026, for courses starting January 2027 onwards |
| Total tuition fee loan entitlement, new learner | **£39,160** — equal to 4 years of full-time study at the £9,790 maximum fee |
| Reduced by previous study | Yes. Entitlement is reduced by tuition fee loans or grants already used, uplifted to today's fee rates |
| Residual entitlement example (GOV.UK's own) | Someone who completed a 3-year degree worth £29,370 at 2026/27 fees has **£9,790** left |
| Credit range for eligibility | Normally **30–180 credits** a year |
| Maintenance support | Available on all designated **in-person** courses and modules. Reduced below 120 credits a year. |
| Repayment threshold | Earnings over **£25,000** a year |
| Interest | **4.1%** |
| Age limit | Must be **under 60** on the first day of the course to apply for a Tuition Fee Loan. 60+ may apply for an additional loan towards living costs. |
| Reapplying | Required for each course, and each year of a multi-year course |
| Already funded before 1 Jan 2027 | Students already funded for a course they started before that date continue on the current system |

Residency for full support is unchanged: home in England plus **3 years'
continuous residence** in the UK, Channel Islands or Isle of Man.

### Why this matters enormously for UNIADS specifically

UNIADS' core offer is **4-year degrees with a foundation year attached**. Four
years at £9,790 is £39,160 — **exactly the full entitlement, with nothing spare.**

So for anyone who has used student finance before, a 4-year foundation-year degree
may no longer be fully fundable. GOV.UK's own worked example: a previous 3-year
graduate has £9,790 of entitlement left, which is one year, not four.

UNIADS already asks "have you had student finance before?" in its lead qualifier
(`src/data/qualification.ts`). Under LLE that answer stops being a scoring signal
and becomes **the** determining factor in whether the offer works at all.

**Compliance consequence — treat as a hard rule.** Never tell someone with
previous UK student finance that a 4-year foundation-year degree will be covered.
Route them to a human. This is on the escalation list in
[guardrails.md](guardrails.md) section 6.

GOV.UK notes a "priority additional entitlement" for certain courses such as
medicine, nursing and social work. Do not describe how it works in a post — it is
too conditional for short-form. Escalate.

### The content opportunity

Neither competitor mentions LLE anywhere on their site or in any of the 19 ads
captured. Both advertise January intakes using old-system framing, and one quotes
a maintenance figure above even the old maximum. UNIADS being first and accurate
here is the clearest version of the accuracy wedge available.

Safe framing: "The student finance system changed for courses starting January
2027. Here's what's different." Then one fact per post, sourced on screen.

Unsafe framing: anything implying a specific person's entitlement, or that the
change is good or bad news for them.

## 7. Settlement statuses UNIADS asks about

From `src/data/qualification.ts`:

British Citizen · Irish Citizen · ILR (Indefinite Leave to Remain) · EU Settled
Status · EU Pre-Settled Status · Refugee / Asylum Granted · Humanitarian
Protection · Ukraine Scheme · Dependent of any of the above · None of the above /
Not sure

Per `/study-without-qualifications`: student finance usually needs a home
residency status plus a UK residency history. **EU Pre-Settled Status and
dependants of settled people can qualify in certain cases** — which is precisely
why UNIADS checks rather than promises.

Never tell anyone on social media that they definitely qualify. The approved line
is: "Eligibility depends on your status and residency history — we check it
properly before you apply."

## 8. Approved proof points

Things UNIADS can truthfully say today:

- Free counselling, application support and student finance guidance
- A named, British-Council-trained counsellor with a publicly verifiable badge
- 14 partner institutions across 10 UK cities, plus online
- Routes for 21+ with no formal qualifications
- 2 days a week, with evening and weekend options
- Support for the Childcare Grant, which many advisers ignore
- Eligibility checked before applying, using settlement status, residency
  history, prior study and age
- English and Maths certification guidance where a partner requires it
- Job sourcing and application support after the degree

## 9. Claims UNIADS does NOT have

UNIADS has published **no** statistics of any kind. There is no approved number
for any of the following, so no post may contain one:

- Number of students enrolled or supported
- Student finance approval rate
- Admissions success or pass rate
- Satisfaction score, star rating or review count
- Years in business
- Speed of offer (no "offer in 48 hours")
- Number of partner campuses (14 *institutions* is verified; campus count is not)

If a post needs social proof, use the verifiable credential, or run a real
testimonial captured under the consent process in
[filming/ugc-brief.md](filming/ugc-brief.md). Do not invent a student.
