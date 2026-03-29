"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import {
  flipResults,
  loanAmount,
  rentScenarios,
  selfCapital,
  urbanRenewalEstimates,
} from "@/lib/calculations";
import {
  formatFarPercentPoints,
  formatPct,
  formatPing,
  formatWan,
  formatWanPerPing,
} from "@/lib/format";
import type { CaseRow } from "@/lib/types/case";

export type CalculationSection = "rent" | "flip" | "urban" | "all";

function Metric({
  label,
  value,
  accent,
  hint,
}: {
  label: string;
  value: string;
  accent?: "pos" | "neg" | "neutral";
  hint?: string;
}) {
  const cls =
    accent === "pos"
      ? "text-emerald-700"
      : accent === "neg"
        ? "text-rose-700"
        : "text-foreground";
  return (
    <div className="space-y-1">
      <p className="text-xs text-muted-foreground">{label}</p>
      <p className={`text-xl font-bold tabular-nums sm:text-2xl ${cls}`}>
        {value}
      </p>
      {hint ? (
        <p className="text-[10px] leading-snug text-muted-foreground">{hint}</p>
      ) : null}
    </div>
  );
}

export function CalculationPanels({
  row,
  section = "all",
}: {
  row: CaseRow;
  section?: CalculationSection;
}) {
  const show = (s: Exclude<CalculationSection, "all">) =>
    section === "all" || section === s;

  const selfWan = selfCapital(row);
  const loanWan = loanAmount(row);
  const conservative = rentScenarios(row, row.conservative_rent ?? 0);
  const target = rentScenarios(row, row.target_rent ?? 0);
  const flip = flipResults(row);
  const urban = urbanRenewalEstimates(row);
  const landTotalWan = row.land_assessed_total;

  return (
    <div className="flex min-h-[280px] flex-col gap-4">
      {show("rent") ? (
      <Card className="border-emerald-200/80 bg-gradient-to-br from-emerald-50/80 to-background">
        <CardHeader>
          <CardTitle className="text-lg">收租試算</CardTitle>
          <CardDescription>
            金額單位：萬（年毛租金由「元/月」換算）；自備 {formatWan(selfWan)} ·
            貸款 {formatWan(loanWan)}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div>
            <h4 className="mb-3 text-sm font-semibold text-emerald-900">
              保守租金（元/月）
            </h4>
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="rounded-lg border bg-background/80 p-4">
                <p className="mb-2 text-xs font-medium text-muted-foreground">
                  {conservative.interestOnly.label}
                </p>
                <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
                  <Metric
                    label="年現金流（萬）"
                    value={formatWan(conservative.interestOnly.yearCashFlowWan)}
                    accent={
                      conservative.interestOnly.yearCashFlowWan >= 0
                        ? "pos"
                        : "neg"
                    }
                  />
                  <Metric
                    label="當年償還本金（萬）"
                    value={formatWan(
                      conservative.interestOnly.yearPrincipalRepaidWan
                    )}
                  />
                  <Metric
                    label="年總收益（萬）"
                    value={formatWan(
                      conservative.interestOnly.yearTotalReturnWan
                    )}
                    accent={
                      conservative.interestOnly.yearTotalReturnWan >= 0
                        ? "pos"
                        : "neg"
                    }
                  />
                  <Metric
                    label="年投報率"
                    value={formatPct(conservative.interestOnly.yearReturnYield)}
                    hint="含現金流 + 當年償還本金"
                  />
                </div>
              </div>
              <div className="rounded-lg border bg-background/80 p-4">
                <p className="mb-2 text-xs font-medium text-muted-foreground">
                  {conservative.amortizing.label}
                </p>
                <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
                  <Metric
                    label="年現金流（萬）"
                    value={formatWan(conservative.amortizing.yearCashFlowWan)}
                    accent={
                      conservative.amortizing.yearCashFlowWan >= 0
                        ? "pos"
                        : "neg"
                    }
                  />
                  <Metric
                    label="當年償還本金（萬）"
                    value={formatWan(
                      conservative.amortizing.yearPrincipalRepaidWan
                    )}
                  />
                  <Metric
                    label="年總收益（萬）"
                    value={formatWan(conservative.amortizing.yearTotalReturnWan)}
                    accent={
                      conservative.amortizing.yearTotalReturnWan >= 0
                        ? "pos"
                        : "neg"
                    }
                  />
                  <Metric
                    label="年投報率"
                    value={formatPct(conservative.amortizing.yearReturnYield)}
                    hint="含現金流 + 當年償還本金"
                  />
                </div>
              </div>
            </div>
          </div>
          <Separator />
          <div>
            <h4 className="mb-3 text-sm font-semibold text-emerald-900">
              目標租金（元/月）
            </h4>
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="rounded-lg border bg-background/80 p-4">
                <p className="mb-2 text-xs font-medium text-muted-foreground">
                  {target.interestOnly.label}
                </p>
                <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
                  <Metric
                    label="年現金流（萬）"
                    value={formatWan(target.interestOnly.yearCashFlowWan)}
                    accent={
                      target.interestOnly.yearCashFlowWan >= 0 ? "pos" : "neg"
                    }
                  />
                  <Metric
                    label="當年償還本金（萬）"
                    value={formatWan(target.interestOnly.yearPrincipalRepaidWan)}
                  />
                  <Metric
                    label="年總收益（萬）"
                    value={formatWan(target.interestOnly.yearTotalReturnWan)}
                    accent={
                      target.interestOnly.yearTotalReturnWan >= 0
                        ? "pos"
                        : "neg"
                    }
                  />
                  <Metric
                    label="年投報率"
                    value={formatPct(target.interestOnly.yearReturnYield)}
                    hint="含現金流 + 當年償還本金"
                  />
                </div>
              </div>
              <div className="rounded-lg border bg-background/80 p-4">
                <p className="mb-2 text-xs font-medium text-muted-foreground">
                  {target.amortizing.label}
                </p>
                <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
                  <Metric
                    label="年現金流（萬）"
                    value={formatWan(target.amortizing.yearCashFlowWan)}
                    accent={
                      target.amortizing.yearCashFlowWan >= 0 ? "pos" : "neg"
                    }
                  />
                  <Metric
                    label="當年償還本金（萬）"
                    value={formatWan(target.amortizing.yearPrincipalRepaidWan)}
                  />
                  <Metric
                    label="年總收益（萬）"
                    value={formatWan(target.amortizing.yearTotalReturnWan)}
                    accent={
                      target.amortizing.yearTotalReturnWan >= 0
                        ? "pos"
                        : "neg"
                    }
                  />
                  <Metric
                    label="年投報率"
                    value={formatPct(target.amortizing.yearReturnYield)}
                    hint="含現金流 + 當年償還本金"
                  />
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
      ) : null}

      {show("flip") ? (
      <Card className="border-sky-200/80 bg-gradient-to-br from-sky-50/80 to-background">
        <CardHeader>
          <CardTitle className="text-lg">轉賣試算</CardTitle>
          <CardDescription>
            金額單位：萬；買方交易成本 = 目標價×2.5%；賣方 = 目標成交價×4.5%；自備為分母
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            <Metric
              label="買方交易成本（萬）"
              value={formatWan(flip.buyerCostWan)}
            />
            <Metric
              label="賣方交易成本（萬）"
              value={formatWan(flip.sellerCostWan)}
            />
            <Metric
              label="轉賣總投入（萬）"
              value={formatWan(flip.totalInWan)}
            />
            <Metric
              label="預估獲利（萬）"
              value={formatWan(flip.profitWan)}
              accent={flip.profitWan >= 0 ? "pos" : "neg"}
            />
            <Metric label="總投報率" value={formatPct(flip.totalRoi)} />
            <Metric
              label="年化投報率"
              value={
                flip.annualized === null ? "—" : formatPct(flip.annualized)
              }
            />
          </div>
        </CardContent>
      </Card>
      ) : null}

      {show("urban") ? (
      <Card className="border-amber-200/80 bg-gradient-to-br from-amber-50/80 to-background">
        <CardHeader>
          <CardTitle className="text-lg">都更試算</CardTitle>
          <CardDescription>
            坪數與分回市值；土地公告現值為表單直接輸入之總價（萬）
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div>
            <p className="mb-2 text-xs font-medium text-muted-foreground">
              分回坪數
            </p>
            <div className="grid gap-4 sm:grid-cols-2">
              <Metric
                label="預估可分回產權建坪"
                value={formatPing(urban.estimatedBuildingPing)}
              />
              <Metric
                label="預估室內實得坪數"
                value={formatPing(urban.estimatedInteriorPing)}
              />
            </div>
          </div>
          <Separator />
          <div>
            <p className="mb-2 text-xs font-medium text-muted-foreground">
              分回市值與報酬（依周遭新房成交單價 萬/坪）
            </p>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              <Metric
                label="周遭新房成交單價"
                value={formatWanPerPing(row.nearby_new_house_price ?? undefined)}
              />
              <Metric
                label="預估分回房產市值（萬）"
                value={formatWan(urban.estimatedMarketValueWan ?? undefined)}
              />
              <Metric
                label="都更帳面價差（萬）"
                value={formatWan(urban.urbanBookDiffWan ?? undefined)}
                accent={
                  (urban.urbanBookDiffWan ?? 0) >= 0 ? "pos" : "neg"
                }
              />
              <Metric
                label="都更報酬率（%）"
                value={formatFarPercentPoints(
                  urban.urbanReturnRatePercent ?? undefined
                )}
              />
            </div>
          </div>
          <Separator />
          <div>
            <p className="mb-2 text-xs font-medium text-muted-foreground">
              土地公告現值（表單輸入）
            </p>
            <Metric
              label="土地公告現值總價（萬）"
              value={formatWan(landTotalWan ?? undefined)}
            />
          </div>
        </CardContent>
      </Card>
      ) : null}
    </div>
  );
}
