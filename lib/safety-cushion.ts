import {
  flipTotalInWithExitPriceWan,
  loanAmount,
  num,
  rentScenarios,
  selfCapital,
  totalAcquisitionCostWan,
  type RentScenarioResult,
} from "@/lib/calculations";
import type { CaseRow } from "@/lib/types/case";

/** 攤還期自償：正自償 / 臨界 / 負自償 */
export type SelfSufficiencyLevel = "positive" | "marginal" | "negative";

const RATIO_POS = 1.02;
const RATIO_MARGINAL_LOW = 0.98;

/**
 * 自償能力 = 年淨租金 ÷ 年債務支出（與既有 rentScenarios 分子分母一致，不重算模型）。
 */
export function selfSufficiencyRatio(
  amortizing: RentScenarioResult
): number | null {
  const debt = amortizing.yearDebtServiceWan;
  if (debt <= 0) return null;
  return amortizing.yearNetRentWan / debt;
}

export function selfSufficiencyLevel(
  ratio: number | null
): SelfSufficiencyLevel | null {
  if (ratio === null) return null;
  if (ratio >= RATIO_POS) return "positive";
  if (ratio >= RATIO_MARGINAL_LOW) return "marginal";
  return "negative";
}

export function selfSufficiencyLabelZh(level: SelfSufficiencyLevel | null): string {
  if (level === "positive") return "正自償";
  if (level === "marginal") return "臨界";
  if (level === "negative") return "負自償";
  return "—";
}

export type SafetySummaryLevel = "強" | "中" | "弱";

export interface SafetyCushionSnapshot {
  /** 攤還期保守年現金流（萬） */
  amortizingConservativeCashFlowWan: number;
  yearNetRentWan: number;
  yearDebtServiceWan: number;
  selfSufficiencyRatio: number | null;
  selfSufficiencyLevel: SelfSufficiencyLevel | null;
  totalAcquisitionWan: number;
  /** 保守合理成交價（萬），缺則 null */
  conservativeMarketWan: number | null;
  /** 買入安全墊 = (保守合理成交價 − 總取得成本) ÷ 保守合理成交價 */
  buyMarginPct: number | null;
  /** 保守出場價（萬） */
  conservativeExitWan: number | null;
  totalInAtExitWan: number | null;
  /** 出場安全墊 = (保守出場價 − 總投入) ÷ 保守出場價 */
  exitMarginPct: number | null;
  safetySummary: SafetySummaryLevel;
}

function computeSafetySummary(
  level: SelfSufficiencyLevel | null,
  buyMarginPct: number | null,
  exitMarginPct: number | null
): SafetySummaryLevel {
  let score = 0;
  if (level === "positive") score += 1;
  if (buyMarginPct !== null && buyMarginPct >= 0.05) score += 1;
  if (exitMarginPct !== null && exitMarginPct >= 0.05) score += 1;

  if (buyMarginPct !== null && buyMarginPct < 0) return "弱";
  if (exitMarginPct !== null && exitMarginPct < -0.02) return "弱";
  if (level === "negative") return "弱";

  if (score >= 3) return "強";
  if (score >= 1) return "中";
  return "弱";
}

/** 第一階段安全墊：沿用既有試算與轉賣總投入結構，不重寫模型。 */
export function computeSafetyCushion(row: CaseRow): SafetyCushionSnapshot {
  const monthly = num(row.conservative_rent, 0);
  const { amortizing } = rentScenarios(row, monthly);
  const ratio = selfSufficiencyRatio(amortizing);
  const ssLevel = selfSufficiencyLevel(ratio);

  const totalAcq = totalAcquisitionCostWan(row);
  const market = num(row.conservative_market_value);
  let buyMarginPct: number | null = null;
  if (market !== null && market > 0) {
    buyMarginPct = (market - totalAcq) / market;
  }

  const exitP = num(row.conservative_exit_price);
  let totalInAtExit: number | null = null;
  let exitMarginPct: number | null = null;
  if (exitP !== null && exitP > 0) {
    totalInAtExit = flipTotalInWithExitPriceWan(row, exitP);
    exitMarginPct = (exitP - totalInAtExit) / exitP;
  }

  const safetySummary = computeSafetySummary(ssLevel, buyMarginPct, exitMarginPct);

  return {
    amortizingConservativeCashFlowWan: amortizing.yearCashFlowWan,
    yearNetRentWan: amortizing.yearNetRentWan,
    yearDebtServiceWan: amortizing.yearDebtServiceWan,
    selfSufficiencyRatio: ratio,
    selfSufficiencyLevel: ssLevel,
    totalAcquisitionWan: totalAcq,
    conservativeMarketWan: market,
    buyMarginPct,
    conservativeExitWan: exitP,
    totalInAtExitWan: totalInAtExit,
    exitMarginPct,
    safetySummary,
  };
}

/** 供評級與說明：自備、貸款（與既有定義一致） */
export function selfAndLoanWan(row: CaseRow): { selfWan: number; loanWan: number } {
  return { selfWan: selfCapital(row), loanWan: loanAmount(row) };
}
