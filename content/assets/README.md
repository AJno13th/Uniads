# Post-ready assets

Generated graphics and videos, with the captions to go with them. Everything here
is copy-paste ready — the captions below are the final text, not a brief.

Regenerate at any time with:

```bash
pip install pillow
python3 content/assets/generate_assets.py
```

Every figure is defined once, in `generate_assets.py`, and taken from
[../brand-facts.md](../brand-facts.md). **Regenerate rather than editing an
exported PNG** — a hand-edited figure is a compliance problem waiting to happen.

Fonts (Oswald and Outfit, matching `src/app/globals.css`) download automatically
to `.fonts/` on first run and are not committed.

---

## Post today — Day 1, the January 2027 rule change

Full plan and compliance checks: [../daily/2026-09-22.md](../daily/2026-09-22.md)

### TikTok — 19:30

**File:** `out/day1-tiktok-lle.mp4` — 1080x1920, 16s, 175KB

A text-card video, so it needs no filming and works with sound off. The bottom
fifth of the frame is deliberately empty because TikTok's own UI covers it.

**Before posting:** add a trending sound at low volume in the TikTok app. It has no
audio of its own, and a silent video gets suppressed. Pick the sound on the day —
that is the one thing that genuinely cannot be prepared in advance.

**Caption** (copy from here):

```
If your course starts January 2027 you're on the new system, not the old one. Worth knowing before you apply anywhere.

Source: gov.uk
```

**Hashtags:**

```
#StudentFinance #StudentFinanceEngland #UniUK #MatureStudentUK #BackToEducation #UniAdvice
```

### Instagram — 20:00

**Files:** `out/day1-ig-carousel-1.png` … `-6.png` — 1080x1350, in order

Upload all six as a carousel. Slide 1 is the hook, slide 6 is the CTA.

**Caption:**

```
Nobody sent out a memo about this one.

If you're looking at a January 2027 start, you'll be applying under the new Lifelong Learning Entitlement rather than the system you may have read about. The biggest change: there's a lifetime cap on tuition fee loans, and previous study comes off it.

That last part matters most if you've studied before. Get your own entitlement checked before you commit to a course — we'll do it with you.

Save this for when you're ready.

All figures from gov.uk
```

**Hashtags:**

```
#StudentFinance #StudentFinanceEngland #LifelongLearningEntitlement #MatureStudentUK #UniUK #ReturnToStudy #BackToUni #UKStudents
```

### Facebook — 19:30

**File:** `out/day1-fb-square.png` — 1200x1200

Optional. The Facebook post works better as text plus the GOV.UK link, because a
gov.uk link preview carries more credibility than a branded graphic. Use the image
only if you want something visual in the feed — if you post the image, drop the
link into the first comment instead so the preview doesn't compete with it.

**Copy:** use the Facebook block in
[../daily/2026-09-22.md](../daily/2026-09-22.md) verbatim. It is long on purpose —
Facebook is the one platform here where explanation beats the hook.

**No hashtags on Facebook.**

---

## Also ready — Day 3, the age set

For [../daily/2026-09-24.md](../daily/2026-09-24.md). Needs no filming, so it can
be brought forward if session 1 slips.

**Files, in order:** `out/day3-fb-age-0-intro.png`, `-30`, `-35`, `-40`, `-45`,
`-5-cta` — 1200x1200 each

Post as a Facebook image set, or as an Instagram carousel at 1080x1350 by changing
the size in the script.

**Copy:** the Facebook block in [../daily/2026-09-24.md](../daily/2026-09-24.md).

These carry no `Source: gov.uk` footer, which is correct — they contain only
arithmetic about the viewer's own age. There is deliberately no earnings claim
anywhere in the set; adding one would need a cited ONS or National Careers Service
figure under CAP 20.9.

---

## What still needs filming

The talking-head versions are stronger than text cards, because the whole
positioning rests on a named, credentialled human. These are specified in
[../filming/shoot-blocks.md](../filming/shoot-blocks.md) and need session 1:

| Day | Slot | Block |
| --- | --- | --- |
| 1 | TikTok | SB-13 script 1 — the version with you on camera |
| 2 | all three | SB-01, cut-downs A / B / C |
| 3 | TikTok, Instagram | SB-02 age 35 and age 30 |

The text-card video is a bridge so you can start today. Swap to the filmed
versions as soon as they exist, and keep the text-card format for funding-figure
posts where on-screen numbers do the work anyway.

---

## Design system

Taken from `src/app/globals.css` so the assets match the site.

| Token | Hex | Use |
| --- | --- | --- |
| Navy | `#1d2b4d` | Primary background |
| Navy deep | `#121c36` | CTA slides |
| Teal | `#1f6b6b` | Third accent background |
| Olive | `#c2cc60` | Key figures, wordmark, CTA blocks |
| Cream | `#f7f8f4` | Light slides |
| Ink | `#1a1f2e` | Text on light |

Oswald Bold for headlines and figures, Outfit for body and eyebrows. Content is
vertically centred between the wordmark rule and the footer. Light and dark slides
alternate through a carousel so it has rhythm when swiped.

## Sizes

| Output | Dimensions | Where |
| --- | --- | --- |
| Vertical video | 1080x1920, 30fps, H.264 | TikTok, Reels, Stories |
| Portrait carousel | 1080x1350 | Instagram |
| Square | 1200x1200 | Facebook, LinkedIn |

## Adding a new asset

1. Add a spec dict to `generate_assets.py` — `bg`, `eyebrow`, `headline`, `bignum`, `body`, `cta`, `footnote`
2. Take any figure from `brand-facts.md`. If it isn't there, it doesn't go on the slide.
3. Re-run the script and check the output before posting
4. Keep `Source: gov.uk` on anything carrying a funding figure
