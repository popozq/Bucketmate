"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import { Locale } from "@/types";

// 동적 역할 진입점 — 사용자가 무엇을 원하는지 한 줄로 말하면,
// 버킷이 알맞은 전문가 역할을 스스로 맡아 대화를 시작한다. (고정 팩/폼 없음)
const copy = {
  ko: {
    eyebrow: "버킷에게 말 걸기",
    title: "무엇을 도와드릴까요?",
    sub: "하고 싶은 일이나 고민을 자유롭게 적어주세요. 버킷이 딱 맞는 전문가가 되어 도와드릴게요.",
    placeholder: "예) 프리랜서 디자이너를 위한 클라이언트 관리 SaaS를 만들고 싶어요",
    start: "버킷과 대화 시작",
    starting: "버킷을 준비하고 있어요...",
    examples: "이런 걸 시작할 수 있어요",
    note: "입력은 이 브라우저에만 저장됩니다",
    presets: [
      "사업 아이디어를 구체화하고 싶어요",
      "이력서와 구직을 준비하고 있어요",
      "가게 운영을 개선하고 싶어요",
      "SNS·마케팅 계획이 필요해요",
      "공부·시험 계획을 세우고 싶어요",
    ],
  },
  en: {
    eyebrow: "Talk to Bucket",
    title: "What can I help with?",
    sub: "Tell me what you're working on or stuck on. Bucket will become the right expert and help.",
    placeholder: "e.g. I want to build a client-management SaaS for freelance designers",
    start: "Start chatting",
    starting: "Getting Bucket ready...",
    examples: "You could start with",
    note: "Your input stays in this browser only",
    presets: [
      "I want to shape a business idea",
      "I'm preparing my resume and job search",
      "I want to improve my shop's operations",
      "I need a social / marketing plan",
      "I want to plan my studies / exam",
    ],
  },
};

export function StartComposer({ locale = "en" }: { locale?: Locale }) {
  const router = useRouter();
  const ko = locale === "ko";
  const t = copy[locale];
  const [goal, setGoal] = useState("");
  const [starting, setStarting] = useState(false);

  const start = (text: string) => {
    const g = text.trim();
    if (!g || starting) return;
    setStarting(true);
    window.localStorage.setItem(`bucketmate-goal-${locale}`, g);
    // 이전 팩 모드 데이터는 정리 (동적 모드로 새 세션)
    window.localStorage.removeItem(`bucketmate-agent-${locale}`);
    window.localStorage.removeItem(`bucketmate-answers-${locale}`);
    window.setTimeout(() => router.push(`${ko ? "" : "/en"}/workspace`), 300);
  };

  const submit = (e: FormEvent) => {
    e.preventDefault();
    start(goal);
  };

  return (
    <main className="page-shell py-16 sm:py-24">
      <div className="mx-auto max-w-2xl">
        <div className="text-center">
          <p className="eyebrow">{t.eyebrow}</p>
          <h1 className="mt-4 text-4xl font-black tracking-tight sm:text-5xl">{t.title}</h1>
          <p className="mt-5 leading-7 text-black/55">{t.sub}</p>
        </div>

        <form onSubmit={submit} className="card mt-10 p-5 sm:p-6">
          <div className="flex items-start gap-3">
            <span className="mt-1 grid h-9 w-9 shrink-0 place-items-center rounded-xl bg-brand-100 text-sm font-black text-brand-700">
              B
            </span>
            <textarea
              autoFocus
              rows={3}
              value={goal}
              onChange={(e) => setGoal(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter" && (e.metaKey || e.ctrlKey)) submit(e);
              }}
              placeholder={t.placeholder}
              className="flex-1 resize-none bg-transparent py-1.5 text-base leading-7 outline-none placeholder:text-black/25"
            />
          </div>
          <button
            type="submit"
            disabled={!goal.trim() || starting}
            className="primary-button mt-3 w-full disabled:cursor-not-allowed disabled:opacity-50"
          >
            {starting ? t.starting : t.start} {starting ? "✦" : "→"}
          </button>
        </form>

        <div className="mt-8">
          <p className="text-center text-xs font-black uppercase tracking-wider text-black/35">{t.examples}</p>
          <div className="mt-4 flex flex-wrap justify-center gap-2.5">
            {t.presets.map((preset) => (
              <button
                key={preset}
                type="button"
                onClick={() => setGoal(preset)}
                className="rounded-full border border-black/10 bg-white px-4 py-2.5 text-sm font-semibold text-black/65 transition hover:border-brand-500 hover:text-brand-700"
              >
                {preset}
              </button>
            ))}
          </div>
        </div>

        <p className="mt-8 text-center text-xs text-black/35">{t.note}</p>
      </div>
    </main>
  );
}
