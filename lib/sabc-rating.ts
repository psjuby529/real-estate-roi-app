import { isDataCompleteForSA, listMissingFieldsForSA } from "@/lib/data-completeness";
import { computeSafetyCushion } from "@/lib/safety-cushion";
import type { SelfSufficiencyLevel } from "@/lib/safety-cushion";
import type { CaseRow } from "@/lib/types/case";

export type SabcGrade = "S" | "A" | "B" | "C";

export interface SabcRatingResult {
  grade: SabcGrade;
  /** 資料是否已達 S/A 評定門檻 */
  dataCompleteForSA: boolean;
  missingFields: string[];
  /** 給 UI 的簡短理由 */
  gradeReasons: string[];
  /** 若要升級（補資料或改善指標） */
  upgradeHints: string[];
  /** 降級或維持較低等級的主要風險 */
  downgradeRisks: string[];
}

const THRESHOLD_AM_CASH_BAD = -5;
const THRESHOLD_BUY_BAD = 0;
const THRESHOLD_EXIT_BAD = -0.05;

function isWeakMetrics(
  amortCash: number,
  buyMarginPct: number | null,
  exitMarginPct: number | null,
  ssLevel: SelfSufficiencyLevel | null
): boolean {
  if (amortCash < THRESHOLD_AM_CASH_BAD) return true;
  if (buyMarginPct !== null && buyMarginPct < THRESHOLD_BUY_BAD) return true;
  if (exitMarginPct !== null && exitMarginPct < THRESHOLD_EXIT_BAD) return true;
  if (ssLevel === "negative") return true;
  return false;
}

function gradeWhenIncomplete(row: CaseRow): SabcGrade {
  const snap = computeSafetyCushion(row);
  if (
    isWeakMetrics(
      snap.amortizingConservativeCashFlowWan,
      snap.buyMarginPct,
      snap.exitMarginPct,
      snap.selfSufficiencyLevel
    )
  ) {
    return "C";
  }
  return "B";
}

function gradeWhenComplete(row: CaseRow): SabcGrade {
  const snap = computeSafetyCushion(row);
  const ratio = snap.selfSufficiencyRatio;
  const buy = snap.buyMarginPct;
  const exit = snap.exitMarginPct;
  const amCash = snap.amortizingConservativeCashFlowWan;
  const ssLv = snap.selfSufficiencyLevel;

  if (
    amCash < THRESHOLD_AM_CASH_BAD ||
    (buy !== null && buy < THRESHOLD_BUY_BAD) ||
    (exit !== null && exit < THRESHOLD_EXIT_BAD) ||
    ssLv === "negative"
  ) {
    return "C";
  }

  const sCandidate =
    ratio !== null &&
    ratio >= 1.08 &&
    buy !== null &&
    buy >= 0.1 &&
    exit !== null &&
    exit >= 0.1 &&
    amCash > 2 &&
    ssLv === "positive";

  if (sCandidate) return "S";

  const aCandidate =
    ratio !== null &&
    ratio >= 1.0 &&
    buy !== null &&
    buy >= 0.03 &&
    exit !== null &&
    exit >= 0.03 &&
    amCash >= 0 &&
    (ssLv === "positive" || ssLv === "marginal");

  if (aCandidate) return "A";

  return "B";
}

/**
 * 第一階段 SABC：規則集中於此，不寫死在畫面。
 * 資料未補齊時最高僅 B（弱數據可至 C）。
 */
export function computeSabcRating(row: CaseRow): SabcRatingResult {
  const complete = isDataCompleteForSA(row);
  const missingFields = listMissingFieldsForSA(row);
  const snap = computeSafetyCushion(row);

  const grade: SabcGrade = complete
    ? gradeWhenComplete(row)
    : gradeWhenIncomplete(row);

  const gradeReasons: string[] = [];
  const upgradeHints: string[] = [];
  const downgradeRisks: string[] = [];

  if (!complete) {
    gradeReasons.push(
      "目前為階段性評估：資料未補齊，最高僅能評至 B（若指標偏弱則為 C）。"
    );
    upgradeHints.push(
      ...missingFields.map((f) => `請補齊：${f}`)
    );
  }

  if (grade === "S") {
    gradeReasons.push(
      "資料已補齊；攤還期保守現金流有餘裕、買入與出場安全墊皆厚、自償條件乾淨。"
    );
  } else if (grade === "A") {
    gradeReasons.push(
      "資料已補齊；攤還期可自償、買入與出場安全墊在合理範圍內。"
    );
  } else if (grade === "B") {
    gradeReasons.push(
      complete
        ? "條件尚可，但安全墊或現金流尚未達 A 級標準，或仍有情境待驗證。"
        : "初步可成立；待補齊資料後可重新評定。"
    );
    if (complete) {
      upgradeHints.push(
        "可嘗試提高保守租金假設的可信度、或降低取得成本以增厚買入安全墊。"
      );
    }
  } else {
    gradeReasons.push(
      "保守情境下現金流、買入或出場安全墊至少一項明顯偏弱。"
    );
    downgradeRisks.push(
      "攤還期年現金流過低、買入價高於合理成交、或出場價無法覆蓋總投入。"
    );
  }

  if (snap.selfSufficiencyLevel === "marginal" && grade !== "C") {
    downgradeRisks.push("自償能力接近臨界，利率或租金波動可能轉負。");
  }

  return {
    grade,
    dataCompleteForSA: complete,
    missingFields,
    gradeReasons,
    upgradeHints,
    downgradeRisks,
  };
}
