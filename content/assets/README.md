# Post-ready assets

Benefit-led set for the immediate intake. Everything here is finished and ready to
upload.

**Captions live with each day**, in [../daily/](../daily/) — start at
[2026-09-22.md](../daily/2026-09-22.md) and work forward. One file per day, three
posts each, copy-paste ready.

Regenerate any asset with:

```bash
pip install pillow
python3 content/assets/generate_assets.py
```

Every figure is defined once in `generate_assets.py` and traced to
[../brand-facts.md](../brand-facts.md). Change it there and re-run — **never edit an
exported PNG**, because an edited number can't be traced back to its source.

Brand fonts (Oswald, Outfit, per `src/app/globals.css`) download to `.fonts/` on
first run and aren't committed.

---

## Videos — 1080x1920, vertical, 14–16s

All are text-card videos, so nothing needs filming and they work with sound off.
The bottom fifth is left clear because TikTok and Reels overlay UI there.

**Every one of them needs a trending sound added in-app before posting.** They have
no audio of their own and a silent video gets suppressed. Pick the sound on the day.

| File | Hook | Used |
| --- | --- | --- |
| `vid-noquals.mp4` | No GCSEs, no A-Levels, start this month | Day 1, Day 7 |
| `vid-money.mp4` | Over £16,000 a year to study | Day 2, Day 5 |
| `vid-2days.mp4` | Two days a week, you pick the days | Day 3 |
| `vid-courses.mp4` | What do you want to be? | Day 4 |
| `vid-upgrade.mp4` | How long have you been meaning to? | Day 6 |

## Instagram carousels — 1080x1350

Upload the numbered files in order. Slide 1 is the hook, the last slide is the CTA.

| Set | Slides | Hook | Used |
| --- | --- | --- | --- |
| `car-start-1…6.png` | 6 | No qualifications + start now | Day 1, Day 7 |
| `car-money-1…6.png` | 6 | The full funding breakdown | Day 2 |
| `car-courses-1…6.png` | 6 | Course list and cities | Day 4 |
| `car-kids-1…5.png` | 5 | Studying with children | Day 5 |

## Facebook squares — 1200x1200

| File | Hook | Used |
| --- | --- | --- |
| `sq-noquals.png` | No qualifications, start this month | Day 1, Day 7 |
| `sq-money.png` | Over £16,000 a year | Day 2 |
| `sq-2days.png` | Two days a week | Day 3 |
| `sq-kids.png` | £199.62 a week towards childcare | Day 5 |
| `sq-courses.png` | What do you want to be? | Day 4 |

---

## The one thing to keep in the copy

"**Up to**" and "**if you're eligible**", once per asset carrying a funding figure.

They cost nothing in a caption and they are what makes the £16,000+ headline usable
rather than a problem. The basis is set out in
[../brand-facts.md](../brand-facts.md) §6c: £14,135 maintenance loan plus £2,024
Parents' Learning Allowance is £16,159, and with the Childcare Grant a parent
reaches £23,234. So the number is conservative — as a *package*. It is only a
problem if it's attached to the maintenance loan alone, which is where a competitor
went wrong.

Everything else about compliance stays out of the creative and lives in
[../guardrails.md](../guardrails.md).

---

## Still to film

The talking-head versions outperform text cards, because the positioning rests on a
named, credentialled human — and no competitor names one. Specified in
[../filming/shoot-blocks.md](../filming/shoot-blocks.md), needs session 1:

| Block | Replaces |
| --- | --- |
| SB-01 No GCSEs / No A-Levels | `vid-noquals.mp4` |
| SB-03 Keep your job | `vid-2days.mp4` |
| SB-07 Student parents | `vid-money.mp4` on day 5 |
| SB-10 Unsaid fears | `vid-upgrade.mp4` |

Swap them in as they're cut. Keep the text-card format for funding posts, where
on-screen figures do the work anyway.

**Skip SB-13 for now.** It covers the January 2027 funding change, which is
irrelevant to someone starting this month and kills the hook. It stays in the pack
for when the January intake is being sold — no competitor covers it, so it's still
a strong angle for that audience.

---

## Design system

From `src/app/globals.css`, so assets match the site.

| Token | Hex | Use |
| --- | --- | --- |
| Navy | `#1d2b4d` | Primary background |
| Navy deep | `#121c36` | CTA slides |
| Teal | `#1f6b6b` | Third accent |
| Olive | `#c2cc60` | Figures, wordmark, CTA blocks, ticks |
| Cream | `#f7f8f4` | Light slides |

Oswald Bold for headlines and figures, Outfit for body and tick lists. Content is
vertically centred; light and dark slides alternate through a carousel so it has
rhythm when swiped.

## Adding an asset

1. Add a spec dict in `generate_assets.py` — `bg`, `eyebrow`, `headline`, `bignum`, `body`, `bullets`, `cta`
2. Take any figure from `brand-facts.md`. If it isn't there, it doesn't go on the slide.
3. Re-run and look at the output before posting.
