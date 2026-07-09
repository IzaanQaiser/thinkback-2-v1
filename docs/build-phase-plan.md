# Thinkback V1 Build Phase Plan

This document is the working implementation plan from the current repo state to a usable first version of Thinkback.

Current state:

* Repo has product context docs only.
* No Next.js app exists yet.
* No Supabase schema exists in this repo yet.
* No Telegram webhook exists yet.
* No AI processing code exists yet.

Build principle:

> Every phase should end with something testable. Do not move to the next phase until the validation gate passes.

Phase completion rule:

> A phase is not complete until Codex has run the relevant automated checks, runtime/API checks, and core user-flow checks for that phase. The final response for a phase must clearly say whether the phase passed validation.

When the user says something like “start Phase 1” or “do Phase 3”, Codex should:

1. read this plan and the product context
2. list the exact user actions needed for that phase
3. implement the Codex-owned work for that phase
4. run the validation checks listed for the phase, plus any extra regression checks needed to prove the touched functionality still works
5. report what passed, what failed, and what user action is still needed
6. if all validation passes, end the final response with `GOOD TO COMMIT: <commit message>`
7. if validation does not pass, do not say `GOOD TO COMMIT`; instead end with `NOT READY TO COMMIT: <blocking reason>`

---

# Phase 0: Project Scaffold And Local App

Goal:

Create the base Next.js application and make sure the local dev app runs.

Why this comes first:

Thinkback needs a web dashboard, API routes, environment config, and a place for all later backend logic. The repo is currently docs-only, so the app shell must exist before any product feature can be built.

## User Actions

The user does not need to set up external services yet.

The user should be ready to approve choices if asked, but default stack should be:

* Next.js App Router
* TypeScript
* Tailwind
* ESLint
* shadcn/ui only if useful

## Codex Actions

1. Scaffold a Next.js app in the existing repo root.
2. Keep the existing `docs/` folder.
3. Add TypeScript config.
4. Add Tailwind config.
5. Add a basic app layout.
6. Add a simple home page that points to `/dashboard`.
7. Add placeholder dashboard routes:
   * `/dashboard`
   * `/dashboard/search`
   * `/dashboard/reminders`
   * `/dashboard/ask`
   * `/dashboard/brag-sheet`
8. Add placeholder API health route:
   * `GET /api/health`
9. Add `.env.example` with all known required env vars.
10. Add basic project scripts:
   * `dev`
   * `build`
   * `lint`
   * `typecheck` if not already covered
11. Start the local dev server.

## Validation Gate

Phase 0 is complete when:

* `npm install` or equivalent package install succeeds.
* `npm run lint` passes, or lint is configured and known issues are documented.
* `npm run build` passes.
* Local dev server starts.
* `/api/health` returns a healthy response.
* `/dashboard` renders in the browser.

## Expected Deliverable

A running local Next.js app with empty dashboard surfaces ready for product implementation.

---

# Phase 1: Supabase Project, Database Schema, And Local Data Access

Goal:

Create the persistent data layer for memories, reminders, files, chunks, and user mapping.

Why this comes here:

Before Telegram or AI processing exists, Thinkback needs a reliable place to save raw captures. The product rule is “never lose the user’s capture,” so persistence comes before AI polish.

## User Actions

1. Create a Supabase project.
2. Copy these values into local `.env.local`:
   * `NEXT_PUBLIC_SUPABASE_URL`
   * `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   * `SUPABASE_SERVICE_ROLE_KEY`
3. Choose a personal default timezone:
   * recommended: `America/Toronto`
4. Create or provide a default app user ID.
   * For personal V1, this can be a hardcoded UUID.
   * Later auth can replace this.
5. Confirm whether Supabase Auth should be enabled in V1 immediately or deferred.
   * Recommended personal V1: defer full auth, use hardcoded user plus Telegram allowlist.

## Codex Actions

1. Add Supabase client helpers:
   * browser/client-safe helper for anon usage if needed
   * server/service-role helper for API routes
2. Add SQL migrations or schema files for:
   * `memories`
   * `reminders`
   * `memory_files`
   * `memory_chunks`
   * optional `telegram_users` mapping table
3. Enable `pgvector`.
4. Add indexes for practical V1 queries:
   * `memories.user_id`
   * `memories.created_at`
   * `memories.type`
   * `memories.tags`
   * `memories.reminder_at`
   * `reminders.user_id`
   * `reminders.remind_at`
   * `reminders.status`
5. Add updated-at trigger behavior for tables with `updated_at`.
6. Add private Supabase Storage bucket:
   * recommended bucket name: `memory-files`
7. Add TypeScript database types if practical.
8. Add a server-side database health check.
9. Add a simple `GET /api/memories` endpoint returning memories for the default user.
10. Add a simple `POST /api/memories` endpoint for manual text memory creation.

## Validation Gate

Phase 1 is complete when:

* Supabase env vars are present locally.
* Database migrations/schema have been applied successfully.
* `pgvector` is enabled.
* Private storage bucket exists.
* `GET /api/health` can confirm app and database connectivity.
* `POST /api/memories` can insert a raw text memory.
* `GET /api/memories` returns the inserted memory.
* Raw memory is saved even if no AI processing exists yet.

## Expected Deliverable

The app can save and read basic memories from Supabase.

---

# Phase 2: Manual Memory CRUD And Dashboard Inbox

Goal:

Build the first usable web review interface for saved memories.

Why this comes before Telegram:

Telegram capture is easier to debug when there is already a dashboard where saved rows can be inspected.

## User Actions

No external setup required after Phase 1.

The user should provide feedback on whether the dashboard layout feels useful enough for personal daily use.

## Codex Actions

1. Build `/dashboard` memory inbox.
2. Show memory cards with:
   * title
   * summary
   * type badge
   * tags
   * created date/time
   * reminder badge if relevant
   * file indicator if relevant
3. Build `/dashboard/memory/[id]`.
4. Show detail fields:
   * raw input
   * summary
   * extracted text
   * transcript
   * action items
   * tags
   * people
   * reminder/event fields
   * file metadata
   * AI metadata
5. Add edit behavior for:
   * title
   * summary
   * type
   * tags
   * priority
6. Add delete behavior.
7. Add a small manual capture form in the dashboard for testing.
8. Add loading, empty, and error states.

## Validation Gate

Phase 2 is complete when:

* User can create a text memory from the dashboard.
* User can see it in `/dashboard`.
* User can open its detail page.
* User can edit basic fields.
* User can delete it.
* Refreshing the page preserves database-backed state.
* Build and lint pass.

## Expected Deliverable

A basic but real memory inbox in the browser.

---

# Phase 3: OpenAI Structuring For Text Memories

Goal:

Turn raw text captures into structured Thinkback memories using AI.

Why this phase matters:

This is where Thinkback starts feeling different from a notes app. Messy text should become a clean title, summary, type, tags, action items, reminders, events, and achievement metadata.

## User Actions

1. Create or provide an OpenAI API key.
2. Add it to `.env.local`:
   * `OPENAI_API_KEY`
3. Confirm the default timezone:
   * `DEFAULT_TIMEZONE=America/Toronto`
4. Confirm whether AI calls can process private memory content.
   * Product positioning should remain honest: AI processing is used to summarize and organize captures.

## Codex Actions

1. Add AI provider helper.
2. Add structured-output schema for memory processing.
3. Support these memory types:
   * `note`
   * `idea`
   * `task`
   * `reminder`
   * `event`
   * `link`
   * `image`
   * `video`
   * `audio`
   * `file`
   * `job`
   * `person`
   * `research`
   * `achievement`
4. Encode the product prompt rules:
   * be practical
   * lowercase kebab-case tags
   * extract deadlines/tasks/reminders/events
   * detect brag sheet / achievement entries
   * do not invent details
   * default vague reminder times to 9 AM local time
5. Add processing statuses:
   * `pending`
   * `processing`
   * `processed`
   * `failed`
6. Update `POST /api/memories` so text memories can be processed by AI.
7. Preserve raw input if AI fails.
8. Store AI response fields into `memories`.
9. If `reminder_at` exists, create a `reminders` row.
10. If type is `achievement`, store brag sheet metadata in `ai_metadata.brag_sheet`.
11. Add retry endpoint for failed processing.
12. Add tests or scriptable checks for representative inputs.

## Validation Gate

Phase 3 is complete when these sample inputs process correctly:

1. Text idea:
   * input: `Idea: app that makes you do pushups to unlock TikTok`
   * expected: type `idea`, useful tags, summary, possible action items
2. Reminder:
   * input: `Remind me next Friday to message YC founders about remote internships`
   * expected: type `reminder`, `reminder_at`, reminder row
3. Event:
   * input: `MSA meeting with Abdullah on Wednesday at 5 about locker inventory`
   * expected: type `event`, `event_start`, person `Abdullah`
4. Brag sheet:
   * input: `Add to brag sheet: built LeadGuard landing page and got 12 waitlist signups in one day`
   * expected: type `achievement`, tag `brag-sheet`, `ai_metadata.brag_sheet`
5. AI failure simulation:
   * expected: raw memory remains saved with status `failed`

Also required:

* Build passes.
* Lint passes.
* Dashboard shows processed fields.

## Expected Deliverable

Text memories become structured, searchable memory records.

---

# Phase 4: Telegram Bot Text Capture

Goal:

Let the user send text to Telegram and have it saved and structured in Thinkback.

Why this phase matters:

Telegram is the primary capture interface. This is the first version of the real habit loop.

## User Actions

1. Create a Telegram bot using BotFather.
2. Save the bot token in `.env.local`:
   * `TELEGRAM_BOT_TOKEN`
3. Get your Telegram numeric user ID.
   * This can be done with a user info bot or a temporary debug endpoint.
4. Save allowed IDs:
   * `TELEGRAM_ALLOWED_USER_IDS=123456789`
5. Generate a webhook secret:
   * `TELEGRAM_WEBHOOK_SECRET=some-long-random-string`
6. Provide an externally reachable app URL.
   * Local development option: ngrok or similar tunnel.
   * Deployment option: Vercel URL.
7. Add:
   * `APP_BASE_URL=https://your-url`
8. Tell Codex when the bot token, allowed user ID, and app URL are ready.

## Codex Actions

1. Add Telegram API helper.
2. Add webhook route:
   * `POST /api/telegram/webhook`
3. Validate Telegram webhook secret.
4. Verify sender is in `TELEGRAM_ALLOWED_USER_IDS`.
5. Reject all unapproved Telegram users.
6. Parse text messages.
7. Save raw text memory immediately.
8. Run AI processing.
9. Create reminder row if needed.
10. Reply to Telegram with a concise confirmation:
   * normal memory: saved summary and tags
   * reminder: reminder time
   * achievement: brag sheet confirmation
11. Add setup script or documented command to register webhook with Telegram.
12. Add debug logging that avoids raw private content.

## Validation Gate

Phase 4 is complete when:

* Telegram webhook is registered.
* Message from allowed user is accepted.
* Message from unapproved user is rejected.
* Sending `hello this is a test memory` creates a memory.
* Sending `add to brag sheet: did X at Y which achieved Z` creates an `achievement` memory.
* Telegram bot replies with useful confirmation.
* Created memory appears in `/dashboard`.
* Raw memory is saved even if AI processing fails.

## Expected Deliverable

The user can text the Telegram bot and see structured memories in the dashboard.

---

# Phase 5: Search And Filters

Goal:

Make saved memories easy to find.

Why this comes after Telegram text:

Once capture works, search is what proves the memories are not just being stored, but becoming useful later.

## User Actions

No new external services required.

The user should provide real search examples from their own usage once a few memories exist.

## Codex Actions

1. Build `/dashboard/search`.
2. Add keyword search endpoint:
   * `GET /api/search?q=...`
3. Search these fields:
   * raw text
   * title
   * summary
   * extracted text
   * transcript
   * tags
   * search keywords
4. Add filters:
   * type
   * tag
   * date
   * has reminder
   * has file
   * priority
5. Add result cards.
6. Rank by practical combination of:
   * text match
   * recency
   * tag match
7. Add empty states.
8. Add search from dashboard navigation.

## Validation Gate

Phase 5 is complete when:

* Searching exact words finds matching memories.
* Searching a tag finds matching memories.
* Filtering by type works.
* Filtering by `achievement` shows brag sheet entries.
* Searching `remote internships` can find notes, reminders, and links containing that phrase.
* Search results link to memory detail pages.
* Build and lint pass.

## Expected Deliverable

User can find old captured memories without manually browsing the inbox.

---

# Phase 6: Brag Sheet Dashboard

Goal:

Turn achievement memories into a useful career brag sheet.

Why this gets its own phase:

The brag sheet uses the same memory system, but it needs a focused surface and export-style formatting to become useful for resumes, internship applications, and interview prep.

## User Actions

1. Send a few real or fake brag sheet entries through Telegram or dashboard:
   * `add to brag sheet: shipped X at Y which achieved Z`
   * `career win: did X and improved Y by Z`
2. Review generated resume bullets and say whether the tone should be more:
   * concise
   * quantified
   * technical
   * founder/product-oriented

## Codex Actions

1. Build `/dashboard/brag-sheet`.
2. Query memories where:
   * `type = achievement`, or
   * tags include `brag-sheet`
3. Show each achievement with:
   * title
   * what was done
   * context/project/company
   * impact/metric
   * skills
   * created date
   * source memory link
4. Generate a resume-style bullet for each entry.
5. Add filters:
   * project
   * skill
   * date
   * metric/impact present
6. Add copy button for resume bullets.
7. Add edit affordance through the memory detail page.
8. Add a simple grouped view:
   * by project
   * by skill
   * by month

## Validation Gate

Phase 6 is complete when:

* Telegram brag sheet entry appears on `/dashboard/brag-sheet`.
* Entry includes extracted `what`, `impact`, and `skills` when available.
* Entry links back to the original memory.
* Copyable resume bullet exists.
* Filtering by skill or project works.
* Editing the source memory updates the brag sheet view.

## Expected Deliverable

User has a living career achievement tracker powered by normal Thinkback memories.

---

# Phase 7: Image, Screenshot, And File Capture

Goal:

Let the user send images/screenshots/files to Telegram and make them searchable.

Why this phase matters:

Screenshots are a major part of the target user’s messy memory load. Job postings, chats, receipts, deadlines, and notes often live as images.

## User Actions

1. Confirm Supabase Storage bucket exists and is private:
   * `memory-files`
2. Send test screenshots/files when requested:
   * job posting screenshot
   * random text screenshot
   * PDF or document if desired
3. Confirm whether signed URLs are acceptable for file previews.

## Codex Actions

1. Extend Telegram webhook to detect:
   * photos
   * documents
   * videos in simple storage mode
2. Download files from Telegram.
3. Upload files to Supabase Storage.
4. Save file metadata:
   * storage path
   * file type
   * file name
   * file size
5. For images, run vision/OCR.
6. Store extracted text.
7. Run AI structuring using image understanding plus caption/user text.
8. Show file/image preview in dashboard where possible.
9. Keep storage private.
10. Use signed URLs for previews/downloads.
11. Avoid logging raw extracted private content.

## Validation Gate

Phase 7 is complete when:

* User can send a screenshot to Telegram.
* File is uploaded to Supabase Storage.
* Memory row has file metadata.
* Image text/content is extracted.
* Dashboard shows preview or download link.
* Search can find extracted screenshot text.
* Private file URLs are not publicly exposed.
* If vision/OCR fails, raw file memory remains saved.

## Expected Deliverable

Screenshots and files become useful memories, not just uploads.

---

# Phase 8: Voice Note Capture

Goal:

Let the user send voice notes to Telegram and convert them into structured memories.

Why this phase matters:

Voice notes support fast capture while walking, commuting, or thinking out loud.

## User Actions

1. Send test voice notes through Telegram.
2. Confirm whether transcription content can be processed by AI.

## Codex Actions

1. Extend Telegram webhook to detect voice/audio.
2. Download audio from Telegram.
3. Upload audio to Supabase Storage.
4. Transcribe audio.
5. Save transcript.
6. Run AI structuring over transcript.
7. Extract:
   * ideas
   * tasks
   * reminders
   * events
   * achievements if spoken
8. Show transcript in memory detail page.
9. Make transcript searchable.

## Validation Gate

Phase 8 is complete when:

* User can send a voice note.
* Audio file is stored.
* Transcript is saved.
* Summary/tags/action items are generated.
* Reminder extraction works from voice.
* Search finds words from transcript.
* Dashboard memory detail shows transcript and audio file.

## Expected Deliverable

User can ramble into Telegram and get a structured Thinkback memory.

---

# Phase 9: Reminder Delivery And Cron

Goal:

Actually notify the user when reminders become due.

Why this comes after text and voice:

Reminder extraction can exist earlier, but delivery needs a scheduled process and Telegram sending reliability.

## User Actions

1. Confirm the app has a deployed or always-reachable URL.
2. If using Vercel, connect the repo/project.
3. Add production env vars to deployment provider:
   * Supabase vars
   * Telegram vars
   * OpenAI key
   * `APP_BASE_URL`
   * `DEFAULT_USER_ID`
   * `DEFAULT_TIMEZONE`
4. Confirm cron provider:
   * Vercel cron, or
   * Supabase scheduled function, or
   * another scheduler

## Codex Actions

1. Add due reminder endpoint:
   * `POST /api/reminders/process-due`
2. Protect the endpoint with a cron secret.
3. Add env var:
   * `CRON_SECRET`
4. Query pending reminders where `remind_at <= now()`.
5. Send Telegram reminder message.
6. Mark reminder as sent.
7. Handle send failures safely.
8. Add `/dashboard/reminders`.
9. Show:
   * upcoming reminders
   * overdue reminders
   * completed reminders
10. Add manual complete/delete behavior.
11. Configure cron schedule.
   * V1: every 1 or 5 minutes.

## Validation Gate

Phase 9 is complete when:

* Creating a reminder creates a reminder row.
* Due reminder processing sends a Telegram message.
* Sent reminder is marked `sent` or equivalent completed state.
* Failed send does not delete the reminder.
* `/dashboard/reminders` shows upcoming and completed reminders.
* A real test reminder scheduled a few minutes ahead fires correctly.

## Expected Deliverable

“Remind me tomorrow...” actually results in a Telegram reminder.

---

# Phase 10: Embeddings And Semantic Search

Goal:

Add vector search so users can find related memories without exact keywords.

Why this comes after keyword search:

Keyword search is enough for early usefulness. Semantic search improves recall after there are enough memories.

## User Actions

1. Confirm OpenAI API key has embedding access.
2. Provide real search examples that keyword search misses.

## Codex Actions

1. Choose embedding model.
2. Generate embeddings for:
   * title
   * summary
   * raw text
   * extracted text
   * transcript
   * tags
   * action items
3. Store chunks in `memory_chunks`.
4. Backfill embeddings for existing memories.
5. Add semantic search endpoint:
   * `POST /api/search/semantic`
6. Combine keyword and semantic results in search UI.
7. Add similarity threshold.
8. Add source memory links.
9. Avoid embedding empty or low-value chunks.

## Validation Gate

Phase 10 is complete when:

* Existing memories have chunks and embeddings.
* Semantic search returns conceptually related memories.
* Search for `money plan` can find memories about tuition, internships, LeadGuard, or startup income if those memories exist.
* Search for `career wins` can find brag sheet entries.
* Results show source memory links.
* Build and lint pass.

## Expected Deliverable

Thinkback can retrieve memories by meaning, not only exact words.

---

# Phase 11: Ask Thinkback / RAG

Goal:

Let the user ask questions over saved memories and get grounded answers with sources.

Why this is later:

Ask Thinkback depends on enough stored memories, embeddings, and reliable retrieval. It should not hallucinate over thin context.

## User Actions

1. Provide 5-10 real questions to test, such as:
   * `What deadlines do I have?`
   * `What app ideas did I save?`
   * `What was my plan for tuition money?`
   * `What career wins do I have?`
   * `What should I follow up on?`
2. Review whether answers feel grounded or too speculative.

## Codex Actions

1. Build `/dashboard/ask` chat UI.
2. Add ask endpoint:
   * `POST /api/ask`
3. Embed the user question.
4. Retrieve relevant memory chunks.
5. Pass only retrieved context into the answer model.
6. Require source citations.
7. If context is weak, answer:
   * `I don't have enough saved memories about that yet.`
8. Show linked source memories below each answer.
9. Add basic chat loading and error states.
10. Add guardrails against answering from general model knowledge when sources are missing.

## Validation Gate

Phase 11 is complete when:

* User can ask a question in `/dashboard/ask`.
* Answer uses saved memories only.
* Sources are shown.
* Weak-context questions produce the “not enough saved memories” response.
* Asking about brag sheet achievements returns relevant achievement memories.
* Build and lint pass.

## Expected Deliverable

User can ask Thinkback questions and get useful, grounded answers from stored memories.

---

# Phase 12: Deployment, Auth Hardening, And Security Pass

Goal:

Make the personal V1 safe enough to use daily outside local development.

Why this phase matters:

The app stores private thoughts, screenshots, files, and career details. Even personal V1 needs basic access control and storage safety.

## User Actions

1. Choose deployment platform.
   * Recommended: Vercel for Next.js.
2. Connect the repo to deployment provider.
3. Add all production env vars.
4. Choose access model:
   * personal V1 allowlist only, or
   * Supabase Auth login
5. If using Supabase Auth:
   * configure redirect URLs
   * create login provider
6. Confirm production domain or deployment URL.

## Codex Actions

1. Add route protection for dashboard.
2. Ensure API routes use server-side user scoping.
3. Add Supabase RLS policies if auth is enabled.
4. Keep Telegram allowlist enforced.
5. Ensure storage bucket is private.
6. Ensure previews use signed URLs.
7. Remove unsafe debug endpoints.
8. Audit logging so raw private content is not logged.
9. Add production webhook registration instructions.
10. Add production health checks.
11. Validate env var handling.

## Validation Gate

Phase 12 is complete when:

* Production app deploys successfully.
* Dashboard is not publicly accessible.
* Telegram webhook works in production.
* Memories are scoped to the intended user.
* Storage files are private.
* Raw private memory content is not printed in normal logs.
* Cron reminder processing works in production.
* Build passes in deployment.

## Expected Deliverable

A private personal V1 that can be used from phone and browser.

---

# Phase 13: V1 Polish And Daily-Use Readiness

Goal:

Make the first version reliable and pleasant enough for daily use.

Why this is last:

Polish should improve the working loop, not delay it.

## User Actions

1. Use Thinkback for a real day.
2. Capture:
   * random notes
   * screenshots
   * links
   * voice notes
   * reminders
   * brag sheet entries
3. Report friction points:
   * slow capture
   * bad tags
   * weak summaries
   * bad reminders
   * search misses
   * dashboard clutter

## Codex Actions

1. Improve Telegram confirmations.
2. Add failed processing states and retry buttons.
3. Improve dashboard empty/loading/error states.
4. Add onboarding page:
   * connect Telegram
   * send first memory
   * view dashboard
5. Add settings page:
   * timezone
   * Telegram connection status
   * data delete/export later
6. Improve card layout and responsive behavior.
7. Add better type/tag filtering.
8. Add batch backfill tools for embeddings or failed processing.
9. Tune AI prompt based on real examples.
10. Add basic automated tests around critical paths.

## Validation Gate

Phase 13 is complete when:

* User can capture from Telegram without thinking about organization.
* Text, image, link, voice, reminder, and brag sheet flows work.
* Dashboard shows memories clearly.
* Search finds expected memories.
* Ask Thinkback answers with sources.
* Reminders fire.
* Failed AI processing can be retried.
* User can delete memories/files.
* User genuinely starts dumping brain into it daily.

## Expected Deliverable

Thinkback V1: a usable personal AI memory inbox.

---

# Cross-Phase Rules

## Phase Validation And Closeout

Every phase must include an explicit validation pass before it can be called complete.

At minimum, Codex should run:

* `npm run lint`
* `npm run typecheck`
* `npm run build`
* `npm audit --omit=dev`

Codex should also run phase-specific validation:

* API route checks with `curl` or equivalent
* database read/write checks when data persistence is touched
* rendered route checks for frontend pages
* create/read/update/delete checks when CRUD is touched
* external service checks when a phase depends on Supabase, Telegram, OpenAI, storage, cron, or deployment
* regression checks for any previously completed functionality that could have been affected

If a validation item cannot be run, Codex must say exactly why and treat the phase as incomplete unless the missing check is irrelevant to that phase.

Final phase response format:

If all required validation passes, end with:

```txt
GOOD TO COMMIT: <imperative commit message>
```

If anything required fails or remains blocked, end with:

```txt
NOT READY TO COMMIT: <blocking reason>
```

## Data Safety

Never lose raw input.

If processing fails:

* save raw memory
* mark status `failed`
* show failed state in dashboard
* allow retry

## Privacy

Do not claim full privacy if external AI APIs process memory content.

Accurate positioning:

> Your memories are private to your account. Files are stored securely. AI processing is used to summarize and organize your captures.

## Telegram Security

Always enforce:

* webhook secret validation
* allowed Telegram user IDs
* rejection of unknown users

## File Security

Always enforce:

* private storage bucket
* signed URLs for previews
* no public file URLs unless intentional

## AI Behavior

The AI should:

* return structured JSON
* avoid inventing details
* use lowercase kebab-case tags
* extract reminders/events/tasks when clear
* classify brag sheet entries as `achievement`
* add `brag-sheet` tag for achievement capture
* preserve uncertainty in metadata rather than guessing

## Definition Of Final First Version

The final first version is complete when all of these are true:

1. Telegram text capture works.
2. Telegram image/screenshot capture works.
3. Telegram link capture works at least through URL metadata and notes.
4. Telegram voice note capture works.
5. AI summarizes, tags, classifies, and extracts action items.
6. Reminder extraction and delivery works.
7. Dashboard inbox works.
8. Memory detail/edit/delete works.
9. Search works.
10. Brag sheet capture and dashboard works.
11. Semantic search works.
12. Ask Thinkback answers from saved memories with sources.
13. Failed processing is visible and retryable.
14. Private files remain private.
15. The app is usable from phone and browser in daily life.
