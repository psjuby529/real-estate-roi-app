-- 在 Supabase SQL Editor 執行（新專案建表 + RLS）

create extension if not exists pgcrypto;

create table if not exists cases (
  id uuid primary key default gen_random_uuid(),
  address text not null,
  property_type text not null,
  floor_info text,
  ask_price numeric,
  floor_price numeric,
  target_price numeric not null,
  building_ping numeric,
  land_ping numeric,
  land_assessed_total numeric,
  invest_rent boolean default false,
  invest_urban_renewal boolean default false,
  invest_flip boolean default false,
  loan_ratio numeric default 0.7,
  loan_amount numeric,
  interest_rate numeric default 0.02086,
  loan_years int default 30,
  interest_only_years int default 0,
  renovation_cost numeric default 0,
  conservative_rent numeric default 0,
  target_rent numeric default 0,
  upfront_misc_cost numeric default 0,
  operating_cost_rate numeric default 0.10,
  legal_far numeric,
  bonus_far numeric,
  alloc_efficiency numeric default 0.75,
  common_burden_rate numeric default 0.35,
  interior_efficiency numeric default 0.70,
  nearby_new_house_price numeric,
  expected_sell_price numeric,
  hold_months int,
  holding_cost numeric default 0,
  selling_cost numeric default 0,
  notes text,
  created_by text,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

alter table cases enable row level security;

drop policy if exists "cases_anon_select" on cases;
drop policy if exists "cases_anon_insert" on cases;
drop policy if exists "cases_anon_update" on cases;
drop policy if exists "cases_anon_delete" on cases;

create policy "cases_anon_select" on cases for select using (true);
create policy "cases_anon_insert" on cases for insert with check (true);
create policy "cases_anon_update" on cases for update using (true);
create policy "cases_anon_delete" on cases for delete using (true);
