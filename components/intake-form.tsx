"use client";

import { FormEvent, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { AgentPack, Locale } from "@/types";
import { generateMockPlan } from "@/lib/mock-plan";

export function IntakeForm({ agent, locale = "en" }: { agent: AgentPack; locale?: Locale }) {
  const router = useRouter();
  const initial = useMemo(() => Object.fromEntries(agent.intakeQuestions.map((question) => [question.id, ""])), [agent]);
  const [answers, setAnswers] = useState<Record<string, string>>(initial);
  const [isGenerating, setIsGenerating] = useState(false);
  const completed = Object.values(answers).filter((value) => value.trim()).length;

  const submit = (event: FormEvent) => {
    event.preventDefault();
    setIsGenerating(true);
    const plan = generateMockPlan(agent, answers, locale);
    window.localStorage.setItem(`bucketmate-plan-${locale}`, JSON.stringify(plan));
    window.localStorage.setItem(`bucketmate-answers-${locale}`, JSON.stringify(answers));
    window.setTimeout(() => router.push(`${locale === "en" ? "/en" : ""}/workspace`), 650);
  };

  return (
    <form onSubmit={submit} className="card p-6 sm:p-9">
      <div className="mb-9 flex items-center justify-between border-b border-black/5 pb-6"><div><p className="text-sm font-black">{locale === "ko" ? "목표 입력" : "Plan intake"}</p><p className="mt-1 text-xs text-black/40">{locale === "ko" ? "구체적으로 적되, 너무 오래 고민하지 마세요." : "Be specific, but don’t overthink it."}</p></div><span className="rounded-full bg-brand-50 px-3 py-1.5 text-xs font-bold text-brand-700">{completed}/{agent.intakeQuestions.length} {locale === "ko" ? "답변" : "answered"}</span></div>
      <div className="space-y-7">
        {agent.intakeQuestions.map((question, index) => (
          <label key={question.id} className="block">
            <span className="mb-2.5 flex gap-3 text-sm font-bold"><span className="text-brand-600">{String(index + 1).padStart(2, "0")}</span>{question.label}</span>
            <textarea required rows={3} value={answers[question.id]} onChange={(event) => setAnswers({ ...answers, [question.id]: event.target.value })} placeholder={question.placeholder} className="w-full resize-none rounded-2xl border border-black/10 bg-cream/60 px-4 py-3.5 text-sm leading-6 outline-none transition placeholder:text-black/25 focus:border-brand-500 focus:bg-white focus:ring-4 focus:ring-brand-100" />
          </label>
        ))}
      </div>
      <button disabled={isGenerating} className="primary-button mt-9 w-full disabled:cursor-wait disabled:opacity-70">{isGenerating ? (locale === "ko" ? "실행 계획을 만드는 중..." : "Building your plan...") : (locale === "ko" ? "나만의 실행 계획 만들기" : "Generate my execution plan")}<span className="ml-2">{isGenerating ? "✦" : "→"}</span></button>
      <p className="mt-4 text-center text-xs text-black/35">{locale === "ko" ? "Mock AI 모드 · 답변은 이 브라우저에만 저장됩니다" : "Mock AI mode · Your answers stay in this browser"}</p>
    </form>
  );
}
