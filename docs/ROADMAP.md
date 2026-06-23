# 로드맵 (Roadmap)

> "다음에 뭐 하지?"를 잊지 않으려는 메모. 끝낸 건 [x]로 체크.
> 우선순위가 바뀌면 순서를 옮긴다. 결정의 "왜"는 DECISIONS.md에.

## 비전 한 줄
**사용자가 원하는 전문가 역할(Agent Pack)을 조립해서 만드는 AI Agent 플랫폼.**
범용 UI는 누구나 쓰고, 개인 커스터마이징으로 맞춤형 AI 서비스를 제공한다.

---

## ✅ 완료 (v0.1)
- [x] 랜딩 / 에이전트 팩 선택 / intake / 워크스페이스 페이지 (한·영 bilingual)
- [x] Agent Pack 3종: Business Builder, Restaurant Operator, Career Helper
- [x] DeepSeek AI 실시간 채팅 연동 (intake 답변 기반 개인화 시스템 프롬프트)
- [x] 무료 티어 비용 통제: thinking 비활성 + maxTokens 800 + 세션 메시지 20개 제한
- [x] API 키 서버 전용 보안
- [x] GitHub repo + 문서화(docs/)

---

## 🔜 다음 (우선순위 순, 변동 가능)

### 1. 유료 티어 / 멀티모델 분기
- 무료=`deepseek-v4-flash`, 유료=`deepseek-v4-pro` 또는 Claude/GPT/Gemini
- 모델 선택을 티어에 따라 분기 (현재는 `FREE_MODEL` 고정)
- → **계정 시스템과 함께 구현 예정** (티어 판별에 로그인 필요)

### 2. 계정 / 인증 / 영속성
- 현재: intake·대화가 localStorage에만 → 브라우저 닫으면 휘발, 기기 간 동기화 X
- 필요: 로그인(예: 이메일/소셜), DB(대화·세션·티어 저장)
- 후보: Supabase, Clerk+Postgres 등 (정하면 DECISIONS.md에 기록)

### 3. 사용량 제한 강화 (계정 기반)
- 현재 세션당 메시지 제한은 클라이언트 우회 가능
- 계정별 일일/월간 호출 한도를 서버에서 강제 (DB 카운터)

### 4. Agent Pack 확장
- 팩 추가 / 카테고리 정리
- (장기) **사용자가 직접 커스텀 에이전트를 조립**하는 빌더 — 비전의 핵심

---

## 🧹 베타 출시 전 몰아서 정리할 것
- [ ] `lib/mock-plan.ts` — 더 이상 안 쓰는 죽은 코드. 일단 보관, 베타 때 제거
- [ ] 안 쓰는 타입/컴포넌트 정리 (ExecutionPlan 등 mock 관련)

---

## 💡 메모 / 나중에 고민
- 응답 분량 캡(800)이 적절한지 사용자 반응 보고 조정
- 스트리밍 중단/재시도 UX
- 대화 내용 내보내기(공유/저장) 기능
