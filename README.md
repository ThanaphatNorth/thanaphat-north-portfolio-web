# thanaphat-north.com — "TRUE NORTH"

Portfolio of Thanaphat Chirutpadathorn (North), Senior Engineering Manager & technical consultant.
Next.js 16 (App Router, React Compiler) · React 19 · Tailwind 4 · framer-motion + Lenis · Supabase · Resend.

The design concept — *Blueprint → Skyline* — and its rationale live in
[`../PORTFOLIO-REDESIGN-PLAN.md`](../PORTFOLIO-REDESIGN-PLAN.md) (outside this repo). Generated media is
catalogued in [`docs/media-assets.md`](docs/media-assets.md).

## Develop

```bash
npm ci
cp .env.example .env.local   # fill in your Supabase + Resend values
npm run dev
```

| Env | Required | Purpose |
|---|---|---|
| `NEXT_PUBLIC_SUPABASE_URL` / `NEXT_PUBLIC_SUPABASE_ANON_KEY` | yes | content (portfolio, ventures, blog, settings) |
| `RESEND_API_KEY` | prod | contact-form email; without it contacts are saved but no email is sent |
| `DISCORD_CONTACT_WEBHOOK_URL` | optional | Discord incoming webhook; every contact submission is posted to that channel (secret — set in Vercel, never commit) |
| `ADMIN_EMAILS` | recommended | comma-separated admin allow-list for `/admin` (falls back to `ADMIN_EMAIL`, then the owner's address) |

## Database

`supabase-setup.sql` creates the schema for a fresh project. **Then run every file in
`supabase/migrations/` in order.** `20260928000000_admin_only_writes.sql` restricts all writes to the
emails in `public.admin_users` — also disable *Allow new users to sign up* in Supabase Auth.

> **Two allow-lists, keep them in sync:** `ADMIN_EMAILS` (who can open `/admin`) and the
> `public.admin_users` table (who can write). Add a new admin to both:
> `insert into public.admin_users (email) values ('new@admin.com');`

## Motion system

`src/motion/` decides a **tier** per visitor and every effect degrades with it:

| Tier | Who | What runs |
|---|---|---|
| `full` | desktop, fine pointer, capable device | Lenis smooth scroll, frame-scrubbed hero, mouse parallax, custom cursor, pinned gallery |
| `lite` | touch / low-end / data-saver | transform-only scroll effects, native scroll, grid gallery |
| `static` | `prefers-reduced-motion` or the in-page **Pause motion** toggle | no smooth scroll, no autoplay video, no parallax |

## Test

```bash
npm run lint && npm run typecheck
npm run e2e          # desktop + mobile + reduced-motion (Playwright)
npm run e2e:video    # records the full walkthrough with a visible cursor → e2e/.results/**/video.webm
```

The e2e suite starts `e2e/mock-supabase.mjs` (a tiny PostgREST stand-in serving `e2e/fixtures/*.json`,
public content captured from the live site) and a production build — no real database needed.
