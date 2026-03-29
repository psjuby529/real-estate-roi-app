import Link from "next/link";
import { notFound } from "next/navigation";

import { CaseDetailFields } from "@/components/case-detail-fields";
import { CaseDetailShell } from "@/components/case-detail-shell";
import { RatingPanel } from "@/components/rating-panel";
import { SafetyCushionPanel } from "@/components/safety-cushion-panel";
import { buttonVariants } from "@/lib/button-variants";
import { formatDate } from "@/lib/format";
import { cn } from "@/lib/utils";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import type { CaseRow } from "@/lib/types/case";
import { Pencil } from "lucide-react";
import { Separator } from "@/components/ui/separator";

export const dynamic = "force-dynamic";

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

      <CaseDetailShell
        row={row}
        fieldsSlot={<CaseDetailFields row={row} />}
        safetySlot={<SafetyCushionPanel row={row} />}
        ratingSlot={<RatingPanel row={row} />}
      />

      <Separator />

      <div className="flex justify-center">
        <Link href="/" className={cn(buttonVariants({ variant: "outline" }))}>
          回到列表
        </Link>
      </div>
    </div>
  );
}
