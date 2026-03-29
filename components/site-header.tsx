import Image from "next/image";
import Link from "next/link";

import { buttonVariants } from "@/lib/button-variants";
import { cn } from "@/lib/utils";
import { Plus } from "lucide-react";

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-40 border-b border-border/80 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/80">
      <div className="mx-auto flex max-w-4xl items-center justify-between gap-3 px-4 py-3">
        <Link
          href="/"
          className="flex min-w-0 items-center py-1 pl-0.5 pr-1 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 rounded-sm"
        >
          <Image
            src="/branding/matsumotolin-logo.png"
            alt="松本霖 MatsumotoLin · 房產投資評估器"
            width={320}
            height={128}
            className="h-6 w-auto max-h-8 object-contain object-left sm:h-8 sm:max-h-9 lg:h-10 lg:max-h-[40px]"
            sizes="(max-width: 640px) 140px, 220px"
            priority
          />
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
