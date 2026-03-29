"use client";

import type { ReactNode } from "react";
import { useState } from "react";

import { CalculationPanels } from "@/components/calculation-panels";
import { cn } from "@/lib/utils";
import type { CaseRow } from "@/lib/types/case";

type Module =
  | "overview"
  | "safety"
  | "rating"
  | "rent"
  | "flip"
  | "urban";

const tabListPrimary = cn(
  "grid h-auto w-full min-w-0 grid-cols-3 gap-0.5 rounded-xl border border-border/70 bg-muted/60 p-1 shadow-sm",
  "min-h-[52px] sm:min-h-11"
);

const tabTriggerPrimary = cn(
  "touch-manipulation rounded-lg px-1.5 text-xs font-semibold sm:min-h-10 sm:px-3 sm:text-sm",
  "min-h-[48px] sm:min-h-9"
);

const tabListSecondary = cn(
  "grid w-full min-w-0 grid-cols-3 gap-0.5 rounded-lg border border-border/60 bg-muted/40 p-1",
  "min-h-[50px] sm:min-h-10"
);

const tabTriggerSecondaryBase = cn(
  "inline-flex min-h-[46px] touch-manipulation items-center justify-center gap-1 rounded-md px-1.5 text-xs font-semibold sm:min-h-9 sm:gap-1.5 sm:px-2.5 sm:text-sm",
  "outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
);

const primarySelected = cn(
  "bg-background text-foreground shadow-md ring-1 ring-border/60"
);

const primaryIdle = cn("text-foreground/60 hover:text-foreground/90");

const secondarySelected = cn(
  "bg-background text-foreground shadow-sm ring-1 ring-border/40"
);

const secondaryIdle = cn("text-foreground/60 hover:text-foreground/90");

function sectionTitleClass() {
  return "text-center text-sm font-medium text-foreground/90 sm:text-[0.9375rem]";
}

function strategyMark(on: boolean) {
  return (
    <span
      className={cn(
        "select-none text-[0.7rem] font-normal tabular-nums sm:text-xs",
        on ? "text-emerald-700 dark:text-emerald-500" : "text-muted-foreground/70"
      )}
      aria-hidden
    >
      {on ? "✓" : "✕"}
    </span>
  );
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
  const [active, setActive] = useState<Module>("overview");

  const rentInvest = Boolean(row.invest_rent);
  const flipInvest = Boolean(row.invest_flip);
  const urbanInvest = Boolean(row.invest_urban_renewal);

  return (
    <div className="flex w-full min-w-0 flex-col gap-0">
      <div
        className={cn(
          "sticky top-[var(--site-header-h)] z-30 -mx-3 border-b border-border/60 bg-background/95 px-3 py-2.5 backdrop-blur-md",
          "sm:static sm:top-auto sm:z-0 sm:mx-0 sm:mb-4 sm:border-0 sm:bg-transparent sm:px-0 sm:py-0 sm:backdrop-blur-0"
        )}
      >
        <div className="mx-auto flex w-full max-w-4xl flex-col gap-2 sm:gap-2.5">
          <p className={sectionTitleClass()}>基本面分析</p>

          <div className={tabListPrimary} role="tablist" aria-label="基本面：概覽、安全墊、評級">
            {(
              [
                { id: "overview" as const, label: "概覽" },
                { id: "safety" as const, label: "安全墊" },
                { id: "rating" as const, label: "評級" },
              ] as const
            ).map(({ id, label }) => {
              const selected = active === id;
              return (
                <button
                  key={id}
                  type="button"
                  role="tab"
                  aria-selected={selected}
                  onClick={() => setActive(id)}
                  className={cn(
                    tabTriggerPrimary,
                    selected ? primarySelected : primaryIdle
                  )}
                >
                  {label}
                </button>
              );
            })}
          </div>

          <p className={sectionTitleClass()}>投資試算分析</p>

          <div
            className={tabListSecondary}
            role="tablist"
            aria-label="投資試算：收租、轉賣、都更"
          >
            {(
              [
                {
                  id: "rent" as const,
                  label: "收租",
                  strategy: rentInvest,
                },
                {
                  id: "flip" as const,
                  label: "轉賣",
                  strategy: flipInvest,
                },
                {
                  id: "urban" as const,
                  label: "都更",
                  strategy: urbanInvest,
                },
              ] as const
            ).map(({ id, label, strategy }) => {
              const selected = active === id;
              return (
                <button
                  key={id}
                  type="button"
                  role="tab"
                  aria-selected={selected}
                  onClick={() => setActive(id)}
                  className={cn(
                    tabTriggerSecondaryBase,
                    selected ? secondarySelected : secondaryIdle
                  )}
                >
                  <span>{label}</span>
                  {strategyMark(strategy)}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      <div className="mt-0 min-h-[min(50vh,520px)] w-full min-w-0">
        {active === "overview" ? (
          <div className="space-y-3 sm:space-y-4">{fieldsSlot}</div>
        ) : null}
        {active === "safety" ? safetySlot : null}
        {active === "rating" ? ratingSlot : null}
        {active === "rent" ? (
          <div className="min-h-[240px] w-full min-w-0 sm:min-h-[260px]">
            <CalculationPanels row={row} section="rent" />
          </div>
        ) : null}
        {active === "flip" ? (
          <div className="min-h-[240px] w-full min-w-0 sm:min-h-[260px]">
            <CalculationPanels row={row} section="flip" />
          </div>
        ) : null}
        {active === "urban" ? (
          <div className="min-h-[240px] w-full min-w-0 sm:min-h-[260px]">
            <CalculationPanels row={row} section="urban" />
          </div>
        ) : null}
      </div>
    </div>
  );
}
