import Link from "next/link";

import { Badge } from "@/components/ui/badge";
import { formatDate } from "@/lib/format";
import { computeSabcRating } from "@/lib/sabc-rating";
import type { CaseRow } from "@/lib/types/case";

/** 首頁底部「歷史紀錄」：僅接收 page 已載入的資料，不在此處發起 fetch。 */
export function HomeCaseHistory({
  cases,
  loadFailed,
}: {
  cases: CaseRow[];
  loadFailed: boolean;
}) {
  return (
    <section
      className="rounded-xl border border-border/80 bg-card/40 px-3 py-4 sm:px-4 sm:py-5"
      aria-labelledby="home-history-heading"
    >
      <h2
        id="home-history-heading"
        className="mb-3 text-base font-semibold tracking-tight sm:text-lg"
      >
        歷史紀錄
      </h2>

      {loadFailed ? (
        <p className="text-sm leading-relaxed text-muted-foreground">
          歷史紀錄載入失敗，請稍後再試。
        </p>
      ) : cases.length === 0 ? (
        <p className="text-sm text-muted-foreground">尚無歷史紀錄</p>
      ) : (
        <ul className="divide-y divide-border/70">
          {cases.map((row) => {
            const rating = computeSabcRating(row);
            return (
              <li key={row.id} className="min-h-[44px] py-2.5 first:pt-0 last:pb-0">
                <Link
                  href={`/cases/${row.id}`}
                  className="flex flex-wrap items-center gap-x-2 gap-y-1 touch-manipulation rounded-md py-0.5 text-sm transition-colors hover:bg-muted/50 active:bg-muted/70 sm:gap-x-3"
                >
                  <Badge
                    variant="secondary"
                    className="shrink-0 font-mono text-[11px] sm:text-xs"
                  >
                    {rating.grade}
                  </Badge>
                  <span className="min-w-0 flex-1 break-words font-medium leading-snug">
                    {row.address}
                  </span>
                  <span className="shrink-0 text-xs tabular-nums text-muted-foreground">
                    更新 {formatDate(row.updated_at)}
                  </span>
                </Link>
              </li>
            );
          })}
        </ul>
      )}
    </section>
  );
}
