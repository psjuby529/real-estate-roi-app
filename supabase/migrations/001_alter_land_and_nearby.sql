-- 既有專案自舊 schema 遷移：在 Supabase SQL Editor 執行

-- A) 僅有舊欄位 land_value_input：改名為 land_assessed_total
do $$
begin
  if exists (
    select 1 from information_schema.columns
    where table_schema = 'public' and table_name = 'cases' and column_name = 'land_value_input'
  ) and not exists (
    select 1 from information_schema.columns
    where table_schema = 'public' and table_name = 'cases' and column_name = 'land_assessed_total'
  ) then
    alter table public.cases rename column land_value_input to land_assessed_total;
  end if;
end $$;

-- B) 若同時存在兩欄（曾手動新增 land_assessed_total）：合併後刪舊欄
do $$
begin
  if exists (
    select 1 from information_schema.columns
    where table_schema = 'public' and table_name = 'cases' and column_name = 'land_value_input'
  ) and exists (
    select 1 from information_schema.columns
    where table_schema = 'public' and table_name = 'cases' and column_name = 'land_assessed_total'
  ) then
    update public.cases
      set land_assessed_total = coalesce(land_assessed_total, land_value_input);
    alter table public.cases drop column land_value_input;
  end if;
end $$;

alter table public.cases drop column if exists land_value_unit;

alter table public.cases
  add column if not exists land_assessed_total numeric;

alter table public.cases
  add column if not exists nearby_new_house_price numeric;
