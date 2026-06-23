import { AgentPack, Locale } from "@/types";

export const agentPacks: AgentPack[] = [
  {
    id: "business-builder",
    name: "Business Builder Pack",
    shortName: "Business Builder",
    description: "Turn a business or SaaS idea into a focused MVP and a practical launch plan.",
    category: "Business",
    persona: "A pragmatic startup operator who cuts through noise and gets ideas into customers' hands.",
    accent: "bg-emerald-100 text-emerald-700",
    icon: "↗",
    intakeQuestions: [
      { id: "idea", type: "text", label: "What do you want to build?", placeholder: "A scheduling tool for independent fitness coaches..." },
      { id: "target", type: "single", label: "Who is it mainly for?", options: ["Consumers (B2C)", "Businesses / teams (B2B)", "Creators / solo founders", "Local / brick-and-mortar", "Not sure yet"], allowCustom: true },
      { id: "stage", type: "single", label: "How far along are you?", options: ["Just an idea", "Talked to some users", "Have a prototype / MVP", "Already launched"] },
      { id: "skill", type: "multi", label: "What can you do yourself?", options: ["Product / planning", "Design", "Development", "Marketing", "Sales", "Not much yet"] },
      { id: "time", type: "single", label: "Hours you can spend per week?", options: ["Under 5h", "5–10h", "10–20h", "20h+"] },
    ],
    systemPrompt: "Act as a practical startup operator. Produce a scoped, testable execution plan.",
    outputFormat: ["Refined idea", "Target user", "MVP features", "3–5 buckets", "7-day action plan", "First next action"],
    suggestedWorkflows: ["Validate the problem", "Scope the MVP", "Build a launch plan"],
  },
  {
    id: "restaurant-operator",
    name: "Restaurant Operator Pack",
    shortName: "Restaurant Operator",
    description: "Improve daily operations, menu performance, local marketing, and guest reviews.",
    category: "Operations",
    persona: "An experienced neighborhood restaurant operator focused on simple systems and visible wins.",
    accent: "bg-orange-100 text-orange-700",
    icon: "✦",
    intakeQuestions: [
      { id: "restaurant", type: "text", label: "Tell us about your restaurant.", placeholder: "A 35-seat Korean casual dining spot" },
      { id: "goal", type: "single", label: "What matters most right now?", options: ["More weekday sales", "More new guests", "More repeat visits", "Smoother operations", "Better reviews / reputation"], allowCustom: true },
      { id: "challenge", type: "single", label: "Your biggest challenge?", options: ["Service consistency", "Wait times / turnover", "Staffing / training", "Marketing / discovery", "Costs / margins"] },
      { id: "channels", type: "multi", label: "How do guests find you?", options: ["Map apps (Google / Naver)", "Instagram", "Delivery apps", "Word of mouth", "Walk-by / signage"] },
      { id: "time", type: "single", label: "Hours per week for improvements?", options: ["Under 3h", "3–5h", "5–10h", "10h+"] },
    ],
    systemPrompt: "Act as a hands-on restaurant operator. Prioritize low-cost improvements the team can execute this week.",
    outputFormat: ["Operating goal", "Current constraint", "Priority buckets", "Daily tasks", "7-day action plan", "First next action"],
    suggestedWorkflows: ["Tighten daily operations", "Improve local discovery", "Build a review flywheel"],
  },
  {
    id: "career-helper",
    name: "Career Helper Pack",
    shortName: "Career Helper",
    description: "Organize your job search, sharpen your story, and build a repeatable application system.",
    category: "Career",
    persona: "A candid career coach who turns uncertainty into a steady, measurable search routine.",
    accent: "bg-violet-100 text-violet-700",
    icon: "◎",
    intakeQuestions: [
      { id: "role", type: "text", label: "What role are you aiming for?", placeholder: "Product designer at an early-stage startup" },
      { id: "status", type: "single", label: "Where are you in your search?", options: ["Getting ready", "Applying but few interviews", "Interviewing but no offers", "Considering a change"], allowCustom: true },
      { id: "experience", type: "single", label: "How much experience?", options: ["Entry / 0–1 yr", "2–4 yrs", "5–9 yrs", "10+ yrs"] },
      { id: "challenge", type: "single", label: "What's hardest right now?", options: ["Resume / portfolio", "My story / positioning", "Networking", "Interviews", "Career direction"] },
      { id: "time", type: "single", label: "Hours per week for the search?", options: ["Under 5h", "5–10h", "10h+"] },
    ],
    systemPrompt: "Act as a direct, encouraging career coach. Build a high-quality, sustainable job-search system.",
    outputFormat: ["Career goal", "Positioning", "Search buckets", "Application tasks", "7-day action plan", "First next action"],
    suggestedWorkflows: ["Clarify positioning", "Upgrade application assets", "Build an outreach habit"],
  },
];

export const getAgentPack = (id: string) => agentPacks.find((pack) => pack.id === id);

export const agentPacksKo: AgentPack[] = [
  {
    ...agentPacks[0],
    name: "비즈니스 빌더 팩",
    shortName: "비즈니스 빌더",
    description: "비즈니스 또는 SaaS 아이디어를 검증 가능한 MVP와 현실적인 출시 계획으로 바꿔드립니다.",
    category: "비즈니스",
    persona: "불필요한 일을 덜어내고 아이디어가 실제 고객에게 닿도록 돕는 실전형 스타트업 운영자입니다.",
    intakeQuestions: [
      { id: "idea", type: "text", label: "어떤 걸 만들고 싶나요?", placeholder: "개인 피트니스 코치를 위한 일정 관리 도구..." },
      { id: "target", type: "single", label: "주로 누구를 위한 건가요?", options: ["개인 소비자 (B2C)", "기업·팀 (B2B)", "크리에이터·1인 사업자", "소상공인·오프라인", "아직 모르겠어요"], allowCustom: true },
      { id: "stage", type: "single", label: "지금 어디까지 왔나요?", options: ["아이디어만 있어요", "고객과 얘기해봤어요", "시제품·MVP가 있어요", "이미 출시했어요"] },
      { id: "skill", type: "multi", label: "직접 할 수 있는 건 뭔가요?", options: ["기획", "디자인", "개발", "마케팅", "영업", "아직 별로 없어요"] },
      { id: "time", type: "single", label: "주당 투입 가능한 시간은?", options: ["5시간 이하", "5~10시간", "10~20시간", "20시간 이상"] },
    ],
    outputFormat: ["다듬어진 아이디어", "목표 고객", "MVP 기능", "3~5개 실행 버킷", "7일 실행 계획", "첫 번째 행동"],
    suggestedWorkflows: ["문제 검증", "MVP 범위 설정", "출시 계획 만들기"],
  },
  {
    ...agentPacks[1],
    name: "외식업 운영 팩",
    shortName: "외식업 운영 코치",
    description: "매장 운영, 메뉴 성과, 지역 마케팅, 고객 리뷰를 실행 가능한 방식으로 개선합니다.",
    category: "매장 운영",
    persona: "작은 시스템과 눈에 보이는 개선을 중시하는 경험 많은 동네 식당 운영자입니다.",
    intakeQuestions: [
      { id: "restaurant", type: "text", label: "운영 중인 매장을 소개해 주세요.", placeholder: "35석 규모의 한식 캐주얼 다이닝입니다" },
      { id: "goal", type: "single", label: "지금 가장 중요한 건?", options: ["평일 매출 늘리기", "신규 고객 늘리기", "재방문 늘리기", "운영 효율화", "리뷰·평판 개선"], allowCustom: true },
      { id: "challenge", type: "single", label: "가장 큰 어려움은?", options: ["서비스 일관성", "대기·회전율", "인력·교육", "마케팅·노출", "원가·마진"] },
      { id: "channels", type: "multi", label: "고객은 주로 어디서 찾아오나요?", options: ["지도 앱 (네이버·구글)", "인스타그램", "배달앱", "지인 추천", "길거리·간판"] },
      { id: "time", type: "single", label: "개선에 주당 가능한 시간?", options: ["3시간 이하", "3~5시간", "5~10시간", "10시간 이상"] },
    ],
    outputFormat: ["운영 목표", "현재 제약", "우선순위 버킷", "일일 실행 과제", "7일 실행 계획", "첫 번째 행동"],
    suggestedWorkflows: ["일일 운영 안정화", "지역 검색 노출 개선", "리뷰 선순환 만들기"],
  },
  {
    ...agentPacks[2],
    name: "커리어 헬퍼 팩",
    shortName: "커리어 헬퍼",
    description: "취업 목표와 강점을 정리하고, 지원·이력서·면접·후속 연락을 꾸준한 시스템으로 만듭니다.",
    category: "커리어",
    persona: "막연한 불안을 측정 가능한 취업 루틴으로 바꿔주는 솔직하고 든든한 커리어 코치입니다.",
    intakeQuestions: [
      { id: "role", type: "text", label: "어떤 직무를 목표로 하나요?", placeholder: "초기 스타트업의 프로덕트 디자이너" },
      { id: "status", type: "single", label: "지금 구직 단계는?", options: ["준비 중이에요", "지원했는데 면접이 적어요", "면접은 보는데 합격이 안 돼요", "이직을 고민 중이에요"], allowCustom: true },
      { id: "experience", type: "single", label: "경력은 어느 정도인가요?", options: ["신입·0~1년", "2~4년", "5~9년", "10년 이상"] },
      { id: "challenge", type: "single", label: "지금 가장 어려운 건?", options: ["이력서·포트폴리오", "나의 강점·스토리", "네트워킹", "면접", "직무 방향"] },
      { id: "time", type: "single", label: "주당 구직 활동 시간?", options: ["5시간 이하", "5~10시간", "10시간 이상"] },
    ],
    outputFormat: ["커리어 목표", "포지셔닝", "구직 버킷", "지원 과제", "7일 실행 계획", "첫 번째 행동"],
    suggestedWorkflows: ["포지셔닝 정리", "지원 자료 개선", "네트워킹 습관 만들기"],
  },
];

export const getAgentPacks = (locale: Locale) => locale === "ko" ? agentPacksKo : agentPacks;
export const getLocalizedAgentPack = (id: string, locale: Locale) => getAgentPacks(locale).find((pack) => pack.id === id);
