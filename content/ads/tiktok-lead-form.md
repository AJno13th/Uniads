# TikTok Instant Form — build sheet

Exact form to build in TikTok Ads Manager, plus how to get the leads into your CRM
(TikTok does **not** do that part for you).

**Assets → Instant Forms → Create**

The answer options below are deliberately worded to match the values your CRM
already expects, so leads arrive scored rather than as raw text an advisor has to
re-key. Don't reword them casually — see the mapping in section 6.

---

## 1. The two settings that decide lead quality

Get these right before you touch the questions.

| Setting | Use | Why |
| --- | --- | --- |
| Form type | **Classic** | Conditional branching is useful later, but it's harder to debug and you have no data yet on where people drop |
| Optimise for | **More volume** | Start here |

**On "More volume" vs "Higher intent".** Higher intent adds a review step before
submission, which cuts junk but also cuts volume. Start on More volume: you need
leads quickly to get the ad group out of the learning phase, and the citizenship
question in section 3 is already filtering the leads that matter. Switch to Higher
intent the moment your advisors say the leads are time-wasters — that's the signal,
not the cost per lead.

---

## 2. Intro screen

| Field | Value |
| --- | --- |
| Form name (internal) | `UniAds — Eligibility Check — Sep26` |
| Image | Use the ad's own cover, or `assets/out/sq-noquals.png` |
| Heading | **Check if you can start university this month** |
| Description | Four quick questions and an advisor will come back to you today. If you're 21 or over you don't need formal qualifications. Our help is free. |

Keep the heading about *them* finding out, not about you selling. "Check if you
can" outperforms "Apply now" at the intro stage because it promises information
rather than commitment.

---

## 3. Questions — six fields

Three prefilled, three asked. Any more and completion drops sharply.

### Prefill (TikTok fills these from the user's profile)

1. **Name**
2. **Phone number**
3. **Email**

### Question 4 — Age

> **How old are you?**

| Option (type exactly) |
| --- |
| `21 – 24` |
| `25 – 34` |
| `35 – 44` |
| `45+` |
| `18 – 20` |

Those are en dashes with spaces around them, matching `ageBrackets` in
`src/data/qualification.ts`. Keep `18 – 20` as an option even though the ad group
excludes that age — people lie about age on profiles, and you want the mismatch
visible in the CRM rather than discovered on the call.

### Question 5 — Status in the UK

> **What's your status in the UK?**
> *(This decides what funding you can get, so it's the one we really need.)*

| Option (type exactly) |
| --- |
| `British Citizen` |
| `Irish Citizen` |
| `ILR (Indefinite Leave to Remain)` |
| `EU Settled Status` |
| `EU Pre-Settled Status` |
| `Refugee / Asylum Granted` |
| `None of the above / Not sure` |

This is the question that earns its place. Settlement status is the actual gate on
student finance, so without it advisors spend the day on people who cannot be
funded. It costs some completion rate and it is still worth keeping.

**One gap to brief your advisors on.** Seven options is already the practical
maximum, so Humanitarian Protection, the Ukraine Scheme and dependants of settled
people aren't listed — those people will pick `None of the above / Not sure` and
arrive scored *cold* when they actually qualify. Advisors must re-ask status on the
call rather than trusting a cold score. Don't let a genuine applicant get
deprioritised by a dropdown.

### Question 6 — City

> **Where would you want to study?**

| Option (type exactly) |
| --- |
| `London` · `Birmingham` · `Manchester` · `Leeds` · `Leicester` |
| `Bradford` · `Luton` · `Newcastle` · `Derby` · `Northampton` |
| `Online only` · `No preference` |

Matches `preferredCities` in `src/data/qualification.ts`.

### Optional seventh question

Only add this once the form is converting and you want better prioritisation:

> **Have you had UK student finance before?**
> `No — I have never received student finance` · `Yes — I have received student finance before` · `Not sure`

It matters — previous study reduces what's available — but it's a conversation
rather than a form field, and every extra question costs completions. The CRM
scores a `No` answer highest, so adding it sharpens your hot-lead list.

---

## 4. Privacy and consent

| Field | Value |
| --- | --- |
| Privacy policy URL | `https://www.uniads.co.uk/privacy-policy` |
| Custom disclaimer | See below |

Add this as the custom disclaimer text:

> By submitting, you agree that UNIADS can contact you by phone, WhatsApp or email
> about studying at university. We don't share your details with anyone else.

You're going to ring and WhatsApp these people, so having the consent on record in
the form is worth the two lines. The privacy policy page already exists and is
linked in your footer.

---

## 5. Confirmation screen

| Field | Value |
| --- | --- |
| Heading | **Thanks — we'll be in touch today** |
| Description | An advisor will call or WhatsApp you to check what you could start and when. If you'd rather message us first, tap below. |
| Button text | **Message us on WhatsApp** |
| Button URL | `https://wa.me/447368218457?text=Hi%20UNIADS%2C%20I%20just%20filled%20in%20your%20TikTok%20form` |

Sending them to WhatsApp here is the highest-value part of the whole form. A lead
who messages you first is worth several who wait for a call, and the prefilled text
tells you where they came from.

---

## 6. Getting the leads into your CRM

**TikTok will not send these to your CRM.** By default they sit in Ads Manager and
you download a CSV. That's fine for the first day and unworkable after that —
leads go cold within hours in this market.

Your `/api/leads` endpoint already accepts exactly the fields the form collects, so
connect the two with Zapier or Make:

**Trigger:** TikTok Lead Generation → *New Lead*
**Action:** Webhooks → *POST*

**URL**

```
https://www.uniads.co.uk/api/leads
```

**Headers**

```
Content-Type: application/json
x-uniads-ingest-token: <your LEAD_INGEST_TOKEN>
```

**Body**

```json
{
  "source": "landing",
  "fullName": "{{name}}",
  "phone": "{{phone_number}}",
  "email": "{{email}}",
  "ageBracket": "{{how_old_are_you}}",
  "settlementStatus": "{{whats_your_status_in_the_uk}}",
  "preferredCity": "{{where_would_you_want_to_study}}",
  "notes": "TikTok Instant Form — ad: {{ad_name}}",
  "utmSource": "tiktok",
  "utmMedium": "paid",
  "utmCampaign": "{{campaign_id}}",
  "utmContent": "{{ad_id}}",
  "ttclid": "{{ttclid}}",
  "landingPage": "tiktok-instant-form"
}
```

### Three things that will bite you

**Set `LEAD_INGEST_TOKEN` first.** `/api/leads` rate-limits browser traffic to six
submissions per IP per ten minutes. Zapier posts everything from its own IPs, so a
burst of paid leads would be rejected with a 429 that nobody sees. A request
carrying this header skips that limit. Generate it with `openssl rand -hex 32`, add
it in Vercel, redeploy.

**Phone numbers must be 10–15 digits or the request is rejected with a 422.** UK
mobiles from TikTok prefill (`07…`, 11 digits) are fine. If TikTok returns a
shorter local format, prefix `+44` in the Zapier step.

**`source` must be exactly `landing`.** The endpoint only accepts `apply`,
`booking`, `quick_qualifier` or `landing`, and silently falls back to `apply`
otherwise — which would make your paid leads indistinguishable from website
applications in the CRM.

### What you get for doing this

Each TikTok lead arrives in `/admin` with the qualification score and hot/warm/cold
band already applied, the preset WhatsApp briefing built, an advisor notification
sent, and `utmContent` holding the **ad ID**. That last one is the point: you can
see which specific creative produced a student who enrolled, not just which
campaign got clicks.

---

## 7. Test it before you spend

1. TikTok Ads Manager → your form → **Preview** → submit a test entry with your own number
2. Check it appears in `/admin` within a minute
3. Confirm the score band and that `utmSource` reads `tiktok`
4. If nothing arrives, check the Zapier task history for a 422 (bad phone) or 429 (missing ingest token)

Do this before the campaign goes live. A form that collects leads nobody sees is
worse than no form.

---

## 8. If the numbers are wrong

| Symptom | Most likely cause | Fix |
| --- | --- | --- |
| Lots of impressions, few form opens | The hook isn't landing | Swap the creative, not the form |
| Form opens but few submissions | Too many questions, or the intro over-promises | Drop the optional finance question; shorten the description |
| Plenty of leads, none qualify | Working as intended — you're seeing the market | Keep the citizenship question, tighten the creative to speak to 25+ |
| Leads qualify but won't answer the phone | Normal for paid social | Lead with WhatsApp, not a call. The confirmation-screen button matters here. |
| Cost per lead fine, nobody enrols | Judge on cost per *hot* lead | Filter `/admin` by band and recalculate |

The metric to manage is **cost per hot lead**, which your CRM already gives you. A
£10 lead with no settled status costs more than a £30 lead who enrols.
