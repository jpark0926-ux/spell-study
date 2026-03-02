-- Spell & Study Database Schema
-- Run this in your Supabase SQL Editor

-- User Progress Table
create table if not exists user_progress (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users not null,
  unit int,
  coins int default 0,
  best_streak int default 0,
  earned_ach text[] default '{}',
  cards text[] default '{}',
  killed_villains text[] default '{}',
  total_games int default 0,
  created_at timestamptz default now(),
  updated_at timestamptz default now(),
  unique(user_id, unit)
);

-- Enable Row Level Security
alter table user_progress enable row level security;

-- Policy: Users can manage their own progress
create policy "Users can manage own progress"
  on user_progress for all
  using (auth.uid() = user_id);

-- Leaderboard Table
create table if not exists leaderboard (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users not null,
  display_name text,
  best_score int default 0,
  total_coins int default 0,
  created_at timestamptz default now(),
  updated_at timestamptz default now(),
  unique(user_id)
);

-- Enable Row Level Security
alter table leaderboard enable row level security;

-- Policy: Leaderboard is public for reading
create policy "Leaderboard is public read"
  on leaderboard for select
  using (true);

-- Policy: Users can manage their own leaderboard entry
create policy "Users manage own score"
  on leaderboard for all
  using (auth.uid() = user_id);

-- Create indexes for better query performance
create index if not exists idx_user_progress_user_id on user_progress(user_id);
create index if not exists idx_leaderboard_total_coins on leaderboard(total_coins desc);
create index if not exists idx_leaderboard_best_score on leaderboard(best_score desc);

-- Function to automatically update updated_at timestamp
create or replace function update_updated_at_column()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

-- Trigger to update updated_at on user_progress
drop trigger if exists update_user_progress_updated_at on user_progress;
create trigger update_user_progress_updated_at
  before update on user_progress
  for each row
  execute function update_updated_at_column();

-- Trigger to update updated_at on leaderboard
drop trigger if exists update_leaderboard_updated_at on leaderboard;
create trigger update_leaderboard_updated_at
  before update on leaderboard
  for each row
  execute function update_updated_at_column();
