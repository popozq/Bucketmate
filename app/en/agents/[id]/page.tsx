import { notFound } from "next/navigation";
import { AgentDetailView } from "@/components/agent-detail-view";
import { agentPacks, getLocalizedAgentPack } from "@/data/agent-packs";

export function generateStaticParams() { return agentPacks.map((agent) => ({ id: agent.id })); }
export default async function EnglishAgentDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const agent = getLocalizedAgentPack(id, "en");
  if (!agent) notFound();
  return <AgentDetailView agent={agent} locale="en" />;
}
