# Lation Landing Deployment

This app deploys as a Vercel-hosted landing page with a serverless lead capture endpoint. Cloudflare is used for DNS, CDN/proxy where compatible, WAF/security rules, SSL/TLS, and Turnstile. n8n is not part of this landing page architecture.

## Vercel

Configure the project in Vercel and deploy from the approved branches:

- `DEMO`: preview QA, no Supabase writes.
- `DEV`: development/integration if deployed, no Supabase writes.
- `main`: production, `LEADS_TARGET_TABLE=leads`.

Required environment variables:

```bash
VITE_TURNSTILE_SITE_KEY=
VITE_SUPABASE_URL=
VITE_DEMO_MODE=false
SUPABASE_SERVICE_ROLE_KEY=
LEADS_TARGET_TABLE=leads
RESEND_API_KEY=
LEAD_NOTIFY_TO=
LEAD_NOTIFY_FROM=Lation Leads <leads@lation.com.mx>
TURNSTILE_SECRET_KEY=
ALLOWED_ORIGINS=https://lation.com.mx,https://www.lation.com.mx
```

Optional:

```bash
VITE_API_URL=
UPSTASH_REDIS_REST_URL=
UPSTASH_REDIS_REST_TOKEN=
```

If `VITE_API_URL` is unset, the frontend posts to `/api/lead`. If it is set, the frontend posts to `${VITE_API_URL}/api/lead`.

## Cloudflare

Use Cloudflare for:

- DNS records for `lation.com.mx` and `www.lation.com.mx`.
- CDN/proxy if compatible with the Vercel setup.
- WAF rules for abusive traffic.
- Turnstile site key and secret key.
- SSL/TLS Full or Full Strict depending on the Vercel certificate configuration.

Turnstile must be configured for the production hostnames and any Vercel preview hostnames used by `DEMO`.

## Supabase

Apply the migrations under `supabase/migrations/`. Expected table:

- `leads`

RLS is enabled and public frontend inserts are denied. The Vercel API uses `SUPABASE_SERVICE_ROLE_KEY` server-side to insert leads.

## Resend

Configure:

```bash
RESEND_API_KEY=
LEAD_NOTIFY_TO=
LEAD_NOTIFY_FROM=Lation Leads <leads@lation.com.mx>
```

The sender domain must be verified in Resend before production email sending.

## Verification

Run locally before deploying:

```bash
npm run lint
npm run build
```

After deploy:

- Visit `/` and confirm the landing page renders.
- Visit an unknown route and confirm the NotFound page renders.
- Submit a valid lead and confirm the row is stored in the expected Supabase table.
- Confirm the notification email is delivered through Resend.
- Confirm invalid Turnstile submissions fail.
- Confirm missing or disallowed origins are rejected by `/api/lead`.
