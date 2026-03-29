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
    <div className="w-full min-w-0 space-y-4 pb-12 sm:space-y-6 sm:pb-16">
      <section className="w-full min-w-0 border-b border-border/50 pb-3 sm:pb-4">
        <div className="flex items-start gap-2 sm:gap-4">
          <div className="min-w-0 flex-1 space-y-1">
            <h1 className="break-words text-base font-bold leading-snug tracking-tight text-foreground sm:text-2xl">
              {row.address}
            </h1>
            <p className="text-[11px] text-muted-foreground sm:text-sm">
              更新 {formatDate(row.updated_at)}
            </p>
          </div>
          <Link
            href={`/cases/${row.id}/edit`}
            className={cn(
              buttonVariants({ variant: "secondary", size: "sm" }),
              "touch-manipulation shrink-0 gap-1.5 whitespace-nowrap",
              "min-h-[44px] px-3 py-2.5 text-xs sm:min-h-9 sm:py-2 sm:text-sm",
              "active:opacity-90"
            )}
          >
            <Pencil className="size-4 shrink-0" />
            編輯
          </Link>
        </div>
      </section>

      <CaseDetailShell
        row={row}
        fieldsSlot={<CaseDetailFields row={row} />}
        safetySlot={<SafetyCushionPanel row={row} />}
        ratingSlot={<RatingPanel row={row} />}
      />

      <Separator className="my-2" />

      <div className="flex justify-center px-1">
        <Link href="/" className={cn(buttonVariants({ variant: "outline" }))}>
          回到列表
        </Link>
      </div>
    </div>
  );
}
