-- profiles table
create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  role text not null check (role in ('student', 'eco_club', 'government')),
  group_size integer check (group_size between 1 and 500),
  awareness_level text not null check (awareness_level in ('low', 'medium', 'high')),
  zipcode text not null,
  language text not null check (language in ('en', 'ru', 'uz')),
  created_at timestamptz not null default now()
);

-- plans table
create table if not exists public.plans (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  title text not null,
  goal_description text not null,
  area_size_m2 integer not null check (area_size_m2 > 0),
  season text not null check (season in ('spring', 'summer', 'autumn', 'winter')),
  zipcode text not null,
  reminder_date date,
  plan_json jsonb not null,
  created_at timestamptz not null default now()
);

create index if not exists plans_user_created_idx on public.plans (user_id, created_at desc);

-- logs table
create table if not exists public.logs (
  id uuid primary key default gen_random_uuid(),
  plan_id uuid not null references public.plans(id) on delete cascade,
  user_id uuid not null references auth.users(id) on delete cascade,
  date date not null,
  notes text not null,
  status text not null check (status in ('todo', 'in_progress', 'done')),
  created_at timestamptz not null default now()
);

create index if not exists logs_user_plan_date_idx on public.logs (user_id, plan_id, date desc);

-- impact_photos table
create table if not exists public.impact_photos (
  id uuid primary key default gen_random_uuid(),
  plan_id uuid not null references public.plans(id) on delete cascade,
  user_id uuid not null references auth.users(id) on delete cascade,
  before_url text not null,
  after_url text not null,
  created_at timestamptz not null default now(),
  unique (plan_id, user_id)
);

-- Row Level Security
alter table public.profiles enable row level security;
alter table public.plans enable row level security;
alter table public.logs enable row level security;
alter table public.impact_photos enable row level security;

-- profiles policies
create policy "Users can manage their profile"
on public.profiles
for all
using (auth.uid() = id)
with check (auth.uid() = id);

-- plans policies
create policy "Users can read own plans"
on public.plans
for select
using (auth.uid() = user_id);

create policy "Users can insert own plans"
on public.plans
for insert
with check (auth.uid() = user_id);

create policy "Users can update own plans"
on public.plans
for update
using (auth.uid() = user_id)
with check (auth.uid() = user_id);

create policy "Users can delete own plans"
on public.plans
for delete
using (auth.uid() = user_id);

-- logs policies
create policy "Users can read own logs"
on public.logs
for select
using (auth.uid() = user_id);

create policy "Users can insert own logs"
on public.logs
for insert
with check (auth.uid() = user_id);

create policy "Users can update own logs"
on public.logs
for update
using (auth.uid() = user_id)
with check (auth.uid() = user_id);

create policy "Users can delete own logs"
on public.logs
for delete
using (auth.uid() = user_id);

-- impact_photos policies
create policy "Users can read own impact photos"
on public.impact_photos
for select
using (auth.uid() = user_id);

create policy "Users can insert own impact photos"
on public.impact_photos
for insert
with check (auth.uid() = user_id);

create policy "Users can update own impact photos"
on public.impact_photos
for update
using (auth.uid() = user_id)
with check (auth.uid() = user_id);

create policy "Users can delete own impact photos"
on public.impact_photos
for delete
using (auth.uid() = user_id);

-- Storage bucket "impact" must be created in Supabase dashboard.
-- Example policies (run separately in Storage policies UI):
-- 1) Objects are organized under folder: impact/{user_id}/{plan_id}/...
-- 2) Allow authenticated users to upload and read only their own folder.
--
-- using expression (example):
-- (bucket_id = 'impact') and (auth.role() = 'authenticated') and
-- (position(auth.uid()::text in object_name) = 8) -- path starts with auth.uid()

