export type PropertyType = "電梯" | "公寓" | "透天" | "土地";

/** 金額欄位皆為「萬」；保守／目標租金為「元/月」 */
export interface CaseRow {
  id: string;
  address: string;
  property_type: string;
  floor_info: string | null;
  ask_price: number | null;
  floor_price: number | null;
  target_price: number;
  building_ping: number | null;
  land_ping: number | null;
  /** 土地公告現值總價（萬），直接輸入總額 */
  land_assessed_total: number | null;
  invest_rent: boolean | null;
  invest_urban_renewal: boolean | null;
  invest_flip: boolean | null;
  loan_ratio: number | null;
  loan_amount: number | null;
  interest_rate: number | null;
  loan_years: number | null;
  interest_only_years: number | null;
  renovation_cost: number | null;
  conservative_rent: number | null;
  target_rent: number | null;
  upfront_misc_cost: number | null;
  operating_cost_rate: number | null;
  legal_far: number | null;
  bonus_far: number | null;
  alloc_efficiency: number | null;
  common_burden_rate: number | null;
  interior_efficiency: number | null;
  /** 周遭新房成交單價（萬/坪） */
  nearby_new_house_price: number | null;
  /** 轉賣目標成交價（萬）；舊資料可僅有 expected_sell_price */
  target_sale_price: number | null;
  /** @deprecated 相容舊列；試算以 target_sale_price 為主 */
  expected_sell_price: number | null;
  hold_months: number | null;
  holding_cost: number | null;
  selling_cost: number | null;
  notes: string | null;
  created_by: string | null;
  created_at: string;
  updated_at: string;
}
