import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  formatFarPercentPoints,
  formatPct,
  formatPing,
  formatWan,
  formatWanPerPing,
  formatYuanPerMonth,
} from "@/lib/format";
import type { CaseRow } from "@/lib/types/case";

function Row({
  label,
  value,
}: {
  label: string;
  value: string | number | null | undefined;
}) {
  const display =
    value === null || value === undefined || value === ""
      ? "—"
      : typeof value === "number"
        ? value.toLocaleString("zh-TW")
        : String(value);
  return (
    <div className="flex flex-col gap-0.5 border-b border-border/50 py-2.5 last:border-0 sm:grid sm:grid-cols-[minmax(0,0.95fr)_minmax(0,1.05fr)] sm:items-baseline sm:gap-x-3 sm:gap-y-0 sm:py-2">
      <span className="shrink-0 text-xs leading-snug text-muted-foreground sm:text-sm">
        {label}
      </span>
      <span className="min-w-0 break-words text-sm font-medium leading-snug text-foreground sm:text-sm">
        {display}
      </span>
    </div>
  );
}

type RowExt = CaseRow & { land_value_input?: number | null };

function landTotalDisplay(row: RowExt): string {
  const v = row.land_assessed_total ?? row.land_value_input;
  if (v === null || v === undefined) return "—";
  return formatWan(v);
}

export function CaseDetailFields({ row }: { row: CaseRow }) {
  const r = row as RowExt;
  const boolLabel = (v: boolean | null | undefined) => (v ? "是" : "否");

  return (
    <div className="w-full min-w-0 space-y-3 sm:space-y-4">
      <Card className="w-full min-w-0 overflow-hidden shadow-sm">
        <CardHeader className="px-3 pt-3 sm:px-6 sm:pt-6">
          <CardTitle className="text-base">基本資料</CardTitle>
        </CardHeader>
        <CardContent className="space-y-0 px-3 pb-3 sm:px-6 sm:pb-4">
          <Row label="地址" value={row.address} />
          <Row label="房產類型" value={row.property_type} />
          <Row label="樓層" value={row.floor_info} />
          <Row label="開價（萬）" value={formatWan(row.ask_price ?? undefined)} />
          <Row label="底價（萬）" value={formatWan(row.floor_price ?? undefined)} />
          <Row label="目標價（萬）" value={formatWan(row.target_price)} />
          <Row label="建物坪數" value={formatPing(row.building_ping ?? undefined)} />
          <Row label="持分土地坪數" value={formatPing(row.land_ping ?? undefined)} />
          <Row label="土地公告現值總價（萬）" value={landTotalDisplay(r)} />
        </CardContent>
      </Card>

      <Card className="w-full min-w-0 overflow-hidden shadow-sm">
        <CardHeader className="px-3 pt-3 sm:px-6 sm:pt-6">
          <CardTitle className="text-base">投資類型</CardTitle>
        </CardHeader>
        <CardContent className="space-y-0 px-3 pb-3 sm:px-6 sm:pb-4">
          <Row label="收租" value={boolLabel(row.invest_rent)} />
          <Row label="都更" value={boolLabel(row.invest_urban_renewal)} />
          <Row label="轉賣" value={boolLabel(row.invest_flip)} />
        </CardContent>
      </Card>

      <Card className="w-full min-w-0 overflow-hidden shadow-sm">
        <CardHeader className="px-3 pt-3 sm:px-6 sm:pt-6">
          <CardTitle className="text-base">貸款資料</CardTitle>
        </CardHeader>
        <CardContent className="space-y-0 px-3 pb-3 sm:px-6 sm:pb-4">
          <Row label="貸款成數（比例）" value={formatPct(row.loan_ratio ?? undefined)} />
          <Row
            label="貸款金額（萬）"
            value={formatWan(row.loan_amount ?? undefined)}
          />
          <Row label="年利率（年化）" value={formatPct(row.interest_rate ?? undefined)} />
          <Row label="貸款總年限（年）" value={row.loan_years} />
          <Row label="只還息年數（年）" value={row.interest_only_years} />
        </CardContent>
      </Card>

      <Card className="w-full min-w-0 overflow-hidden shadow-sm">
        <CardHeader className="px-3 pt-3 sm:px-6 sm:pt-6">
          <CardTitle className="text-base">收租資料</CardTitle>
        </CardHeader>
        <CardContent className="space-y-0 px-3 pb-3 sm:px-6 sm:pb-4">
          <Row
            label="裝修投入（萬）"
            value={formatWan(row.renovation_cost ?? undefined)}
          />
          <Row
            label="保守租金（元/月）"
            value={formatYuanPerMonth(row.conservative_rent ?? undefined)}
          />
          <Row
            label="目標租金（元/月）"
            value={formatYuanPerMonth(row.target_rent ?? undefined)}
          />
          <Row
            label="其他前期雜費（萬）"
            value={formatWan(row.upfront_misc_cost ?? undefined)}
          />
          <Row
            label="年營運成本率（比例）"
            value={formatPct(row.operating_cost_rate ?? undefined)}
          />
        </CardContent>
      </Card>

      <Card className="w-full min-w-0 overflow-hidden shadow-sm">
        <CardHeader className="px-3 pt-3 sm:px-6 sm:pt-6">
          <CardTitle className="text-base">轉賣資料</CardTitle>
        </CardHeader>
        <CardContent className="space-y-0 px-3 pb-3 sm:px-6 sm:pb-4">
          <Row
            label="目標成交價（萬）"
            value={formatWan(
              row.target_sale_price ??
                (row as { expected_sell_price?: number | null })
                  .expected_sell_price ??
                undefined
            )}
          />
          <Row label="持有月數" value={row.hold_months} />
          <Row
            label="持有成本（萬）"
            value={formatWan(row.holding_cost ?? undefined)}
          />
          <Row
            label="銷售成本（萬）"
            value={formatWan(row.selling_cost ?? undefined)}
          />
        </CardContent>
      </Card>

      <Card className="w-full min-w-0 overflow-hidden shadow-sm">
        <CardHeader className="px-3 pt-3 sm:px-6 sm:pt-6">
          <CardTitle className="text-base">第一階段決策參考</CardTitle>
        </CardHeader>
        <CardContent className="space-y-0 px-3 pb-3 sm:px-6 sm:pb-4">
          <Row
            label="保守合理成交價（萬）"
            value={formatWan(row.conservative_market_value ?? undefined)}
          />
          <Row
            label="保守出場價（萬）"
            value={formatWan(row.conservative_exit_price ?? undefined)}
          />
        </CardContent>
      </Card>

      <Card className="w-full min-w-0 overflow-hidden shadow-sm">
        <CardHeader className="px-3 pt-3 sm:px-6 sm:pt-6">
          <CardTitle className="text-base">都更估算資料</CardTitle>
        </CardHeader>
        <CardContent className="space-y-0 px-3 pb-3 sm:px-6 sm:pb-4">
          <Row
            label="法定容積率（%）"
            value={formatFarPercentPoints(row.legal_far ?? undefined)}
          />
          <Row
            label="預估獎勵容積率（%）"
            value={formatFarPercentPoints(row.bonus_far ?? undefined)}
          />
          <Row
            label="周遭新房成交單價（萬/坪）"
            value={formatWanPerPing(row.nearby_new_house_price ?? undefined)}
          />
          <Row
            label="可分配效率（比例）"
            value={formatPct(row.alloc_efficiency ?? undefined)}
          />
          <Row
            label="共同負擔率（比例）"
            value={formatPct(row.common_burden_rate ?? undefined)}
          />
          <Row
            label="室內實得率（比例）"
            value={formatPct(row.interior_efficiency ?? undefined)}
          />
        </CardContent>
      </Card>

      <Card className="w-full min-w-0 overflow-hidden shadow-sm">
        <CardHeader className="px-3 pt-3 sm:px-6 sm:pt-6">
          <CardTitle className="text-base">備註</CardTitle>
        </CardHeader>
        <CardContent className="px-3 pb-4 sm:px-6 sm:pb-6">
          <p className="whitespace-pre-wrap text-sm leading-relaxed">
            {row.notes?.trim() ? row.notes : "—"}
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
