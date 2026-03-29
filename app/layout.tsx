import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";

import { SiteHeader } from "@/components/site-header";
import { cn } from "@/lib/utils";

import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-sans",
});

export const metadata: Metadata = {
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3001"
  ),
  title: {
    default: "房產投資評估器",
    template: "%s | 房產投資評估器",
  },
  description: "前線快速輸入房地產案件，即時試算收租、轉賣與都更分回坪數。",
  applicationName: "房產投資評估器",
  manifest: "/manifest.json",
  appleWebApp: {
    capable: true,
    title: "房產投資評估器",
    statusBarStyle: "default",
  },
  icons: {
    icon: "/favicon.ico",
  },
};

export const viewport: Viewport = {
  themeColor: "#0f172a",
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="zh-Hant" className={cn("font-sans", inter.variable)}>
      <body className="min-h-dvh overflow-x-hidden antialiased">
        <SiteHeader />
        <main className="mx-auto w-full min-w-0 max-w-4xl py-4 pl-[max(0.75rem,env(safe-area-inset-left,0px))] pr-[max(0.75rem,env(safe-area-inset-right,0px))] sm:px-4 sm:py-6">
          {children}
        </main>
      </body>
    </html>
  );
}
