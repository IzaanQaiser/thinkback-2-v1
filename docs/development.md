# Thinkback Development Commands

This document explains how to run the Thinkback web app locally, validate it, and eventually run the production build.

Current app shape:

* Frontend/dashboard: Next.js app in `app/`
* Local dashboard URL: `http://localhost:3000/dashboard`
* Local health URL: `http://localhost:3000/api/health`
* Package manager: npm

---

# First-Time Setup

Run from the repo root:

```sh
cd /Users/izaan/Desktop/programming/thinkback-2-v1
npm install
```

Create local environment file when a phase needs secrets:

```sh
cp .env.example .env.local
```

For Phase 0, `.env.local` is not required.

Starting in Phase 1, `.env.local` will need Supabase values.

---

# Run The Dev Server

Default:

```sh
npm run dev
```

Explicit port:

```sh
npm run dev -- --port 3000
```

Open the frontend:

```txt
http://localhost:3000/dashboard
```

Open the health check:

```txt
http://localhost:3000/api/health
```

Stop the dev server:

```txt
Ctrl+C
```

If port `3000` is already in use, run another port:

```sh
npm run dev -- --port 3001
```

Then open:

```txt
http://localhost:3001/dashboard
```

---

# Validate The App

Run these before considering a phase complete:

```sh
npm run lint
npm run typecheck
npm run build
```

Check production dependency audit:

```sh
npm audit --omit=dev
```

Check the local health endpoint while the dev server is running:

```sh
curl -i http://localhost:3000/api/health
```

Expected health response:

```json
{
  "ok": true,
  "service": "thinkback",
  "checks": {
    "app": "ok"
  }
}
```

Check that the dashboard is reachable:

```sh
curl -I http://localhost:3000/dashboard
```

Expected result:

```txt
HTTP/1.1 200 OK
```

Check that the root redirects to the dashboard:

```sh
curl -I http://localhost:3000
```

Expected result:

```txt
HTTP/1.1 307 Temporary Redirect
location: /dashboard
```

---

# Run The Production Build Locally

Build:

```sh
npm run build
```

Start the production server:

```sh
npm run start
```

Use an explicit port if needed:

```sh
npm run start -- --port 3001
```

Open:

```txt
http://localhost:3000/dashboard
```

---

# Environment Variables

The template lives at `.env.example`.

Expected variables over the full V1 build:

```txt
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=

TELEGRAM_BOT_TOKEN=
TELEGRAM_WEBHOOK_SECRET=
TELEGRAM_ALLOWED_USER_IDS=

OPENAI_API_KEY=

APP_BASE_URL=
DEFAULT_USER_ID=
DEFAULT_TIMEZONE=America/Toronto
CRON_SECRET=
```

Do not commit `.env.local`.

---

# Phase-Specific Notes

## Phase 0

Required:

```sh
npm install
npm run dev
npm run lint
npm run typecheck
npm run build
```

No external services required.

## Phase 1

Required user setup:

* Supabase project
* Supabase URL
* Supabase anon key
* Supabase service role key
* default user ID

Then add values to `.env.local`.

## Phase 3

Required user setup:

* OpenAI API key

Then add:

```txt
OPENAI_API_KEY=
```

## Phase 4

Required user setup:

* Telegram bot token
* Telegram numeric user ID
* webhook secret
* public app URL through deployment or a local tunnel

Then add:

```txt
TELEGRAM_BOT_TOKEN=
TELEGRAM_WEBHOOK_SECRET=
TELEGRAM_ALLOWED_USER_IDS=
APP_BASE_URL=
```

## Phase 9

Required user setup:

* deployed app URL
* production env vars
* cron provider

Then add:

```txt
CRON_SECRET=
```

---

# Useful Cleanup Commands

Remove local build output:

```sh
rm -rf .next
```

Reinstall dependencies from lockfile:

```sh
rm -rf node_modules
npm install
```

Inspect changed files:

```sh
git status --short
```

