"use client";

import { useEffect, useState } from "react";

export function ThemeToggle({ isEnglish }: { isEnglish: boolean }) {
  const [dark, setDark] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setDark(document.documentElement.classList.contains("dark"));
    setMounted(true);
  }, []);

  const toggle = () => {
    const next = !dark;
    setDark(next);
    document.documentElement.classList.toggle("dark", next);
    window.localStorage.setItem("bucketmate-theme", next ? "dark" : "light");
  };

  const label = dark
    ? (isEnglish ? "Switch to light mode" : "라이트 모드로 전환")
    : (isEnglish ? "Switch to dark mode" : "다크 모드로 전환");

  return (
    <button type="button" onClick={toggle} aria-label={label} title={label} className="theme-toggle grid h-9 w-9 place-items-center rounded-full border border-black/10 bg-white/60 text-ink transition hover:-translate-y-0.5 hover:border-brand-500/40 hover:text-brand-700" suppressHydrationWarning>
      {mounted && dark ? (
        <svg aria-hidden viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="1.8"><circle cx="12" cy="12" r="3.5"/><path d="M12 2.5v2M12 19.5v2M4.5 12h-2M21.5 12h-2M5.3 5.3 3.9 3.9M20.1 20.1l-1.4-1.4M18.7 5.3l1.4-1.4M3.9 20.1l1.4-1.4"/></svg>
      ) : (
        <svg aria-hidden viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="1.8"><path d="M20.3 15.3A8.5 8.5 0 0 1 8.7 3.7 8.5 8.5 0 1 0 20.3 15.3Z"/></svg>
      )}
    </button>
  );
}
