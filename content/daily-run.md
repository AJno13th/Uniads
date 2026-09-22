# The daily run

The instruction set for producing one day of content. This is the file the daily
job executes, and it is written to be pasted verbatim as a scheduled prompt.

**Design intent:** the reason this produces one day at a time, against fixed
inputs, is that generating a month in one pass is how invented claims get in.
Grounding is enforced by the inputs, not by good intentions.

---

## Inputs — read all five, every time, before writing anything

| File | Role |
| --- | --- |
| [brand-facts.md](brand-facts.md) | The only approved claim set. Nothing outside it ships. |
| [guardrails.md](guardrails.md) | Banned claims, CAP Code rules, pre-publish checklist |
| [research/hook-library.md](research/hook-library.md) | The hook menu, tiered by evidence |
| [filming/shoot-blocks.md](filming/shoot-blocks.md) | Which footage exists and what it can be cut into |
| [posted-log.md](posted-log.md) | What already ran, what performed, what is on cooldown |

If a fact is not in `brand-facts.md` or on a GOV.UK page cited there, it does not
go in a post. Not "probably fine", not "the competitor says it". Section 4 of the
teardown shows a competitor publishing a maintenance loan figure above the legal
maximum — plausibility is not evidence.

## Procedure

1. **Read the log.** Note yesterday's hook family, everything inside its 30-day
   cooldown, and this week's tier mix so far.
2. **Pick a hook.** A different family from yesterday, nothing on cooldown, and
   respecting the weekly mix: 3 days Tier 1, 3 days Tier 3, 1 day Tier 4.
3. **Check footage exists.** Consult the shoot-block usage table. If the block is
   exhausted, either choose a format needing no footage (carousel, text post,
   screen recording) or pick a different hook. **Never** write a post against
   footage that does not exist.
4. **Pick the fact.** One fact from `brand-facts.md` that the hook delivers. One
   per post.
5. **Write three genuinely different posts.** See platform briefs below. The same
   caption on three platforms is not three posts.
6. **Run the checklist.** All 14 items from guardrails section 5, written out in
   the day file with a note on how each passes. If any item fails, rewrite — do not
   soften.
7. **Write `daily/YYYY-MM-DD.md`** in the format of the existing day files.
8. **Flag escalations.** Predict the comments that need a human and write the
   approved holding reply.
9. **Update the log** with the planned rows, the cooldown tracker and the block
   usage table.

## Platform briefs

These are not the same post resized. The audiences differ and so should the work.

### TikTok
- 12–20 seconds, one idea, one CTA
- Hook in the first 3 seconds, spoken *and* on screen — most viewers are muted
- Caption under 25 words. No emoji bullet lists, no phone numbers, no city lists — the measured anti-pattern
- 5–6 hashtags, home-student only
- Subtitles burned in, every number checked by hand
- Original audio for anything with figures in it
- Cold account, so assume no audience: every post must work standalone

### Instagram
- Reel or carousel. Carousels for reference material people will save; Reels for hooks.
- Reels can run a little longer than TikTok, up to ~20s
- Caption can carry 3–4 short paragraphs, with the substance in the first two lines
- 8 hashtags
- Never serve the identical variant TikTok got the same day

### Facebook
- The oldest and highest-intent audience of the three — 30–50s actually deciding
- Longer copy genuinely works. This is the one platform where explanation beats hook.
- Bold the opening line. Short paragraphs. Bullets for practical detail.
- Always include the phone number and WhatsApp
- **No hashtags** — they don't aid reach and make the post look repurposed
- Link previews from gov.uk carry more weight than a branded graphic

## Weekly rhythm

Vary the job of the post, not just the topic:

| Day | Job |
| --- | --- |
| Monday | Practical / process — what actually happens |
| Tuesday | Objection handling — Tier 1 |
| Wednesday | Funding fact — exact figures, source on screen |
| Thursday | Objection handling — Tier 1 |
| Friday | Emotional, built to be sent — Tier 3.3 or 3.1 |
| Saturday | Age or segment specific — student parents, career changers |
| Sunday | Trust — the counsellor, the accuracy angle, or a consented student story |

## Hard stops

Stop and flag for a human rather than publishing if the day's post would need to:

- state a student finance repayment threshold (verify on GOV.UK that day)
- confirm whether a specific immigration status qualifies
- tell anyone with previous student finance that a 4-year foundation-year degree is covered — four years at £9,790 is exactly the £39,160 entitlement, with nothing spare
- explain LLE "priority additional entitlement"
- claim a named partner accepts applicants with no qualifications where `src/data/universities.ts` says otherwise
- use a testimonial without a consent record
- respond to personal financial hardship

## Scheduled prompt

Paste this as the prompt for a daily scheduled run. It is deliberately
self-contained.

```text
Produce today's UNIADS content for TikTok, Instagram and Facebook.

Read all of these first, and treat them as binding:
  content/brand-facts.md        — the ONLY approved claim set
  content/guardrails.md         — banned claims and the CAP Code rules
  content/research/hook-library.md
  content/filming/shoot-blocks.md
  content/posted-log.md         — what already ran and what is on cooldown
  content/daily-run.md          — the procedure, platform briefs and hard stops

Then follow the procedure in daily-run.md exactly and write
content/daily/<today's date>.md in the same format as the existing files in
content/daily/.

Rules that override any instinct to be helpful:
- If a fact is not in brand-facts.md or on a GOV.UK page cited there, do not use
  it. Do not estimate, round, or borrow a competitor's statistic.
- UNIADS publishes no statistics. No enrolment counts, approval rates,
  satisfaction scores or years in business, ever.
- Tuition is a repayable loan. Never call it free. Our support is the free part.
- Never guarantee a place, funding or a job.
- Never tell an individual they qualify. Offer to check.
- Do not write a post against footage that does not exist — check the shoot-block
  usage table in posted-log.md first.
- The three posts must be genuinely different, not one caption resized.
- Write out all 14 checklist items from guardrails.md section 5 in the day file,
  noting how each one passes.

Finally, update content/posted-log.md with the planned rows, the cooldown tracker
and the block usage table. Commit on a new branch and open a pull request so the
day can be reviewed before publishing.
```

## How to schedule it

The content is produced by a scheduled agent run rather than application code, so
there is nothing to deploy, no API key to hold and no cron to maintain — and each
run sees the current state of the repo, including yesterday's results.

1. Cursor Dashboard → **Automations** → new automation on this repository
2. Schedule: daily, early enough to allow review before the 19:00 posting slot
3. Prompt: the block above, verbatim
4. Leave it opening a PR per day. **Do not auto-merge** — the review step is where
   a wrong number gets caught, and it costs a minute.

### If you would rather it lived in the app

The alternative is a `/api/cron/content` route driven by Vercel Cron, calling an
LLM with these same files as context and writing drafts into the CRM database,
with a `/admin/content` page to review and copy them. That needs an API key added
as a secret, a new table, and the review UI. Worth doing if you want posts drafted
where the leads already are; not worth doing just to get a daily cadence.

## Monthly review

Once a month, read the log and act on it:

1. Which hook families actually drove shares and enquiries? Rebalance the weekly mix towards them.
2. Which posting times won? Fix the schedule rather than continuing to test.
3. Any block underperforming across 3+ posts? Rewrite the hook — do not re-cut the same footage.
4. Re-verify every GOV.UK figure in `brand-facts.md`. They change, and the accuracy position is the whole strategy.
5. Check whether competitors have started covering the LLE change. Once they do, Tier 1.6 stops being an advantage and the mix should shift.
6. Book a shoot session if any block has fewer than 2 posts remaining.
