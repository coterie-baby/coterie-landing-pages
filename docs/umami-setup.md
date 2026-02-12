# Umami Analytics — Railway Deployment Guide

Self-hosted [Umami](https://umami.is/) provides privacy-focused pageview and event analytics with a REST API that feeds the Sanity Funnels Dashboard.

## 1. Deploy on Railway

1. Go to [railway.app](https://railway.app) and sign in with GitHub.
2. Click **New Project** → **Deploy a Template** → search **"Umami"**.
3. Railway provisions the Umami app + a PostgreSQL database automatically. Wait for the deploy to finish (~2 min).
4. Open the generated Railway URL (e.g. `https://<app>.up.railway.app`).
5. Log in with the default credentials: **admin / umami**.
6. **Change the admin password immediately** under Settings → Profile.

## 2. Add Websites (One Per Environment)

Create a separate Umami website for each environment so staging traffic never pollutes production analytics.

1. In Umami, go to **Settings → Websites → Add website**.
2. Add a website for **each** environment:

| Environment | Name | Domain |
|-------------|------|--------|
| Production | `Coterie LP — Production` | `lp.coterie.com` |
| Staging | `Coterie LP — Staging` | `staging-lp.coterie.com` (or your staging domain) |

3. Click each website row and copy its **Website ID** (UUID). You'll use a different ID per environment.

## 3. Generate an API Key

1. In Umami, go to **Settings → API Keys** (or Teams → API Keys depending on version).
2. Click **Create** and give it a descriptive name (e.g. `sanity-dashboard`).
3. Copy the generated API key — you won't be able to see it again.
4. A single API key works across all websites in the same Umami instance.

## 4. Set Environment Variables

All environments share the same Umami instance URL and API key, but each gets its own **Website ID**.

### Landing pages site

| File | Environment |
|------|-------------|
| `.env.development` | Local / staging |
| `.env.production` | Production |
| `.env.local` | Local overrides (gitignored) |

```env
NEXT_PUBLIC_UMAMI_URL=https://<your-railway-umami>.up.railway.app
NEXT_PUBLIC_UMAMI_WEBSITE_ID=<environment-specific-website-uuid>
```

On **Vercel**, set these as environment variables scoped to the appropriate environment (Preview vs Production) in the project settings. This ensures preview deploys track to the staging website and production deploys track to the production website.

### Sanity Studio (`coterie-landing-pages-sanity/.env`)

```env
SANITY_STUDIO_UMAMI_URL=https://<your-railway-umami>.up.railway.app
SANITY_STUDIO_UMAMI_WEBSITE_ID=<website-uuid-to-display>
SANITY_STUDIO_UMAMI_API_KEY=<api-key>
```

The `SANITY_STUDIO_` prefix makes these variables available in the Sanity Studio browser bundle.

To switch which environment the dashboard reads from, change `SANITY_STUDIO_UMAMI_WEBSITE_ID` to the staging or production website UUID.

## 5. Verify

1. **Umami dashboard loads** at the Railway URL.
2. **Tracking works:** Visit `lp.coterie.com`, then check Umami's real-time view for the pageview.
3. **Environment isolation:** Verify that staging pageviews only appear under the staging website in Umami, and production pageviews under the production website.
4. **Sanity dashboard shows real data:** Open the Funnels Dashboard — sessions and bounce rate should come from Umami instead of mock values.
5. **Conversion events:** Click a CTA on a landing page and confirm a `conversion` event appears in the Umami events tab.
6. **Graceful fallback:** Remove the `SANITY_STUDIO_UMAMI_*` env vars — the dashboard should fall back to sample data with a "Sample Data" badge.
