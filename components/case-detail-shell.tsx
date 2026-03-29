"use client";

import type { ReactNode } from "react";
import { useState } from "react";

import { CalculationPanels } from "@/components/calculation-panels";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { cn } from "@/lib/utils";
import type { CaseRow } from "@/lib/types/case";

type MainTab = "overview" | "safety" | "rating";
type CalcTab = "rent" | "flip" | "urban";

const tabListPrimary = cn(
  "grid h-auto w-full min-w-0 grid-cols-3 gap-0.5 rounded-xl border border-border/70 bg-muted/60 p-1 shadow-sm",
  "min-h-[52px] sm:min-h-11"
);

const tabTriggerPrimary = cn(
  "touch-manipulation rounded-lg px-1.5 text-xs font-semibold sm:min-h-10 sm:px-3 sm:text-sm",
  "min-h-[48px] sm:min-h-9",
  "data-active:bg-background data-active:text-foreground data-active:shadow-md data-active:ring-1 data-active:ring-border/60"
);

const tabListSecondary = cn(
  "grid w-full min-w-0 grid-cols-3 gap-0.5 rounded-lg border bg-muted/40 p-1 transition-opacity duration-200",
  "min-h-[50px] sm:min-h-10"
);

const tabTriggerSecondaryBase = cn(
  "touch-manipulation rounded-md px-1 text-xs font-semibold sm:px-2.5 sm:text-sm",
  "min-h-[46px] sm:min-h-9",
  "outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
);

function sectionTitleClass() {
  return "text-center text-sm font-medium text-foreground/90 sm:text-[0.9375rem]";
}

export function CaseDetailShell({
  row,
  fieldsSlot,
  safetySlot,
  ratingSlot,
}: {
  row: CaseRow;
  fieldsSlot: ReactNode;
  safetySlot: ReactNode;
  ratingSlot: ReactNode;
}) {
  const [main, setMain] = useState<MainTab>("overview");
  const [calc, setCalc] = useState<CalcTab>("rent");
  const calcDisabled = main !== "overview";

  return (
    <Tabs
      value={main}
      onValueChange={(v) => setMain(v as MainTab)}
      className="flex w-full min-w-0 flex-col gap-0"
    >
      <div
        className={cn(
          "sticky top-[var(--site-header-h)] z-30 -mx-3 border-b border-border/60 bg-background/95 px-3 py-2.5 backdrop-blur-md",
          "sm:static sm:top-auto sm:z-0 sm:mx-0 sm:mb-4 sm:border-0 sm:bg-transparent sm:px-0 sm:py-0 sm:backdrop-blur-0"
        )}
      >
        <div className="mx-auto flex w-full max-w-4xl flex-col gap-2 sm:gap-2.5">
          <p className={sectionTitleClass()}>基本面分析</p>

          <TabsList className={tabListPrimary}>
            <TabsTrigger className={tabTriggerPrimary} value="overview">
              概覽
            </TabsTrigger>
            <TabsTrigger className={tabTriggerPrimary} value="safety">
              安全墊
            </TabsTrigger>
            <TabsTrigger className={tabTriggerPrimary} value="rating">
              評級
            </TabsTrigger>
          </TabsList>

          <p className={cn(sectionTitleClass(), calcDisabled && "text-foreground/50")}>
            投資試算分析
          </p>

          <div
            className={cn(
              tabListSecondary,
              calcDisabled
                ? "border-border/30 opacity-45"
                : "border-border/60"
            )}
            role="tablist"
            aria-label="投資試算：收租、轉賣、都更"
          >
            {(
              [
                { id: "rent" as const, label: "收租" },
                { id: "flip" as const, label: "轉賣" },
                { id: "urban" as const, label: "都更" },
              ] as const
            ).map(({ id, label }) => {
              const selected = calc === id && !calcDisabled;
              return (
                <button
                  key={id}
                  type="button"
                  role="tab"
                  aria-selected={selected}
                  aria-disabled={calcDisabled}
                  disabled={calcDisabled}
                  tabIndex={calcDisabled ? -1 : 0}
                  onClick={() => {
                    if (!calcDisabled) setCalc(id);
                  }}
                  className={cn(
                    tabTriggerSecondaryBase,
                    selected &&
                      "bg-background text-foreground shadow-sm ring-1 ring-border/40",
                    !selected &&
                      !calcDisabled &&
                      "text-foreground/60 hover:text-foreground/90",
                    calcDisabled && "cursor-not-allowed text-foreground/35"
                  )}
                >
                  {label}
                </button>
              );
            })}
          </div>

          {calcDisabled ? (
            <p className="px-1 text-center text-[10px] leading-snug text-muted-foreground sm:text-xs">
              此區僅用於概覽中的投資試算切換
            </p>
          ) : null}
        </div>
      </div>

      <TabsContent value="overview" className="mt-0 min-h-[min(60vh,520px)] space-y-3 sm:space-y-4">
        {fieldsSlot}
        <Card className="w-full min-w-0 overflow-hidden border-border/80 shadow-sm">
          <CardHeader className="space-y-1 px-3 pb-2 pt-3 sm:px-6 sm:pt-6">
            <CardTitle className="text-base sm:text-lg">投資試算</CardTitle>
            <CardDescription className="text-xs sm:text-sm">
              收租／轉賣／都更為既有試算內容，僅切換顯示。
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-0 px-3 pb-3 pt-0 sm:px-6 sm:pb-6">
            <div className="min-h-[240px] sm:min-h-[260px]">
              <CalculationPanels row={row} section={calc} />
            </div>
          </CardContent>
        </Card>
      </TabsContent>

      <TabsContent
        value="safety"
        className="min-h-[min(50vh,480px)] w-full min-w-0"
      >
        {safetySlot}
      </TabsContent>

      <TabsContent
        value="rating"
        className="min-h-[min(50vh,480px)] w-full min-w-0"
      >
        {ratingSlot}
      </TabsContent>
    </Tabs>
  );
}
