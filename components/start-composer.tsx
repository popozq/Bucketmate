import { GoalInput } from "@/components/goal-input";
import { Locale } from "@/types";

// 동적 역할 진입 페이지(/agents) — 열린 입력으로 버킷과 바로 대화 시작.
const copy = {
  ko: {
    eyebrow: "버킷에게 말 걸기",
    title: "무엇을 도와드릴까요?",
    sub: "하고 싶은 일이나 고민을 자유롭게 적어주세요. 버킷이 딱 맞는 전문가가 되어 도와드릴게요.",
    note: "입력은 이 브라우저에만 저장됩니다",
  },
  en: {
    eyebrow: "Talk to Bucket",
    title: "What can I help with?",
    sub: "Tell me what you're working on or stuck on. Bucket will become the right expert and help.",
    note: "Your input stays in this browser only",
  },
};

export function StartComposer({ locale = "en" }: { locale?: Locale }) {
  const t = copy[locale];
  return (
    <main className="page-shell py-16 sm:py-24">
      <div className="mx-auto max-w-2xl">
        <div className="text-center">
          <p className="eyebrow">{t.eyebrow}</p>
          <h1 className="mt-4 text-4xl font-black tracking-tight sm:text-5xl">{t.title}</h1>
          <p className="mt-5 leading-7 text-black/55">{t.sub}</p>
        </div>
        <div className="mt-10">
          <GoalInput locale={locale} autoFocus />
        </div>
        <p className="mt-8 text-center text-xs text-black/35">{t.note}</p>
      </div>
    </main>
  );
}
