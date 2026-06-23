import Link from "next/link";
import { AgentPack, Locale } from "@/types";

export function AgentCard({ agent, locale = "en" }: { agent: AgentPack; locale?: Locale }) {
  const prefix = locale === "en" ? "/en" : "";
  return (
    <article className="card interactive-card group flex h-full flex-col p-6 transition duration-500 hover:-translate-y-2 hover:border-brand-500/20 hover:shadow-soft sm:p-7">
      <div className="mb-8 flex items-start justify-between">
        <span className={`grid h-12 w-12 place-items-center rounded-2xl text-xl font-black ${agent.accent}`}>{agent.icon}</span>
        <span className="rounded-full bg-black/[0.04] px-3 py-1.5 text-xs font-bold text-black/50">{agent.category}</span>
      </div>
      <h3 className="text-2xl font-black tracking-tight">{agent.name}</h3>
      <p className="mt-3 flex-1 text-sm leading-6 text-black/60">{agent.description}</p>
      <div className="mt-7 border-t border-black/5 pt-5">
        <p className="mb-4 text-xs font-bold uppercase tracking-wider text-black/40">{locale === "ko" ? "이런 목표에 적합해요" : "Best for"}</p>
        <div className="mb-6 flex flex-wrap gap-2">
          {agent.suggestedWorkflows.slice(0, 2).map((item) => <span key={item} className="rounded-full bg-cream px-3 py-1.5 text-xs font-semibold">{item}</span>)}
        </div>
        <Link href={`${prefix}/agents/${agent.id}`} className="flex items-center justify-between font-bold text-brand-700">
          {locale === "ko" ? "이 팩으로 시작하기" : "Use this pack"} <span className="transition group-hover:translate-x-1">→</span>
        </Link>
      </div>
    </article>
  );
}
