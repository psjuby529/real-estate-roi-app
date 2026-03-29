"use client";

import type { ReactNode } from "react";

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
  "mb-0 grid w-full min-w-0 grid-cols-3 gap-0.5 rounded-lg border border-border/60 bg-muted/40 p-1",
  "min-h-[50px] sm:min-h-10"
);

const tabTriggerSecondary = cn(
  "touch-manipulation rounded-md px-1 text-xs font-semibold sm:px-2.5 sm:text-sm",
  "min-h-[46px] sm:min-h-9",
  "data-active:bg-background data-active:shadow-sm data-active:ring-1 data-active:ring-border/40"
);

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
  return (
    <Tabs defaultValue="overview" className="flex w-full min-w-0 flex-col gap-0">
      <div className="sticky top-[var(--site-header-h)] z-30 -mx-3 border-b border-border/60 bg-background/95 px-3 py-2 backdrop-blur-md sm:static sm:top-auto sm:z-0 sm:mx-0 sm:mb-4 sm:border-0 sm:bg-transparent sm:px-0 sm:py-0 sm:backdrop-blur-0">
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
      </div>

      <TabsContent value="overview" className="mt-0 space-y-3 sm:space-y-4">
        {fieldsSlot}
        <Card className="w-full min-w-0 overflow-hidden border-border/80 shadow-sm">
          <CardHeader className="space-y-1 px-3 pb-2 pt-3 sm:px-6 sm:pt-6">
            <CardTitle className="text-base sm:text-lg">投資試算</CardTitle>
            <CardDescription className="text-xs sm:text-sm">
              收租／轉賣／都更為既有試算內容，僅切換顯示。
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-0 px-3 pb-3 pt-0 sm:px-6 sm:pb-6">
            <Tabs defaultValue="rent" className="w-full min-w-0">
              <TabsList className={tabListSecondary}>
                <TabsTrigger className={tabTriggerSecondary} value="rent">
                  收租
                </TabsTrigger>
                <TabsTrigger className={tabTriggerSecondary} value="flip">
                  轉賣
                </TabsTrigger>
                <TabsTrigger className={tabTriggerSecondary} value="urban">
                  都更
                </TabsTrigger>
              </TabsList>
              <TabsContent value="rent" className="mt-3 min-h-[240px] sm:mt-4">
                <CalculationPanels row={row} section="rent" />
              </TabsContent>
              <TabsContent value="flip" className="mt-3 min-h-[240px] sm:mt-4">
                <CalculationPanels row={row} section="flip" />
              </TabsContent>
              <TabsContent value="urban" className="mt-3 min-h-[240px] sm:mt-4">
                <CalculationPanels row={row} section="urban" />
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </TabsContent>

      <TabsContent value="safety" className="min-h-[200px] w-full min-w-0">
        {safetySlot}
      </TabsContent>

      <TabsContent value="rating" className="min-h-[200px] w-full min-w-0">
        {ratingSlot}
      </TabsContent>
    </Tabs>
  );
}
