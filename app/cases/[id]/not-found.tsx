import Link from "next/link";

import { buttonVariants } from "@/lib/button-variants";
import { cn } from "@/lib/utils";

export default function CaseNotFound() {
  return (
    <div className="flex flex-col items-center justify-center gap-4 py-20 text-center">
      <h1 className="text-xl font-semibold">找不到案件</h1>
      <p className="text-sm text-muted-foreground">
        此連結可能已失效，或案件已被刪除。
      </p>
      <Link href="/" className={cn(buttonVariants())}>
        回到首頁
      </Link>
    </div>
  );
}
