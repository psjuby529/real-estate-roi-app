import type { CaseRow } from "@/lib/types/case";

/**
 * 單位約定：
 * - 目標價、貸款、成本、售價等：萬
 * - 月租金：元/月 → 年毛租金（萬）= 月租金 × 12 ÷ 10000
 * - 年利息、年淨租金、年現金流、本息年還款：萬
 */

function num(v: number | null | undefined, fallback = 0): number {
  if (v === null || v === undefined || Number.isNaN(v)) return fallback;
  return v;
}

/** 月租金（元）→ 年毛租金（萬） */
export function annualGrossRentWan(monthlyRentYuan: number): number {
  return (monthlyRentYuan * 12) / 10000;
}

/** 貸款金額（萬）= 手動或 目標價×成數 */
export function loanAmount(caseRow: CaseRow): number {
  const manual = caseRow.loan_amount;
  if (manual !== null && manual !== undefined && !Number.isNaN(manual)) {
    return manual;
  }
  const ratio = num(caseRow.loan_ratio, 0.7);
  return num(caseRow.target_price) * ratio;
}

/** 自備金額（萬） */
export function selfCapital(caseRow: CaseRow): number {
  const loan = loanAmount(caseRow);
  return (
    num(caseRow.target_price) +
    num(caseRow.renovation_cost) +
    num(caseRow.upfront_misc_cost) -
    loan
  );
}

export type RentPhase = "interest_only" | "amortizing";

export interface RentScenarioResult {
  phase: RentPhase;
  label: string;
  /** 年現金流（萬） */
  yearCashFlowWan: number;
  yearCashYield: number;
}

function monthlyPaymentWan(
  principalWan: number,
  annualRate: number,
  months: number
): number {
  if (months <= 0 || principalWan <= 0) return 0;
  const r = annualRate / 12;
  if (r === 0) return principalWan / months;
  const pow = Math.pow(1 + r, months);
  return (principalWan * r * pow) / (pow - 1);
}

export function rentScenarios(
  caseRow: CaseRow,
  monthlyRentYuan: number
): { interestOnly: RentScenarioResult; amortizing: RentScenarioResult } {
  const loanWan = loanAmount(caseRow);
  const rate = num(caseRow.interest_rate, 0.02086);
  const selfWan = selfCapital(caseRow);
  const opRate = num(caseRow.operating_cost_rate, 0.1);

  const yearGrossWan = annualGrossRentWan(monthlyRentYuan);
  const yearOpWan = yearGrossWan * opRate;
  const yearNetWan = yearGrossWan - yearOpWan;

  const yearInterestWan = loanWan * rate;

  const ioCashWan = yearNetWan - yearInterestWan;
  const ioYield = selfWan !== 0 ? ioCashWan / selfWan : 0;

  const loanYears = Math.max(0, Math.floor(num(caseRow.loan_years, 30)));
  const ioYears = Math.max(0, Math.floor(num(caseRow.interest_only_years, 0)));
  const amortMonths = Math.max(0, (loanYears - ioYears) * 12);
  const pmtWan = monthlyPaymentWan(loanWan, rate, amortMonths);
  const yearDebtWan = pmtWan * 12;
  const amCashWan = yearNetWan - yearDebtWan;
  const amYield = selfWan !== 0 ? amCashWan / selfWan : 0;

  return {
    interestOnly: {
      phase: "interest_only",
      label: "寬限期內（只還息）",
      yearCashFlowWan: ioCashWan,
      yearCashYield: ioYield,
    },
    amortizing: {
      phase: "amortizing",
      label: "開始還本後（本息攤還）",
      yearCashFlowWan: amCashWan,
      yearCashYield: amYield,
    },
  };
}

export function flipResults(caseRow: CaseRow) {
  const selfWan = selfCapital(caseRow);
  const totalInWan =
    num(caseRow.target_price) +
    num(caseRow.renovation_cost) +
    num(caseRow.upfront_misc_cost) +
    num(caseRow.holding_cost) +
    num(caseRow.selling_cost);
  const sellWan = num(caseRow.expected_sell_price);
  const profitWan = sellWan - totalInWan;
  const totalRoi = selfWan !== 0 ? profitWan / selfWan : 0;
  const months = caseRow.hold_months;
  let annualized: number | null = null;
  if (months && months > 0 && selfWan !== 0) {
    annualized = Math.pow(1 + totalRoi, 12 / months) - 1;
  }
  return { totalInWan, profitWan, totalRoi, annualized };
}

export function urbanRenewalEstimates(caseRow: CaseRow) {
  const legal = num(caseRow.legal_far);
  const bonus = num(caseRow.bonus_far);
  const vol = (legal + bonus) / 100;
  const landPing = num(caseRow.land_ping);
  const alloc = num(caseRow.alloc_efficiency, 0.75);
  const burden = num(caseRow.common_burden_rate, 0.35);
  const interior = num(caseRow.interior_efficiency, 0.7);
  const nearbyWanPerPing = caseRow.nearby_new_house_price;
  const targetWan = num(caseRow.target_price);

  const estimatedBuildingPing = landPing * vol * alloc * (1 - burden);
  const estimatedInteriorPing = estimatedBuildingPing * interior;

  let estimatedMarketValueWan: number | null = null;
  let urbanBookDiffWan: number | null = null;
  let urbanReturnMultiple: number | null = null;

  if (
    nearbyWanPerPing !== null &&
    nearbyWanPerPing !== undefined &&
    !Number.isNaN(nearbyWanPerPing)
  ) {
    estimatedMarketValueWan = estimatedBuildingPing * nearbyWanPerPing;
    urbanBookDiffWan = estimatedMarketValueWan - targetWan;
    urbanReturnMultiple =
      targetWan !== 0 ? estimatedMarketValueWan / targetWan : null;
  }

  return {
    volumeMultiplier: vol,
    estimatedBuildingPing,
    estimatedInteriorPing,
    estimatedMarketValueWan,
    urbanBookDiffWan,
    urbanReturnMultiple,
  };
}

/** 列表卡片：保守租金 × 還本後，年現金流（萬） */
export function listCardMetrics(caseRow: CaseRow) {
  const monthly = num(caseRow.conservative_rent);
  const { amortizing } = rentScenarios(caseRow, monthly);
  return {
    yearCashFlowWan: amortizing.yearCashFlowWan,
    yearCashYield: amortizing.yearCashYield,
  };
}
