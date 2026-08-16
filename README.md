# FORGE

Continuous-rep training and intelligent fuel — cylinder targets by weight, ranks
for unbroken sets, free body readings, photo meal logging, and recommendations
that adapt to what you lifted and ate.

## Stack

- Next.js (App Router) + TypeScript
- Tailwind CSS v4
- Local-first storage (browser `localStorage`)

## Getting started

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Product surfaces

| Route | Purpose |
| --- | --- |
| `/` | Marketing — brand hero + free reading CTA |
| `/free-reading` | Free BMI / lean mass / macro + mineral reading |
| `/app` | Daily dashboard — fuel budget, lift + meal recs |
| `/app/train` | Weight cylinders, continuous-rep logging, ranks |
| `/app/nutrition` | Goals → macros/minerals, library + photo food log |
| `/app/records` | Rank table by weight × best continuous reps |
| `/app/body` | Profile: weight, height, BF%, cut/build goals |

## Core ideas

1. **Cylinders** — each load shows how many continuous reps are expected; fill rises as you log unbroken work.
2. **Continuous rank** — best reps at a weight without stopping mid-set.
3. **Free reading** — advertise with unlocked BMI and food direction.
4. **Adaptive fuel** — next meals from remaining macros, last meal balance, and training volume.
5. **Adaptive training** — next lifts from recent patterns, goals, and whether you cleared the cylinder.
