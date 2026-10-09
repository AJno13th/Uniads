# TikTok ads — launch setup

Everything to enter in TikTok Ads Manager, in order. Creatives are already built
in [../assets/out/](../assets/out/).

I can't create this in your ad account — no access — so this is written as exact
field values to type in rather than advice to interpret.

---

## 0. Before you spend anything

### The pixel is not live. Fix this first.

I checked `https://www.uniads.co.uk` — **there is no TikTok pixel on the site.**
The code is already written and wired up; the environment variable was simply
never set, and it isn't documented anywhere (now fixed in the README).

Without it you cannot see which ads produce leads, only which produce clicks. On a
small budget that difference is most of the value.

1. TikTok Ads Manager → **Assets → Events → Web Events → Set up** → Manual → Pixel
2. Name it `uniads-web`, copy the Pixel ID
3. Vercel → project → Settings → Environment Variables → add
   `NEXT_PUBLIC_TIKTOK_PIXEL_ID` = your ID, for Production
4. **Redeploy.** It's a `NEXT_PUBLIC_*` variable so it's baked in at build time —
   adding it without redeploying does nothing.
5. Verify: load the site with TikTok Pixel Helper, or
   `curl -s https://www.uniads.co.uk/ | grep -c analytics.tiktok.com` should
   return 1 rather than 0.

Once live, [`client.ts`](../../src/lib/crm/client.ts) fires `SubmitForm` on every
successful lead, and `ttclid` lands on the CRM record automatically.

### Account prerequisites

Check these now — business verification can take 24–48 hours and will stop you
launching today if it isn't done:

- TikTok Business Centre account with a verified business
- Ad account with a payment method attached
- Industry set to **Education** (not Financial Services — that category carries
  extra restrictions you don't want applied to you)

---

## 1. What to run today

**One campaign, one ad group, four creatives.**

Resist splitting the budget across ad groups on day one. TikTok needs
concentrated spend to exit the learning phase; two ad groups at £15/day each
learn far slower than one at £30/day.

**Objective: Lead Generation with an Instant Form.**

Chosen deliberately over website conversions for today:

- It works immediately, with no dependency on the pixel being live
- Your funnel is already "message us and we'll check your eligibility" — a form
  inside TikTok matches that, with no landing-page drop-off
- Cold pixels have no conversion history, so a website-conversion campaign would
  spend days learning before it optimised sensibly

Move to website conversions once the pixel has accumulated data — see section 7.

---

## 2. Campaign

| Field | Value |
| --- | --- |
| Objective | **Lead generation** |
| Buying type | Auction |
| Campaign name | `UK_LeadGen_NoQuals_Sep26` |
| Campaign Budget Optimisation | **Off** — control budget at ad group level |
| Special ad categories | None |

---

## 3. Ad group

| Field | Value |
| --- | --- |
| Ad group name | `UK_25-54_Broad_InstantForm` |
| Optimisation location | **Instant Form** |
| Placement | **Select placement → TikTok only** |
| Pangle | **Off** |
| Global App Bundle / News Feed App | **Off** |
| Search ads | Off for now |
| Comments / download / share | Leave on — comments are a lead source, and you should reply to them |
| Automated creative optimisation | **Off** — you want per-creative results |
| Location | United Kingdom |
| Gender | All |
| Age | **25–34, 35–44, 45–54** |
| Languages | English |
| Interests & behaviours | **None.** Leave completely broad. |
| Device / OS | All |
| Budget | **Daily, £30** (TikTok's minimum is £20/day) |
| Schedule | Run continuously, all day |
| Bid strategy | **Lowest cost**, no bid cap |
| Optimisation goal | Lead |

### Two of those choices matter more than the rest

**Exclude 18–24.** This is the one that will cost you money if you get it wrong.
That bracket is the cheapest inventory on TikTok, so the algorithm will pour your
budget into it — but your headline offer is "no qualifications needed at 21+", and
18–21s need a Level 3. You'd be paying the lowest price for the least usable
leads. Add them back later as a separate ad group with its own creative if you
want them.

**No interest targeting.** Counter-intuitive but right for lead generation: the
creative does the targeting. TikTok's algorithm finds the audience from who
engages, and layering interests on a £30/day budget shrinks the pool so much that
it never gets enough signal to optimise. Go broad.

**Why UK-wide rather than your campus cities.** You have online and blended
options, so a lead anywhere is workable, and UK-wide keeps CPMs down while the
algorithm learns. Once you know your cost per lead, add a city-targeted ad group
for the campuses.

---

## 4. Instant Form

Full build sheet with exact answer options and the CRM integration:
**[tiktok-lead-form.md](tiktok-lead-form.md)**. Summary below.

**Form type:** Classic. **Form name:** `UniAds — Eligibility Check`

### Intro

> **Heading:** Check if you can start university this month
> **Description:** Answer 4 quick questions and an advisor will come back to you today. No qualifications needed if you're 21 or over. Free.

### Questions — keep it to these five

| Field | Type |
| --- | --- |
| Name | Prefill |
| Phone number | Prefill |
| Email | Prefill |
| What's your age? | Multiple choice: `21–24` · `25–34` · `35–44` · `45+` · `Under 21` |
| Which city would you study in? | Multiple choice: `London` · `Birmingham` · `Manchester` · `Leeds` · `Leicester` · `Bradford` · `Luton` · `Newcastle` · `Derby` · `Northampton` · `Online only` |
| Do you have British/Irish citizenship, settled status or ILR? | Multiple choice: `Yes` · `No` · `Not sure` |

That last question costs you some volume, and it's still worth including.
Settlement status is the actual gate on student finance, so without it your
advisors will spend their day on people who can't be funded. `Not sure` is a
perfectly good lead — keep those.

Do **not** add "have you had student finance before". It's important, but it's a
conversation, not a form field, and every extra question drops completion.

### Privacy and confirmation

- Privacy policy URL: `https://www.uniads.co.uk/privacy-policy`
- Confirmation heading: **Thanks — we'll be in touch today**
- Confirmation description: An advisor will call or WhatsApp you to check what you can start and when.
- Button: **Visit website** → `https://www.uniads.co.uk/study-without-qualifications`

---

## 5. The ads — four to start

Use these four. Keep them in one ad group so they compete and TikTok can find the
winner.

All are 1080x1920, 14–16s, already in [../assets/out/](../assets/out/).

| Ad name | Video | Ad text (under TikTok's 100-char limit) | CTA |
| --- | --- | --- | --- |
| `AD_noquals` | `vid-noquals.mp4` | `No GCSEs or A-Levels? If you're 21+ you could start a funded degree this month.` | Apply now |
| `AD_money` | `vid-money.mp4` | `Over £16,000 a year to study if you're eligible. Tuition covered. We apply for you.` | Learn more |
| `AD_2days` | `vid-2days.mp4` | `Uni 2 days a week - you pick the days. Keep your job and your income.` | Learn more |
| `AD_courses` | `vid-courses.mp4` | `Pick the career. We find the course, the campus and the funding. Our help is free.` | Apply now |

Hold these two in reserve and swap them in when a creative fatigues:

| Ad name | Video | Ad text | CTA |
| --- | --- | --- | --- |
| `AD_kids` | `vid-money.mp4` | `Studying with kids? There's a grant for childcare that you never pay back.` | Learn more |
| `AD_upgrade` | `vid-upgrade.mp4` | `4 years from now you could have a degree. Or the exact same job. 2 days a week.` | Learn more |

Display name: **UNIADS**. Profile image: the logo mark.

### Be realistic about this creative

These are text-card videos. They're clean, on-brand, accurate and they will work —
but on TikTok, paid or organic, a real person talking to camera beats motion
graphics almost every time. Expect a higher cost per lead than you'll get later.

Two upgrades, in order of impact:

1. **Film session 1** ([../filming/shoot-schedule.md](../filming/shoot-schedule.md)).
   SB-01, SB-03 and SB-07 replace three of the four ads above with talking-head
   versions of the same scripts.
2. **Then use Spark Ads.** Boost the organic post rather than uploading a file:
   it carries its real likes and comments, gets better engagement rates and
   cheaper delivery, and the traffic builds your actual profile. Requires an
   authorisation code from the post — Creator Centre → Post → Ad settings.

Once the organic posts from [../daily/](../daily/) have been up a few days, Spark
Ads on whichever performed best organically is the single cheapest improvement
available.

---

## 6. Tracking

For any ad pointing at the website rather than an Instant Form, use this URL so
the click lands in your CRM with full attribution:

```
https://www.uniads.co.uk/study-without-qualifications?utm_source=tiktok&utm_medium=paid&utm_campaign=__CAMPAIGN_ID__&utm_content=__CID__&ttclid=__CLICKID__
```

Those double-underscore tokens are TikTok macros and get replaced automatically.
[`attribution.ts`](../../src/lib/attribution.ts) reads every one of these
parameters, so the lead record in `/admin` shows the source, campaign, the
specific ad and the click ID — which means you can tell which *creative* produced
a paying student, not just which campaign.

Send this traffic to `/study-without-qualifications`, not the homepage. That page
exists for exactly this audience and already carries the qualifier widget.

### Naming convention

Keep to this so reporting stays readable as you add campaigns:

```
Campaign:  UK_<objective>_<angle>_<month><year>     UK_LeadGen_NoQuals_Sep26
Ad group:  UK_<age>_<targeting>_<optimisation>      UK_25-54_Broad_InstantForm
Ad:        AD_<angle>                               AD_noquals
```

---

## 7. What to check, and when

Do not touch anything for the first 48 hours. Editing an ad group resets the
learning phase, and most people kill their own campaigns by fiddling on day one.

### At 24 hours

Look only at whether it's delivering. Spend near £30 and impressions accumulating
means it's fine. If spend is under about £5, something is wrong — usually an ad in
review, a rejected creative, or targeting too narrow.

### At 48 hours

| Metric | Healthy for UK education lead gen | If it's worse |
| --- | --- | --- |
| CPM | £3–£8 | Broad targeting is already set; it's a creative problem |
| CTR | 0.8%+ | The hook isn't landing. Swap in a reserve ad. |
| Cost per lead | £8–£25 | See below |
| Form completion rate | 25%+ | Your form is too long — drop the citizenship question |

### At 7 days

- Turn off any ad that's spent £40+ with no leads
- Keep the top two by cost per lead, add two fresh creatives alongside them
- If cost per lead is under £15, raise the budget by no more than 20% a day
- If leads are arriving but nobody qualifies, the citizenship question is doing its job — check `/admin` for the pattern and tighten the creative rather than the targeting

**Judge on enquiries that convert, not cost per lead.** A £10 lead who has no
settled status is worth less than a £30 lead who enrols. Your CRM already scores
this — the qualifier bands leads hot/warm/cold — so the real metric is *cost per
hot lead*, which you can read straight off `/admin`.

---

## 8. Ad review — likely rejection causes

TikTok reviews education and finance-adjacent ads closely. Nothing in the
creative above should trip it, but if an ad is rejected the cause is almost
always one of:

- Implying guaranteed money or a guaranteed place. Everything here says "could"
  and "if you're eligible" — keep it that way.
- Wording that reads as a financial product rather than education. Say "student
  finance" and "tuition fee loan", never "loans available" or "get cash".
- A landing page that doesn't match the ad. `/study-without-qualifications`
  matches; the homepage matches less well.
- Industry set to Financial Services rather than Education.

If something is rejected, appeal rather than rewriting — plain education ads are
usually reinstated.

---

## 9. Today's order of operations

1. Confirm the ad account is verified with a payment method
2. Create the pixel, set `NEXT_PUBLIC_TIKTOK_PIXEL_ID` in Vercel, redeploy, verify
3. Build the Instant Form
4. Create the campaign, ad group and four ads exactly as above
5. Submit and leave it alone for 48 hours
6. Post the organic set from [../daily/2026-09-22.md](../daily/2026-09-22.md) — it
   builds the profile that paid traffic lands on, and gives you Spark Ad
   candidates for next week

Step 2 is the only one that touches the site, and it needs no code change — just
the variable and a redeploy.
