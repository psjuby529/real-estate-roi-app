import { CaseCard } from "@/components/case-card";
import { Button } from "@/components/ui/button";
import { buttonVariants } from "@/lib/button-variants";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import type { CaseRow } from "@/lib/types/case";
import Link from "next/link";

export const dynamic = "force-dynamic";

const inputClass =
  "flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2";

export default async function HomePage({
  searchParams,
}: {
  searchParams: Record<string, string | string[] | undefined>;
}) {
  const q = typeof searchParams.q === "string" ? searchParams.q.trim() : "";
  const type =
    typeof searchParams.type === "string" ? searchParams.type.trim() : "";

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

  return (
    <div className="space-y-6">
      <div className="space-y-1">
        <h1 className="text-2xl font-bold tracking-tight">案件列表</h1>
        <p className="text-sm text-muted-foreground">
          搜尋地址、依房產類型篩選，點卡片進入詳情與試算。
        </p>
      </div>

      <form
        className="flex flex-col gap-3 rounded-lg border bg-card p-4 sm:flex-row sm:flex-wrap sm:items-end"
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
        <div className="flex gap-2">
          <Button type="submit">套用</Button>
          <Link
            href="/"
            className={cn(buttonVariants({ variant: "outline" }))}
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
      ) : (
        <div className="grid gap-4 sm:grid-cols-2">
          {rows.map((row) => (
            <CaseCard key={row.id} row={row} />
          ))}
        </div>
      )}
    </div>
  );
}
