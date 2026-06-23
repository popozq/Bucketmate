"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect } from "react";
import { Logo } from "@/components/logo";
import { ThemeToggle } from "@/components/theme-toggle";

export function Header() {
  const pathname = usePathname();
  const isEnglish = pathname === "/en" || pathname.startsWith("/en/");
  const prefix = isEnglish ? "/en" : "";
  const languageHref = isEnglish ? (pathname.replace(/^\/en/, "") || "/") : `/en${pathname === "/" ? "" : pathname}`;

  useEffect(() => {
    document.documentElement.lang = isEnglish ? "en" : "ko";
  }, [isEnglish]);

  return (
    <header className="sticky top-0 z-40 border-b border-black/5 bg-cream/75 shadow-[0_1px_30px_rgba(23,33,27,0.03)] backdrop-blur-xl">
      <div className="page-shell flex h-20 items-center justify-between">
        <Logo href={isEnglish ? "/en" : "/"} />
        <nav className="flex items-center gap-2 sm:gap-7">
          <Link href={`${prefix}/agents`} className="hidden text-sm font-semibold text-black/60 hover:text-ink sm:block">{isEnglish ? "Agent Packs" : "에이전트 팩"}</Link>
          <Link href={`${prefix}/workspace`} className="hidden text-sm font-semibold text-black/60 hover:text-ink sm:block">{isEnglish ? "Workspace" : "워크스페이스"}</Link>
          <ThemeToggle isEnglish={isEnglish} />
          <Link href={languageHref} className="rounded-full border border-black/10 px-3 py-2 text-xs font-black text-black/55 hover:border-brand-500 hover:text-brand-700">{isEnglish ? "한국어" : "EN"}</Link>
          <Link href={`${prefix}/agents`} className="primary-button !hidden !px-5 !py-2.5 sm:!inline-flex">{isEnglish ? "Start free" : "무료로 시작"} <span className="ml-2">→</span></Link>
        </nav>
      </div>
    </header>
  );
}
