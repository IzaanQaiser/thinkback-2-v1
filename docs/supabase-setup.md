# Supabase Setup For Thinkback

This is the user-owned setup needed for Phase 1.

Codex can write the schema and app code, but you need to create the Supabase project and provide local credentials.

---

# 1. Create A Supabase Project

Go to Supabase and create a new project.

Save these values from the project dashboard:

* Project URL
* anon public key
* service role key

The service role key is private. Do not commit it.

---

# 2. Create `.env.local`

From the repo root:

```sh
cp .env.example .env.local
```

Fill in:

```txt
NEXT_PUBLIC_SUPABASE_URL=your-project-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
DEFAULT_TIMEZONE=America/Toronto
```

Generate a default user ID:

```sh
node -e "console.log(crypto.randomUUID())"
```

Put that value into `.env.local`:

```txt
DEFAULT_USER_ID=generated-uuid-here
```

For personal V1, this UUID is the single app user. Full login/auth comes later.

---

# 3. Apply The Database Migration

Open the Supabase SQL editor and run:

```txt
supabase/migrations/0001_initial_schema.sql
```

The migration creates:

* `memories`
* `reminders`
* `memory_files`
* `memory_chunks`
* `telegram_users`
* indexes for common V1 queries
* updated-at triggers
* `pgvector`
* private `memory-files` storage bucket

If the storage bucket insert fails in SQL, create it manually:

* Bucket name: `memory-files`
* Public bucket: off/private

---

# 4. Validate Phase 1

Start the dev server:

```sh
npm run dev
```

Check health:

```sh
curl -i http://localhost:3000/api/health
```

Expected after Supabase is configured and migration is applied:

```json
{
  "ok": true,
  "service": "thinkback",
  "checks": {
    "app": "ok",
    "database": {
      "status": "ok"
    }
  }
}
```

Create a manual memory:

```sh
curl -i \
  -X POST http://localhost:3000/api/memories \
  -H "Content-Type: application/json" \
  -d '{"raw_text":"Phase 1 test memory from curl","tags":["phase-1","test"]}'
```

List memories:

```sh
curl -i http://localhost:3000/api/memories
```

Expected:

* `POST /api/memories` returns `201`
* `GET /api/memories` includes the inserted memory
* Supabase table `memories` contains the new row

