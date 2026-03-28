import Link from "next/link";
import { notFound } from "next/navigation";

import { CalculationPanels } from "@/components/calculation-panels";
import { buttonVariants } from "@/lib/button-variants";
import {
  formatDate,
  formatFarPercentPoints,
  formatPct,
  formatPing,
  formatWan,
  formatWanPerPing,
  formatYuanPerMonth,
} from "@/lib/format";
import { cn } from "@/lib/utils";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import type { CaseRow } from "@/lib/types/case";
import { Pencil } from "lucide-react";

export const dynamic = "force-dynamic";

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
    <div className="grid grid-cols-[minmax(0,1fr)_minmax(0,1.2fr)] gap-2 border-b border-border/50 py-2 text-sm last:border-0">
      <span className="text-muted-foreground">{label}</span>
      <span className="font-medium break-words">{display}</span>
    </div>
  );
}

type RowExt = CaseRow & { land_value_input?: number | null };

function landTotalDisplay(row: RowExt): string {
  const v = row.land_assessed_total ?? row.land_value_input;
  if (v === null || v === undefined) return "—";
  return formatWan(v);
}

export default async function CaseDetailPage({
  params,
}: {
  params: { id: string };
}) {
  let row: CaseRow | null = null;
  let err: string | null = null;

  try {
    const supabase = createSupabaseServerClient();
    const { data, error } = await supabase
      .from("cases")
      .select("*")
      .eq("id", params.id)
      .maybeSingle();

    if (error) err = error.message;
    else row = data as CaseRow | null;
  } catch (e) {
    err = e instanceof Error ? e.message : "讀取失敗";
  }

  if (err) {
    return (
      <div className="rounded-lg border border-destructive/40 bg-destructive/5 px-4 py-3 text-sm text-destructive">
        {err}
      </div>
    );
  }

  if (!row) notFound();

  const r = row as RowExt;

  const boolLabel = (v: boolean | null | undefined) =>
    v ? "是" : "否";

  return (
    <div className="space-y-6 pb-16">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div className="space-y-1">
          <h1 className="text-2xl font-bold leading-snug">{row.address}</h1>
          <p className="text-sm text-muted-foreground">
            更新 {formatDate(row.updated_at)}
          </p>
        </div>
        <Link
          href={`/cases/${row.id}/edit`}
          className={cn(
            buttonVariants({ variant: "secondary" }),
            "inline-flex shrink-0 gap-1"
          )}
        >
          <Pencil className="size-4" />
          編輯
        </Link>
      </div>

      <CalculationPanels row={row} />

      <Card>
        <CardHeader>
          <CardTitle className="text-base">基本資料</CardTitle>
        </CardHeader>
        <CardContent className="space-y-0">
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

      <Card>
        <CardHeader>
          <CardTitle className="text-base">投資類型</CardTitle>
        </CardHeader>
        <CardContent className="space-y-0">
          <Row label="收租" value={boolLabel(row.invest_rent)} />
          <Row label="都更" value={boolLabel(row.invest_urban_renewal)} />
          <Row label="轉賣" value={boolLabel(row.invest_flip)} />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">貸款資料</CardTitle>
        </CardHeader>
        <CardContent className="space-y-0">
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

      <Card>
        <CardHeader>
          <CardTitle className="text-base">收租資料</CardTitle>
        </CardHeader>
        <CardContent className="space-y-0">
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

      <Card>
        <CardHeader>
          <CardTitle className="text-base">轉賣資料</CardTitle>
        </CardHeader>
        <CardContent className="space-y-0">
          <Row
            label="預估售價（萬）"
            value={formatWan(row.expected_sell_price ?? undefined)}
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

      <Card>
        <CardHeader>
          <CardTitle className="text-base">都更估算資料</CardTitle>
        </CardHeader>
        <CardContent className="space-y-0">
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

      <Card>
        <CardHeader>
          <CardTitle className="text-base">備註</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="whitespace-pre-wrap text-sm leading-relaxed">
            {row.notes?.trim() ? row.notes : "—"}
          </p>
        </CardContent>
      </Card>

      <Separator />

      <div className="flex justify-center">
        <Link href="/" className={cn(buttonVariants({ variant: "outline" }))}>
          回到列表
        </Link>
      </div>
    </div>
  );
}
