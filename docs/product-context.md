Paste this into Codex as the **full Thinkback V1 product context**.

---

# Thinkback V1 Product Breakdown

## One-liner

**Thinkback is an AI memory inbox that lets users dump text, screenshots, links, images, videos, voice notes, events, reminders, and random thoughts into one place so they do not have to mentally hold everything anymore.**

Core promise:

> Dump anything. AI understands it. Search it later. Get reminded when it matters.

---

# 1. Product Goal

The user’s brain is overloaded because they are trying to remember too many things at once:

* app ideas
* school deadlines
* screenshots
* links
* reminders
* videos
* random thoughts
* career tasks
* meeting notes
* people to message
* things to research later

Thinkback should become the place where the user can instantly dump anything without organizing it manually.

The app should solve:

> “I don’t want to remember this right now, but I don’t want to lose it.”

---

# 2. V1 Philosophy

V1 should be **capture-first**, not organization-first.

Bad product:

> Open app → choose category → write perfect note → tag it → organize it.

Good product:

> Send/dump anything → Thinkback handles the rest.

The app should make messy input useful.

The user should not need to think about folders, labels, categories, or structure while capturing.

---

# 3. Target User

Initial target user:

**Chaotic student/builder/founder type.**

This person has:

* too many thoughts
* too many screenshots
* too many tabs
* too many ideas
* too many deadlines
* too many random notes
* poor trust in their memory
* stress from mentally juggling tasks

They are not trying to become a Notion power user. They just want to stop losing stuff.

---

# 4. Core User Flows

## Flow 1: Quick Text Capture

User sends:

> “Idea: app that makes you do pushups to unlock TikTok”

Thinkback should:

1. save the raw text
2. summarize it
3. classify it as an idea
4. tag it with relevant tags
5. extract action items if any
6. make it searchable

Example processed output:

```json
{
  "type": "idea",
  "summary": "App idea where users unlock social media time by completing exercises.",
  "tags": ["app-idea", "fitness", "screen-time", "consumer-app"],
  "priority": "medium",
  "action_items": ["Research Apple Screen Time APIs", "Validate TikTok-style hook"],
  "reminder_at": null
}
```

---

## Flow 2: Reminder Capture

User sends:

> “Remind me next Friday to message YC founders about remote internships”

Thinkback should:

1. save the memory
2. detect it is a reminder
3. extract the due date/time
4. create a reminder
5. notify the user at the right time

Processed output:

```json
{
  "type": "reminder",
  "summary": "Message YC founders about remote internships.",
  "tags": ["yc", "remote-internships", "career"],
  "priority": "high",
  "reminder_at": "2026-07-17T09:00:00-04:00",
  "action_items": ["Message YC founders about remote internships"]
}
```

If time is vague, default to 9 AM local time.

---

## Flow 3: Image/Screenshot Capture

User sends a screenshot.

Thinkback should:

1. upload the image
2. use AI vision/OCR to understand it
3. summarize what the screenshot is about
4. extract useful text
5. tag it
6. make it searchable

Example:

Screenshot of a job posting.

Thinkback output:

```json
{
  "type": "image",
  "summary": "Screenshot of a remote software internship posting from a startup.",
  "tags": ["job-posting", "remote-internship", "startup", "career"],
  "extracted_text": "...",
  "action_items": ["Apply to the internship", "Reach out to someone at the company"],
  "reminder_at": null
}
```

---

## Flow 4: Link Capture

User sends a link.

Thinkback should:

1. save the URL
2. fetch page metadata if possible
3. summarize the page
4. tag it
5. make it searchable

For YouTube/TikTok/Instagram links, V1 can simply save:

* URL
* title if available
* user note if provided
* AI-generated summary from available metadata

Full video transcription can be later.

---

## Flow 5: Voice Note Capture

User sends a voice note.

Thinkback should:

1. upload the audio
2. transcribe it
3. summarize it
4. extract tasks/reminders/events
5. tag it

This is important because users often have ideas while walking, commuting, or lying down.

---

## Flow 6: Event Capture

User sends:

> “MSA meeting with Abdullah on Wednesday at 5 about locker inventory”

Thinkback should:

1. detect event
2. extract title, date, time, people, topic
3. create an event-style memory
4. optionally create a reminder before the event

Processed output:

```json
{
  "type": "event",
  "summary": "MSA meeting with Abdullah about locker inventory.",
  "tags": ["msa", "locker-inventory", "meeting"],
  "event_start": "2026-07-15T17:00:00-04:00",
  "people": ["Abdullah"],
  "action_items": [],
  "reminder_at": "2026-07-15T16:30:00-04:00"
}
```

---

## Flow 7: Search

User searches:

> “remote internships”

Thinkback should show all related memories:

* screenshots of job postings
* notes about YC companies
* reminders to message founders
* links to job boards
* voice notes about the plan
* previous related ideas

Search should use:

1. keyword search
2. tag search
3. semantic/vector search

V1 can start with keyword search and add embeddings soon after.

---

## Flow 8: Ask Thinkback

User asks:

> “What was my plan for making money this semester?”

Thinkback should answer based on saved memories.

Example answer:

> Your current money paths are: remote startup internships, LeadGuard, and Thinkback 2.0. Remote internships are your survival path, LeadGuard is the fastest realistic cash path, and Thinkback is the long-term fun/career/product path.

This requires retrieval-augmented generation.

V1 can implement basic retrieval:

1. embed memories
2. retrieve top relevant memories
3. answer using those memories only

---

# 5. V1 Platforms

## Primary Capture Interface

Use **Telegram bot** first.

Why:

* fastest to build
* supports text
* supports images
* supports files
* supports videos
* supports voice notes
* works on phone and desktop
* no App Store delay
* no native mobile complexity

Telegram becomes the capture inbox.

## Primary Review Interface

Use a **web dashboard**.

Dashboard lets user:

* view memories
* search memories
* filter by type/tag
* view reminders
* ask Thinkback questions
* edit/delete memories

## Later

Native app or PWA can come later.

V1 should prioritize actual usage over perfect platform.

---

# 6. Main Product Surfaces

## 1. Telegram Bot

Responsibilities:

* receive user messages
* detect message type
* download files from Telegram
* upload files to storage
* send content to AI processing pipeline
* save memory to database
* reply with a short confirmation

Example bot response:

> Saved. Tagged as `career`, `yc`, `remote-internships`. I also found 1 action item: message founders.

For reminders:

> Saved. I’ll remind you next Friday at 9:00 AM.

---

## 2. Web Dashboard

Pages:

### `/dashboard`

Main memory inbox.

Shows:

* latest memories
* type
* summary
* tags
* created date
* reminder status
* file preview if available

### `/dashboard/search`

Search interface.

User can search across:

* raw text
* summaries
* tags
* extracted text
* transcripts

### `/dashboard/memory/[id]`

Memory detail page.

Shows:

* raw input
* summary
* tags
* extracted text/transcript
* action items
* reminder info
* attached file
* edit/delete buttons

### `/dashboard/reminders`

Shows:

* upcoming reminders
* overdue reminders
* completed reminders

### `/dashboard/ask`

Chat with saved memories.

User asks questions and gets answers grounded in their stored memories.

---

# 7. Core Data Model

## `memories`

Main table.

```sql
create table memories (
  id uuid primary key default gen_random_uuid(),

  user_id uuid not null,

  source text not null default 'telegram',
  source_message_id text,

  type text not null,
  status text not null default 'processed',

  raw_text text,
  summary text,
  extracted_text text,
  transcript text,

  url text,
  title text,

  tags text[] default '{}',
  search_keywords text[] default '{}',

  priority text default 'medium',

  reminder_at timestamptz,
  event_start timestamptz,
  event_end timestamptz,

  action_items jsonb default '[]',
  people text[] default '{}',

  file_url text,
  file_type text,
  file_name text,
  file_size_bytes bigint,

  embedding vector,

  ai_metadata jsonb default '{}',

  created_at timestamptz default now(),
  updated_at timestamptz default now()
);
```

---

## `reminders`

Separate reminders table.

```sql
create table reminders (
  id uuid primary key default gen_random_uuid(),

  user_id uuid not null,
  memory_id uuid references memories(id) on delete cascade,

  title text not null,
  description text,

  remind_at timestamptz not null,
  status text not null default 'pending',

  sent_at timestamptz,

  created_at timestamptz default now(),
  updated_at timestamptz default now()
);
```

---

## `memory_files`

Optional file table if multiple files per memory are needed.

```sql
create table memory_files (
  id uuid primary key default gen_random_uuid(),

  memory_id uuid references memories(id) on delete cascade,
  user_id uuid not null,

  storage_path text not null,
  public_url text,
  file_type text,
  file_name text,
  file_size_bytes bigint,

  created_at timestamptz default now()
);
```

---

## `memory_chunks`

For semantic search / RAG.

```sql
create table memory_chunks (
  id uuid primary key default gen_random_uuid(),

  memory_id uuid references memories(id) on delete cascade,
  user_id uuid not null,

  chunk_text text not null,
  embedding vector,

  created_at timestamptz default now()
);
```

---

# 8. Memory Types

Supported V1 memory types:

```txt
note
idea
task
reminder
event
link
image
video
audio
file
job
person
research
```

The AI can classify the type.

User should also be able to manually edit type later.

---

# 9. AI Processing Pipeline

Every capture goes through this pipeline:

## Step 1: Ingest

Input may be:

* text
* photo
* document
* video
* audio
* link

Normalize it into a common object:

```ts
type CapturedInput = {
  userId: string;
  source: "telegram" | "web" | "manual";
  rawText?: string;
  fileUrl?: string;
  fileType?: string;
  url?: string;
  createdAt: string;
};
```

---

## Step 2: Extract Content

Depending on input type:

### Text

Use raw text directly.

### Image

Use vision model/OCR to extract:

* visible text
* what the image is
* why it might matter

### Audio

Transcribe first.

### Video

V1 simple mode:

* store the video
* save any caption/user text
* optionally extract audio transcript if easy

### Link

Fetch metadata:

* title
* description
* URL
* favicon maybe later

---

## Step 3: AI Structuring

Use AI to convert messy input into structured memory JSON.

Prompt:

```txt
You are Thinkback, an AI memory assistant.

Your job is to turn messy captured input into useful structured memory data.

The user is dumping something because they do not want to mentally hold it anymore.

Return JSON only.

Schema:
{
  "type": "note | idea | task | reminder | event | link | image | video | audio | file | job | person | research",
  "title": "short title",
  "summary": "short practical summary",
  "extracted_text": "important extracted text, or null",
  "tags": ["short-useful-tags"],
  "search_keywords": ["keywords the user may later search"],
  "priority": "low | medium | high",
  "people": ["people mentioned"],
  "action_items": [
    {
      "text": "action item",
      "due_at": null
    }
  ],
  "reminder_at": null,
  "event_start": null,
  "event_end": null,
  "confidence": 0.0,
  "reasoning_notes": "brief explanation of classification"
}

Rules:
- Be practical, not fancy.
- Use lowercase kebab-case tags.
- If the user mentions a deadline, reminder, event, meeting, task, or follow-up, extract it.
- If a date is vague, infer cautiously using the user's timezone.
- If no reminder is clearly requested, set reminder_at to null.
- Do not invent details.
- Keep summaries short but useful.
```

---

## Step 4: Save Memory

Save:

* raw input
* AI summary
* tags
* extracted content
* files
* reminder/event fields
* action items

---

## Step 5: Generate Embeddings

Create embeddings for:

* summary
* raw text
* extracted text
* transcript
* tags
* action items

Store in `memory_chunks`.

---

## Step 6: Reminder Scheduling

If `reminder_at` exists:

1. create reminder row
2. schedule notification
3. send through Telegram for V1

Reminder delivery:

> Reminder: message YC founders about remote internships.

---

# 10. Search System

V1 search should support:

## Keyword Search

Search fields:

* raw_text
* summary
* extracted_text
* transcript
* tags
* search_keywords

## Filters

Filter by:

* type
* tag
* date
* has reminder
* has file
* priority

## Semantic Search

Use embeddings to find related memories even if the exact keyword is not present.

Example:

Search:

> “money plan”

Should find memories tagged:

* tuition
* remote internships
* LeadGuard
* Thinkback
* startup income

---

# 11. Ask Thinkback / RAG

User can ask questions over their saved memories.

Flow:

1. user asks question
2. embed question
3. retrieve top relevant memories/chunks
4. pass them to AI
5. AI answers using only retrieved context
6. show cited memories below answer

Example:

User:

> “What app ideas did I have this week?”

Answer:

> This week you captured these app ideas:
>
> 1. Pushups-to-unlock-social-media app
> 2. Thinkback AI memory inbox
> 3. LeadGuard missed-call SMS recovery tool

Then show linked memories.

Important rule:

If there is not enough saved context, say:

> I don’t have enough saved memories about that yet.

Do not hallucinate.

---

# 12. Notifications

V1 notification channels:

## Telegram

Primary reminder delivery.

## Email

Optional.

## Web Push

Later.

Reminder system should check pending reminders every minute or every 5 minutes using a cron job.

---

# 13. Authentication

For personal V1:

* can start with hardcoded user
* private deployment
* Telegram user ID allowlist

For real V1:

* login with email/password or Google auth
* map Telegram user ID to app user
* protect dashboard routes
* Supabase RLS enabled

Telegram security:

* only allow messages from approved Telegram user IDs
* reject all other users

---

# 14. Privacy/Security

Do not overclaim “fully private” if AI processing sends data to model APIs.

Accurate privacy positioning:

> Your memories are private to your account. Files are stored securely. AI processing is used to summarize and organize your captures.

Security requirements:

* Supabase RLS
* private storage buckets
* signed URLs for files
* encrypted environment variables
* no public file URLs unless intentional
* user can delete memories
* user can delete files
* avoid logging raw private content in server logs

Later:

* local encryption
* bring-your-own-key
* private AI mode
* data export

---

# 15. V1 Tech Stack

Recommended stack:

## Frontend

* Next.js App Router
* TypeScript
* Tailwind
* shadcn/ui if useful

## Backend

* Next.js API routes or separate server
* Supabase Postgres
* Supabase Storage
* Supabase Auth
* pgvector for embeddings

## Capture

* Telegram Bot API webhook

## AI

* LLM for structuring/summarization
* vision model for images
* transcription model for audio
* embeddings model for semantic search

## Jobs/Cron

* Vercel cron or Supabase scheduled functions
* process reminders
* retry failed AI processing

---

# 16. API Routes

## Telegram

```txt
POST /api/telegram/webhook
```

Receives Telegram updates.

Responsibilities:

* validate Telegram secret
* verify user allowlist
* detect message type
* download media if needed
* create memory processing job
* reply to user

---

## Memories

```txt
GET /api/memories
POST /api/memories
GET /api/memories/:id
PATCH /api/memories/:id
DELETE /api/memories/:id
```

---

## Search

```txt
GET /api/search?q=...
POST /api/search/semantic
```

---

## Ask

```txt
POST /api/ask
```

Body:

```json
{
  "question": "What was my plan for making money?"
}
```

Returns:

```json
{
  "answer": "...",
  "sources": [
    {
      "memory_id": "...",
      "summary": "..."
    }
  ]
}
```

---

## Reminders

```txt
GET /api/reminders
POST /api/reminders
PATCH /api/reminders/:id
DELETE /api/reminders/:id
POST /api/reminders/process-due
```

---

# 17. Dashboard UI

## Main Inbox

Memory card should show:

* title
* summary
* type badge
* tags
* created time
* file preview
* reminder badge if applicable

Example card:

```txt
App idea: Pushups to unlock TikTok

App where users earn social media time by doing pushups/jumping jacks.

Tags: app-idea, fitness, screen-time
Type: idea
Created: Today 2:34 PM
```

---

## Memory Detail

Show:

* full summary
* raw input
* extracted text/transcript
* action items
* tags
* related memories
* attached file
* edit button
* delete button

---

## Search Page

Search bar:

> Search anything you saved...

Results should be grouped by relevance and recency.

---

## Ask Page

Simple chat UI:

> Ask Thinkback anything you saved.

Examples:

* “What deadlines do I have?”
* “What app ideas did I save?”
* “What was my plan for tuition money?”
* “Show me stuff related to YC internships.”

---

# 18. First-Time User Experience

Onboarding should teach the habit quickly.

## Step 1

Connect Telegram.

## Step 2

Send first memory.

Example prompt:

> Send Thinkback one thing you don’t want to remember manually.

## Step 3

Show AI result.

> Saved as an idea. Added tags. Found 2 action items.

## Step 4

User sees it in dashboard.

The aha moment should happen within 60 seconds.

---

# 19. The “Aha Moment”

The user should feel:

> “Oh, I can just throw messy stuff here and it becomes useful.”

The first magical moments:

1. user dumps a messy thought
2. AI gives it a clean title and tags
3. AI extracts an action item
4. user searches later and finds it instantly
5. reminder fires at the right time

---

# 20. Monetization Later

Not needed for personal V1, but product should support future pricing.

Possible freemium model:

## Free

* 50 memories/month
* basic search
* limited file uploads

## Pro

* unlimited memories
* AI search/chat
* voice notes
* image understanding
* reminders
* larger file storage
* priority AI processing

Potential price:

* $4.99/month student
* $9.99/month standard
* $49/year early-user plan

Paywall moments:

* user hits memory limit
* user tries AI ask
* user uploads many images/files
* user creates advanced reminders
* user wants unlimited storage

Do not paywall capture too early. Capture creates the habit.

---

# 21. V1 Non-Goals

Do **not** build these in V1:

* full native mobile app
* complicated Notion-style editor
* public sharing
* team workspaces
* complex folders
* calendar sync
* Chrome extension
* perfect video transcription
* perfect task manager
* complicated project management
* social features

V1 is not Notion.
V1 is not a full productivity suite.
V1 is a personal AI memory inbox.

---

# 22. Success Criteria

V1 is successful if:

1. user can capture text from Telegram
2. user can capture images/screenshots
3. user can capture links
4. user can capture voice notes
5. AI summarizes/tags/extracts tasks
6. reminders work
7. dashboard shows all memories
8. search works
9. Ask Thinkback can answer from saved memories
10. user genuinely starts dumping brain into it daily

Personal success metric:

> Does this reduce the number of things I feel forced to remember?

---

# 23. Build Phases

## Phase 0: Setup

* create Next.js app
* set up Supabase
* create database schema
* create storage bucket
* configure env vars
* create Telegram bot
* configure webhook

---

## Phase 1: Text Capture

* receive Telegram text messages
* save raw text
* run AI extraction
* save structured memory
* bot replies with summary/tags

Done when:

> User can text the bot and see the memory in database.

---

## Phase 2: Dashboard

* build `/dashboard`
* list memories
* memory cards
* memory detail page
* delete memory
* edit tags/type/summary

Done when:

> User can review saved memories in browser.

---

## Phase 3: Image/File Capture

* receive images/documents/videos
* download from Telegram
* upload to Supabase Storage
* save file metadata
* for images, run vision/OCR
* show preview in dashboard

Done when:

> User can send screenshot to Telegram and search its extracted content later.

---

## Phase 4: Voice Notes

* receive voice notes
* upload audio
* transcribe
* summarize/tag/extract action items
* save transcript

Done when:

> User can ramble an idea by voice and Thinkback turns it into useful memory.

---

## Phase 5: Reminders

* extract `reminder_at`
* create reminder rows
* cron job checks due reminders
* send Telegram notification
* mark reminder as sent

Done when:

> “Remind me tomorrow to apply to YC jobs” actually reminds the user tomorrow.

---

## Phase 6: Search

* keyword search
* tag filter
* type filter
* date filter
* semantic search if embeddings are ready

Done when:

> User can find old memories without remembering exact words.

---

## Phase 7: Ask Thinkback

* create embeddings
* chunk long memories
* retrieve relevant chunks
* answer with sources
* show source memories

Done when:

> User can ask “what was my plan for X?” and get a useful grounded answer.

---

## Phase 8: Polish

* better UI
* loading states
* failed processing states
* retry button
* better Telegram responses
* onboarding page
* settings page
* privacy/data delete controls

---

# 24. Environment Variables

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
```

---

# 25. Processing Statuses

Memory status should be tracked.

```txt
pending
processing
processed
failed
```

If AI fails:

* save raw memory anyway
* mark as failed
* allow retry

Never lose the user’s capture because AI failed.

---

# 26. Core Principle for Codex

Build the fastest working version that lets the user dump their brain into Thinkback tonight.

Prioritize:

1. capture speed
2. not losing data
3. AI structuring
4. searchability
5. reminders

Do not over-engineer architecture before the user can use it.

Final product feeling:

> Thinkback is the place I send anything I don’t want to remember manually.
