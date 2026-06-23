import { AgentCard } from "@/components/agent-card";
import { StepStrip } from "@/components/step-strip";
import { getAgentPacks } from "@/data/agent-packs";
import { Locale } from "@/types";

export function AgentsPageView({ locale }: { locale: Locale }) {
  const ko = locale === "ko";
  return <main className="page-shell py-12 sm:py-16"><StepStrip active={1} locale={locale} /><div className="mx-auto mt-16 max-w-2xl text-center"><p className="eyebrow">{ko ? "시작점 선택" : "Pick your starting point"}</p><h1 className="mt-4 text-4xl font-black tracking-tight sm:text-5xl">{ko ? "어떤 목표를 함께 실행할까요?" : "Which goal are we working on?"}</h1><p className="mt-5 leading-7 text-black/55">{ko ? "각 팩은 목표에 맞는 전문가 관점과 질문, 실행 방식을 제공합니다. 지금 상황과 가장 가까운 팩을 골라보세요." : "Each pack brings a different expert mindset, intake, and execution workflow. Choose the closest fit—you can always start another plan later."}</p></div><div className="mt-14 grid gap-5 lg:grid-cols-3">{getAgentPacks(locale).map((agent) => <AgentCard key={agent.id} agent={agent} locale={locale} />)}</div></main>;
}
