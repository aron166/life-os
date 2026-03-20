-- ============================================================
-- Life OS — Supabase Schema
-- Run this in the Supabase SQL editor (Dashboard → SQL Editor)
-- ============================================================

-- HABIT LOGS
create table if not exists habit_logs (
  id          uuid default gen_random_uuid() primary key,
  user_id     uuid references auth.users(id) on delete cascade not null,
  date        date not null,
  habit_id    text not null,
  done        boolean default false,
  created_at  timestamptz default now(),
  updated_at  timestamptz default now(),
  unique(user_id, date, habit_id)
);

-- HABIT STREAKS
create table if not exists habit_streaks (
  id               uuid default gen_random_uuid() primary key,
  user_id          uuid references auth.users(id) on delete cascade not null,
  habit_id         text not null,
  streak           int default 0,
  freeze_used_week text,   -- ISO week number as text, e.g. "12"
  updated_at       timestamptz default now(),
  unique(user_id, habit_id)
);

-- DAY TYPES
create table if not exists day_types (
  id        uuid default gen_random_uuid() primary key,
  user_id   uuid references auth.users(id) on delete cascade not null,
  date      date not null,
  day_type  text not null,  -- team | bar | school | biz
  created_at timestamptz default now(),
  unique(user_id, date)
);

-- JOURNAL ENTRIES
create table if not exists journal_entries (
  id          uuid default gen_random_uuid() primary key,
  user_id     uuid references auth.users(id) on delete cascade not null,
  date        date not null,
  worked      text,
  didnt       text,
  tomorrow    text,
  quick_note  text,
  created_at  timestamptz default now(),
  updated_at  timestamptz default now(),
  unique(user_id, date)
);

-- DAILY TASKS
create table if not exists tasks (
  id         uuid default gen_random_uuid() primary key,
  user_id    uuid references auth.users(id) on delete cascade not null,
  date       date not null,
  content    text,
  created_at timestamptz default now(),
  updated_at timestamptz default now(),
  unique(user_id, date)
);

-- GYM EXERCISES (per user, customisable)
create table if not exists gym_exercises (
  id           uuid default gen_random_uuid() primary key,
  user_id      uuid references auth.users(id) on delete cascade not null,
  day_type     text not null,  -- push | pull | legs
  name         text not null,
  default_sets int,
  default_reps int,
  order_index  int default 0,
  created_at   timestamptz default now()
);

-- GYM LOGS (individual session entries)
create table if not exists gym_logs (
  id            uuid default gen_random_uuid() primary key,
  user_id       uuid references auth.users(id) on delete cascade not null,
  date          date not null,
  exercise_name text not null,
  sets          int,
  reps          int,
  weight_kg     numeric,
  day_type      text,  -- push | pull | legs
  created_at    timestamptz default now()
);

-- SCHOOL PROGRESS
create table if not exists school_progress (
  id           uuid default gen_random_uuid() primary key,
  user_id      uuid references auth.users(id) on delete cascade not null,
  sprint_name  text,
  sprint_start date,
  sprint_end   date,
  mentor_notes text,
  weekly_goal  text,
  updated_at   timestamptz default now(),
  unique(user_id)
);

-- SCHOOL TASKS (kanban)
create table if not exists school_tasks (
  id          uuid default gen_random_uuid() primary key,
  user_id     uuid references auth.users(id) on delete cascade not null,
  title       text not null,
  status      text default 'todo',  -- todo | in_progress | done
  order_index int default 0,
  created_at  timestamptz default now(),
  updated_at  timestamptz default now()
);

-- SCHOOL SUBMISSIONS / PR LOG
create table if not exists school_submissions (
  id         uuid default gen_random_uuid() primary key,
  user_id    uuid references auth.users(id) on delete cascade not null,
  title      text not null,
  date       date,
  notes      text,
  created_at timestamptz default now()
);

-- BUSINESS CLIENTS
create table if not exists business_clients (
  id          uuid default gen_random_uuid() primary key,
  user_id     uuid references auth.users(id) on delete cascade not null,
  name        text not null,
  status      text default 'active',  -- active | paused | completed
  next_action text,
  created_at  timestamptz default now(),
  updated_at  timestamptz default now()
);

-- BUSINESS PROSPECTS
create table if not exists business_prospects (
  id           uuid default gen_random_uuid() primary key,
  user_id      uuid references auth.users(id) on delete cascade not null,
  name         text not null,
  contact_date date,
  status       text default 'new',  -- new | contacted | in_talks | closed
  created_at   timestamptz default now(),
  updated_at   timestamptz default now()
);

-- BUSINESS CONFIG (weekly goals etc.)
create table if not exists business_config (
  id                    uuid default gen_random_uuid() primary key,
  user_id               uuid references auth.users(id) on delete cascade not null,
  weekly_revenue_goal   numeric default 0,
  weekly_revenue_actual numeric default 0,
  current_build         text,
  ideas_backlog         text,
  week_start            date,
  updated_at            timestamptz default now(),
  unique(user_id)
);

-- SLEEP LOGS
create table if not exists sleep_logs (
  id               uuid default gen_random_uuid() primary key,
  user_id          uuid references auth.users(id) on delete cascade not null,
  date             date not null,
  bedtime          text,   -- HH:MM
  wake_time        text,   -- HH:MM
  duration_hours   numeric,
  created_at       timestamptz default now(),
  unique(user_id, date)
);

-- MOOD LOGS
create table if not exists mood_logs (
  id          uuid default gen_random_uuid() primary key,
  user_id     uuid references auth.users(id) on delete cascade not null,
  date        date not null,
  mood_level  int,  -- 1–5
  created_at  timestamptz default now(),
  unique(user_id, date)
);

-- WEEKLY REVIEWS
create table if not exists weekly_reviews (
  id                 uuid default gen_random_uuid() primary key,
  user_id            uuid references auth.users(id) on delete cascade not null,
  week_start         date not null,
  what_worked        text,
  what_to_drop       text,
  priority_next_week text,
  created_at         timestamptz default now(),
  updated_at         timestamptz default now(),
  unique(user_id, week_start)
);

-- ============================================================
-- ROW LEVEL SECURITY
-- ============================================================
alter table habit_logs          enable row level security;
alter table habit_streaks       enable row level security;
alter table day_types           enable row level security;
alter table journal_entries     enable row level security;
alter table tasks               enable row level security;
alter table gym_exercises       enable row level security;
alter table gym_logs            enable row level security;
alter table school_progress     enable row level security;
alter table school_tasks        enable row level security;
alter table school_submissions  enable row level security;
alter table business_clients    enable row level security;
alter table business_prospects  enable row level security;
alter table business_config     enable row level security;
alter table sleep_logs          enable row level security;
alter table mood_logs           enable row level security;
alter table weekly_reviews      enable row level security;

-- RLS policies — one per table (drop-and-recreate pattern for idempotency)
do $$
declare
  tbl text;
  tbls text[] := array[
    'habit_logs','habit_streaks','day_types','journal_entries','tasks',
    'gym_exercises','gym_logs','school_progress','school_tasks',
    'school_submissions','business_clients','business_prospects',
    'business_config','sleep_logs','mood_logs','weekly_reviews'
  ];
  policy_name text;
begin
  foreach tbl in array tbls loop
    policy_name := tbl || '_user_policy';
    -- Drop existing policy if present, then recreate
    execute format('drop policy if exists "%s" on %I', policy_name, tbl);
    execute format(
      'create policy "%s" on %I for all using (auth.uid() = user_id) with check (auth.uid() = user_id)',
      policy_name, tbl
    );
  end loop;
end $$;

-- MEAL LOGS (added for per-meal content + protein tracking)
create table if not exists meal_logs (
  id          uuid default gen_random_uuid() primary key,
  user_id     uuid references auth.users(id) on delete cascade not null,
  date        date not null,
  meal_number int not null,  -- 1 | 2 | 3
  content     text,
  protein_g   int,
  done        boolean default false,
  created_at  timestamptz default now(),
  updated_at  timestamptz default now(),
  unique(user_id, date, meal_number)
);
alter table meal_logs enable row level security;
drop policy if exists "meal_logs_user_policy" on meal_logs;
create policy "meal_logs_user_policy" on meal_logs for all
  using (auth.uid() = user_id) with check (auth.uid() = user_id);

-- ============================================================
-- REALTIME (enable for habit_logs so cross-device sync works)
-- ============================================================
alter publication supabase_realtime add table habit_logs;
alter publication supabase_realtime add table mood_logs;
alter publication supabase_realtime add table sleep_logs;
