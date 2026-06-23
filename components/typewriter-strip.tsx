"use client";

import { useEffect, useMemo, useState } from "react";
import { Locale } from "@/types";

const prompts = {
  ko: [
    "버킷, 이력서 작성 좀 도와줘.",
    "버킷, 원가와 마진율을 계산해줘.",
    "버킷, 법인을 만드는 법을 알려줘.",
    "버킷, 오늘 할 일을 전문가별로 정리해줘.",
  ],
  en: [
    "Bucket, help me write my resume.",
    "Bucket, calculate my costs and margin.",
    "Bucket, show me how to form a company.",
    "Bucket, organize today's work by expert role.",
  ],
};

export function TypewriterStrip({ locale }: { locale: Locale }) {
  const items = useMemo(() => prompts[locale], [locale]);
  const [itemIndex, setItemIndex] = useState(0);
  const [visibleText, setVisibleText] = useState("");
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    const current = items[itemIndex];
    const doneTyping = !isDeleting && visibleText === current;
    const doneDeleting = isDeleting && visibleText === "";
    const delay = doneTyping ? 1450 : isDeleting ? 34 : 58;

    const timer = window.setTimeout(() => {
      if (doneTyping) {
        setIsDeleting(true);
        return;
      }

      if (doneDeleting) {
        setIsDeleting(false);
        setItemIndex((index) => (index + 1) % items.length);
        return;
      }

      setVisibleText((text) =>
        isDeleting ? current.slice(0, text.length - 1) : current.slice(0, text.length + 1),
      );
    }, delay);

    return () => window.clearTimeout(timer);
  }, [isDeleting, itemIndex, items, visibleText]);

  return (
    <div className="typewriter-strip border-y border-black/5 py-5 text-white">
      <div className="page-shell">
        <div className="mx-auto flex max-w-4xl items-center gap-3 rounded-2xl border border-white/10 bg-white/[0.07] px-4 py-3 shadow-[0_18px_60px_rgba(7,18,32,.18)] backdrop-blur sm:gap-4 sm:px-5">
          <span className="grid h-9 w-9 shrink-0 place-items-center rounded-xl bg-brand-500/15 text-sm font-black text-brand-100 ring-1 ring-brand-300/25">
            B
          </span>
          <div className="min-w-0 flex-1">
            <p className="mb-1 text-[10px] font-black uppercase tracking-[.24em] text-white/35">
              {locale === "ko" ? "Ask Bucket" : "Ask Bucket"}
            </p>
            <p className="min-h-[1.75rem] truncate text-sm font-extrabold tracking-[-0.01em] text-white sm:text-lg">
              <span>{visibleText}</span>
              <span className="type-cursor ml-0.5 inline-block h-5 w-[2px] translate-y-1 rounded-full bg-brand-300 sm:h-6" />
            </p>
          </div>
          <span className="hidden shrink-0 rounded-full border border-brand-300/20 bg-brand-300/10 px-3 py-1 text-[11px] font-black text-brand-100 sm:inline-flex">
            AI Agent
          </span>
        </div>
      </div>
    </div>
  );
}
