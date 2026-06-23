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
      { id: "idea", label: "What idea are you trying to build?", placeholder: "A scheduling tool for independent fitness coaches..." },
      { id: "target", label: "Who is your target user?", placeholder: "Independent coaches with 10–50 clients" },
      { id: "problem", label: "What problem are you solving?", placeholder: "They lose time coordinating sessions in DMs" },
      { id: "skill", label: "What is your current skill level?", placeholder: "I can design, but I am new to coding" },
      { id: "time", label: "How much time can you spend per week?", placeholder: "About 8 hours" },
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
      { id: "restaurant", label: "Tell us about your restaurant.", placeholder: "A 35-seat Korean casual dining restaurant" },
      { id: "goal", label: "What result matters most right now?", placeholder: "Increase weekday dinner traffic" },
      { id: "challenge", label: "What is your biggest operational challenge?", placeholder: "Inconsistent service and slow ticket times" },
      { id: "channels", label: "How do guests currently find you?", placeholder: "Google Maps, Instagram, and word of mouth" },
      { id: "time", label: "How much time can you spend per week?", placeholder: "5 hours outside daily operations" },
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
      { id: "role", label: "What role are you targeting?", placeholder: "Product designer at an early-stage startup" },
      { id: "experience", label: "What experience do you bring?", placeholder: "3 years in agency design and user research" },
      { id: "status", label: "Where are you in your job search?", placeholder: "Resume ready, but few interviews" },
      { id: "challenge", label: "What feels hardest right now?", placeholder: "Tailoring applications and networking" },
      { id: "time", label: "How much time can you spend per week?", placeholder: "10 hours" },
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
      { id: "idea", label: "어떤 아이디어를 만들고 싶나요?", placeholder: "개인 피트니스 코치를 위한 일정 관리 도구..." },
      { id: "target", label: "목표 고객은 누구인가요?", placeholder: "고객 10~50명을 관리하는 개인 코치" },
      { id: "problem", label: "어떤 문제를 해결하려고 하나요?", placeholder: "DM으로 일정을 조율하느라 많은 시간을 씁니다" },
      { id: "skill", label: "현재 보유한 기술이나 경험은 어느 정도인가요?", placeholder: "디자인은 가능하지만 개발은 처음입니다" },
      { id: "time", label: "일주일에 얼마나 시간을 쓸 수 있나요?", placeholder: "약 8시간" },
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
      { id: "restaurant", label: "운영 중인 매장을 소개해 주세요.", placeholder: "35석 규모의 한식 캐주얼 다이닝입니다" },
      { id: "goal", label: "지금 가장 중요한 성과는 무엇인가요?", placeholder: "평일 저녁 방문 고객을 늘리고 싶습니다" },
      { id: "challenge", label: "가장 큰 운영상의 어려움은 무엇인가요?", placeholder: "서비스 편차와 긴 음식 대기 시간" },
      { id: "channels", label: "고객은 주로 어떤 경로로 매장을 찾나요?", placeholder: "네이버 지도, 인스타그램, 지인 추천" },
      { id: "time", label: "개선 활동에 일주일에 얼마나 쓸 수 있나요?", placeholder: "매장 운영 외 약 5시간" },
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
      { id: "role", label: "어떤 직무를 목표로 하나요?", placeholder: "초기 스타트업의 프로덕트 디자이너" },
      { id: "experience", label: "어떤 경험과 강점을 가지고 있나요?", placeholder: "에이전시 디자인과 사용자 조사 경력 3년" },
      { id: "status", label: "현재 구직 단계는 어디쯤인가요?", placeholder: "이력서는 준비됐지만 면접 기회가 적습니다" },
      { id: "challenge", label: "지금 가장 어렵게 느껴지는 것은 무엇인가요?", placeholder: "맞춤 지원서 작성과 네트워킹" },
      { id: "time", label: "일주일에 구직 활동을 얼마나 할 수 있나요?", placeholder: "약 10시간" },
    ],
    outputFormat: ["커리어 목표", "포지셔닝", "구직 버킷", "지원 과제", "7일 실행 계획", "첫 번째 행동"],
    suggestedWorkflows: ["포지셔닝 정리", "지원 자료 개선", "네트워킹 습관 만들기"],
  },
];

export const getAgentPacks = (locale: Locale) => locale === "ko" ? agentPacksKo : agentPacks;
export const getLocalizedAgentPack = (id: string, locale: Locale) => getAgentPacks(locale).find((pack) => pack.id === id);
