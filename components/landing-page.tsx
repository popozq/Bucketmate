import Link from "next/link";
import { AgentCard } from "@/components/agent-card";
import { getAgentPacks } from "@/data/agent-packs";
import { Locale } from "@/types";
import { Reveal } from "@/components/motion";

const copy = {
  ko: {
    badge: "BucketMate v0.1 · 한국어 베타",
    title: "큰 목표도, 제대로 나누면",
    highlight: "실행할 수 있어요.",
    intro: "목표에 맞는 전문 에이전트 팩을 고르고 몇 가지 질문에 답해 보세요. 스크롤만 하다 끝나는 대화가 아닌, 오늘 바로 시작할 수 있는 나만의 실행 계획을 만들어 드립니다.",
    cta: "내 실행 계획 만들기",
    how: "어떻게 작동하나요?",
    points: ["약 3분이면 충분해요", "가입 없이 체험 가능", "지금 할 일이 명확해져요"],
    plan: "나의 실행 계획", sampleTitle: "첫 MVP 출시하기", day: "7일 중 1일차", progress: "8개 중 3개 완료",
    sampleBuckets: [["문제 검증", "3개 중 2개"], ["MVP 범위 설정", "3개 중 1개"], ["출시 루프 만들기", "2개 중 0개"]],
    next: "지금 할 일", nextAction: "사용자 한 명 인터뷰하기",
    howLabel: "이용 방법", howTitle: "막연한 목표를 구체적인 행동으로.", howIntro: "전문가의 관점을 실제 일이 진행되는 실행 계획으로 바꿉니다.",
    steps: [["01", "전문가 선택", "지금 목표에 꼭 맞는 에이전트 팩을 선택하세요."], ["02", "상황 알려주기", "짧고 핵심적인 질문에 답하면 현실에 맞는 계획을 설계합니다."], ["03", "계획 실행하기", "명확한 버킷, 과제, 일정과 다음 행동을 따라가세요."]],
    packs: "에이전트 팩", packsTitle: "지금 필요한 전문가를 만나보세요.", explore: "모든 팩 살펴보기",
  },
  en: {
    badge: "BucketMate v0.1", title: "Big goals are easier with the", highlight: "right buckets.",
    intro: "Pick an expert Agent Pack, answer a few focused questions, and get a personalized plan you can start today—not another chat to scroll through.",
    cta: "Build my plan", how: "See how it works", points: ["Takes about 3 minutes", "No account needed", "Practical next actions"],
    plan: "Your plan", sampleTitle: "Launch your first MVP", day: "Day 1 of 7", progress: "3 of 8 tasks completed",
    sampleBuckets: [["Validate the problem", "2 / 3 tasks"], ["Scope the MVP", "1 / 3 tasks"], ["Build the launch loop", "0 / 2 tasks"]],
    next: "Next action", nextAction: "Interview one user",
    howLabel: "How it works", howTitle: "From fuzzy goal to focused action.", howIntro: "BucketMate turns expert guidance into a plan that lives where work gets done.",
    steps: [["01", "Choose your expert", "Select the Agent Pack built for the goal in front of you."], ["02", "Share the context", "Answer a short set of questions so the plan fits your reality."], ["03", "Work the plan", "Get clear buckets, tasks, timing, and the one action to take next."]],
    packs: "Agent Packs", packsTitle: "A specialist for the work ahead.", explore: "Explore all packs",
  },
};

export function LandingPage({ locale }: { locale: Locale }) {
  const t = copy[locale];
  const prefix = locale === "en" ? "/en" : "";
  const agents = getAgentPacks(locale);
  return (
    <main className="overflow-hidden">
      <section className="relative">
        <div className="tech-grid absolute inset-0 -z-20" />
        <div className="hero-orb left-[8%] top-24 -z-10 h-2 w-2 bg-brand-500 shadow-[0_0_28px_8px_rgba(25,118,210,.22)]" />
        <div className="hero-orb right-[12%] top-32 -z-10 h-3 w-3 bg-violet-400 shadow-[0_0_32px_9px_rgba(167,139,250,.18)]" />
        <div className="hero-orb bottom-24 left-[46%] -z-10 h-2 w-2 bg-orange-400 shadow-[0_0_30px_8px_rgba(251,146,60,.16)]" />
      <div className="page-shell grid min-h-[690px] items-center gap-14 py-20 lg:grid-cols-[1.08fr_.92fr] lg:py-24">
        <Reveal>
          <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-brand-500/20 bg-white/70 px-4 py-2 text-xs font-bold text-brand-700 shadow-sm backdrop-blur"><span className="live-dot h-2 w-2 rounded-full bg-brand-500" />{t.badge}</div>
          <h1 className={`max-w-3xl text-5xl font-black leading-[1.08] tracking-[-0.045em] sm:text-6xl ${locale === "ko" ? "lg:text-[60px]" : "lg:text-7xl"}`}>{t.title} <span className="gradient-text">{t.highlight}</span></h1>
          <p className="mt-7 max-w-xl text-lg leading-8 text-black/60">{t.intro}</p>
          <div className="mt-9 flex flex-col gap-3 sm:flex-row"><Link href={`${prefix}/agents`} className="primary-button shine-button shadow-[0_12px_30px_rgba(23,33,27,.16)]">{t.cta} <span className="ml-2 transition-transform group-hover:translate-x-1">→</span></Link><a href="#how-it-works" className="secondary-button backdrop-blur">{t.how}</a></div>
          <div className="mt-10 flex flex-wrap gap-x-7 gap-y-3 text-sm font-semibold text-black/50">{t.points.map((point) => <span key={point}>✓ {point}</span>)}</div>
        </Reveal>
        <Reveal delay={180} className="relative mx-auto w-full max-w-lg">
          <div className="absolute -inset-10 -z-10 rounded-full bg-brand-100/70 blur-3xl" />
          <div className="card float-card overflow-hidden p-4 shadow-soft sm:p-5">
            <div className="scan-line rounded-2xl bg-ink p-6 text-white sm:p-8"><div className="flex items-center justify-between gap-3"><div><p className="text-xs font-bold uppercase tracking-widest text-white/50">{t.plan}</p><h2 className="mt-2 text-xl font-black sm:text-2xl">{t.sampleTitle}</h2></div><span className="shrink-0 rounded-full border border-white/10 bg-white/10 px-3 py-1.5 text-[11px] font-bold backdrop-blur sm:text-xs">{t.day}</span></div><div className="mt-8 h-2 overflow-hidden rounded-full bg-white/10"><div className="h-full w-[38%] rounded-full bg-brand-500 shadow-[0_0_14px_rgba(88,166,255,.7)]" /></div><p className="mt-3 text-xs text-white/50">{t.progress}</p></div>
            <div className="space-y-3 px-2 py-5">{t.sampleBuckets.map((item, index) => <div key={item[0]} className="flex items-center gap-4 rounded-2xl border border-black/5 bg-white p-4"><span className={`grid h-10 w-10 place-items-center rounded-xl text-sm font-black ${index < 2 ? "bg-brand-100 text-brand-700" : "bg-black/[0.04] text-black/30"}`}>{index + 1}</span><div className="flex-1"><p className="font-bold">{item[0]}</p><p className="mt-1 text-xs text-black/40">{item[1]}</p></div><span className="text-black/25">›</span></div>)}</div>
          </div>
          <div className="absolute -bottom-7 -left-5 hidden rounded-2xl bg-white p-4 shadow-soft sm:flex sm:items-center sm:gap-3"><span className="grid h-10 w-10 place-items-center rounded-xl bg-orange-100">⚡</span><div><p className="text-xs text-black/40">{t.next}</p><p className="text-sm font-bold">{t.nextAction}</p></div></div>
        </Reveal>
      </div></section>

      <div className="border-y border-black/5 bg-ink py-4 text-white/55"><div className="overflow-hidden"><div className="marquee-track gap-12 px-6 text-xs font-bold uppercase tracking-[.22em]">{[0,1].map((set) => <div key={set} className="flex shrink-0 gap-12">{["AI ORCHESTRATION", "EXPERT AGENTS", "STRUCTURED EXECUTION", "HUMAN IN CONTROL", "REAL PROGRESS"].map((item) => <span key={`${set}-${item}`} className="flex items-center gap-12">{item}<i className="h-1 w-1 rounded-full bg-brand-500" /></span>)}</div>)}</div></div></div>

      <section id="how-it-works" className="border-b border-black/5 bg-white py-24"><div className="page-shell"><Reveal className="mx-auto max-w-2xl text-center"><p className="eyebrow">{t.howLabel}</p><h2 className="mt-4 text-4xl font-black tracking-tight">{t.howTitle}</h2><p className="mt-4 text-black/55">{t.howIntro}</p></Reveal><div className="mt-14 grid gap-5 md:grid-cols-3">{t.steps.map((step, index) => <Reveal key={step[0]} delay={index * 110}><div className="interactive-card h-full rounded-3xl border border-transparent bg-cream p-7 transition duration-500 hover:-translate-y-2 hover:border-brand-500/15 hover:bg-white hover:shadow-soft sm:p-8"><span className="text-sm font-black text-brand-600">{step[0]}</span><h3 className="mt-12 text-xl font-black">{step[1]}</h3><p className="mt-3 text-sm leading-6 text-black/55">{step[2]}</p></div></Reveal>)}</div></div></section>
      <section className="page-shell py-24"><Reveal><div className="flex flex-col justify-between gap-5 sm:flex-row sm:items-end"><div><p className="eyebrow">{t.packs}</p><h2 className="mt-4 text-4xl font-black tracking-tight">{t.packsTitle}</h2></div><Link href={`${prefix}/agents`} className="font-bold text-brand-700 transition hover:translate-x-1">{t.explore} →</Link></div></Reveal><div className="mt-12 grid gap-5 lg:grid-cols-3">{agents.map((agent, index) => <Reveal key={agent.id} delay={index * 110}><AgentCard agent={agent} locale={locale} /></Reveal>)}</div></section>
    </main>
  );
}
