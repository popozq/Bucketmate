"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import { Locale } from "@/types";

// 동적 역할 진입의 핵심 입력 — 랜딩 히어로와 /agents 양쪽에서 재사용.
// 한 줄 입력 → goal 저장 → /workspace 에서 버킷이 알맞은 전문가로 대화 시작.
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

const copy = {
  ko: { placeholder: "무엇을 도와드릴까요? 한 줄로 적어주세요...", start: "버킷과 대화 시작", starting: "버킷을 준비하고 있어요...", examples: "이렇게 시작해도 돼요" },
  en: { placeholder: "What can I help with? Type one line...", start: "Start chatting", starting: "Getting Bucket ready...", examples: "Or start with one of these" },
};

export function GoalInput({ locale = "en", autoFocus = false, showChips = true }: { locale?: Locale; autoFocus?: boolean; showChips?: boolean }) {
  const router = useRouter();
  const ko = locale === "ko";
  const c = copy[locale];
  const [goal, setGoal] = useState("");
  const [starting, setStarting] = useState(false);

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
      <form onSubmit={submit} className="card p-3 shadow-soft sm:p-4">
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
            placeholder={c.placeholder}
            className="flex-1 resize-none bg-transparent py-1.5 text-base leading-7 outline-none placeholder:text-black/25"
          />
        </div>
        <button
          type="submit"
          disabled={!goal.trim() || starting}
          className="primary-button mt-2 w-full disabled:cursor-not-allowed disabled:opacity-50"
        >
          {starting ? c.starting : c.start} {starting ? "✦" : "→"}
        </button>
      </form>

      {showChips && (
        <div className="mt-5">
          <p className="text-center text-xs font-bold text-black/35">{c.examples}</p>
          <div className="mt-3 flex flex-wrap justify-center gap-2">
            {presets[locale].map((preset) => (
              <button
                key={preset}
                type="button"
                onClick={() => setGoal(preset)}
                className="rounded-full border border-black/10 bg-white/70 px-3.5 py-2 text-sm font-semibold text-black/60 backdrop-blur transition hover:border-brand-500 hover:text-brand-700"
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
