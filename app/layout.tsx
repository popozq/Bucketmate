import type { Metadata } from "next";
import "./globals.css";
import { Header } from "@/components/header";
import { PointerGlow } from "@/components/motion";

export const metadata: Metadata = {
  title: "BucketMate — 목표를 오늘의 실행으로",
  description: "AI 에이전트 팩을 선택하고 내 목표에 맞는 실전 실행 계획을 만들어 보세요.",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="ko" suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: `(function(){try{var t=localStorage.getItem('bucketmate-theme');var d=t?t==='dark':window.matchMedia('(prefers-color-scheme: dark)').matches;document.documentElement.classList.toggle('dark',d)}catch(e){}})()` }} />
      </head>
      <body>
        <PointerGlow />
        <Header />
        {children}
      </body>
    </html>
  );
}
