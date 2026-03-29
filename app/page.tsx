import { CaseCard } from "@/components/case-card";
import { Button } from "@/components/ui/button";
import { buttonVariants } from "@/lib/button-variants";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";
import { computeSabcRating } from "@/lib/sabc-rating";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import type { CaseRow } from "@/lib/types/case";
import Link from "next/link";

export const dynamic = "force-dynamic";

const inputClass =
  "flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2";

const GRADES = ["S", "A", "B", "C"] as const;

function parseGradeFilter(
  sp: Record<string, string | string[] | undefined>
): Set<string> {
  const g = sp.grade;
  if (!g) return new Set();
  const arr = Array.isArray(g) ? g : [g];
  const ok = new Set(GRADES);
  return new Set(arr.map(String).filter((x) => ok.has(x as (typeof GRADES)[number])));
}

export default async function HomePage({
  searchParams,
}: {
  searchParams: Record<string, string | string[] | undefined>;
}) {
  const q = typeof searchParams.q === "string" ? searchParams.q.trim() : "";
  const type =
    typeof searchParams.type === "string" ? searchParams.type.trim() : "";
  const gradeFilter = parseGradeFilter(searchParams);

  let rows: CaseRow[] = [];
  let errorMessage: string | null = null;

  try {
    const supabase = createSupabaseServerClient();
    let query = supabase
      .from("cases")
      .select("*")
      .order("updated_at", { ascending: false });

    if (q) {
      query = query.ilike("address", `%${q}%`);
    }
    if (type && type !== "all") {
      query = query.eq("property_type", type);
    }

    const { data, error } = await query;
    if (error) errorMessage = error.message;
    else rows = (data as CaseRow[]) ?? [];
  } catch (e) {
    errorMessage = e instanceof Error ? e.message : "無法載入資料";
  }

  const displayRows =
    gradeFilter.size === 0
      ? rows
      : rows.filter((row) => gradeFilter.has(computeSabcRating(row).grade));

  return (
    <div className="w-full min-w-0 space-y-5 sm:space-y-6">
      <div className="space-y-1">
        <h1 className="text-xl font-bold tracking-tight sm:text-2xl">案件列表</h1>
        <p className="text-xs leading-relaxed text-muted-foreground sm:text-sm">
          搜尋地址、依房產類型篩選，點卡片進入詳情與試算。
        </p>
      </div>

      <form
        className="flex flex-col gap-3 rounded-xl border bg-card p-3 sm:flex-row sm:flex-wrap sm:items-end sm:gap-4 sm:p-4"
        method="get"
      >
        <div className="grid flex-1 gap-2 sm:min-w-[200px]">
          <Label htmlFor="q">搜尋地址</Label>
          <Input
            id="q"
            name="q"
            placeholder="關鍵字…"
            defaultValue={q}
          />
        </div>
        <div className="grid w-full gap-2 sm:w-44">
          <Label htmlFor="type">房產類型</Label>
          <select
            id="type"
            name="type"
            defaultValue={type || "all"}
            className={inputClass}
          >
            <option value="all">全部</option>
            {["電梯", "公寓", "透天", "土地"].map((t) => (
              <option key={t} value={t}>
                {t}
              </option>
            ))}
          </select>
        </div>
        <div className="flex w-full flex-col gap-2 sm:flex-1 sm:min-w-[220px]">
          <Label className="text-xs text-muted-foreground sm:text-sm">評級（複選）</Label>
          <div className="flex min-h-[44px] flex-wrap items-center gap-x-4 gap-y-2 rounded-lg border border-input/80 bg-background px-3 py-2.5">
            {GRADES.map((g) => (
              <label
                key={g}
                className="flex min-h-[44px] cursor-pointer items-center gap-2 text-sm touch-manipulation"
              >
                <input
                  type="checkbox"
                  name="grade"
                  value={g}
                  defaultChecked={gradeFilter.has(g)}
                  className="size-[18px] shrink-0 rounded border-input"
                />
                {g}
              </label>
            ))}
          </div>
        </div>
        <div className="flex w-full flex-col gap-2 gap-x-3 sm:w-auto sm:flex-row sm:items-center">
          <Button type="submit" className="min-h-[44px] w-full touch-manipulation sm:w-auto sm:min-h-10">
            套用
          </Button>
          <Link
            href="/"
            className={cn(
              buttonVariants({ variant: "outline" }),
              "min-h-[44px] w-full justify-center touch-manipulation sm:w-auto sm:min-h-10"
            )}
          >
            清除
          </Link>
        </div>
      </form>

      {errorMessage ? (
        <div className="rounded-lg border border-destructive/40 bg-destructive/5 px-4 py-3 text-sm text-destructive">
          {errorMessage}
        </div>
      ) : rows.length === 0 ? (
        <div className="rounded-xl border border-dashed py-16 text-center text-muted-foreground">
          <p className="mb-4">尚無案件，建立第一筆開始評估。</p>
          <Link href="/new" className={cn(buttonVariants())}>
            新增案件
          </Link>
        </div>
      ) : displayRows.length === 0 ? (
        <div className="rounded-xl border border-dashed py-12 text-center text-muted-foreground">
          <p>沒有符合評級篩選的案件。</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 sm:gap-4">
          {displayRows.map((row) => (
            <CaseCard key={row.id} row={row} />
          ))}
        </div>
      )}
    </div>
  );
}
