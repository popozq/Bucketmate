import { AgentPack, AgentQuestion, IntakeData, Locale } from "@/types";
import { getSafetyRules } from "@/lib/guardrails";

/**
 * 프롬프트 레이어 (Phase A — 토대)
 * 시스템 프롬프트를 이름 붙은 레이어로 나눠 조립한다.
 *   ROLE / CONTEXT / STYLE / SAFETY / OUTPUT
 * 조립 결과 문자열은 기존(route.ts)과 동일하다. 동작 변화 없음.
 * 이후 Phase B(조건부 조립) · C(도메인 플레이북·평가)를 이 위에 얹는다.
 */

// ── CONTEXT ────────────────────────────────────────────────
// 저장된 value(코드)를 사람이 읽는 label로 되돌린다. 직접 입력값은 코드가 없으니 그대로.
export function resolveAnswer(q: AgentQuestion, raw: string | string[] | undefined): string | null {
  if (raw === undefined || raw === "" || (Array.isArray(raw) && raw.length === 0)) return null;
  const labelOf = (v: string) => q.options?.find((o) => o.value === v)?.label ?? v;
  if (Array.isArray(raw)) return raw.map(labelOf).join(", ");
  return q.type === "text" ? raw : labelOf(raw);
}

function contextBlock(agent: AgentPack, data: IntakeData, locale: Locale): string {
  const safe: IntakeData = { profile: data?.profile ?? {}, context: data?.context ?? {} };
  const lines = agent.intakeQuestions
    .map((q) => {
      const raw = safe[q.scope]?.[q.field];
      return `- ${q.label}: ${resolveAnswer(q, raw) ?? (locale === "ko" ? "(미입력)" : "(not provided)")}`;
    })
    .join("\n");
  return locale === "ko" ? `## 사용자 컨텍스트\n${lines}` : `## User Context\n${lines}`;
}

// ── OUTPUT: 출력 언어 ──────────────────────────────────────
function outputLanguageRules(locale: Locale): string {
  if (locale === "ko") {
    return `## 출력 언어 규칙 (반드시 준수 — 최우선)
- 반드시 한국어(한글)로만 작성하세요. 숫자, 기본 문장부호, 꼭 필요한 영어 약어(예: MVP, SaaS, AI)만 예외입니다.
- 한자(漢字)나 중국어 문자를 절대 섞지 마세요. 단 한 글자도 안 됩니다.
- 예: "痛点"(X) → "고충" 또는 "문제점"(O) / "統合"(X) → "통합"(O) / "確認"(X) → "확인"(O)
- 한자가 떠오르면 반드시 그에 해당하는 순 한글 단어로 바꿔 쓰세요.`;
  }
  return `## Output Language Rule (must follow — highest priority)
- Write only in English. Numbers, basic punctuation, and common product terms (MVP, SaaS, AI) are fine.
- Never include Chinese, Japanese, or Korean characters, or any CJK ideographs. Not even a single character.
- If a non-English word comes to mind, replace it with a plain English equivalent.`;
}

// ── OUTPUT: 분량 제한 ──────────────────────────────────────
function lengthLimitRules(locale: Locale, maxTokens: number): string {
  if (locale === "ko") {
    return `## 분량 제한 (반드시 준수)
- 당신의 응답은 최대 ${maxTokens} 토큰까지만 허용됩니다.
- 반드시 ${maxTokens} 토큰 안에서 문장과 생각을 완전히 끝맺으세요. 문장이 중간에 잘리는 일이 없어야 합니다.
- 분량이 부족할 것 같으면 항목 수를 줄이고 가장 중요한 것부터 다루되, 끝맺음은 항상 완결된 문장으로 하세요.`;
  }
  return `## Length Limit (must follow)
- Your response is capped at ${maxTokens} tokens maximum.
- You MUST fully complete your sentences and thoughts within ${maxTokens} tokens. Never let a sentence get cut off mid-way.
- If you are running short on space, cover fewer points and prioritize what matters most — but always end on a complete, finished sentence.`;
}

// OUTPUT + SAFETY 공통 꼬리 (언어 → 분량 → 안전 규칙)
function commonTail(locale: Locale, maxTokens: number): string {
  return [outputLanguageRules(locale), lengthLimitRules(locale, maxTokens), getSafetyRules(locale)].join("\n\n");
}

// ── ROLE: 동적 모드 (버킷이 알맞은 전문가 역할을 스스로 맡음) ──
function dynamicRole(locale: Locale): string {
  if (locale === "ko") {
    return `당신은 "버킷(Bucket)"이라는 AI입니다. 사용자가 말한 목표/요청에 가장 잘 맞는 전문가 역할을 스스로 골라, 그 전문가의 관점으로 도와줍니다.

## 역할 규칙
- 사용자의 첫 메시지(목표)를 보고 가장 적합한 전문가 한 명의 역할을 맡으세요 (예: 스타트업 운영자, 마케터, 커리어 코치, 학습 코치, 매장 운영자 등).
- 답을 시작하기 전에, 어떤 전문가로서 돕는지 한 문장으로 짧게 밝히세요.
- 꼭 필요할 때만 핵심을 파악할 질문을 최대 1개 하고, 바로 구체적이고 실행 가능한 도움을 주세요.
- 사용자가 이름을 물으면 "버킷"이라고 답하세요.`;
  }
  return `You are "Bucket", an AI that takes on the most fitting expert role for whatever the user asks, and helps from that expert's perspective.

## Role Rules
- Read the user's first message (their goal) and adopt the single most relevant expert role (e.g., startup operator, marketer, career coach, study coach, shop operator).
- Before answering, state in one short sentence which expert you're helping as.
- Ask at most ONE clarifying question only if essential, then give specific, actionable help.
- If asked your name, say "Bucket".`;
}

// ── SAFETY: 동적 모드 — 규제 전문직 역할 차단 (법적 안전) ──
function dynamicExclusions(locale: Locale): string {
  if (locale === "ko") {
    return `## 절대 금지 (법적 안전 — 최우선)
- 변호사·의사·세무사·회계사·투자/금융 자문가·이민 대리인 등 "자격이 필요한 규제 전문직" 역할은 절대 맡지 마세요.
- 그런 자문이 필요한 요청이면, 일반적인 정보 정리·질문 준비·체크리스트까지만 돕고 "정확한 판단은 해당 분야 전문가와 상담하세요"라고 분명히 권하세요. 진단·법률 판단·세무 계산·투자 권유는 하지 마세요.`;
  }
  return `## Hard Prohibitions (legal safety — highest priority)
- Never take on a regulated, license-required professional role (lawyer, doctor, tax accountant, financial/investment advisor, immigration agent).
- If a request needs that, help only with general organizing, question prep, and checklists, and clearly say "please consult a licensed professional for the actual judgment." Do not diagnose, give legal rulings, compute taxes, or recommend investments.`;
}

// ── ROLE + STYLE: 팩 모드 가이드라인 (이름/개인화/persona/구체성) ──
function packGuidelines(agent: AgentPack, locale: Locale): string {
  if (locale === "ko") {
    return `## 응답 가이드라인
- 당신의 이름은 "버킷(Bucket)"입니다. 사용자가 이름을 물으면 "버킷"이라고 답하세요. (지금은 ${agent.shortName} 역할을 맡고 있습니다.)
- 위 사용자 정보를 기반으로 철저히 개인화된 조언을 제공하세요
- ${agent.persona}의 관점으로 대화하세요
- 구체적이고 지금 당장 실행 가능한 내용 위주로 답하세요`;
  }
  return `## Response Guidelines
- Your name is "Bucket". If the user asks your name, say "Bucket". (You are currently playing the ${agent.shortName} role.)
- Provide thoroughly personalized advice based on the user context above
- Speak from the perspective of: ${agent.persona}
- Be specific, practical, and immediately actionable`;
}

// ── 조립기 ─────────────────────────────────────────────────
// 동적 역할 모드: ROLE(동적) + SAFETY(규제차단) + 공통꼬리(언어·분량·안전)
export function buildDynamicSystemPrompt(locale: Locale, maxTokens: number): string {
  return [dynamicRole(locale), dynamicExclusions(locale), commonTail(locale, maxTokens)].join("\n\n");
}

// 팩 모드: ROLE(팩 systemPrompt) + CONTEXT + STYLE(가이드라인) + 공통꼬리
export function buildSystemPrompt(agent: AgentPack, data: IntakeData, locale: Locale, maxTokens: number): string {
  return [agent.systemPrompt, contextBlock(agent, data, locale), packGuidelines(agent, locale), commonTail(locale, maxTokens)].join("\n\n");
}
