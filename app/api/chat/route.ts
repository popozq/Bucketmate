import { createDeepSeek } from "@ai-sdk/deepseek";
import { streamText, createDataStreamResponse, formatDataStreamPart } from "ai";
import { getLocalizedAgentPack } from "@/data/agent-packs";
import { Locale } from "@/types";
import { checkInput, checkOutput, getSafetyRules, getRefusal } from "@/lib/guardrails";
import { buildDynamicSystemPrompt, buildSystemPrompt } from "@/lib/prompts";

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

export async function POST(req: Request) {
  const { messages, agentId, answers, goal, locale } = await req.json();
  const lang: Locale = locale === "ko" ? "ko" : "en";

  // 동적 역할 모드: 고정 팩(agentId) 없이 사용자의 목표만으로 시작한다.
  const dynamic = !agentId && typeof goal === "string" && goal.trim().length > 0;

  // 팩 모드일 때만 지역화된 팩을 가져온다. (동적 모드는 팩이 없다)
  const agent = dynamic ? undefined : getLocalizedAgentPack(agentId, lang);
  if (!dynamic && !agent) {
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

  // ── 입력 가드레일 ── 모델 호출 전에 마지막 사용자 메시지를 검사한다.
  // 불건전 콘텐츠 / 프롬프트 추출 시도를 모델에 닿기 전에 차단.
  const lastUserMessage = Array.isArray(messages)
    ? [...messages].reverse().find((m: { role: string }) => m.role === "user")
    : undefined;
  const inputCheck = checkInput(lastUserMessage?.content ?? "");
  if (!inputCheck.ok) {
    return refusalStream(getRefusal(lang, inputCheck.reason));
  }

  const system = dynamic ? buildDynamicSystemPrompt(lang, FREE_MAX_TOKENS) : buildSystemPrompt(agent!, answers, lang, FREE_MAX_TOKENS);

  // 출력 누출 검사용 "보호 대상" — 튜닝 정보(팩 모드) 또는 안전 규칙(동적 모드).
  const confidential = dynamic
    ? getSafetyRules(lang)
    : `${agent!.systemPrompt}\n${agent!.persona}\n${getSafetyRules(lang)}`;

  // ── 출력 가드레일 ── 스트리밍하면서 누적 텍스트를 검사한다.
  // 프롬프트 누출 / 불건전 콘텐츠가 감지되면 즉시 중단하고 거절 메시지로 대체.
  return createDataStreamResponse({
    execute: async (writer) => {
      const result = streamText({
        model: deepseek(FREE_MODEL),
        system,
        messages,
        maxTokens: FREE_MAX_TOKENS,
        temperature: 0.6, // 엉뚱한 토큰(한자 등) 튐 빈도 감소
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
