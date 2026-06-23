import { ConversationalIntake } from "@/components/conversational-intake";
import { StepStrip } from "@/components/step-strip";
import { AgentPack, Locale } from "@/types";

export function AgentDetailView({ agent, locale }: { agent: AgentPack; locale: Locale }) {
  const ko = locale === "ko";
  return <main className="page-shell py-12 sm:py-16"><StepStrip active={2} locale={locale} /><div className="mx-auto mt-14 grid max-w-6xl gap-8 lg:grid-cols-[.72fr_1.28fr] lg:items-start"><aside className="lg:sticky lg:top-28"><span className={`grid h-14 w-14 place-items-center rounded-2xl text-2xl font-black ${agent.accent}`}>{agent.icon}</span><p className="eyebrow mt-7">{agent.category} {ko ? "에이전트 팩" : "agent pack"}</p><h1 className="mt-3 text-4xl font-black tracking-tight">{agent.name}</h1><p className="mt-5 leading-7 text-black/55">{agent.description}</p><div className="mt-8 rounded-3xl bg-ink p-6 text-white"><p className="text-xs font-bold uppercase tracking-widest text-brand-100/60">{ko ? "나의 AI 가이드 · 버킷" : "Your AI guide · Bucket"}</p><p className="mt-3 text-sm leading-6 text-white/75">{agent.persona}</p></div><div className="mt-7"><p className="text-xs font-black uppercase tracking-wider text-black/35">{ko ? "버킷이 도와줄 수 있는 것" : "Bucket can help with"}</p><ul className="mt-4 grid gap-2">{agent.suggestedWorkflows.map((item) => <li key={item} className="flex items-center gap-2 text-sm font-semibold"><span className="text-brand-600">✓</span>{item}</li>)}</ul></div></aside><ConversationalIntake agent={agent} locale={locale} /></div></main>;
}
