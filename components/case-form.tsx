import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Textarea } from "@/components/ui/textarea";
import type { CaseRow } from "@/lib/types/case";

import { createCase, updateCase } from "@/app/actions/cases";

const inputClass =
  "flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50";

function numStr(v: number | null | undefined, empty = ""): string {
  if (v === null || v === undefined || Number.isNaN(v)) return empty;
  return String(v);
}

/** 遷移前舊欄位 land_value_input 相容 */
function landAssessedDefault(initial: CaseRow | null | undefined): string {
  if (!initial) return "";
  const legacy = initial as CaseRow & { land_value_input?: number | null };
  return numStr(initial.land_assessed_total ?? legacy.land_value_input);
}

type Mode = "create" | "edit";

export function CaseForm({
  mode,
  caseId,
  initial,
}: {
  mode: Mode;
  caseId?: string;
  initial?: CaseRow | null;
}) {
  const action =
    mode === "create" ? createCase : updateCase.bind(null, caseId!);

  return (
    <form action={action} className="mx-auto flex max-w-2xl flex-col gap-6 pb-24">
      <Card>
        <CardHeader>
          <CardTitle>基本資料</CardTitle>
          <CardDescription>
            價格與成本相關欄位單位為「萬」；租金相關為「元/月」
          </CardDescription>
        </CardHeader>
        <CardContent className="grid gap-4">
          <div className="grid gap-2">
            <Label htmlFor="address">地址 *</Label>
            <Input
              id="address"
              name="address"
              required
              defaultValue={initial?.address ?? ""}
              placeholder="例如：台北市大安區…"
            />
          </div>
          <div className="grid gap-2 sm:grid-cols-2 sm:gap-4">
            <div className="grid gap-2">
              <Label htmlFor="property_type">房產類型 *</Label>
              <select
                id="property_type"
                name="property_type"
                required
                defaultValue={initial?.property_type ?? "電梯"}
                className={inputClass}
              >
                {["電梯", "公寓", "透天", "土地"].map((t) => (
                  <option key={t} value={t}>
                    {t}
                  </option>
                ))}
              </select>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="floor_info">樓層</Label>
              <Input
                id="floor_info"
                name="floor_info"
                defaultValue={initial?.floor_info ?? ""}
                placeholder="例如：5F / 總樓高 7F"
              />
            </div>
          </div>
          <div className="grid gap-2 sm:grid-cols-3 sm:gap-3">
            <div className="grid gap-2">
              <Label htmlFor="ask_price">開價（萬）</Label>
              <Input
                id="ask_price"
                name="ask_price"
                type="number"
                step="any"
                defaultValue={numStr(initial?.ask_price)}
                placeholder="例如 1480"
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="floor_price">底價（萬）</Label>
              <Input
                id="floor_price"
                name="floor_price"
                type="number"
                step="any"
                defaultValue={numStr(initial?.floor_price)}
                placeholder="例如 1400"
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="target_price">目標價（萬） *</Label>
              <Input
                id="target_price"
                name="target_price"
                type="number"
                step="any"
                required
                defaultValue={numStr(initial?.target_price)}
                placeholder="例如 1380"
              />
            </div>
          </div>
          <div className="grid gap-2 sm:grid-cols-2 sm:gap-4">
            <div className="grid gap-2">
              <Label htmlFor="building_ping">建物坪數</Label>
              <Input
                id="building_ping"
                name="building_ping"
                type="number"
                step="any"
                defaultValue={numStr(initial?.building_ping)}
                placeholder="坪"
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="land_ping">持分土地坪數</Label>
              <Input
                id="land_ping"
                name="land_ping"
                type="number"
                step="any"
                defaultValue={numStr(initial?.land_ping)}
                placeholder="坪"
              />
            </div>
          </div>
          <div className="grid gap-2">
            <Label htmlFor="land_assessed_total">土地公告現值總價（萬）</Label>
            <Input
              id="land_assessed_total"
              name="land_assessed_total"
              type="number"
              step="any"
              defaultValue={landAssessedDefault(initial)}
              placeholder="直接輸入公告現值總額，例如 850"
            />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>投資類型</CardTitle>
          <CardDescription>可複選</CardDescription>
        </CardHeader>
        <CardContent className="flex flex-wrap gap-6">
          <label className="flex items-center gap-2 text-sm">
            <input
              type="checkbox"
              name="invest_rent"
              defaultChecked={initial?.invest_rent ?? false}
              className="size-4 rounded border-input"
            />
            收租
          </label>
          <label className="flex items-center gap-2 text-sm">
            <input
              type="checkbox"
              name="invest_urban_renewal"
              defaultChecked={initial?.invest_urban_renewal ?? false}
              className="size-4 rounded border-input"
            />
            都更
          </label>
          <label className="flex items-center gap-2 text-sm">
            <input
              type="checkbox"
              name="invest_flip"
              defaultChecked={initial?.invest_flip ?? false}
              className="size-4 rounded border-input"
            />
            轉賣
          </label>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>貸款資料</CardTitle>
          <CardDescription>貸款金額單位：萬</CardDescription>
        </CardHeader>
        <CardContent className="grid gap-4 sm:grid-cols-2">
          <div className="grid gap-2 sm:col-span-2">
            <Label htmlFor="loan_ratio">貸款成數</Label>
            <select
              id="loan_ratio"
              name="loan_ratio"
              defaultValue={numStr(initial?.loan_ratio, "0.7")}
              className={inputClass}
            >
              <option value="0">0%</option>
              <option value="0.5">50%</option>
              <option value="0.6">60%</option>
              <option value="0.7">70%</option>
              <option value="0.8">80%</option>
            </select>
          </div>
          <div className="grid gap-2 sm:col-span-2">
            <Label htmlFor="loan_amount">
              貸款金額（萬，手動覆寫；留空則 目標價×成數）
            </Label>
            <Input
              id="loan_amount"
              name="loan_amount"
              type="number"
              step="any"
              defaultValue={numStr(initial?.loan_amount)}
              placeholder="留空則自動計算"
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="interest_rate">年利率（小數，如 0.02086）</Label>
            <Input
              id="interest_rate"
              name="interest_rate"
              type="number"
              step="any"
              defaultValue={numStr(initial?.interest_rate, "0.02086")}
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="loan_years">貸款總年限（年）</Label>
            <Input
              id="loan_years"
              name="loan_years"
              type="number"
              defaultValue={numStr(initial?.loan_years, "30")}
            />
          </div>
          <div className="grid gap-2 sm:col-span-2">
            <Label htmlFor="interest_only_years">前幾年只還息不還本</Label>
            <Input
              id="interest_only_years"
              name="interest_only_years"
              type="number"
              defaultValue={numStr(initial?.interest_only_years, "0")}
            />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>收租資料</CardTitle>
          <CardDescription>租金為「元/月」；其餘金額為「萬」</CardDescription>
        </CardHeader>
        <CardContent className="grid gap-4 sm:grid-cols-2">
          <div className="grid gap-2">
            <Label htmlFor="renovation_cost">裝修投入（萬）</Label>
            <Input
              id="renovation_cost"
              name="renovation_cost"
              type="number"
              step="any"
              defaultValue={numStr(initial?.renovation_cost)}
              placeholder="例如 120"
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="upfront_misc_cost">其他前期雜費（萬）</Label>
            <Input
              id="upfront_misc_cost"
              name="upfront_misc_cost"
              type="number"
              step="any"
              defaultValue={numStr(initial?.upfront_misc_cost)}
              placeholder="例如 30"
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="conservative_rent">保守租金（元/月）</Label>
            <Input
              id="conservative_rent"
              name="conservative_rent"
              type="number"
              step="any"
              defaultValue={numStr(initial?.conservative_rent)}
              placeholder="例如 32000"
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="target_rent">目標租金（元/月）</Label>
            <Input
              id="target_rent"
              name="target_rent"
              type="number"
              step="any"
              defaultValue={numStr(initial?.target_rent)}
              placeholder="例如 38000"
            />
          </div>
          <div className="grid gap-2 sm:col-span-2">
            <Label htmlFor="operating_cost_rate">年營運成本率（小數，如 0.10）</Label>
            <Input
              id="operating_cost_rate"
              name="operating_cost_rate"
              type="number"
              step="any"
              defaultValue={numStr(initial?.operating_cost_rate, "0.10")}
            />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>轉賣資料</CardTitle>
          <CardDescription>金額單位：萬</CardDescription>
        </CardHeader>
        <CardContent className="grid gap-4 sm:grid-cols-2">
          <div className="grid gap-2">
            <Label htmlFor="target_sale_price">目標成交價（萬）</Label>
            <Input
              id="target_sale_price"
              name="target_sale_price"
              type="number"
              step="any"
              defaultValue={numStr(
                initial?.target_sale_price ??
                  (initial as { expected_sell_price?: number | null })
                    ?.expected_sell_price
              )}
              placeholder="例如 1580"
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="hold_months">持有月數</Label>
            <Input
              id="hold_months"
              name="hold_months"
              type="number"
              defaultValue={numStr(initial?.hold_months)}
              placeholder="例如 18"
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="holding_cost">持有成本（萬）</Label>
            <Input
              id="holding_cost"
              name="holding_cost"
              type="number"
              step="any"
              defaultValue={numStr(initial?.holding_cost)}
              placeholder="例如 15"
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="selling_cost">銷售成本（萬）</Label>
            <Input
              id="selling_cost"
              name="selling_cost"
              type="number"
              step="any"
              defaultValue={numStr(initial?.selling_cost)}
              placeholder="例如 40"
            />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>第一階段決策參考</CardTitle>
          <CardDescription>
            用於安全墊與 SABC 評級；與目標成交價分開填寫。
          </CardDescription>
        </CardHeader>
        <CardContent className="grid gap-4 sm:grid-cols-2">
          <div className="grid gap-2">
            <Label htmlFor="conservative_market_value">保守合理成交價（萬）</Label>
            <Input
              id="conservative_market_value"
              name="conservative_market_value"
              type="number"
              step="any"
              defaultValue={numStr(initial?.conservative_market_value)}
              placeholder="可選"
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="conservative_exit_price">保守出場價（萬）</Label>
            <Input
              id="conservative_exit_price"
              name="conservative_exit_price"
              type="number"
              step="any"
              defaultValue={numStr(initial?.conservative_exit_price)}
              placeholder="可選"
            />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>都更估算資料</CardTitle>
          <CardDescription>容積率為百分比數值；周遭成交單價為 萬/坪</CardDescription>
        </CardHeader>
        <CardContent className="grid gap-4 sm:grid-cols-2">
          <div className="grid gap-2">
            <Label htmlFor="legal_far">法定容積率（%）</Label>
            <Input
              id="legal_far"
              name="legal_far"
              type="number"
              step="any"
              defaultValue={numStr(initial?.legal_far)}
              placeholder="例如 200"
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="bonus_far">預估獎勵容積率（%）</Label>
            <Input
              id="bonus_far"
              name="bonus_far"
              type="number"
              step="any"
              defaultValue={numStr(initial?.bonus_far)}
              placeholder="例如 40"
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="nearby_new_house_price">周遭新房成交單價（萬/坪）</Label>
            <Input
              id="nearby_new_house_price"
              name="nearby_new_house_price"
              type="number"
              step="any"
              defaultValue={numStr(initial?.nearby_new_house_price)}
              placeholder="例如 120"
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="alloc_efficiency">可分配效率（小數）</Label>
            <Input
              id="alloc_efficiency"
              name="alloc_efficiency"
              type="number"
              step="any"
              defaultValue={numStr(initial?.alloc_efficiency, "0.75")}
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="common_burden_rate">共同負擔率（小數）</Label>
            <Input
              id="common_burden_rate"
              name="common_burden_rate"
              type="number"
              step="any"
              defaultValue={numStr(initial?.common_burden_rate, "0.35")}
            />
          </div>
          <div className="grid gap-2 sm:col-span-2">
            <Label htmlFor="interior_efficiency">室內實得率（小數）</Label>
            <Input
              id="interior_efficiency"
              name="interior_efficiency"
              type="number"
              step="any"
              defaultValue={numStr(initial?.interior_efficiency, "0.70")}
            />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>備註</CardTitle>
        </CardHeader>
        <CardContent>
          <Textarea
            name="notes"
            rows={4}
            defaultValue={initial?.notes ?? ""}
            placeholder="其他說明…"
          />
        </CardContent>
      </Card>

      <Separator />

      <div className="flex flex-col gap-3 sm:flex-row sm:justify-end">
        <Button type="submit" size="lg" className="w-full sm:w-auto">
          {mode === "create" ? "建立案件" : "儲存變更"}
        </Button>
      </div>
    </form>
  );
}
