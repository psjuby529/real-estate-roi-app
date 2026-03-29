import type { CaseRow } from "@/lib/types/case";

function num(v: number | null | undefined): number | null {
  if (v === null || v === undefined || Number.isNaN(v)) return null;
  return v;
}

/**
 * 第一階段：可評定 S/A 前須補齊之最小欄位（缺一則資料未補齊，最高僅 B）。
 */
export function listMissingFieldsForSA(row: CaseRow): string[] {
  const missing: string[] = [];

  const tp = num(row.target_price);
  if (tp === null || tp <= 0) missing.push("目標價");

  const hasLoanTerms =
    row.loan_ratio != null ||
    (row.loan_amount != null && !Number.isNaN(Number(row.loan_amount)));
  if (!hasLoanTerms) missing.push("貸款成數或貸款金額（主要貸款條件）");

  const cr = num(row.conservative_rent);
  if (cr === null || cr <= 0) missing.push("保守租金（元/月）");

  if (row.renovation_cost === null || row.renovation_cost === undefined) {
    missing.push("裝修投入（萬）");
  }

  const cmv = num(row.conservative_market_value);
  if (cmv === null || cmv <= 0) missing.push("保守合理成交價（萬）");

  const cex = num(row.conservative_exit_price);
  if (cex === null || cex <= 0) missing.push("保守出場價（萬）");

  return missing;
}

export function isDataCompleteForSA(row: CaseRow): boolean {
  return listMissingFieldsForSA(row).length === 0;
}
