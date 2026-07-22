create table if not exists public.wave_works (
  slug text primary key,
  title text not null,
  author text not null,
  type text not null check (type in ('novel', 'comic')),
  category text not null,
  description text not null,
  tags text[] not null default '{}',
  status text not null,
  updated_at date not null,
  popularity integer not null default 0,
  cover_style jsonb not null,
  section text not null check (section in ('popular-novel', 'popular-comic', 'new')),
  chapters jsonb not null default '[]'::jsonb,
  created_at timestamptz not null default now()
);

alter table public.wave_works enable row level security;

drop policy if exists "Public can read WAVE works" on public.wave_works;

create policy "Public can read WAVE works"
on public.wave_works
for select
using (true);

create table if not exists public.wave_comments (
  id uuid primary key default gen_random_uuid(),
  work_slug text not null references public.wave_works(slug) on delete cascade,
  user_id uuid not null,
  user_name text not null,
  content text not null,
  created_at timestamptz not null default now()
);

create index if not exists wave_comments_work_slug_created_at_idx
on public.wave_comments (work_slug, created_at desc);

alter table public.wave_comments enable row level security;

drop policy if exists "Public can read WAVE comments" on public.wave_comments;

create policy "Public can read WAVE comments"
on public.wave_comments
for select
using (true);
