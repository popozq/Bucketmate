"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { AgentPack, Locale } from "@/types";

// Phase 1 대화형 인테이크 — 버킷이 한 번에 하나씩 묻고, 칩으로 빠르게 답한다.
// 답변은 localStorage에 "세션 프로파일"로 저장(구조화). 계정/DB는 Phase 2.
export function ConversationalIntake({ agent, locale = "en" }: { agent: AgentPack; locale?: Locale }) {
  const router = useRouter();
  const ko = locale === "ko";
  const questions = agent.intakeQuestions;

  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [text, setText] = useState(""); // text 타입 또는 직접 입력값
  const [multi, setMulti] = useState<string[]>([]); // multi 타입 진행 중 선택
  const [customOpen, setCustomOpen] = useState(false); // single + allowCustom 직접 입력 열림
  const [submitting, setSubmitting] = useState(false);

  const q = questions[step];
  const isLast = step === questions.length - 1;
  const t = (k: string, e: string) => (ko ? k : e);

  const commit = (value: string) => {
    const updated = { ...answers, [q.id]: value };
    setAnswers(updated);
    if (isLast) {
      setSubmitting(true);
      window.localStorage.setItem(`bucketmate-answers-${locale}`, JSON.stringify(updated));
      window.localStorage.setItem(`bucketmate-agent-${locale}`, agent.id);
      window.setTimeout(() => router.push(`${ko ? "" : "/en"}/workspace`), 350);
      return;
    }
    setStep(step + 1);
    setText("");
    setMulti([]);
    setCustomOpen(false);
  };

  const goBack = () => {
    if (step === 0) return;
    setStep(step - 1);
    setText("");
    setMulti([]);
    setCustomOpen(false);
  };

  const toggleMulti = (option: string) =>
    setMulti((cur) => (cur.includes(option) ? cur.filter((o) => o !== option) : [...cur, option]));

  const chip = "rounded-full border px-4 py-2.5 text-sm font-bold transition";

  return (
    <div className="card p-6 sm:p-9">
      {/* 진행 헤더 */}
      <div className="mb-7 flex items-center justify-between border-b border-black/5 pb-5">
        <button
          type="button"
          onClick={goBack}
          disabled={step === 0}
          className="text-xs font-bold text-black/45 transition enabled:hover:text-brand-700 disabled:opacity-30"
        >
          ← {t("이전", "Back")}
        </button>
        <div className="flex items-center gap-2">
          {questions.map((_, i) => (
            <span
              key={i}
              className={`h-1.5 rounded-full transition-all ${i === step ? "w-6 bg-brand-500" : i < step ? "w-3 bg-brand-300" : "w-3 bg-black/10"}`}
            />
          ))}
        </div>
        <span className="text-xs font-bold text-black/40">
          {step + 1}/{questions.length}
        </span>
      </div>

      {/* 버킷의 질문 */}
      <div className="flex items-start gap-3">
        <span className="mt-0.5 grid h-9 w-9 shrink-0 place-items-center rounded-xl bg-brand-100 text-sm font-black text-brand-700">
          B
        </span>
        <div className="rounded-3xl rounded-tl-md bg-cream/70 px-5 py-4">
          <p className="text-[11px] font-black uppercase tracking-wider text-black/35">{t("버킷", "Bucket")}</p>
          <p className="mt-1 text-base font-black leading-7">{q.label}</p>
        </div>
      </div>

      {/* 답변 영역 */}
      <div className="mt-7">
        {q.type === "text" && (
          <form
            onSubmit={(e) => {
              e.preventDefault();
              if (text.trim()) commit(text.trim());
            }}
          >
            <textarea
              autoFocus
              rows={3}
              value={text}
              onChange={(e) => setText(e.target.value)}
              placeholder={q.placeholder}
              className="w-full resize-none rounded-2xl border border-black/10 bg-cream/60 px-4 py-3.5 text-sm leading-6 outline-none transition placeholder:text-black/25 focus:border-brand-500 focus:bg-white focus:ring-4 focus:ring-brand-100"
            />
            <button
              type="submit"
              disabled={!text.trim()}
              className="primary-button mt-4 w-full disabled:cursor-not-allowed disabled:opacity-50"
            >
              {isLast ? t("버킷과 대화 시작", "Start chatting") : t("다음", "Next")} →
            </button>
          </form>
        )}

        {q.type === "single" && (
          <div className="flex flex-wrap gap-2.5">
            {q.options?.map((option) => (
              <button
                key={option}
                type="button"
                onClick={() => commit(option)}
                className={`${chip} border-black/10 hover:border-brand-500 hover:bg-brand-50 hover:text-brand-700`}
              >
                {option}
              </button>
            ))}
            {q.allowCustom && !customOpen && (
              <button
                type="button"
                onClick={() => setCustomOpen(true)}
                className={`${chip} border-dashed border-black/20 text-black/50 hover:border-brand-500 hover:text-brand-700`}
              >
                + {t("직접 입력", "Type my own")}
              </button>
            )}
            {q.allowCustom && customOpen && (
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  if (text.trim()) commit(text.trim());
                }}
                className="flex w-full gap-2"
              >
                <input
                  autoFocus
                  value={text}
                  onChange={(e) => setText(e.target.value)}
                  placeholder={t("직접 입력...", "Type your answer...")}
                  className="flex-1 rounded-full border border-black/10 bg-cream/60 px-4 py-2.5 text-sm outline-none transition focus:border-brand-500 focus:bg-white focus:ring-4 focus:ring-brand-100"
                />
                <button type="submit" disabled={!text.trim()} className="primary-button !px-5 !py-2.5 disabled:opacity-50">
                  →
                </button>
              </form>
            )}
          </div>
        )}

        {q.type === "multi" && (
          <div>
            <p className="mb-3 text-xs font-semibold text-black/40">{t("해당되는 걸 모두 선택하세요", "Select all that apply")}</p>
            <div className="flex flex-wrap gap-2.5">
              {q.options?.map((option) => {
                const on = multi.includes(option);
                return (
                  <button
                    key={option}
                    type="button"
                    onClick={() => toggleMulti(option)}
                    className={`${chip} ${on ? "border-brand-500 bg-brand-500 text-white" : "border-black/10 hover:border-brand-500 hover:text-brand-700"}`}
                  >
                    {on ? "✓ " : ""}
                    {option}
                  </button>
                );
              })}
            </div>
            <button
              type="button"
              onClick={() => commit(multi.join(", "))}
              disabled={multi.length === 0}
              className="primary-button mt-5 w-full disabled:cursor-not-allowed disabled:opacity-50"
            >
              {isLast ? t("버킷과 대화 시작", "Start chatting") : t("다음", "Next")} →
            </button>
          </div>
        )}
      </div>

      <p className="mt-6 text-center text-xs text-black/35">
        {submitting
          ? t("버킷을 준비하고 있어요...", "Getting Bucket ready...")
          : t("답변은 이 브라우저에만 저장됩니다", "Your answers stay in this browser only")}
      </p>
    </div>
  );
}
