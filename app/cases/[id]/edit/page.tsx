import Link from "next/link";
import { notFound } from "next/navigation";

import { CaseForm } from "@/components/case-form";
import { buttonVariants } from "@/lib/button-variants";
import { cn } from "@/lib/utils";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import type { CaseRow } from "@/lib/types/case";

export const dynamic = "force-dynamic";

export default async function EditCasePage({
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

  return (
    <div className="w-full min-w-0 space-y-5 sm:space-y-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between sm:gap-4">
        <div className="min-w-0 flex-1">
          <h1 className="text-xl font-bold tracking-tight sm:text-2xl">編輯案件</h1>
          <p className="mt-1 line-clamp-3 break-words text-xs text-muted-foreground sm:text-sm">
            {row.address}
          </p>
        </div>
        <Link
          href={`/cases/${row.id}`}
          className={cn(
            buttonVariants({ variant: "outline", size: "sm" }),
            "min-h-[44px] shrink-0 touch-manipulation sm:min-h-9"
          )}
        >
          取消
        </Link>
      </div>
      <CaseForm mode="edit" caseId={row.id} initial={row} />
    </div>
  );
}
