import Image from "next/image";
import Link from "next/link";

import { buttonVariants } from "@/lib/button-variants";
import { cn } from "@/lib/utils";
import { Plus } from "lucide-react";

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-50 min-h-[var(--site-header-h)] border-b border-border/80 bg-background/95 shadow-sm backdrop-blur-md supports-[backdrop-filter]:bg-background/90">
      <div
        className={cn(
          "mx-auto flex h-full min-h-[var(--site-header-h)] w-full min-w-0 max-w-4xl items-center justify-between gap-2",
          "pl-[max(0.75rem,env(safe-area-inset-left,0px))] pr-[max(0.75rem,env(safe-area-inset-right,0px))] py-2 sm:gap-3 sm:py-2.5"
        )}
      >
        <Link
          href="/"
          className={cn(
            "flex min-w-0 flex-1 items-center gap-2.5 rounded-lg py-1 pl-0.5 pr-1 outline-none transition-colors",
            "active:bg-muted/60 sm:active:bg-transparent",
            "focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
            "touch-manipulation sm:gap-3"
          )}
        >
          <Image
            src="/branding/matsumotolin-logo.png"
            alt="松本霖 MatsumotoLin · 房產投資評估器"
            width={320}
            height={128}
            className="h-8 w-auto max-w-[42vw] shrink-0 object-contain object-left sm:h-10 sm:max-w-none md:h-11 md:max-h-[44px]"
            sizes="(max-width: 640px) 180px, 260px"
            priority
          />
          <div className="min-w-0 flex-1 leading-tight">
            <p className="truncate text-[11px] font-medium leading-tight tracking-tight text-muted-foreground sm:text-xs">
              <span className="sm:hidden">松本霖</span>
              <span className="hidden sm:inline">松本霖 · MatsumotoLin</span>
            </p>
            <p className="truncate text-sm font-semibold leading-tight tracking-tight text-foreground sm:text-base">
              房產投資評估器
            </p>
          </div>
        </Link>
        <Link
          href="/new"
          className={cn(
            buttonVariants({ size: "sm" }),
            "shrink-0 touch-manipulation gap-1 whitespace-nowrap rounded-lg px-2.5 py-2.5 text-[11px] sm:min-h-9 sm:px-3 sm:py-2 sm:text-sm",
            "min-h-[44px] active:opacity-90"
          )}
        >
          <Plus className="size-4 shrink-0" />
          新增案件
        </Link>
      </div>
    </header>
  );
}
