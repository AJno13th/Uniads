# AGENTS.md

## Cursor Cloud specific instructions

Single Next.js 16 (App Router) full-stack app managed with `npm`. There is no separate backend/worker; API routes live under `src/app/api`. Standard commands are in `package.json` (`dev`, `build`, `start`, `lint`) and `README.md`.

- Dependencies are refreshed automatically on startup via the update script (`npm install`). No extra install steps needed.
- Run the dev server with `npm run dev` (Turbopack, http://localhost:3000). Lint with `npm run lint`.
- The CRM at `/admin` requires `CRM_ADMIN_PASSWORD` to be set, otherwise login fails. Create a `.env.local` (git-ignored) with at least `CRM_ADMIN_PASSWORD` (and ideally `CRM_SESSION_SECRET`) before testing CRM flows. `.env.example` is referenced in the README but is git-ignored/not committed.
- Persistence: with no `DATABASE_URL`, leads are stored in a local JSON file at `.data/leads.json` (git-ignored, zero-config). Set `DATABASE_URL` (+ `DATABASE_SSL=false` for local Postgres) only if you need Postgres-backed storage; the `uniads_leads` table is auto-created on first use.
- End-to-end smoke: POST a lead to `/api/leads` (or use the `/apply` form) → log in at `/admin` → the lead appears on the dashboard and its detail page. Leads are scored hot/warm/cold automatically.
