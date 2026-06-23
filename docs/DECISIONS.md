# 의사결정 기록 (Decision Log)

> 즉흥적으로 빌드하면서 "왜 이렇게 정했는지" 까먹지 않으려고 남기는 기록.
> 새 결정이 생기면 맨 위에 날짜와 함께 추가한다. 기존 결정을 뒤집으면 지우지 말고
> "→ 변경됨 (날짜): 이유" 형태로 이어 적는다.

---

## 2026-06-22 — 포지셔닝 확정: "Goal Execution Manager"가 아니라 "튜닝된 전문가 AI와의 대화"

### 무엇을
제품의 중심은 **사용자가 고른 전문가 역할로 튜닝된 AI와 직접 대화하는 것**이다.
"실행계획/버킷/태스크 대시보드"(7일 플랜, task 추출, 진행률 등)는 **핵심이 아니라 채팅의 선택적 부가기능**이며, 당장은 만들지 않는다.

### 왜
초기 v0.1의 "Mock 실행계획 생성기"를 의도적으로 버리고 AI 채팅으로 피벗했기 때문(아래 항목 참고).
외부 도구(ChatGPT)가 만들어 준 로드맵이 옛 `agent-packs.ts`의 `outputFormat`(버킷/7일계획)만 보고
제품을 다시 "Goal Execution Manager"로 규정했는데, 이는 피벗 방향과 충돌한다. 그래서 명시적으로 정정해 둔다.

### 적용
- workspace/task/bucket 기능은 로드맵에서 "나중(채팅 부가기능)"으로 강등.
- 새 기능을 평가할 때 "이게 대화 경험을 깊게 하나, 아니면 옛 실행계획 모델로 되돌아가나?"를 기준으로 본다.

---

## 2026-06-22 — DeepSeek AI 채팅으로 전환

### 무엇을
초기 v0.1의 "Mock 실행 계획 생성기"를 버리고, 에이전트 팩 선택 → intake → **실제 AI와 대화**하는 구조로 바꿨다.

### 왜
이 서비스의 본질은 "목표 설정 도구"가 아니라 **"사용자가 고른 전문가 역할의 AI와 상호작용하는 플랫폼"**이기 때문. Mock 계획은 방향이 틀렸다.

### 핵심 흐름
```
에이전트 팩 선택 → Intake(컨텍스트 수집) → 시스템 프롬프트 조립 → AI 채팅 세션
```
intake 답변은 시스템 프롬프트의 재료가 되고, localStorage에 저장 후 /workspace(채팅 UI)로 넘긴다.

---

## 2026-06-22 — AI SDK는 Vercel AI SDK v4

### 무엇을
`ai@4.3.16` + `@ai-sdk/react` + `@ai-sdk/deepseek@0.1.12` 사용. (v6를 먼저 깔았다가 v4로 다운그레이드)

### 왜
- **멀티모델 추상화**: 나중에 Claude/Gemini/GPT로 바꿀 때 모델 이름 한 줄만 교체하면 됨.
- v6는 `useChat` API가 크게 바뀌어서(`append`/`input` 제거) 초기 개발에 불편 → 안정적인 v4의 클래식 API(`append`, `input`, `handleSubmit`) 사용.

### 주의
`useChat`은 `@ai-sdk/react`에서 import. (`ai/react` 서브패스는 Next.js 15 + pnpm 환경에서 해석이 불안정했음)

---

## 2026-06-22 — 모델: deepseek-v4-flash (무료 티어)

### 무엇을
무료 이용자는 `deepseek-v4-flash` 모델 사용. 코드 상수 `FREE_MODEL`.

### 왜 deepseek-chat이 아니라 v4-flash인가
DeepSeek 공식 문서: `deepseek-chat`/`deepseek-reasoner` 별칭은 **2026/07/24 15:59 UTC에 deprecated**.
이 별칭들은 각각 `deepseek-v4-flash`의 non-thinking/thinking 모드에 대응. 그래서 미리 정식 이름으로 전환.

### 모델 스펙 참고
| | flash | pro |
|---|---|---|
| 컨텍스트 | 1M | 1M |
| 최대 출력 | 384K | 384K |
| 입력(캐시미스)/1M | $0.14 | $0.435 |
| 출력/1M | $0.28 | $0.87 |
| 동시 처리 | 2,500 | 500 |

출처: https://api-docs.deepseek.com/quick_start/pricing

---

## 2026-06-22 — 무료 티어 비용/남용 통제 3종

### 무엇을
1. **thinking 모드 비활성** — v4는 thinking이 기본 ON이라 추론 토큰을 많이 씀. OpenAI 포맷의 `extra_body.thinking = { type: "disabled" }`를 커스텀 `fetch`로 요청 본문에 주입해서 끔.
2. **maxTokens = 800** — 답변 길이 캡. 상수 `FREE_MAX_TOKENS`.
3. **세션당 메시지 20개 제한** — 서버에서 초과 시 429 반환, 클라이언트는 입력창을 막고 "새 세션" 안내. 상수 `MAX_MESSAGES_PER_SESSION`(서버) / `MAX_MESSAGES`(클라, 값 일치 필요).

### 왜
무료 이용자의 API 과사용 → 비용 폭증 방지. DeepSeek는 입력+출력 토큰 합산 과금.

### 관련
시스템 프롬프트에 "반드시 800 토큰 안에서 문장을 완결하라"는 지시를 추가해서, 캡 때문에 답변이 문장 중간에 잘리는 문제를 해결함.

---

## 2026-06-22 — API 키 보안

### 무엇을
`DEEPSEEK_API_KEY`는 `.env.local`(gitignore됨)에만. 서버 라우트(`app/api/chat/route.ts`)의 `process.env`로만 접근. 클라이언트 번들에 절대 포함 안 됨. 양식은 `.env.example` 제공.

### 왜
키가 브라우저로 나가면 누구나 훔쳐서 내 크레딧으로 API를 쓸 수 있음.
