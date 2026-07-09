# Thinkback V1

Thinkback is a capture-first AI memory inbox. V1 pairs a Telegram bot for fast capture with a web dashboard for review, search, reminders, Ask Thinkback, and the brag sheet.

## Local Development

Full command reference: [docs/development.md](docs/development.md)

Install dependencies:

```sh
npm install
```

Run the app:

```sh
npm run dev
```

Open:

* `http://localhost:3000/dashboard`
* `http://localhost:3000/api/health`

## Scripts

```sh
npm run lint
npm run typecheck
npm run build
```

## Environment

Copy `.env.example` to `.env.local` when a phase needs external services.
