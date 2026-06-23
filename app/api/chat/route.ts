import { createDeepSeek } from "@ai-sdk/deepseek";
import { streamText, createDataStreamResponse, formatDataStreamPart } from "ai";
import { getAgentPack } from "@/data/agent-packs";
import { AgentPack } from "@/types";
import { checkInput, checkOutput, getSafetyRules, getRefusal } from "@/lib/guardrails";

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
- 당신의 이름은 "버킷(Bucket)"입니다. 사용자가 이름을 물으면 "버킷"이라고 답하세요. (지금은 ${agent.shortName} 역할을 맡고 있습니다.)
- 위 사용자 정보를 기반으로 철저히 개인화된 조언을 제공하세요
- ${agent.persona}의 관점으로 대화하세요
- 구체적이고 지금 당장 실행 가능한 내용 위주로 답하세요
- 한국어로 응답하세요

## 분량 제한 (반드시 준수)
- 당신의 응답은 최대 ${FREE_MAX_TOKENS} 토큰까지만 허용됩니다.
- 반드시 ${FREE_MAX_TOKENS} 토큰 안에서 문장과 생각을 완전히 끝맺으세요. 문장이 중간에 잘리는 일이 없어야 합니다.
- 분량이 부족할 것 같으면 항목 수를 줄이고 가장 중요한 것부터 다루되, 끝맺음은 항상 완결된 문장으로 하세요.

${getSafetyRules("ko")}`;
  }

  return `${agent.systemPrompt}

## User Context
${contextLines}

## Response Guidelines
- Your name is "Bucket". If the user asks your name, say "Bucket". (You are currently playing the ${agent.shortName} role.)
- Provide thoroughly personalized advice based on the user context above
- Speak from the perspective of: ${agent.persona}
- Be specific, practical, and immediately actionable
- Respond in English

## Length Limit (must follow)
- Your response is capped at ${FREE_MAX_TOKENS} tokens maximum.
- You MUST fully complete your sentences and thoughts within ${FREE_MAX_TOKENS} tokens. Never let a sentence get cut off mid-way.
- If you are running short on space, cover fewer points and prioritize what matters most — but always end on a complete, finished sentence.

${getSafetyRules("en")}`;
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

  const lang = locale === "ko" ? "ko" : "en";

  // ── 입력 가드레일 ── 모델 호출 전에 마지막 사용자 메시지를 검사한다.
  // 불건전 콘텐츠 / 프롬프트 추출 시도를 모델에 닿기 전에 차단.
  const lastUserMessage = Array.isArray(messages)
    ? [...messages].reverse().find((m: { role: string }) => m.role === "user")
    : undefined;
  const inputCheck = checkInput(lastUserMessage?.content ?? "");
  if (!inputCheck.ok) {
    return refusalStream(getRefusal(lang, inputCheck.reason));
  }

  const system = buildSystemPrompt(agent, answers ?? {}, lang);

  // 출력 누출 검사용 "보호 대상" — 튜닝 정보만(사용자 답변 제외).
  const confidential = `${agent.systemPrompt}\n${agent.persona}\n${getSafetyRules(lang)}`;

  // ── 출력 가드레일 ── 스트리밍하면서 누적 텍스트를 검사한다.
  // 프롬프트 누출 / 불건전 콘텐츠가 감지되면 즉시 중단하고 거절 메시지로 대체.
  return createDataStreamResponse({
    execute: async (writer) => {
      const result = streamText({
        model: deepseek(FREE_MODEL),
        system,
        messages,
        maxTokens: FREE_MAX_TOKENS,
      });

      let acc = "";
      for await (const chunk of result.textStream) {
        acc += chunk;
        const outCheck = checkOutput(acc, confidential);
        if (!outCheck.ok) {
          writer.write(formatDataStreamPart("text", "\n\n" + getRefusal(lang, outCheck.reason)));
          return;
        }
        writer.write(formatDataStreamPart("text", chunk));
      }
    },
  });
}

// 모델을 거치지 않고 정중한 거절 메시지를 스트림 형식으로 반환.
function refusalStream(message: string): Response {
  return createDataStreamResponse({
    execute: (writer) => {
      writer.write(formatDataStreamPart("text", message));
    },
  });
}
