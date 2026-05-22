# Lation Landing Page

This repository powers the public Lation landing page and protected lead capture flow. It does not contain the CRM, internal admin tools, interview scheduling system, login system, payment flow, candidate management platform, interviewer dashboard, or n8n workflows.

## What This App Does

- Serves the commercial landing page at `/`.
- Explains Lation's structured technical interview and QA evaluation support.
- Captures inbound leads through a protected contact form.
- Verifies Cloudflare Turnstile server-side.
- Rate limits lead submissions.
- Stores leads in Supabase through a server-side service role.
- Sends lead notification emails through Resend.

## Architecture

- **Vercel:** frontend hosting and serverless `POST /api/lead`.
- **Cloudflare:** DNS, CDN/proxy where compatible, WAF/security rules, SSL/TLS, and Turnstile.
- **Supabase:** production lead table: `leads`.
- **Resend:** notification emails after successful lead insert.

n8n is not part of this landing page architecture.

## Tech Stack

- Vite
- React
- TypeScript
- Tailwind CSS
- Supabase JS server-side client
- Cloudflare Turnstile
- Resend

## Local Setup

```bash
npm install
cp .env.example .env.local
npm run dev
```

The local app runs with Vite. The contact form requires a valid Turnstile site key and server-side env when tested through the Vercel serverless API path.

## Environment Variables

Public frontend env:

```bash
VITE_TURNSTILE_SITE_KEY=
VITE_SUPABASE_URL=
VITE_DEMO_MODE=false
VITE_API_URL=
```

Server-only env:

```bash
SUPABASE_SERVICE_ROLE_KEY=
LEADS_TARGET_TABLE=leads
RESEND_API_KEY=
LEAD_NOTIFY_TO=
LEAD_NOTIFY_FROM=Lation Leads <leads@lation.com.mx>
TURNSTILE_SECRET_KEY=
ALLOWED_ORIGINS=https://lation.com.mx,https://www.lation.com.mx
```

Optional rate limit storage:

```bash
UPSTASH_REDIS_REST_URL=
UPSTASH_REDIS_REST_TOKEN=
```

Never expose or commit `SUPABASE_SERVICE_ROLE_KEY`, `RESEND_API_KEY`, or `TURNSTILE_SECRET_KEY`.

## Supabase Setup

Apply the migrations in `supabase/migrations/`.

Expected table:

- `leads` for production.

Each table stores:

- `id`
- `created_at`
- `name`
- `email`
- `company`
- `role`
- `phone`
- `message`
- `service_interest`
- `source`
- `locale`
- `status`
- `metadata`

RLS is enabled on the lead table. Public frontend inserts are intentionally not allowed. Inserts happen only through `POST /api/lead` using `SUPABASE_SERVICE_ROLE_KEY`.

## Resend Setup

Configure these values in Vercel:

```bash
RESEND_API_KEY=
LEAD_NOTIFY_TO=
LEAD_NOTIFY_FROM=Lation Leads <leads@lation.com.mx>
```

Use the `LEAD_NOTIFY_FROM` value that matches a verified Resend sending domain. The notification includes the lead details, locale, timestamp, source, and Supabase target table.

## Cloudflare Turnstile Setup

Frontend:

```bash
VITE_TURNSTILE_SITE_KEY=
```

Server-side:

```bash
TURNSTILE_SECRET_KEY=
```

The frontend renders Turnstile on the contact form and includes the token in the lead payload. The backend verifies the token before inserting a lead.

## Vercel Deployment

Use Vercel as the hosting and serverless runtime source of truth.

Recommended branch mapping:

- `DEMO`: preview deployment, no Supabase writes.
- `DEV`: integration/development, no Supabase writes.
- `main`: production deployment, `LEADS_TARGET_TABLE=leads`.

Set all secrets in the Vercel dashboard. Do not rely on checked-in env files.

## Cloudflare Setup

Use Cloudflare for:

- DNS for `lation.com.mx` and `www.lation.com.mx`.
- CDN/proxy if compatible with Vercel.
- WAF/security rules.
- Turnstile site and secret keys.
- SSL/TLS Full or Full Strict depending on the Vercel domain/certificate setup.

Allow the production origins in `ALLOWED_ORIGINS`:

```bash
ALLOWED_ORIGINS=https://lation.com.mx,https://www.lation.com.mx
```

Add preview origins for `DEMO` when testing Vercel preview deployments.

## Branch Strategy

Keep only these long-lived branches:

- `main`
- `DEV`
- `DEMO`

Do not modify `main` directly for landing cleanup work. Work from `DEMO`, validate there, then merge through the agreed release process.

## Security Notes

- The only public route is `/`.
- The only lead endpoint is `POST /api/lead`.
- The API enforces origin checks, request size validation, server-side validation, honeypot handling, Turnstile verification, and rate limiting.
- Security headers are configured in `vercel.json`.
- Resend is server-side only and does not require frontend CSP access.

## Quality Checks

```bash
npm run lint
npm run build
```
