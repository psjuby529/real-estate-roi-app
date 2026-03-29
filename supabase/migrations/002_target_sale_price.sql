-- 新增轉賣「目標成交價」欄位，並自舊欄位複製（Supabase SQL Editor 執行）

alter table public.cases
  add column if not exists target_sale_price numeric;

update public.cases
set target_sale_price = expected_sell_price
where target_sale_price is null
  and expected_sell_price is not null;
