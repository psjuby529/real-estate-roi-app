-- 第一階段決策：保守成交價／保守出場價（可為 NULL，舊列相容）
alter table cases add column if not exists conservative_market_value numeric;
alter table cases add column if not exists conservative_exit_price numeric;
