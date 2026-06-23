# 로드맵 (Roadmap)

> "다음에 뭐 하지?"를 잊지 않으려는 메모. 끝낸 건 `[x]`로 체크.
> 우선순위가 바뀌면 순서를 옮긴다. 결정의 "왜"는 [DECISIONS.md](DECISIONS.md)에.
> **솔로 + 즉흥 빌더 기준으로 범위를 일부러 좁게 유지한다. 압도당해서 멈추는 게 제일 큰 리스크다.**

---

## 비전 한 줄
**사용자가 원하는 전문가 역할(Agent Pack)을 조립해서 만드는 AI Agent 플랫폼.**
범용 UI는 누구나 쓰고, 개인 커스터마이징으로 각자에게 맞는 AI 비서가 된다.

## 포지셔닝 (중요 — 헷갈리지 말 것)
BucketMate는 **"사용자가 고른 전문가 역할로 튜닝된 AI와 직접 대화하는"** 서비스다.
- ✅ 핵심: Agent Pack(Persona + Intake + 튜닝된 시스템 프롬프트)으로 개인화된 AI 대화.
- ❌ **아님**: "7일 실행계획/버킷/태스크를 자동 생성해 주는 도구". (v0.1에서 의도적으로 버린 방향)
- workspace/task 같은 실행관리 기능은 **나중에, 대화의 부가기능으로만** 검토. 자세한 이유는 DECISIONS.md.

---

# 🎯 지금 당장 할 단 하나

## 계정 + 저장 (Auth & Persistence)
**왜 이게 1순위인가**: 지금 intake·대화가 localStorage에만 있어서 브라우저 닫으면 휘발하고 기기 간 동기화가 안 된다. "다시 돌아올 이유"를 만들려면 사용자의 대화가 저장돼야 한다. 유료화보다 이게 먼저다.

- [ ] 인증/DB 방식 결정 → DECISIONS.md에 이유 기록 (유력 후보: **Supabase Auth + Postgres** — 인증+DB 한 번에, RLS, MVP에 빠름)
- [ ] 이메일 로그인 (Google은 그 다음)
- [ ] 로그인/로그아웃 UI
- [ ] 사용자별 세션·intake 답변·메시지 저장
- [ ] 로그인 후 이전 대화 이어하기

### DB 스키마 초안 (검증 전이라 가볍게, 바뀔 수 있음)
```text
users            : id, email, name, created_at
sessions         : id, user_id, agent_pack_id, title, intake_answers, created_at, updated_at
messages         : id, session_id, role, content, model, token_count, created_at
```
> agent_packs는 당분간 코드(`data/agent-packs.ts`)에 둬도 됨. DB로 빼는 건 Custom Builder 할 때.
> workspace_items / analytics_events 테이블은 **지금 만들지 않는다** (아래 "아직 아님" 참고).

---

## 🔜 그 다음 (순서대로, 변동 가능)

### 1. 서버 기반 사용량 제한 (계정 생긴 직후)
현재 세션 메시지 제한은 클라이언트라 우회 가능. AI SaaS는 비용 통제가 생존 직결.
- [ ] 계정별 일일/월간 메시지 한도 (서버 API에서 강제)
- [ ] 계정별 토큰 사용량 기록
- [ ] 한도 초과 시 안내 UI + 요청 차단

초기 제한 예시:
```text
Free   : 하루 20 / 월 300 messages, maxTokens 800
Beta   : 하루 50 / 월 1000 messages, maxTokens 1200
```

> ✅ 베이스라인 가드레일은 v0.1에 이미 들어감(`lib/guardrails.ts`: 콘텐츠 차단 + 프롬프트 유출 방지). 아래는 고도화.
- [ ] 욕설/성적 키워드 목록 보강 (오탐 모니터링하며)
- [ ] LLM 기반 moderation으로 업그레이드 (트래픽·예산 생기면)
- [ ] 출력 하드블록 시 부분노출(스트리밍 중 몇 글자) 최소화

### 2. Business Builder Pack 깊게 만들기 (Pack 늘리기보다 우선)
가장 검증 쉬운 Pack 하나를 제대로. (BucketMate 만들면서 직접 테스트 가능, 규제 위험 낮음)
- [ ] intake 질문 다듬기 / 시스템 프롬프트 튜닝 고도화
- [ ] 대화 흐름을 단계적으로 안내 (아이디어 구체화 → 타겟 → 문제검증 → MVP 범위 → 다음 행동)
- [ ] **이건 "대화 경험"을 깊게 하는 방향이지, 자동 7일플랜 생성기로 되돌아가는 게 아님** (DECISIONS.md)

### 3. 외부 테스터 5~10명 확보
- [ ] 지인/타겟 유저에게 직접 써보게 하고 **말로** 피드백 받기 (분석 인프라보다 이게 빠름)
- [ ] 어떤 Pack을 쓰는지, 어디서 막히는지 관찰

### 4. 유료 티어 / 멀티모델 분기
아래 신호가 보이면 착수 (그 전엔 결제 구조에 시간 쓰지 말 것):
- [ ] 반복 방문 사용자 발생 / 특정 Pack 사용률 높음 / 무료 한도 도달 유저 발생 / 외부 테스터 10명+
- [ ] 무료=`deepseek-v4-flash`, 유료=`deepseek-v4-pro` 또는 Claude/GPT/Gemini
- [ ] user tier DB 필드, 모델/maxTokens/한도 tier별 분기, Stripe 검토

### 5. Agent Pack 확장
무작정 늘리지 않는다. **추가 기준**: 사용자 명확 / 반복 업무 있음 / 결과물 구체적 / 규제 위험 낮음.
- 후보: Content Creator, Student Study Planner, Personal Finance Organizer
- ⚠️ 조심(초기 회피): Legal / Tax / Medical / Investment / Immigration → "전문가 대체" 아니라 "문서정리·질문준비·체크리스트"로만 제한.

### 6. (장기 비전 핵심) Custom Agent Pack Builder
사용자가 직접 자기 목적의 Agent Pack을 조립. 처음부터 노코드 풀빌더 X, **간단한 form 기반**으로 시작.
```text
이름 → 역할/Persona → intake 질문 3~5개 → 출력형식 → 저장
```
- [ ] custom_agents 테이블, 사용자별 생성/저장, custom agent로 세션 시작, public/private

---

## 🧹 베타 출시 전 몰아서 정리 (지금은 손대지 말고 모아둠)
- [ ] `lib/mock-plan.ts` 제거 (현재 미사용 죽은 코드 — 보관 중)
- [ ] `ExecutionPlan` 등 mock 관련 타입/컴포넌트 정리
- [ ] console.log / 에러 핸들링 / 로딩·empty state 통일
- [ ] 모바일 반응형 확인
- [ ] 스트리밍 중단·재시도 UX, 한도/로그인 안내 문구 다듬기
- [ ] README / ROADMAP / DECISIONS / ENV·배포 문서 최신화

---

## ⏳ 아직 아님 (일부러 미룸)
- **Analytics / 이벤트 추적**: 지금 유저 0명. 인프라 깔 시간에 테스터한테 직접 물어보는 게 빠름. 재방문 유저가 생긴 뒤에.
- **workspace_items / task 추출 / 진행률**: 포지셔닝상 부가기능. 대화 경험이 검증된 뒤 "있으면 좋은" 단계에서.
- **과한 스키마 선설계**: 검증 전 풀스키마 설계 금지. 필요한 테이블만 그때그때.

## 💡 나중에 고민 (아이디어 풀)
대화 내보내기 · 공유 링크 · Pack 마켓플레이스 · 팀/조직 계정 · 파일업로드 기반 지식(RAG) ·
캘린더/이메일/Notion 연동 · Slack/Discord 봇 · 모바일앱/PWA · 모델별 응답 비교 · AI 응답 평가 버튼

---

## 핵심 원칙 (흔들릴 때 여기로)
1. **유료화보다 재방문** — 돈 받는 구조보다 다시 올 이유를 먼저.
2. **Pack 수보다 깊이** — 하나를 쓸만하게 > 여럿을 얕게.
3. **프롬프트보다 대화 경험** — 멋진 프롬프트가 아니라 사용자를 끝까지 데려가는 흐름.
4. **모델은 교체 가능, 제품 경험이 자산** — DeepSeek/GPT/Claude/Gemini는 언제든 바뀐다. 진짜 자산은 Agent Pack 구조 · 사용자 데이터 · 대화 UX.
