"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { getLocalizedAgentPack } from "@/data/agent-packs";
import { ExecutionPlan, Locale } from "@/types";

export function WorkspaceDashboard({ locale = "en" }: { locale?: Locale }) {
  const [plan, setPlan] = useState<ExecutionPlan | null>(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const saved = window.localStorage.getItem(`bucketmate-plan-${locale}`) ?? window.localStorage.getItem("bucketmate-plan");
    if (saved) setPlan(JSON.parse(saved));
    setReady(true);
  }, [locale]);

  const totals = useMemo(() => {
    const tasks = plan?.buckets.flatMap((bucket) => bucket.tasks) ?? [];
    return { all: tasks.length, done: tasks.filter((task) => task.completed).length };
  }, [plan]);

  const progress = totals.all ? Math.round((totals.done / totals.all) * 100) : 0;
  const agent = plan ? getLocalizedAgentPack(plan.agentId, locale) : undefined;
  const prefix = locale === "en" ? "/en" : "";

  const toggleTask = (bucketId: string, taskId: string) => {
    if (!plan) return;
    const updated = { ...plan, buckets: plan.buckets.map((bucket) => bucket.id === bucketId ? { ...bucket, tasks: bucket.tasks.map((task) => task.id === taskId ? { ...task, completed: !task.completed } : task) } : bucket) };
    setPlan(updated);
    window.localStorage.setItem(`bucketmate-plan-${locale}`, JSON.stringify(updated));
  };

  if (!ready) return <main className="page-shell py-20"><div className="h-72 animate-pulse rounded-3xl bg-black/5" /></main>;

  if (!plan) return (
    <main className="page-shell py-24"><div className="card mx-auto max-w-2xl p-10 text-center sm:p-16"><span className="mx-auto grid h-16 w-16 place-items-center rounded-2xl bg-brand-100 text-2xl">◎</span><h1 className="mt-6 text-3xl font-black">{locale === "ko" ? "새로운 목표를 시작할 준비가 됐어요." : "Your workspace is ready for a goal."}</h1><p className="mt-4 leading-7 text-black/50">{locale === "ko" ? "에이전트 팩을 고르고 목표에 관한 질문에 답하면 실행 계획이 이곳에 나타납니다." : "Choose an Agent Pack and answer the intake questions. Your generated plan will appear here."}</p><Link href={`${prefix}/agents`} className="primary-button mt-8">{locale === "ko" ? "에이전트 팩 선택하기" : "Choose an Agent Pack"} →</Link></div></main>
  );

  return (
    <main className="pb-20">
      <section className="bg-ink text-white">
        <div className="page-shell py-10 sm:py-14">
          <div className="flex flex-col justify-between gap-8 lg:flex-row lg:items-end">
            <div className="max-w-3xl"><div className="flex items-center gap-3"><span className={`grid h-10 w-10 place-items-center rounded-xl text-lg ${agent?.accent ?? "bg-brand-100 text-brand-700"}`}>{agent?.icon ?? "B"}</span><span className="text-xs font-bold uppercase tracking-widest text-white/45">{agent?.name ?? "Agent Pack"}</span></div><h1 className="mt-6 text-3xl font-black tracking-tight sm:text-5xl">{plan.goalSummary}</h1></div>
            <Link href={`${prefix}/agents`} className="w-fit rounded-full border border-white/15 px-5 py-2.5 text-sm font-bold text-white/80 hover:bg-white/10">{locale === "ko" ? "새 계획 시작" : "Start another plan"}</Link>
          </div>
          <div className="mt-10 grid gap-4 sm:grid-cols-3"><div className="rounded-2xl bg-white/[0.06] p-5"><p className="text-xs font-bold text-white/40">{locale === "ko" ? "목표" : "TARGET"}</p><p className="mt-2 text-sm font-semibold leading-6">{plan.target}</p></div><div className="rounded-2xl bg-white/[0.06] p-5"><p className="text-xs font-bold text-white/40">{locale === "ko" ? "기간" : "TIMELINE"}</p><p className="mt-2 text-sm font-semibold">{plan.timeline}</p></div><div className="rounded-2xl bg-white/[0.06] p-5"><p className="text-xs font-bold text-white/40">{locale === "ko" ? "진행률" : "PROGRESS"}</p><div className="mt-3 flex items-center gap-3"><div className="h-2 flex-1 overflow-hidden rounded-full bg-white/10"><div className="h-full rounded-full bg-brand-500 transition-all" style={{ width: `${progress}%` }} /></div><span className="text-sm font-black">{progress}%</span></div></div></div>
        </div>
      </section>

      <div className="page-shell grid gap-8 py-10 lg:grid-cols-[1fr_310px] lg:items-start">
        <section>
          <div className="mb-6 flex items-end justify-between"><div><p className="eyebrow">{locale === "ko" ? "실행 버킷" : "Execution buckets"}</p><h2 className="mt-2 text-3xl font-black">{locale === "ko" ? "해야 할 일을 한눈에." : "Your work, organized."}</h2></div><span className="text-sm font-bold text-black/40">{locale === "ko" ? `${totals.all}개 중 ${totals.done}개 완료` : `${totals.done} of ${totals.all} done`}</span></div>
          <div className="space-y-5">
            {plan.buckets.map((bucket, bucketIndex) => {
              const done = bucket.tasks.filter((task) => task.completed).length;
              return (
                <article key={bucket.id} className="card overflow-hidden">
                  <div className="flex items-start gap-4 border-b border-black/5 p-5 sm:p-6"><span className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-brand-100 text-sm font-black text-brand-700">{bucketIndex + 1}</span><div className="flex-1"><div className="flex justify-between gap-4"><h3 className="text-lg font-black">{bucket.name}</h3><span className="text-xs font-bold text-black/35">{done}/{bucket.tasks.length}</span></div><p className="mt-1 text-sm text-black/45">{bucket.description}</p></div></div>
                  <div className="divide-y divide-black/5">{bucket.tasks.map((task) => <label key={task.id} className="group flex cursor-pointer items-start gap-4 p-5 transition hover:bg-cream/70 sm:px-6"><input type="checkbox" checked={task.completed} onChange={() => toggleTask(bucket.id, task.id)} className="mt-0.5 h-5 w-5 shrink-0 accent-[#27a864]" /><div className="flex-1"><div className="flex flex-col justify-between gap-1 sm:flex-row sm:gap-4"><p className={`text-sm font-bold ${task.completed ? "text-black/30 line-through" : "text-ink"}`}>{task.title}</p><span className="shrink-0 text-xs font-bold text-brand-700">{task.day}</span></div><p className={`mt-1.5 text-xs leading-5 ${task.completed ? "text-black/25" : "text-black/45"}`}>{task.detail}</p></div></label>)}</div>
                </article>
              );
            })}
          </div>
        </section>

        <aside className="space-y-5 lg:sticky lg:top-28">
          <div className="rounded-3xl bg-brand-500 p-6 text-white"><div className="flex items-center justify-between"><p className="text-xs font-bold uppercase tracking-widest text-white/65">{locale === "ko" ? "지금 할 일" : "Do this next"}</p><span className="text-xl">→</span></div><p className="mt-5 text-lg font-black leading-7">{plan.nextAction}</p><p className="mt-5 text-xs leading-5 text-white/65">{locale === "ko" ? "완벽한 계획보다 작은 실행이 중요합니다. 다른 일을 더하기 전에 이것부터 끝내세요." : "Momentum beats a perfect plan. Finish this before adding more work."}</p></div>
          <div className="card p-6"><p className="text-xs font-black uppercase tracking-wider text-black/35">AI guide</p><p className="mt-3 text-sm font-black">{agent?.shortName ?? "BucketMate"}</p><p className="mt-2 text-xs leading-5 text-black/45">This is a mocked plan for v0.1. Real AI guidance and account sync come in the next integration phase.</p></div>
        </aside>
      </div>
    </main>
  );
}
