import Link from "next/link";
import { AgentCard } from "@/components/agent-card";
import { getAgentPacks } from "@/data/agent-packs";
import { Locale } from "@/types";
import { Reveal } from "@/components/motion";
import { TypewriterStrip } from "@/components/typewriter-strip";

const copy = {
  ko: {
    badge: "BucketMate v0.1 · 한국어 베타",
    title: "필요한 전문가를 고르면,",
    highlight: "AI가 당신에게 맞춰 답해요.",
    intro: "범용 챗봇이 아니에요. 목표에 맞는 전문가 에이전트를 고르고 몇 가지만 답하면, 당신의 상황에 맞춰 튜닝된 AI가 바로 대화를 시작합니다.",
    cta: "전문가 AI와 대화 시작",
    how: "어떻게 작동하나요?",
    points: ["약 1분이면 시작", "가입 없이 체험 가능", "내 상황에 맞춘 답변"],
    session: "AI 전문가 세션", agentName: "비즈니스 빌더",
    userMsg: "프리랜서 디자이너용 클라이언트 관리 SaaS를 만들고 싶어요.",
    aiMsg: "좋아요. 개발부터 하지 말고, 이번 주에 잠재 고객 3명과 먼저 이야기해보죠. 가장 큰 불편이 뭔지부터 확인하는 거예요.",
    next: "AI 추천", nextAction: "사용자 3명 인터뷰하기",
    howLabel: "이용 방법", howTitle: "전문가를 고르고, 바로 대화하세요.", howIntro: "범용 챗봇과 다릅니다. 당신이 고른 역할로 튜닝된 AI가 당신의 맥락 위에서 답합니다.",
    steps: [["01", "전문가 선택", "지금 목표에 꼭 맞는 에이전트 팩을 선택하세요."], ["02", "상황 알려주기", "짧은 질문 몇 개로 AI가 당신의 맥락을 파악합니다."], ["03", "AI와 대화하기", "당신에게 맞춰 튜닝된 전문가 AI와 바로 대화를 시작합니다."]],
    packs: "에이전트 팩", packsTitle: "지금 필요한 전문가를 만나보세요.", explore: "모든 팩 살펴보기",
  },
  en: {
    badge: "BucketMate v0.1", title: "Pick your expert,", highlight: "chat on your terms.",
    intro: "Not another general chatbot. Choose an expert agent, answer a few questions, and start chatting with an AI tuned to your exact situation.",
    cta: "Start chatting", how: "See how it works", points: ["Start in ~1 minute", "No account needed", "Answers tuned to you"],
    session: "Live AI session", agentName: "Business Builder",
    userMsg: "I want to build a client-management SaaS for freelance designers.",
    aiMsg: "Great — before writing any code, let's talk to 3 potential users this week and find their biggest pain point first.",
    next: "AI suggestion", nextAction: "Interview 3 users",
    howLabel: "How it works", howTitle: "Pick an expert, then just talk.", howIntro: "Different from a general chatbot: an AI tuned to the role you chose, answering on top of your context.",
    steps: [["01", "Choose your expert", "Select the Agent Pack built for the goal in front of you."], ["02", "Share your context", "A few quick questions let the AI understand your situation."], ["03", "Chat with the AI", "Start talking to an expert AI tuned to you."]],
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
            <div className="scan-line flex items-center gap-3 rounded-2xl bg-ink p-5 text-white sm:p-6"><span className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-brand-100 text-lg text-brand-700">↗</span><div className="flex-1"><p className="text-sm font-black">{t.agentName}</p><p className="text-xs text-white/50">{t.session}</p></div><span className="live-dot h-2 w-2 rounded-full bg-brand-500" /></div>
            <div className="space-y-3 px-1 py-5">
              <div className="flex justify-end"><p className="max-w-[85%] rounded-3xl rounded-tr-md bg-ink px-4 py-3 text-sm leading-6 text-white">{t.userMsg}</p></div>
              <div className="flex items-start gap-2.5"><span className="mt-0.5 grid h-8 w-8 shrink-0 place-items-center rounded-lg bg-brand-100 text-sm text-brand-700">↗</span><p className="max-w-[85%] rounded-3xl rounded-tl-md bg-white px-4 py-3 text-sm leading-6 text-black/70 ring-1 ring-black/5">{t.aiMsg}</p></div>
            </div>
          </div>
          <div className="absolute -bottom-7 -left-5 hidden rounded-2xl bg-white p-4 shadow-soft sm:flex sm:items-center sm:gap-3"><span className="grid h-10 w-10 place-items-center rounded-xl bg-orange-100">⚡</span><div><p className="text-xs text-black/40">{t.next}</p><p className="text-sm font-bold">{t.nextAction}</p></div></div>
        </Reveal>
      </div></section>

      <TypewriterStrip locale={locale} />

      <section id="how-it-works" className="border-b border-black/5 bg-white py-24"><div className="page-shell"><Reveal className="mx-auto max-w-2xl text-center"><p className="eyebrow">{t.howLabel}</p><h2 className="mt-4 text-4xl font-black tracking-tight">{t.howTitle}</h2><p className="mt-4 text-black/55">{t.howIntro}</p></Reveal><div className="mt-14 grid gap-5 md:grid-cols-3">{t.steps.map((step, index) => <Reveal key={step[0]} delay={index * 110}><div className="interactive-card h-full rounded-3xl border border-transparent bg-cream p-7 transition duration-500 hover:-translate-y-2 hover:border-brand-500/15 hover:bg-white hover:shadow-soft sm:p-8"><span className="text-sm font-black text-brand-600">{step[0]}</span><h3 className="mt-12 text-xl font-black">{step[1]}</h3><p className="mt-3 text-sm leading-6 text-black/55">{step[2]}</p></div></Reveal>)}</div></div></section>
      <section className="page-shell py-24"><Reveal><div className="flex flex-col justify-between gap-5 sm:flex-row sm:items-end"><div><p className="eyebrow">{t.packs}</p><h2 className="mt-4 text-4xl font-black tracking-tight">{t.packsTitle}</h2></div><Link href={`${prefix}/agents`} className="font-bold text-brand-700 transition hover:translate-x-1">{t.explore} →</Link></div></Reveal><div className="mt-12 grid gap-5 lg:grid-cols-3">{agents.map((agent, index) => <Reveal key={agent.id} delay={index * 110}><AgentCard agent={agent} locale={locale} /></Reveal>)}</div></section>
    </main>
  );
}
