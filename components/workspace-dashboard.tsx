"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { useChat } from "ai/react";
import { getLocalizedAgentPack } from "@/data/agent-packs";
import { Locale } from "@/types";

export function WorkspaceDashboard({ locale = "en" }: { locale?: Locale }) {
  const [agentId, setAgentId] = useState<string | null>(null);
  const [answers, setAnswers] = useState<Record<string, unknown> | null>(null);
  const [goal, setGoal] = useState<string | null>(null);
  const [ready, setReady] = useState(false);
  const triggered = useRef(false);
  const bottomRef = useRef<HTMLDivElement>(null);
  const prefix = locale === "en" ? "/en" : "";
  const ko = locale === "ko";

  useEffect(() => {
    // 동적 역할 모드(goal) 우선, 없으면 레거시 팩 모드(agent+answers)
    const savedGoal = window.localStorage.getItem(`bucketmate-goal-${locale}`);
    if (savedGoal) {
      setGoal(savedGoal);
    } else {
      const savedAnswers = window.localStorage.getItem(`bucketmate-answers-${locale}`);
      const savedAgent = window.localStorage.getItem(`bucketmate-agent-${locale}`);
      if (savedAnswers) setAnswers(JSON.parse(savedAnswers));
      if (savedAgent) setAgentId(savedAgent);
    }
    setReady(true);
  }, [locale]);

  const agent = agentId ? getLocalizedAgentPack(agentId, locale) : undefined;
  const dynamic = !!goal;
  const hasSession = dynamic || (!!agentId && !!answers);

  const MAX_MESSAGES = 20; // route.ts의 MAX_MESSAGES_PER_SESSION과 일치

  const { messages, input, handleInputChange, handleSubmit, isLoading, append, error } = useChat({
    api: "/api/chat",
    body: { agentId, answers, goal, locale },
  });

  const limitReached = messages.length >= MAX_MESSAGES;

  // 첫 메시지 자동 트리거
  useEffect(() => {
    if (!ready || triggered.current) return;
    if (dynamic) {
      // 동적 모드: 사용자가 입력한 목표가 곧 첫 메시지
      triggered.current = true;
      append({ role: "user", content: goal! });
    } else if (agentId && answers) {
      // 팩 모드: 일반 인사로 시작
      triggered.current = true;
      append({
        role: "user",
        content: ko
          ? "안녕하세요! 제 상황을 파악해주시고, 지금 당장 집중해야 할 것과 첫 번째 조언을 해주세요."
          : "Hello! Please review my situation and share your initial assessment — what should I focus on first?",
      });
    }
  }, [ready, dynamic, goal, agentId, answers]);

  // 새 메시지마다 하단 스크롤
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  if (!ready) {
    return (
      <main className="page-shell py-20">
        <div className="h-72 animate-pulse rounded-3xl bg-black/5" />
      </main>
    );
  }

  if (!hasSession) {
    return (
      <main className="page-shell py-24">
        <div className="card mx-auto max-w-2xl p-10 text-center sm:p-16">
          <span className="mx-auto grid h-16 w-16 place-items-center rounded-2xl bg-brand-100 text-2xl">◎</span>
          <h1 className="mt-6 text-3xl font-black">
            {ko ? "버킷과 대화를 시작해 보세요." : "Start a conversation with Bucket."}
          </h1>
          <p className="mt-4 leading-7 text-black/50">
            {ko
              ? "무엇을 도와드릴지 한 줄로 알려주시면, 버킷이 딱 맞는 전문가가 되어 대화를 시작해요."
              : "Tell Bucket what you need in one line, and it becomes the right expert to help."}
          </p>
          <Link href={`${prefix}/agents`} className="primary-button mt-8">
            {ko ? "버킷에게 말 걸기" : "Talk to Bucket"} →
          </Link>
        </div>
      </main>
    );
  }

  return (
    <div className="flex h-[calc(100dvh-80px)] flex-col">
      {/* 세션 헤더 */}
      <div className="border-b border-black/5 bg-white/80 px-6 py-4 backdrop-blur">
        <div className="mx-auto flex max-w-3xl items-center justify-between">
          <div className="flex items-center gap-3">
            <span className={`grid h-10 w-10 shrink-0 place-items-center rounded-xl text-lg ${agent?.accent ?? "bg-brand-100 text-brand-700"}`}>
              {agent?.icon ?? "B"}
            </span>
            <div>
              <p className="text-sm font-black">{agent?.shortName ?? (ko ? "버킷" : "Bucket")}</p>
              <p className="text-xs text-black/40">
                {agent
                  ? (ko ? "버킷 · AI 전문가 세션" : "Bucket · Live AI session")
                  : (ko ? "AI 전문가 세션" : "Live AI session")}
              </p>
            </div>
          </div>
          <Link
            href={`${prefix}/agents`}
            className="rounded-full border border-black/10 px-4 py-2 text-xs font-bold text-black/55 transition hover:border-brand-500 hover:text-brand-700"
          >
            {ko ? "새 세션" : "New session"} →
          </Link>
        </div>
      </div>

      {/* 메시지 영역 */}
      <div className="flex-1 overflow-y-auto">
        <div className="mx-auto max-w-3xl space-y-6 px-6 py-8">
          {messages.map((msg, i) => {
            // 자동 트리거된 첫 유저 메시지는 숨김
            if (i === 0 && msg.role === "user") return null;
            return (
              <div key={msg.id} className={`flex gap-3 ${msg.role === "user" ? "flex-row-reverse" : ""}`}>
                {msg.role === "assistant" && (
                  <span className={`mt-1 grid h-9 w-9 shrink-0 place-items-center rounded-xl text-sm ${agent?.accent ?? "bg-brand-100 text-brand-700"}`}>
                    {agent?.icon ?? "B"}
                  </span>
                )}
                <div
                  className={`max-w-[80%] rounded-3xl px-5 py-4 text-sm leading-7 ${
                    msg.role === "user"
                      ? "rounded-tr-lg bg-ink text-white"
                      : "rounded-tl-lg bg-white shadow-sm ring-1 ring-black/5"
                  }`}
                >
                  <p className="whitespace-pre-wrap">{msg.content}</p>
                </div>
              </div>
            );
          })}

          {/* AI 타이핑 인디케이터 */}
          {isLoading && (
            <div className="flex gap-3">
              <span className={`mt-1 grid h-9 w-9 shrink-0 place-items-center rounded-xl text-sm ${agent?.accent ?? "bg-brand-100 text-brand-700"}`}>
                {agent?.icon ?? "B"}
              </span>
              <div className="rounded-3xl rounded-tl-lg bg-white px-5 py-4 shadow-sm ring-1 ring-black/5">
                <span className="flex items-center gap-1.5">
                  <span className="h-2 w-2 animate-bounce rounded-full bg-black/25 [animation-delay:0ms]" />
                  <span className="h-2 w-2 animate-bounce rounded-full bg-black/25 [animation-delay:150ms]" />
                  <span className="h-2 w-2 animate-bounce rounded-full bg-black/25 [animation-delay:300ms]" />
                </span>
              </div>
            </div>
          )}
          <div ref={bottomRef} />
        </div>
      </div>

      {/* 입력창 */}
      <div className="border-t border-black/5 bg-white/80 px-6 py-4 backdrop-blur">
        {limitReached ? (
          <div className="mx-auto flex max-w-3xl flex-col items-center gap-3 py-2 text-center sm:flex-row sm:justify-between sm:text-left">
            <p className="text-sm font-semibold text-black/55">
              {ko
                ? "이 세션의 대화 한도에 도달했어요. 새 세션을 시작해 주세요."
                : "You've reached this session's message limit. Start a new session to continue."}
            </p>
            <Link href={`${prefix}/agents`} className="primary-button shrink-0 !py-2.5">
              {ko ? "새 세션 시작" : "New session"} →
            </Link>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="mx-auto flex max-w-3xl gap-3">
            <input
              value={input}
              onChange={handleInputChange}
              placeholder={ko ? "질문하거나 더 자세한 도움을 요청하세요..." : "Ask a follow-up or request specific help..."}
              className="flex-1 rounded-2xl border border-black/10 bg-cream/60 px-5 py-3.5 text-sm outline-none transition placeholder:text-black/30 focus:border-brand-500 focus:bg-white focus:ring-4 focus:ring-brand-100"
            />
            <button
              type="submit"
              disabled={isLoading || !input?.trim()}
              className="primary-button disabled:cursor-not-allowed disabled:opacity-50"
            >
              {ko ? "전송" : "Send"} →
            </button>
          </form>
        )}
        {error && !limitReached && (
          <p className="mx-auto mt-2 max-w-3xl text-center text-xs text-red-500">
            {ko ? "응답을 받지 못했어요. 잠시 후 다시 시도해 주세요." : "Couldn't get a response. Please try again in a moment."}
          </p>
        )}
      </div>
    </div>
  );
}
