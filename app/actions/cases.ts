"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

import { createSupabaseServerClient } from "@/lib/supabase/server";

function parseNum(formData: FormData, key: string): number | null {
  const v = formData.get(key);
  if (v === null || v === "") return null;
  const n = Number(v);
  return Number.isFinite(n) ? n : null;
}

function parseIntOrNull(formData: FormData, key: string): number | null {
  const v = formData.get(key);
  if (v === null || v === "") return null;
  const n = parseInt(String(v), 10);
  return Number.isFinite(n) ? n : null;
}

function parseBool(formData: FormData, key: string): boolean {
  const v = formData.get(key);
  return v === "on" || v === "true" || v === "1";
}

function parseString(formData: FormData, key: string): string | null {
  const v = formData.get(key);
  if (v === null) return null;
  const s = String(v).trim();
  return s === "" ? null : s;
}

function buildPayload(formData: FormData) {
  return {
    address: String(formData.get("address") ?? "").trim(),
    property_type: String(formData.get("property_type") ?? "").trim(),
    floor_info: parseString(formData, "floor_info"),
    ask_price: parseNum(formData, "ask_price"),
    floor_price: parseNum(formData, "floor_price"),
    target_price: parseNum(formData, "target_price"),
    building_ping: parseNum(formData, "building_ping"),
    land_ping: parseNum(formData, "land_ping"),
    land_assessed_total: parseNum(formData, "land_assessed_total"),
    invest_rent: parseBool(formData, "invest_rent"),
    invest_urban_renewal: parseBool(formData, "invest_urban_renewal"),
    invest_flip: parseBool(formData, "invest_flip"),
    loan_ratio: parseNum(formData, "loan_ratio"),
    loan_amount: parseNum(formData, "loan_amount"),
    interest_rate: parseNum(formData, "interest_rate"),
    loan_years: parseIntOrNull(formData, "loan_years"),
    interest_only_years: parseIntOrNull(formData, "interest_only_years"),
    renovation_cost: parseNum(formData, "renovation_cost"),
    conservative_rent: parseNum(formData, "conservative_rent"),
    target_rent: parseNum(formData, "target_rent"),
    upfront_misc_cost: parseNum(formData, "upfront_misc_cost"),
    operating_cost_rate: parseNum(formData, "operating_cost_rate"),
    legal_far: parseNum(formData, "legal_far"),
    bonus_far: parseNum(formData, "bonus_far"),
    alloc_efficiency: parseNum(formData, "alloc_efficiency"),
    common_burden_rate: parseNum(formData, "common_burden_rate"),
    interior_efficiency: parseNum(formData, "interior_efficiency"),
    nearby_new_house_price: parseNum(formData, "nearby_new_house_price"),
    expected_sell_price: parseNum(formData, "expected_sell_price"),
    hold_months: parseIntOrNull(formData, "hold_months"),
    holding_cost: parseNum(formData, "holding_cost"),
    selling_cost: parseNum(formData, "selling_cost"),
    notes: parseString(formData, "notes"),
    created_by: parseString(formData, "created_by"),
  };
}

export async function createCase(formData: FormData) {
  const payload = buildPayload(formData);
  if (!payload.address) throw new Error("請填寫地址");
  if (!payload.property_type) throw new Error("請選擇房產類型");
  if (payload.target_price === null)
    throw new Error("請填寫目標價（萬）");

  const supabase = createSupabaseServerClient();
  const { data, error } = await supabase
    .from("cases")
    .insert({
      ...payload,
      target_price: payload.target_price,
    })
    .select("id")
    .single();

  if (error) {
    console.error(error);
    throw new Error(error.message ?? "建立失敗");
  }

  revalidatePath("/");
  redirect(`/cases/${data.id}`);
}

export async function updateCase(id: string, formData: FormData) {
  const payload = buildPayload(formData);
  if (!payload.address) throw new Error("請填寫地址");
  if (!payload.property_type) throw new Error("請選擇房產類型");
  if (payload.target_price === null)
    throw new Error("請填寫目標價（萬）");

  const supabase = createSupabaseServerClient();
  const { error } = await supabase
    .from("cases")
    .update({
      ...payload,
      target_price: payload.target_price,
      updated_at: new Date().toISOString(),
    })
    .eq("id", id);

  if (error) {
    console.error(error);
    throw new Error(error.message ?? "更新失敗");
  }

  revalidatePath("/");
  revalidatePath(`/cases/${id}`);
  redirect(`/cases/${id}`);
}
