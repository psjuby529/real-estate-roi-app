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
import type { CaseRow } from "@/lib/types/case";

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
    <Tabs defaultValue="overview" className="w-full gap-4">
      <TabsList className="grid w-full max-w-md grid-cols-3 sm:w-auto">
        <TabsTrigger value="overview">概覽</TabsTrigger>
        <TabsTrigger value="safety">安全墊</TabsTrigger>
        <TabsTrigger value="rating">評級</TabsTrigger>
      </TabsList>

      <TabsContent value="overview" className="space-y-4">
        {fieldsSlot}
        <Card className="overflow-hidden border-border/80">
          <CardHeader className="pb-2">
            <CardTitle className="text-base">投資試算</CardTitle>
            <CardDescription>
              收租／轉賣／都更為既有試算內容，僅切換顯示。
            </CardDescription>
          </CardHeader>
          <CardContent className="pt-0">
            <Tabs defaultValue="rent" className="w-full gap-3">
              <TabsList className="mb-3 grid w-full grid-cols-3 sm:w-auto">
                <TabsTrigger value="rent">收租</TabsTrigger>
                <TabsTrigger value="flip">轉賣</TabsTrigger>
                <TabsTrigger value="urban">都更</TabsTrigger>
              </TabsList>
              <TabsContent value="rent" className="min-h-[280px]">
                <CalculationPanels row={row} section="rent" />
              </TabsContent>
              <TabsContent value="flip" className="min-h-[280px]">
                <CalculationPanels row={row} section="flip" />
              </TabsContent>
              <TabsContent value="urban" className="min-h-[280px]">
                <CalculationPanels row={row} section="urban" />
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </TabsContent>

      <TabsContent value="safety" className="min-h-[200px]">
        {safetySlot}
      </TabsContent>

      <TabsContent value="rating" className="min-h-[200px]">
        {ratingSlot}
      </TabsContent>
    </Tabs>
  );
}
