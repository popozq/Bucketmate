# BucketMate v0.1

사용자가 원하는 전문가 역할(Agent Pack)을 골라, 개인 맥락에 맞춰 튜닝된 AI와 대화하는
AI Agent 플랫폼.

## 로컬 실행

```bash
pnpm install
pnpm dev
```

`.env.local`에 DeepSeek API 키 필요 (양식은 `.env.example` 참고):

```
DEEPSEEK_API_KEY=sk-...
```

`http://localhost:3000` 접속.

## 흐름

1. 랜딩 페이지 (한국어 `/`, 영어 `/en`)
2. Agent Pack 선택 (Business Builder / Restaurant Operator / Career Helper)
3. 팩별 intake 질문에 답변
4. intake 답변으로 개인화된 시스템 프롬프트가 조립되어 **AI 채팅 세션** 시작

## 기술 스택

Next.js 15 · React 19 · TypeScript · Tailwind CSS · Vercel AI SDK (DeepSeek)

## 문서

- [docs/DECISIONS.md](docs/DECISIONS.md) — 주요 의사결정과 "왜"
- [docs/ROADMAP.md](docs/ROADMAP.md) — 다음 할 일

계정/인증/DB는 아직 없음 (intake·대화는 localStorage). 로드맵 참고.
