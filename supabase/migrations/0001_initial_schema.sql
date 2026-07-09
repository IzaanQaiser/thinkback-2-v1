create extension if not exists vector with schema extensions;

create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create table if not exists public.memories (
  id uuid primary key default gen_random_uuid(),

  user_id uuid not null,

  source text not null default 'telegram',
  source_message_id text,

  type text not null,
  status text not null default 'processed',

  raw_text text,
  title text,
  summary text,
  extracted_text text,
  transcript text,

  url text,

  tags text[] not null default '{}',
  search_keywords text[] not null default '{}',

  priority text not null default 'medium',

  reminder_at timestamptz,
  event_start timestamptz,
  event_end timestamptz,

  action_items jsonb not null default '[]'::jsonb,
  people text[] not null default '{}',

  file_url text,
  file_type text,
  file_name text,
  file_size_bytes bigint,

  embedding extensions.vector,

  ai_metadata jsonb not null default '{}'::jsonb,

  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),

  constraint memories_type_check check (
    type in (
      'note',
      'idea',
      'task',
      'reminder',
      'event',
      'link',
      'image',
      'video',
      'audio',
      'file',
      'job',
      'person',
      'research',
      'achievement'
    )
  ),
  constraint memories_status_check check (
    status in ('pending', 'processing', 'processed', 'failed')
  ),
  constraint memories_priority_check check (
    priority in ('low', 'medium', 'high')
  )
);

create table if not exists public.reminders (
  id uuid primary key default gen_random_uuid(),

  user_id uuid not null,
  memory_id uuid references public.memories(id) on delete cascade,

  title text not null,
  description text,

  remind_at timestamptz not null,
  status text not null default 'pending',

  sent_at timestamptz,

  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),

  constraint reminders_status_check check (
    status in ('pending', 'sent', 'completed', 'failed', 'cancelled')
  )
);

create table if not exists public.memory_files (
  id uuid primary key default gen_random_uuid(),

  memory_id uuid references public.memories(id) on delete cascade,
  user_id uuid not null,

  storage_path text not null,
  public_url text,
  file_type text,
  file_name text,
  file_size_bytes bigint,

  created_at timestamptz not null default now()
);

create table if not exists public.memory_chunks (
  id uuid primary key default gen_random_uuid(),

  memory_id uuid references public.memories(id) on delete cascade,
  user_id uuid not null,

  chunk_text text not null,
  embedding extensions.vector,

  created_at timestamptz not null default now()
);

create table if not exists public.telegram_users (
  id uuid primary key default gen_random_uuid(),

  user_id uuid not null,
  telegram_user_id text not null unique,
  telegram_username text,

  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists memories_user_id_idx on public.memories(user_id);
create index if not exists memories_created_at_idx on public.memories(created_at desc);
create index if not exists memories_type_idx on public.memories(type);
create index if not exists memories_reminder_at_idx on public.memories(reminder_at);
create index if not exists memories_tags_idx on public.memories using gin(tags);
create index if not exists memories_search_keywords_idx on public.memories using gin(search_keywords);

create index if not exists reminders_user_id_idx on public.reminders(user_id);
create index if not exists reminders_remind_at_idx on public.reminders(remind_at);
create index if not exists reminders_status_idx on public.reminders(status);

create index if not exists memory_files_memory_id_idx on public.memory_files(memory_id);
create index if not exists memory_files_user_id_idx on public.memory_files(user_id);

create index if not exists memory_chunks_memory_id_idx on public.memory_chunks(memory_id);
create index if not exists memory_chunks_user_id_idx on public.memory_chunks(user_id);

create index if not exists telegram_users_user_id_idx on public.telegram_users(user_id);

drop trigger if exists set_memories_updated_at on public.memories;
create trigger set_memories_updated_at
before update on public.memories
for each row
execute function public.set_updated_at();

drop trigger if exists set_reminders_updated_at on public.reminders;
create trigger set_reminders_updated_at
before update on public.reminders
for each row
execute function public.set_updated_at();

drop trigger if exists set_telegram_users_updated_at on public.telegram_users;
create trigger set_telegram_users_updated_at
before update on public.telegram_users
for each row
execute function public.set_updated_at();

alter table public.memories enable row level security;
alter table public.reminders enable row level security;
alter table public.memory_files enable row level security;
alter table public.memory_chunks enable row level security;
alter table public.telegram_users enable row level security;

drop policy if exists "Users can manage their memories" on public.memories;
create policy "Users can manage their memories"
on public.memories
for all
using (auth.uid() = user_id)
with check (auth.uid() = user_id);

drop policy if exists "Users can manage their reminders" on public.reminders;
create policy "Users can manage their reminders"
on public.reminders
for all
using (auth.uid() = user_id)
with check (auth.uid() = user_id);

drop policy if exists "Users can manage their memory files" on public.memory_files;
create policy "Users can manage their memory files"
on public.memory_files
for all
using (auth.uid() = user_id)
with check (auth.uid() = user_id);

drop policy if exists "Users can manage their memory chunks" on public.memory_chunks;
create policy "Users can manage their memory chunks"
on public.memory_chunks
for all
using (auth.uid() = user_id)
with check (auth.uid() = user_id);

drop policy if exists "Users can manage their telegram mappings" on public.telegram_users;
create policy "Users can manage their telegram mappings"
on public.telegram_users
for all
using (auth.uid() = user_id)
with check (auth.uid() = user_id);

insert into storage.buckets (id, name, public)
values ('memory-files', 'memory-files', false)
on conflict (id) do update set public = false;
