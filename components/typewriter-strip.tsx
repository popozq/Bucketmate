"use client";

import { useEffect, useState } from "react";
import { Locale } from "@/types";

const prompts = {
  ko: [
    "버킷, 이력서 작성 좀 도와줘.",
    "버킷, 원가와 마진율을 계산해줘.",
    "버킷, 인스타 마케팅 계획을 짜줘.",
    "버킷, 오늘 할 일을 전문가별로 정리해줘.",
  ],
  en: [
    "Bucket, help me write my resume.",
    "Bucket, calculate my costs and margin.",
    "Bucket, draft an Instagram marketing plan.",
    "Bucket, organize today's work by expert role.",
  ],
};

// 사용자의 "움직임 줄이기(prefers-reduced-motion)" 설정을 따른다.
function usePrefersReducedMotion() {
  const [reduced, setReduced] = useState(false);
  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    setReduced(mq.matches);
    const handler = () => setReduced(mq.matches);
    mq.addEventListener("change", handler);
    return () => mq.removeEventListener("change", handler);
  }, []);
  return reduced;
}

export function TypewriterStrip({ locale }: { locale: Locale }) {
  const items = prompts[locale];
  const reduced = usePrefersReducedMotion();
  const [itemIndex, setItemIndex] = useState(0);
  const [visibleText, setVisibleText] = useState("");

  // 일반 모드: 한 글자씩 타이핑/삭제 (부드러운 속도)
  const [isDeleting, setIsDeleting] = useState(false);
  useEffect(() => {
    if (reduced) return;
    const current = items[itemIndex];
    const doneTyping = !isDeleting && visibleText === current;
    const doneDeleting = isDeleting && visibleText === "";
    // 가독성을 위해 살짝 느리고 일정한 속도, 다 친 뒤엔 충분히 머무름
    const delay = doneTyping ? 1900 : doneDeleting ? 400 : isDeleting ? 42 : 70;

    const timer = window.setTimeout(() => {
      if (doneTyping) return setIsDeleting(true);
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
  }, [reduced, isDeleting, itemIndex, items, visibleText]);

  // 움직임 줄이기 모드: 타이핑 없이 문장을 통째로 보여주고 천천히 교체
  useEffect(() => {
    if (!reduced) return;
    setVisibleText(items[itemIndex]);
    const timer = window.setTimeout(() => {
      setItemIndex((index) => (index + 1) % items.length);
    }, 3600);
    return () => window.clearTimeout(timer);
  }, [reduced, itemIndex, items]);

  return (
    <div className="typewriter-strip border-y border-black/5 py-5 text-white">
      <div className="page-shell">
        <div className="mx-auto flex max-w-4xl items-center gap-3 rounded-2xl border border-white/10 bg-white/[0.07] px-4 py-3 shadow-[0_18px_60px_rgba(7,18,32,.18)] backdrop-blur sm:gap-4 sm:px-5">
          <span className="grid h-9 w-9 shrink-0 place-items-center rounded-xl bg-brand-500/15 text-sm font-black text-brand-100 ring-1 ring-brand-300/25">
            B
          </span>
          <div className="min-w-0 flex-1">
            <p className="mb-1 text-[10px] font-black uppercase tracking-[.24em] text-white/35">
              Ask Bucket
            </p>
            <p className="min-h-[1.75rem] truncate text-sm font-extrabold tracking-[-0.01em] text-white sm:text-lg">
              <span>{visibleText}</span>
              <span
                className={`ml-0.5 inline-block h-5 w-[2px] translate-y-1 rounded-full bg-brand-300 sm:h-6 ${reduced ? "" : "type-cursor"}`}
              />
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
