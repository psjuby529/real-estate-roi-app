import Link from "next/link";

import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { listCardMetrics } from "@/lib/calculations";
import { formatDate, formatPct, formatWan } from "@/lib/format";
import type { CaseRow } from "@/lib/types/case";

export function CaseCard({ row }: { row: CaseRow }) {
  const tags: string[] = [];
  if (row.invest_rent) tags.push("收租");
  if (row.invest_urban_renewal) tags.push("都更");
  if (row.invest_flip) tags.push("轉賣");

  const { yearCashFlowWan, yearCashYield } = listCardMetrics(row);

  return (
    <Link href={`/cases/${row.id}`} className="block transition hover:opacity-95">
      <Card className="h-full border-border/80 shadow-sm">
        <CardHeader className="space-y-1 pb-2">
          <CardTitle className="line-clamp-2 text-base leading-snug">
            {row.address}
          </CardTitle>
          <CardDescription className="flex flex-wrap items-center gap-2">
            <span>{row.property_type}</span>
            <span className="text-muted-foreground">·</span>
            <span>更新 {formatDate(row.updated_at)}</span>
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-3 text-sm">
          <div className="flex flex-wrap gap-1.5">
            {tags.length === 0 ? (
              <Badge variant="secondary">未標類型</Badge>
            ) : (
              tags.map((t) => (
                <Badge key={t} variant="secondary">
                  {t}
                </Badge>
              ))
            )}
          </div>
          <div className="grid grid-cols-2 gap-3 border-t border-border/60 pt-3">
            <div>
              <p className="text-xs text-muted-foreground">目標價（萬）</p>
              <p className="text-lg font-semibold tabular-nums text-foreground">
                {formatWan(row.target_price)}
              </p>
            </div>
            <div>
              <p className="text-xs text-muted-foreground">建物 / 土地坪</p>
              <p className="font-medium tabular-nums">
                {row.building_ping ?? "—"} / {row.land_ping ?? "—"}
              </p>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3 rounded-lg bg-muted/50 px-3 py-2.5">
            <div>
              <p className="text-xs text-muted-foreground">
                保守年現金流（萬）
              </p>
              <p
                className={`text-lg font-bold tabular-nums ${
                  yearCashFlowWan >= 0 ? "text-emerald-700" : "text-rose-700"
                }`}
              >
                {formatWan(yearCashFlowWan)}
              </p>
            </div>
            <div>
              <p className="text-xs text-muted-foreground">保守年現金投報率</p>
              <p className="text-lg font-bold tabular-nums text-primary">
                {formatPct(yearCashYield)}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}
