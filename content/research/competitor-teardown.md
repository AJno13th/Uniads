# Competitor teardown — Just Educated and UNISEF

Compiled 22 September 2026. Every claim below is traceable to a source listed
inline. Where something could not be verified it is marked **UNVERIFIED** rather
than estimated — the whole point of this file is to be the factual base that the
daily content is generated from, so a guess in here becomes a false claim in a post.

---

## 1. Evidence status

| Source | Access | What it gave us |
| --- | --- | --- |
| `justeducated.co.uk` | Public | Full offer, claims, funnel, pricing, blog/SEO map |
| `unisef.co.uk` | Public | Full offer, claims, funnel, segments |
| Meta Ad Library (GB) | Public | 13 UNISEF ads with run dates; 6 Just Educated ads, all expired |
| TikTok profile pages | **Login-gated** | Both competitors have "audience controls" on — logged-out requests return `statusCode: 209002` and the message *"This creator turned on audience controls. Log in to make the most of your TikTok experience."* |
| TikTok video-detail pages | Public for public accounts | Exact plays / likes / comments / shares / saves per video |
| TikTok Commercial Content Library | **Does not cover GB** | Returns `Total ads: 0` for every GB query including generic terms, because the library covers the EEA and the UK is not in the EEA. We therefore **cannot** conclude either competitor does or does not buy TikTok ads. |

Consequence: the TikTok organic numbers in section 6 come from a logged-in
browser session. The paid analysis in section 5 is fully public and reproducible.

---

## 2. Account map

| | Just Educated | UNISEF |
| --- | --- | --- |
| Site | justeducated.co.uk | unisef.co.uk |
| Legal | Just Educated Ltd, 99 Long St / City View Business Centre, Manchester M24 6UN | Not stated on site |
| Phone | +44 7551 985323 / +44 7867 267872 | +44 7365 405099 |
| Email | info@justeducated.co.uk | hq@unisef.co.uk |
| TikTok | `@justeducated` | `@unisefuk` ("Unisef") |
| Instagram | `@justeducatedltd` | `@unisef.hq` |
| Facebook | `Just Educated \| Manchester`, page id `61551358111557` | `Unisef`, page id `104791279289208`, 4,254 followers |
| Lead capture | On-page form + JotForm `form.jotform.com/242245565546360` | Own `/apply` form + WhatsApp `wa.link/r81utd` |
| Meta pixels | Not checked | **Two** pixels: `1397985730780505`, `1449176930424507` |

---

## 3. Just Educated — positioning and offer

**One-line position:** "100% free university enrollment support" for mature and
non-traditional students, Manchester-headquartered, campus-led.

Offer components, all from their own pages:

- Free end-to-end service, "funded directly through our official university partnerships" (`/faqs/`)
- 21+ can apply with no formal GCSEs or A-Levels, assessed on work and life experience
- Study 2 days per week, morning / evening / weekend
- Campuses: Manchester (head office), Leeds, Birmingham, East London, West London, Cardiff, Swansea
- Intakes in September, January, April and June — "multiple entry intake windows" (`/faqs/` Q19)
- **No UCAS** — "direct application channels with our partner universities" (`/faqs/` Q5)
- Offer letter "within 48 hours" (`/faqs/` Q16, `/services/`)
- 19 courses: mostly BSc (Hons) with Foundation Year, plus HNDs, two CertHEs, two MScs
- 8 named services including CV enhancement, mock interviews, ongoing in-study support and annual student finance renewal (`/services/`)

### Claims they make, and how they stand up

| Their claim | Source | Assessment |
| --- | --- | --- |
| "maintenance loans up to **£16,000** per year" | `/faqs/` Q6, homepage, `/services/` | **Overstated.** The 2026/27 maximum Maintenance Loan is £14,135 (living away from home, in London) and £10,830 outside London — GOV.UK. £16,000 exceeds the highest available rate. |
| "**98%** approval rate" for Student Finance | `/faqs/` Q6, `/services/` | Unevidenced. No methodology, sample or date. |
| "**94%** admissions pass rate" | Homepage | Unevidenced. |
| "**51%** Satisfaction" | Homepage | Appears on their own homepage next to "595+ Students". Reads as an own goal — presumably a CMS error, but it is live. |
| Student counts | Homepage | Mutually contradictory within one page: "595+ Students", "1362+ Satisfied Students", "638+ Satisfied Students". |
| Campus count | Homepage / `/faqs/` | Also contradictory: "14+ Campuses", "9+ Campuses", "14+ partner campuses", while `/campuses/` lists 7. |
| "Childcare Grant (covering up to 85% of verified childcare fees)" | `/faqs/` Q9 | **Accurate** — GOV.UK confirms 85%, capped at £199.62/week for one child and £342.24/week for two or more. |
| "You only begin making repayments the April after you graduate" | `/faqs/` Q7 | Broadly right in direction, but stated without the income threshold in the same breath. |
| Rated 4.9/5 on Google, 95 reviews, Trustindex-verified | `/testimonials/` | **Their strongest asset.** Verifiable third-party social proof. |

### Their real strength: reviews

The `/testimonials/` page carries 95 Google reviews at 4.9/5 via Trustindex. The
recurring praise themes are worth copying as *content themes*, because they are
what their market actually values:

- Speed and responsiveness ("fast quick responses always available on hand to help all hours")
- A named human advisor — "Sameul" is named repeatedly and credited personally
- Hand-holding through Student Finance specifically ("contacting Student Finance every step he help me")
- Removing anxiety ("As someone who tends to overthink decisions like this... GO FOR IT")
- Practical settling-in support (equipment, orientation)

One review names a real placement: "I was able to study at Hardwick in Manchester
studying business management".

### SEO / content strategy

Their blog is an unambiguous mature-student play. Post slugs from
`post-sitemap.xml` include: `study-in-the-uk-at-21`, `mature-student-nursing-courses`,
`how-to-apply-university-at-30-uk`, `what-support-is-available-for-mature-students`,
`mature-student-university-admissions-guide-uk`, `best-university-courses-for-mature-students-uk`,
`uk-business-degree-for-adult-learners`, plus career-outcome posts
(`entry-level-cybersecurity-jobs`, `how-to-become-a-chartered-accountant-uk`,
`project-management-certifications`).

Read the pattern: **age-anchored queries** ("at 21", "at 30", "adult learners")
and **career-outcome queries**. Those are the two intent clusters in this market.

---

## 4. UNISEF — positioning and offer

**One-line position:** a polished, career-first educational consultancy — softer
and more premium in tone than Just Educated, WhatsApp-first in conversion.

- 6+ years in business, 600+ successful enrolments, 20+ UK universities (`/about`)
- Branch campuses: London, Manchester, Birmingham, Leeds, Nottingham, Newcastle
- Explicit segments on the homepage: **mature students** ("Looking to restart your university education?") and **experienced professionals** ("Missing the qualifications you need?")
- Advisor response promise: "within 24 hours — by phone, email or WhatsApp"
- Foundation year framed well: "attached to a 4-year programme — meaning you're already in higher education from day one" (`/foundation-year`)
- Application timeline: "Most applications take 2–4 weeks from your first call with us to a confirmed offer" (`/foundation-year` FAQ)
- Site is a modern SPA (not WordPress), fast, with a clean `/apply` funnel

Their testimonials are first-name-and-surname with no photo, no course and no
university ("James Anderson, Student"), which reads as placeholder copy — a
weakness against Just Educated's 95 verified Google reviews.

---

## 5. Paid creative — the highest-value evidence

### UNISEF is the serious paid advertiser

13 ads captured from the Meta Ad Library, GB, all statuses. Ads marked
"**N ads** use this creative and text" are being run across multiple placements,
which is a scaling signal. Long run-times are the performance signal that matters:
advertisers kill losers within days.

| Status | Run dates | Creative count | Opening line |
| --- | --- | --- | --- |
| Active | from 9 Feb 2026 | 8 | "🎓 No A Levels? No Problem!" |
| Active | from 9 Feb 2026 | 8 | "Wait — why are thousands of working adults suddenly doing this one-year uni course?" |
| Active | from 16 May 2026 | 8 | "🎓 Uni Qualification in just one year?" |
| Active | from 16 May 2026 | 4 | "Careers in Psychology can pay up to £60,000 a year (or more!)." |
| Active | from 17 Mar 2026 | 2 | "Psychology with Counselling is becoming one of the most popular degrees for career changers right now." |
| Active | from 17 Mar 2026 | 1 | "Psychology with Counselling is one of the fastest-growing degrees right now" |
| Active | from 18 May 2026 | 1 | "Thousands of people started an online Psychology degree this year — fully funded and studied from home." |
| Inactive | 14 Feb – 17 Jun 2026 | 4 | "🎓 No A Levels? No Problem!" (re-run) |
| Inactive | 10 Feb – 14 May 2026 | 3 | "Did you know you could get a university degree in just two years? Sounds unreal, right? I thought the same — until I discovered this." |
| Inactive | 11 Feb – 15 May 2026 | 4 | "🤫 Here's a little secret: Universities in London love applicants with real-world mental health experience" |
| Inactive | 16 Oct – 1 Nov 2025 | 1 | "No A-Levels? No problem. If you've got a Level 3 qualification or work experience..." |
| Inactive | 11 Jul – 13 Oct 2025 | 4 | "⏳ Final spots for September intake — apply now!" |

Seven months continuously live (Feb → Sep 2026) on "No A Levels? No Problem!"
across 8+4 creatives, plus the same hook appearing as far back as Oct 2025. That
is the single most validated hook in this market.

**Their whole psychology cluster** — 4 separate ads launched Mar–May 2026 — says
they found a winning vertical and poured budget into it. Psychology / Psychology
with Counselling, sold to career changers on a "help people + keep your job +
£60k ceiling" promise.

Notable craft details worth copying:

- Compliance hedging is consistent: "(eligible students)", "(subject to eligibility)"
- They quote **£13,762** for the maintenance loan — the accurate 2025/26 London maximum — not a rounded-up fantasy number
- CTA is multi-channel in the creative itself: phone number, `wa.link`, "DM us", "link in bio"
- Benefit stacks are always 4–5 ticked lines, never more
- Cities are always named explicitly

### Just Educated barely advertises on Meta

Six ads, **all inactive**, all short bursts in Nov–Dec 2025:

| Library ID | Run dates | Days |
| --- | --- | --- |
| 2845842698940894 | 6–11 Nov 2025 | 5 |
| 1195584539147206 | 12–19 Nov 2025 | 7 |
| 4166891376911595 | 22–24 Nov 2025 | 2 |
| 1051492203723867 | 24–28 Nov 2025 | 4 |
| 1558247638397526 | 1–8 Dec 2025 | 7 |
| 1174337161527073 | 20–26 Dec 2025 | 6 |

The creative is weak: "📣 January 2026❗️ Join university🎓 To Unlock Your
Potential – Apply Now!" followed by roughly 30 hashtags, several of which
(`#InternationalStudents`, `#StudyAbroad`, `#UKStudentVisa`) contradict a
home-fee, Student-Finance-funded offer. One better ad exists — "Ready to start a
new chapter? ... with guidance, honesty and real support" — but it ran five days.

**Read:** Just Educated wins organically (TikTok + mature-student SEO + 95 Google
reviews). UNISEF wins on paid. Nobody in this set is doing both well.

### UNIADS currently runs no Meta ads at all

`view_all_page_id=61577408444999` with `active_status=all` returns "No ads match
your search criteria".

---

## 6. Organic TikTok — category baselines

UNIADS' own TikTok presence is effectively zero, which is the single most
important planning fact in this document:

| Account | Followers | Total likes | Videos |
| --- | --- | --- | --- |
| `@uasuk` (linked from the UNIADS site) | 4 | 2 | 2 |
| `@Uniadsuk` | 0 | 0 | 0 |

Two near-empty accounts. The site links `@uasuk`; the brand name matches
`@Uniadsuk`. **Consolidate on one before publishing anything.**

Adjacent public competitors, scraped directly (same niche: UK funded degrees, no
A-Levels, 2 days a week):

| Account | Followers | Total likes | Videos | Likes per video |
| --- | --- | --- | --- | --- |
| `@studinuk` | 5,282 | 29,800 | 51 | **584** |
| `@londonlanguageclub` | 3,207 | 9,609 | 229 | 42 |
| `@ukplatinumservices` | 2,019 | 23,900 | 438 | 55 |

Individual videos, exact figures from TikTok's own video-detail payload:

| Video | Date | Plays | Likes | Comments | Shares | Saves | Length |
| --- | --- | --- | --- | --- | --- | --- | --- |
| `@studinuk/video/7307916454047927585` | 2023-12-02 | **985,900** | 1,540 | 32 | 614 | 48 | 12s |
| `@ukplatinumservices/video/7585956684158209302` | 2025-12-21 | 832 | 7 | 0 | 0 | 0 | 22s |
| `@londonlanguageclub/video/7655256882583555361` | 2026-06-25 | 252 | 1 | 0 | 0 | 3 | 50s |

Three lessons fall straight out of this table:

1. **Volume does not work.** `@ukplatinumservices` has posted 438 videos and its
   recent one got 832 views. `@studinuk` has posted 51 and averages 14x the likes
   per video. Posting more bad videos does not compound.
2. **Length kills.** The 50-second corporate feature-list got 252 views. The
   12-second one got 985,900.
3. **Shares are the lever.** The 985k video earned 614 shares against 32
   comments — a ~19:1 share-to-comment ratio. In this niche, distribution comes
   from someone sending the video to a friend or family member who "should see
   this", not from debate in the comments. Content should be built to be *sent*,
   not argued with.

Note the 985k video says "Press 'Learn more'", indicating it carried paid
distribution, so treat 985,900 as reach-with-budget rather than pure organic. The
craft lesson — 12 seconds, one idea, one CTA — still holds.

The dead giveaway shared by both low performers is the caption style: long
emoji-bulleted feature lists, multiple phone numbers, six city names and 20+
hashtags. That format is reliably ignored.

---

## 7. What this means for UNIADS

**The gap in the market.** Just Educated is credible but sloppy and
factually loose. UNISEF is polished and disciplined on paid but has no real social
proof. Neither has an accuracy advantage, and one competitor is publishing a
maintenance-loan figure (£16,000) that is higher than the legal maximum.

So the opening for UNIADS is **be the accurate one**. Specifically:

1. **Use real numbers.** £9,790 tuition fee loan, £10,830 maintenance outside
   London, £14,135 in London, £5,760 classroom-based foundation year, Childcare
   Grant at 85% capped at £199.62/£342.24 a week. Precision is differentiating in
   a market of round-number exaggeration, and it is the one claim competitors
   cannot copy without correcting themselves.
2. **Own eligibility honestly.** The genuinely under-served question is not "can I
   get in" but "do I qualify for funding". UNIADS already collects settlement
   status, residency length and prior-study history in its qualifier — that is a
   content moat, because answering it accurately requires actual expertise.
3. **Copy the validated hook family, not the wording.** "No A-Levels? No problem"
   is proven over seven months of live spend. UNIADS has its own on-brand version
   already on the site: "No GCSEs? No A-Levels? No problem."
4. **Steal the psychology insight.** UNISEF put four ads behind Psychology /
   Psychology with Counselling for career changers. UNIADS partners offer
   psychology-with-counselling routes. That vertical is pre-validated.
5. **Build for shares, at 12–20 seconds.** One idea per video.
6. **Get real reviews on camera.** Just Educated's 95 Google reviews are their
   moat. UNIADS' counterweight is the named, verifiable
   British-Council-trained counsellor credential — no competitor has an
   equivalent, and neither publishes a named accountable human.

### Deliberate non-copies

These competitor tactics are off-limits and the reasons are in
[guardrails.md](../guardrails.md):

- Invented performance statistics (98% approval, 94% pass rate, 600+ enrolments)
- Maintenance-loan figures above the published maximum
- "Guaranteed" or "within 48 hours" offer promises UNIADS cannot control
- "100% free education" phrasing — the *service* is free; tuition is a loan that
  is repaid, and conflating the two is the clearest mis-selling risk in the category
- Placeholder testimonials with invented student names

---

## 8. Reproducing this research

```bash
# Competitor sites as plain text
curl -sS "https://r.jina.ai/https://justeducated.co.uk/"

# Meta ads by page (GB, all statuses)
curl -sS "https://r.jina.ai/https%3A%2F%2Fwww.facebook.com%2Fads%2Flibrary%2F%3Factive_status%3Dall%26ad_type%3Dall%26country%3DGB%26view_all_page_id%3D104791279289208"

# Resolve a Facebook page id from a vanity or share URL
curl -sS "https://www.facebook.com/plugins/page.php?href=<urlencoded-page-url>"
```

TikTok account stats and per-video stats are parsed out of the
`__UNIVERSAL_DATA_FOR_REHYDRATION__` JSON blob on profile and video pages
(`webapp.user-detail` and `webapp.video-detail`). Profile pages for accounts with
audience controls require a logged-in session; public video-detail pages do not.
