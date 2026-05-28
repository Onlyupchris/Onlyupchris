-- =============================================
-- Rivonia AI — Supabase Database Schema
-- Run this in your Supabase SQL Editor
-- =============================================

-- Profiles (extends auth.users)
create table if not exists profiles (
  id uuid references auth.users(id) on delete cascade primary key,
  email text not null,
  full_name text,
  agency_name text,
  avatar_url text,
  plan text default 'starter' check (plan in ('starter', 'pro', 'enterprise')),
  created_at timestamptz default now()
);

alter table profiles enable row level security;
create policy "Users can view own profile" on profiles for select using (auth.uid() = id);
create policy "Users can update own profile" on profiles for update using (auth.uid() = id);
create policy "Users can insert own profile" on profiles for insert with check (auth.uid() = id);

-- Clients
create table if not exists clients (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references profiles(id) on delete cascade not null,
  name text not null,
  company text,
  email text,
  phone text,
  status text default 'prospect' check (status in ('prospect', 'active', 'at_risk', 'churned')),
  monthly_value numeric(10,2) default 0,
  start_date date,
  notes text,
  tags text[],
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

alter table clients enable row level security;
create policy "Users manage own clients" on clients for all using (auth.uid() = user_id);

-- Deals
create table if not exists deals (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references profiles(id) on delete cascade not null,
  client_id uuid references clients(id) on delete set null,
  title text not null,
  value numeric(10,2) default 0,
  stage text default 'lead' check (stage in ('lead', 'qualified', 'proposal', 'negotiation', 'closed_won', 'closed_lost')),
  probability integer default 0 check (probability between 0 and 100),
  close_date date,
  notes text,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

alter table deals enable row level security;
create policy "Users manage own deals" on deals for all using (auth.uid() = user_id);

-- Agreements
create table if not exists agreements (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references profiles(id) on delete cascade not null,
  client_id uuid references clients(id) on delete set null,
  title text not null,
  content text not null,
  status text default 'draft' check (status in ('draft', 'sent', 'signed', 'expired')),
  sent_at timestamptz,
  signed_at timestamptz,
  expires_at timestamptz,
  signer_name text,
  signer_email text,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

alter table agreements enable row level security;
create policy "Users manage own agreements" on agreements for all using (auth.uid() = user_id);

-- Revenue Entries
create table if not exists revenue_entries (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references profiles(id) on delete cascade not null,
  client_id uuid references clients(id) on delete set null,
  amount numeric(10,2) not null,
  type text default 'recurring' check (type in ('recurring', 'one_time', 'refund')),
  month integer check (month between 1 and 12),
  year integer,
  description text,
  created_at timestamptz default now()
);

alter table revenue_entries enable row level security;
create policy "Users manage own revenue" on revenue_entries for all using (auth.uid() = user_id);

-- AI Sessions
create table if not exists ai_sessions (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references profiles(id) on delete cascade not null,
  tool text not null check (tool in ('content_generator', 'growth_advisor', 'report_generator', 'lead_qualifier')),
  input jsonb,
  output text,
  tokens_used integer,
  created_at timestamptz default now()
);

alter table ai_sessions enable row level security;
create policy "Users view own AI sessions" on ai_sessions for all using (auth.uid() = user_id);

-- Updated_at trigger function
create or replace function update_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

create trigger clients_updated_at before update on clients for each row execute function update_updated_at();
create trigger deals_updated_at before update on deals for each row execute function update_updated_at();
create trigger agreements_updated_at before update on agreements for each row execute function update_updated_at();

-- Auto-create profile on signup
create or replace function handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, email, full_name, agency_name)
  values (
    new.id,
    new.email,
    new.raw_user_meta_data->>'full_name',
    new.raw_user_meta_data->>'agency_name'
  )
  on conflict (id) do nothing;
  return new;
end;
$$ language plpgsql security definer;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function handle_new_user();
