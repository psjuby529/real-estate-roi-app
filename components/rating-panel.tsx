import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { computeSabcRating } from "@/lib/sabc-rating";
import type { CaseRow } from "@/lib/types/case";

const gradeVariant: Record<string, "default" | "secondary" | "outline"> = {
  S: "default",
  A: "default",
  B: "secondary",
  C: "outline",
};

export function RatingPanel({ row }: { row: CaseRow }) {
  const r = computeSabcRating(row);

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">SABC 評級（第一階段）</CardTitle>
          <CardDescription>
            {!r.dataCompleteForSA
              ? "目前為階段性評估，資料未補齊時最高僅評至 B。"
              : "資料已達評定門檻，可依安全墊與現金流給予 A／S。"}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex flex-wrap items-center gap-3">
            <span className="text-sm text-muted-foreground">目前評級</span>
            <Badge variant={gradeVariant[r.grade] ?? "secondary"} className="text-base px-3 py-0.5">
              {r.grade}
            </Badge>
            <span className="text-sm text-muted-foreground">資料狀態</span>
            <span className="text-sm font-medium">
              {r.dataCompleteForSA ? "已補齊" : "未補齊"}
            </span>
          </div>

          <div className="space-y-2">
            <p className="text-sm font-medium">為什麼是這個等級</p>
            <ul className="list-inside list-disc space-y-1 text-sm text-muted-foreground">
              {r.gradeReasons.map((line, i) => (
                <li key={i}>{line}</li>
              ))}
            </ul>
          </div>

          {r.upgradeHints.length > 0 ? (
            <div className="space-y-2">
              <p className="text-sm font-medium">若要升級</p>
              <ul className="list-inside list-disc space-y-1 text-sm text-muted-foreground">
                {r.upgradeHints.map((line, i) => (
                  <li key={i}>{line}</li>
                ))}
              </ul>
            </div>
          ) : null}

          {r.downgradeRisks.length > 0 ? (
            <div className="space-y-2">
              <p className="text-sm font-medium">主要風險（降級或承壓因子）</p>
              <ul className="list-inside list-disc space-y-1 text-sm text-rose-800/90 dark:text-rose-300/90">
                {r.downgradeRisks.map((line, i) => (
                  <li key={i}>{line}</li>
                ))}
              </ul>
            </div>
          ) : null}
        </CardContent>
      </Card>
    </div>
  );
}
