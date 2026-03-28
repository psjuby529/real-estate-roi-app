import { createClient, type SupabaseClient } from "@supabase/supabase-js";

/** 讀取 .env 時常見：尾端空白、CR、被包在引號內 */
function normalizeEnv(value: string | undefined): string {
  if (value === undefined || value === null) return "";
  let v = String(value).replace(/\r/g, "").trim();
  if (
    (v.startsWith('"') && v.endsWith('"')) ||
    (v.startsWith("'") && v.endsWith("'"))
  ) {
    v = v.slice(1, -1).trim();
  }
  return v;
}

function looksLikePlaceholder(url: string): boolean {
  const u = url.toLowerCase();
  return (
    u.includes("你的_") ||
    u.includes("your-project") ||
    u.includes("placeholder") ||
    u === "undefined" ||
    u === "null"
  );
}

function assertValidHttpUrl(url: string): void {
  try {
    const parsed = new URL(url);
    if (parsed.protocol !== "http:" && parsed.protocol !== "https:") {
      throw new Error("protocol");
    }
  } catch {
    throw new Error(
      "NEXT_PUBLIC_SUPABASE_URL 必須是完整的 http 或 https 網址（例如 https://xxxx.supabase.co）。請檢查 .env.local 是否含引號、尾端空白或換行，修改後請重新啟動 npm run dev。"
    );
  }
}

/**
 * 伺服端 Supabase 客戶端（使用 anon key，搭配 RLS／本專案政策）
 */
export function createSupabaseServerClient(): SupabaseClient {
  const url = normalizeEnv(process.env.NEXT_PUBLIC_SUPABASE_URL);
  const key = normalizeEnv(process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY);

  if (!url || !key) {
    throw new Error(
      "缺少 NEXT_PUBLIC_SUPABASE_URL 或 NEXT_PUBLIC_SUPABASE_ANON_KEY。請在專案根目錄建立 .env.local 並填入 Supabase Project Settings → API，然後重新執行 npm run dev。"
    );
  }

  if (looksLikePlaceholder(url)) {
    throw new Error(
      "NEXT_PUBLIC_SUPABASE_URL 仍是範例文字。請改為專案實際的 https://…supabase.co 網址。"
    );
  }

  assertValidHttpUrl(url);

  return createClient(url, key, {
    auth: {
      persistSession: false,
      autoRefreshToken: false,
    },
  });
}
