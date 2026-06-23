import { notFound } from "next/navigation";
import { AgentDetailView } from "@/components/agent-detail-view";
import { agentPacksKo, getLocalizedAgentPack } from "@/data/agent-packs";

export function generateStaticParams() { return agentPacksKo.map((agent) => ({ id: agent.id })); }
export default async function AgentDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const agent = getLocalizedAgentPack(id, "ko");
  if (!agent) notFound();
  return <AgentDetailView agent={agent} locale="ko" />;
}
