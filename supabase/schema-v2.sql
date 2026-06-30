-- ============================================================================
-- DRISHTI VEDIC+ v2.0 — Complete Supabase Schema
-- Run this once in Supabase SQL editor after creating your project.
-- ============================================================================

create extension if not exists "uuid-ossp";

-- ============================================================================
-- profiles — extends auth.users
-- ============================================================================
create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  full_name text,
  phone text,
  -- Subscription
  plan text not null default 'free',
  plan_renews_at timestamptz,
  razorpay_subscription_id text,
  -- Usage caps
  chats_this_month int not null default 0,
  matches_this_month int not null default 0,
  -- Metadata
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

create index if not exists profiles_plan_idx on public.profiles(plan);

-- ============================================================================
-- partners — B2B matrimonial bureaus
-- ============================================================================
create table if not exists public.partners (
  id uuid primary key default uuid_generate_v4(),
  owner_id uuid references public.profiles(id) on delete cascade,
  business_name text not null,
  business_type text,
  city text,
  plan text not null default 'partner_starter',
  monthly_match_quota int not null default 100,
  matches_used_this_month int not null default 0,
  monthly_fee_inr int,
  razorpay_subscription_id text,
  brand_name text,
  brand_logo_url text,
  active boolean default true,
  created_at timestamptz default now()
);

create index if not exists partners_active_idx on public.partners(active) where active = true;

-- ============================================================================
-- charts — birth charts + numerology (NEW: numerology columns)
-- ============================================================================
create table if not exists public.charts (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid references public.profiles(id) on delete cascade,
  partner_id uuid references public.partners(id) on delete set null,
  -- Birth details
  name text not null,
  birth_date date not null,
  birth_time time not null,
  place text not null,
  latitude numeric(10, 6),
  longitude numeric(10, 6),
  gender text check (gender in ('male', 'female')),
  -- Astrology
  ascendant text,
  moon_sign text,
  sun_sign text,
  nakshatra text,
  -- Numerology (NEW IN v2)
  mulank int,
  bhagyank int,
  naamank int,
  soul_number int,
  personality_number int,
  kua int,
  kua_group text,
  personal_year int,
  karmic_debts int[],
  master_numbers int[],
  -- Raw JSON
  raw_data jsonb,
  -- Metadata
  created_at timestamptz default now()
);

create index if not exists charts_user_idx on public.charts(user_id);
create index if not exists charts_partner_idx on public.charts(partner_id);
create index if not exists charts_mulank_idx on public.charts(mulank);

-- ============================================================================
-- matches — kundli matching results with DRISHTI Score (UPDATED in v2)
-- ============================================================================
create table if not exists public.matches (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid references public.profiles(id) on delete set null,
  partner_id uuid references public.partners(id) on delete set null,
  boy_chart_id uuid references public.charts(id),
  girl_chart_id uuid references public.charts(id),
  -- DRISHTI Score (NEW IN v2)
  drishti_score int not null,
  drishti_band text,
  astrology_points int,
  numerology_points int,
  loshu_points int,
  dosha_points int,
  -- Legacy Ashtakoot
  total_score int,
  max_score int default 36,
  percentage int,
  verdict text,
  -- Raw result
  raw_result jsonb,
  created_at timestamptz default now()
);

create index if not exists matches_partner_idx on public.matches(partner_id, created_at desc);
create index if not exists matches_drishti_score_idx on public.matches(drishti_score);

-- ============================================================================
-- chat_messages — Oracle chat history
-- ============================================================================
create table if not exists public.chat_messages (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid not null references public.profiles(id) on delete cascade,
  chart_id uuid references public.charts(id) on delete set null,
  role text not null check (role in ('user', 'oracle')),
  content text not null,
  sources text[],
  engines_used text[],
  confidence_pct int,
  created_at timestamptz default now()
);

create index if not exists chat_user_idx on public.chat_messages(user_id, created_at desc);

-- ============================================================================
-- RLS policies
-- ============================================================================
alter table public.profiles enable row level security;
alter table public.charts enable row level security;
alter table public.matches enable row level security;
alter table public.chat_messages enable row level security;
alter table public.partners enable row level security;

drop policy if exists "own_profile" on public.profiles;
create policy "own_profile" on public.profiles for all using (auth.uid() = id);

drop policy if exists "own_charts" on public.charts;
create policy "own_charts" on public.charts for all 
  using (auth.uid() = user_id OR partner_id in (select id from public.partners where owner_id = auth.uid()));

drop policy if exists "own_chats" on public.chat_messages;
create policy "own_chats" on public.chat_messages for all using (auth.uid() = user_id);

drop policy if exists "own_matches" on public.matches;
create policy "own_matches" on public.matches for all 
  using (auth.uid() = user_id OR partner_id in (select id from public.partners where owner_id = auth.uid()));

drop policy if exists "own_partner" on public.partners;
create policy "own_partner" on public.partners for all using (auth.uid() = owner_id);

-- ============================================================================
-- Monthly usage reset function (call from cron)
-- ============================================================================
create or replace function public.reset_monthly_usage()
returns void language plpgsql as $$
begin
  update public.profiles set chats_this_month = 0, matches_this_month = 0;
  update public.partners set matches_used_this_month = 0;
end;
$$;

-- ============================================================================
-- DONE
-- ============================================================================
-- After running this, go to:
-- Authentication > Providers > Enable Email Provider (Magic Link)
-- Settings > API > Copy URL + anon key + service role key to .env.local
-- ============================================================================
