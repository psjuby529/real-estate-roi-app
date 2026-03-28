import Link from "next/link";

import { buttonVariants } from "@/lib/button-variants";
import { cn } from "@/lib/utils";
import { Plus } from "lucide-react";

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-40 border-b border-border/80 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/80">
      <div className="mx-auto flex max-w-4xl items-center justify-between gap-3 px-4 py-3">
        <Link href="/" className="text-base font-semibold tracking-tight">
          房產投資評估器
        </Link>
        <Link
          href="/new"
          className={cn(buttonVariants({ size: "sm" }), "gap-1")}
        >
          <Plus className="size-4" />
          新增案件
        </Link>
      </div>
    </header>
  );
}
