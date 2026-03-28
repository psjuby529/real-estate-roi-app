const pct = new Intl.NumberFormat("zh-TW", {
  style: "percent",
  maximumFractionDigits: 2,
});

/** 萬元，顯示為「1,380 萬」 */
export function formatWan(n: number | null | undefined): string {
  if (n === null || n === undefined || Number.isNaN(n)) return "—";
  return `${n.toLocaleString("zh-TW", { maximumFractionDigits: 2 })} 萬`;
}

/** 元/月（租金） */
export function formatYuanPerMonth(n: number | null | undefined): string {
  if (n === null || n === undefined || Number.isNaN(n)) return "—";
  return `${Math.round(n).toLocaleString("zh-TW")} 元/月`;
}

export function formatPct(n: number | null | undefined): string {
  if (n === null || n === undefined || Number.isNaN(n)) return "—";
  return pct.format(n);
}

export function formatPing(n: number | null | undefined): string {
  if (n === null || n === undefined || Number.isNaN(n)) return "—";
  return `${n.toLocaleString("zh-TW", { maximumFractionDigits: 2 })} 坪`;
}

/** 萬/坪 */
export function formatWanPerPing(n: number | null | undefined): string {
  if (n === null || n === undefined || Number.isNaN(n)) return "—";
  return `${n.toLocaleString("zh-TW", { maximumFractionDigits: 2 })} 萬/坪`;
}

/** 倍數，例如 1.25x */
export function formatMultiple(n: number | null | undefined): string {
  if (n === null || n === undefined || Number.isNaN(n)) return "—";
  return `${n.toLocaleString("zh-TW", { maximumFractionDigits: 2 })}x`;
}

/** 容積率等「直接輸入百分比數字」（如 200）→ 顯示 200% */
export function formatFarPercentPoints(n: number | null | undefined): string {
  if (n === null || n === undefined || Number.isNaN(n)) return "—";
  return `${n.toLocaleString("zh-TW", { maximumFractionDigits: 2 })}%`;
}

export function formatDate(iso: string | null | undefined): string {
  if (!iso) return "—";
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return "—";
  return d.toLocaleString("zh-TW", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
  });
}
