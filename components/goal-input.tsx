"use client";

import { FormEvent, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Locale } from "@/types";

// 동적 역할 진입의 핵심 입력 — 랜딩 히어로/시작 페이지/CTA에서 재사용.
// 테마(라이트·다크)에 맞춰 스타일이 바뀌고, placeholder는 타자기처럼 타이핑된다.
const presets = {
  ko: [
    "사업 아이디어를 구체화하고 싶어요",
    "이력서와 구직을 준비하고 있어요",
    "가게 운영을 개선하고 싶어요",
    "SNS·마케팅 계획이 필요해요",
    "공부·시험 계획을 세우고 싶어요",
  ],
  en: [
    "I want to shape a business idea",
    "I'm preparing my resume and job search",
    "I want to improve my shop's operations",
    "I need a social / marketing plan",
    "I want to plan my studies / exam",
  ],
};

// placeholder가 타자기처럼 한 글자씩 타이핑되며 예시를 보여준다.
const typed = {
  ko: ["무엇을 도와드릴까요?", "사업 아이디어를 구체화하고 싶어요", "이력서를 다듬고 싶어요", "동네 가게를 홍보하고 싶어요", "공부 계획을 세우고 싶어요"],
  en: ["What can I help with?", "I want to shape a business idea", "I want to polish my resume", "I want to promote my local shop", "I want to plan my studies"],
};

const copy = {
  ko: { start: "버킷과 대화 시작", starting: "버킷을 준비하고 있어요...", examples: "이렇게 시작해도 돼요" },
  en: { start: "Start chatting", starting: "Getting Bucket ready...", examples: "Or start with one of these" },
};

function usePrefersReducedMotion() {
  const [reduced, setReduced] = useState(false);
  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    setReduced(mq.matches);
    const h = () => setReduced(mq.matches);
    mq.addEventListener("change", h);
    return () => mq.removeEventListener("change", h);
  }, []);
  return reduced;
}

// 타자기 placeholder — 타이핑 → 잠시 멈춤 → 지움 → 다음 문장
function useTypewriter(items: string[]) {
  const reduced = usePrefersReducedMotion();
  const [text, setText] = useState("");
  const [idx, setIdx] = useState(0);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    if (reduced) {
      setText(items[0]);
      return;
    }
    const current = items[idx];
    const doneTyping = !deleting && text === current;
    const doneDeleting = deleting && text === "";
    const delay = doneTyping ? 2200 : doneDeleting ? 500 : deleting ? 38 : 85; // 느긋한 속도

    const t = window.setTimeout(() => {
      if (doneTyping) return setDeleting(true);
      if (doneDeleting) {
        setDeleting(false);
        setIdx((i) => (i + 1) % items.length);
        return;
      }
      setText((v) => (deleting ? current.slice(0, v.length - 1) : current.slice(0, v.length + 1)));
    }, delay);
    return () => window.clearTimeout(t);
  }, [reduced, deleting, idx, text, items]);

  // 깜빡이는 커서 흉내 (타이핑 중엔 항상, 멈춤 중엔 placeholder라 큰 의미는 없음)
  return text + "▌";
}

export function GoalInput({ locale = "en", autoFocus = false, showChips = true }: { locale?: Locale; autoFocus?: boolean; showChips?: boolean }) {
  const router = useRouter();
  const ko = locale === "ko";
  const c = copy[locale];
  const [goal, setGoal] = useState("");
  const [starting, setStarting] = useState(false);
  const placeholder = useTypewriter(typed[locale]);

  const start = (text: string) => {
    const g = text.trim();
    if (!g || starting) return;
    setStarting(true);
    window.localStorage.setItem(`bucketmate-goal-${locale}`, g);
    window.localStorage.removeItem(`bucketmate-agent-${locale}`);
    window.localStorage.removeItem(`bucketmate-answers-${locale}`);
    window.setTimeout(() => router.push(`${ko ? "" : "/en"}/workspace`), 300);
  };

  const submit = (e: FormEvent) => {
    e.preventDefault();
    start(goal);
  };

  return (
    <div className="w-full">
      <form
        onSubmit={submit}
        className="rounded-3xl border border-black/10 bg-white p-3 shadow-soft transition focus-within:border-brand-500 focus-within:ring-4 focus-within:ring-brand-100 dark:border-white/15 dark:bg-white/10 dark:shadow-[0_24px_70px_rgba(5,12,25,.45)] dark:backdrop-blur-xl dark:focus-within:border-brand-300/60 dark:focus-within:ring-brand-400/20 sm:p-4"
      >
        <div className="flex items-start gap-3">
          <span className="mt-1 grid h-9 w-9 shrink-0 place-items-center rounded-xl bg-brand-100 text-sm font-black text-brand-700">B</span>
          <textarea
            autoFocus={autoFocus}
            rows={2}
            value={goal}
            onChange={(e) => setGoal(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                start(goal);
              }
            }}
            placeholder={placeholder}
            className="flex-1 resize-none bg-transparent py-1.5 text-base leading-7 outline-none placeholder:text-black/30 dark:text-white dark:placeholder:text-white/45"
          />
        </div>
        <button
          type="submit"
          disabled={!goal.trim() || starting}
          className="mt-2 inline-flex w-full items-center justify-center rounded-full bg-ink px-6 py-3.5 font-bold text-white transition hover:-translate-y-0.5 hover:bg-black disabled:cursor-not-allowed disabled:opacity-50 dark:bg-brand-500 dark:shadow-[0_10px_30px_rgba(37,99,235,.35)] dark:hover:bg-brand-600"
        >
          {starting ? c.starting : c.start} {starting ? "✦" : "→"}
        </button>
      </form>

      {showChips && (
        <div className="mt-5">
          <p className="text-center text-xs font-bold text-black/35 dark:text-white/45">{c.examples}</p>
          <div className="mt-3 flex flex-wrap justify-center gap-2">
            {presets[locale].map((preset) => (
              <button
                key={preset}
                type="button"
                onClick={() => setGoal(preset)}
                className="rounded-full border border-black/10 bg-white/70 px-3.5 py-2 text-sm font-semibold text-black/60 backdrop-blur transition hover:-translate-y-0.5 hover:border-brand-500 hover:text-brand-700 dark:border-white/15 dark:bg-white/5 dark:text-white/75 dark:hover:border-brand-300/70 dark:hover:text-white"
              >
                {preset}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
