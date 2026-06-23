import { createDeepSeek } from "@ai-sdk/deepseek";
import { streamText } from "ai";
import { getAgentPack } from "@/data/agent-packs";
import { AgentPack } from "@/types";

// 무료 티어 설정 — 비용/길이 통제
const FREE_MODEL = "deepseek-v4-flash"; // deepseek-chat은 2026/07/24 deprecated
const FREE_MAX_TOKENS = 800; // 답변 길이 캡
const MAX_MESSAGES_PER_SESSION = 20; // 세션당 메시지 수 제한 (사용자+AI 합산)

// thinking 모드는 v4 기본값이 'enabled' → 무료 티어에서는 비활성화해
// 추론 토큰 낭비를 막는다. AI SDK가 직접 노출하지 않는 extra_body 필드라서
// 커스텀 fetch로 요청 본문에 주입한다.
const deepseek = createDeepSeek({
  apiKey: process.env.DEEPSEEK_API_KEY!,
  fetch: async (url, options) => {
    if (options?.body && typeof options.body === "string") {
      try {
        const body = JSON.parse(options.body);
        body.thinking = { type: "disabled" };
        options = { ...options, body: JSON.stringify(body) };
      } catch {
        // 파싱 실패 시 원본 그대로 전송
      }
    }
    return fetch(url, options);
  },
});

function buildSystemPrompt(agent: AgentPack, answers: Record<string, string>, locale: string): string {
  const contextLines = agent.intakeQuestions
    .map((q) => `- ${q.label}: ${answers[q.id] || (locale === "ko" ? "(미입력)" : "(not provided)")}`)
    .join("\n");

  if (locale === "ko") {
    return `${agent.systemPrompt}

## 사용자 컨텍스트
${contextLines}

## 응답 가이드라인
- 위 사용자 정보를 기반으로 철저히 개인화된 조언을 제공하세요
- ${agent.persona}의 관점으로 대화하세요
- 구체적이고 지금 당장 실행 가능한 내용 위주로 답하세요
- 간결하게, 핵심만 전달하세요 (불필요하게 길게 쓰지 마세요)
- 한국어로 응답하세요`;
  }

  return `${agent.systemPrompt}

## User Context
${contextLines}

## Response Guidelines
- Provide thoroughly personalized advice based on the user context above
- Speak from the perspective of: ${agent.persona}
- Be specific, practical, and immediately actionable
- Keep it concise — lead with what matters, avoid unnecessary length
- Respond in English`;
}

export async function POST(req: Request) {
  const { messages, agentId, answers, locale } = await req.json();

  const agent = getAgentPack(agentId);
  if (!agent) {
    return new Response("Agent not found", { status: 404 });
  }

  // 세션당 메시지 수 제한 — API 과사용 방지
  if (Array.isArray(messages) && messages.length > MAX_MESSAGES_PER_SESSION) {
    return new Response(
      JSON.stringify({
        error: locale === "ko"
          ? "이 세션의 대화 한도에 도달했어요. 새 세션을 시작해 주세요."
          : "You've reached this session's message limit. Please start a new session.",
      }),
      { status: 429, headers: { "Content-Type": "application/json" } }
    );
  }

  const system = buildSystemPrompt(agent, answers ?? {}, locale ?? "en");

  const result = streamText({
    model: deepseek(FREE_MODEL),
    system,
    messages,
    maxTokens: FREE_MAX_TOKENS,
  });

  return result.toDataStreamResponse();
}
