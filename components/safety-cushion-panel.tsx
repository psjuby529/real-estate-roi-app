import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { formatPct, formatWan } from "@/lib/format";
import { computeSafetyCushion, selfSufficiencyLabelZh } from "@/lib/safety-cushion";
import type { CaseRow } from "@/lib/types/case";

function pctOrDash(v: number | null | undefined): string {
  if (v === null || v === undefined || Number.isNaN(v)) return "—";
  return formatPct(v);
}

export function SafetyCushionPanel({ row }: { row: CaseRow }) {
  const snap = computeSafetyCushion(row);
  const ratio = snap.selfSufficiencyRatio;

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">第一階段安全墊分析</CardTitle>
          <CardDescription>
            指標沿用既有試算與轉賣總投入結構；買入／出場安全墊需手填保守價格。
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <section className="space-y-2">
            <h3 className="text-sm font-semibold">1. 資產自償能力（攤還期 · 保守租金）</h3>
            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4 text-sm">
              <div>
                <p className="text-xs text-muted-foreground">攤還期保守年現金流（萬）</p>
                <p className="text-lg font-semibold tabular-nums">
                  {formatWan(snap.amortizingConservativeCashFlowWan)}
                </p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground">年淨租金（萬）</p>
                <p className="font-medium tabular-nums">{formatWan(snap.yearNetRentWan)}</p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground">年債務支出（萬）</p>
                <p className="font-medium tabular-nums">{formatWan(snap.yearDebtServiceWan)}</p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground">自償能力（淨租金÷債務）</p>
                <p className="font-medium tabular-nums">
                  {ratio === null ? "—" : ratio.toFixed(3)}
                </p>
                <p className="text-xs text-muted-foreground">
                  狀態：{selfSufficiencyLabelZh(snap.selfSufficiencyLevel)}
                </p>
              </div>
            </div>
          </section>

          <Separator />

          <section className="space-y-2">
            <h3 className="text-sm font-semibold">2. 買入安全墊</h3>
            <div className="grid gap-3 sm:grid-cols-3 text-sm">
              <div>
                <p className="text-xs text-muted-foreground">保守合理成交價（萬）</p>
                <p className="font-medium tabular-nums">
                  {snap.conservativeMarketWan != null
                    ? formatWan(snap.conservativeMarketWan)
                    : "—"}
                </p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground">總取得成本（萬）</p>
                <p className="font-medium tabular-nums">{formatWan(snap.totalAcquisitionWan)}</p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground">買入安全墊</p>
                <p className="font-medium tabular-nums">{pctOrDash(snap.buyMarginPct)}</p>
              </div>
            </div>
          </section>

          <Separator />

          <section className="space-y-2">
            <h3 className="text-sm font-semibold">3. 出場安全墊（保守出場價）</h3>
            <p className="text-xs text-muted-foreground">
              總投入與轉賣試算相同結構，賣方成本以「保守出場價」×4.5% 計；與目標成交價欄位分開。
            </p>
            <div className="grid gap-3 sm:grid-cols-3 text-sm">
              <div>
                <p className="text-xs text-muted-foreground">保守出場價（萬）</p>
                <p className="font-medium tabular-nums">
                  {snap.conservativeExitWan != null
                    ? formatWan(snap.conservativeExitWan)
                    : "—"}
                </p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground">總投入（萬）</p>
                <p className="font-medium tabular-nums">
                  {snap.totalInAtExitWan != null
                    ? formatWan(snap.totalInAtExitWan)
                    : "—"}
                </p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground">出場安全墊</p>
                <p className="font-medium tabular-nums">{pctOrDash(snap.exitMarginPct)}</p>
              </div>
            </div>
          </section>

          <Separator />

          <div className="rounded-lg border bg-muted/40 px-4 py-3">
            <p className="text-xs font-medium text-muted-foreground">安全墊總結論（輕量規則）</p>
            <p className="text-2xl font-bold tracking-tight">{snap.safetySummary}</p>
            <p className="mt-1 text-xs text-muted-foreground">
              強：自償為正、買入與出場安全墊皆 ≥5%；中：至少一項達標且無明顯負安全墊；弱：買入或出場為負，或自償偏弱。
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
