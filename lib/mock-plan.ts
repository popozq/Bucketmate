import { AgentPack, ExecutionPlan, Locale } from "@/types";

type Answers = Record<string, string>;

const task = (id: string, title: string, detail: string, day: string) => ({
  id,
  title,
  detail,
  day,
  completed: false,
});

function generateKoreanPlan(agent: AgentPack, answers: Answers): ExecutionPlan {
  const firstAnswer = answers[agent.intakeQuestions[0].id] || "목표";
  const time = answers.time || "가능한 시간";
  const plans = {
    "business-builder": {
      target: answers.target || "명확하게 정의된 초기 고객",
      nextAction: `“${firstAnswer}”의 문제를 한 문장으로 정리하고 오늘 잠재 고객 한 명에게 보여주세요.`,
      buckets: [
        { id: "validate", name: "문제 검증", description: "추측을 실제 고객의 증거로 바꿉니다.", tasks: [task("v1", "인터뷰 질문 5개 만들기", "의견보다 과거 행동을 묻는 질문으로 작성하세요.", "1일차"), task("v2", "목표 고객 3명 만나기", "문제의 빈도와 현재 해결 방법을 기록하세요.", "2~3일차"), task("v3", "가장 강한 신호 정리하기", "가장 자주 반복된 고통 한 가지를 선택하세요.", "3일차")] },
        { id: "scope", name: "MVP 범위 설정", description: "가치를 증명할 수 있는 가장 작은 제품을 정의합니다.", tasks: [task("s1", "핵심 사용자 여정 작성하기", "문제에서 결과까지 가장 짧은 경로를 그리세요.", "4일차"), task("s2", "필수 기능 3개 선택하기", "나머지 기능은 이후 목록으로 옮기세요.", "4일차"), task("s3", "주요 화면 스케치하기", "종이나 간단한 와이어프레임이면 충분합니다.", "5일차")] },
        { id: "launch", name: "출시 루프 만들기", description: "첫 사용자를 만나는 직접적인 경로를 만듭니다.", tasks: [task("l1", "간단한 대기자 페이지 만들기", "문제, 약속, 하나의 행동 버튼만 담으세요.", "6일차"), task("l2", "잠재 사용자 10명 초대하기", "인터뷰 참여자와 가까운 지인부터 시작하세요.", "7일차")] },
      ],
    },
    "restaurant-operator": {
      target: answers.goal || "안정적인 운영과 지역 고객 증가",
      nextAction: "오늘 영업 전 15분 미팅을 열고, 이번 영업에서 측정할 서비스 지표 하나를 정하세요.",
      buckets: [
        { id: "ops", name: "영업 운영 안정화", description: "매일 일관된 고객 경험을 만듭니다.", tasks: [task("o1", "영업 지표 하나 정하기", "음식 대기 시간, 오류, 회전율 중 하나를 꾸준히 기록하세요.", "1일차"), task("o2", "오픈 체크리스트 5개 만들기", "담당자와 완료 시간을 명확히 지정하세요.", "2일차"), task("o3", "서비스 문제 3건 복기하기", "반복되는 인수인계 문제를 찾으세요.", "3일차")] },
        { id: "menu", name: "메뉴 경쟁력 강화", description: "수익성 높은 인기 메뉴가 더 잘 보이게 합니다.", tasks: [task("m1", "대표 메뉴 5개 선정하기", "판매량, 마진, 조리 편의성을 함께 비교하세요.", "4일차"), task("m2", "대표 메뉴 설명 다듬기", "맛이 떠오르는 구체적인 표현으로 짧게 작성하세요.", "5일차")] },
        { id: "local", name: "지역 고객 활성화", description: "만족한 고객을 검색 노출과 재방문으로 연결합니다.", tasks: [task("r1", "네이버·구글 매장 정보 점검하기", "영업시간, 메뉴 링크, 최신 사진을 업데이트하세요.", "6일차"), task("r2", "만족한 고객 10명에게 리뷰 요청하기", "자연스러운 한 문장으로 적절한 순간에 요청하세요.", "7일차")] },
      ],
    },
    "career-helper": {
      target: answers.role || "명확한 다음 커리어",
      nextAction: "가장 원하는 채용 공고 하나를 고르고, 반복해서 등장하는 역량 5개를 표시하세요.",
      buckets: [
        { id: "position", name: "포지셔닝 정리", description: "30초 안에 나의 적합성을 이해시킵니다.", tasks: [task("p1", "이상적인 공고 5개 모으기", "반복되는 역량과 성과 표현을 표시하세요.", "1일차"), task("p2", "두 줄 가치 제안 작성하기", "가장 강한 성과를 회사의 필요와 연결하세요.", "2일차")] },
        { id: "assets", name: "지원 자료 개선", description: "이력서와 프로필을 구체적인 증거로 바꿉니다.", tasks: [task("a1", "이력서 상단 다시 쓰기", "직무 적합성과 측정 가능한 성과 두 개를 먼저 보여주세요.", "3일차"), task("a2", "링크드인 헤드라인 수정하기", "채용 담당자가 검색하는 목표 직무 언어를 사용하세요.", "4일차"), task("a3", "맞춤 이력서 한 부 만들기", "우선순위 표현을 자연스럽게 반영하세요.", "5일차")] },
        { id: "pipeline", name: "구직 파이프라인 만들기", description: "채용 사이트 밖에서도 꾸준한 기회를 만듭니다.", tasks: [task("j1", "목표 회사 15곳 정하기", "채용 중인 곳과 잠재적으로 잘 맞는 곳을 섞으세요.", "6일차"), task("j2", "진정성 있는 메시지 5개 보내기", "일자리 요청보다 경험과 관점을 물어보세요.", "7일차")] },
      ],
    },
  } as const;
  const selected = plans[agent.id as keyof typeof plans] ?? plans["business-builder"];
  return { agentId: agent.id, goalSummary: `${agent.shortName}가 ${firstAnswer} 목표를 ${time} 안에서 실행 가능한 계획으로 바꿔드립니다.`, target: selected.target, timeline: "7일 스타터 스프린트", nextAction: selected.nextAction, buckets: selected.buckets.map((bucket) => ({ ...bucket, tasks: bucket.tasks.map((item) => ({ ...item })) })), createdAt: new Date().toISOString() };
}

export function generateMockPlan(agent: AgentPack, answers: Answers, locale: Locale = "en"): ExecutionPlan {
  if (locale === "ko") return generateKoreanPlan(agent, answers);
  const firstAnswer = answers[agent.intakeQuestions[0].id] || "your goal";
  const time = answers.time || "your available time";

  const templates = {
    "business-builder": {
      target: answers.target || "A clearly defined early customer group",
      nextAction: `Write a one-sentence problem statement for “${firstAnswer}” and send it to one potential user today.`,
      buckets: [
        { id: "validate", name: "Validate the problem", description: "Replace assumptions with direct customer evidence.", tasks: [
          task("v1", "Draft 5 interview questions", "Keep them focused on past behavior, not opinions.", "Day 1"),
          task("v2", "Speak with 3 target users", "Capture exact phrases, pain frequency, and current workarounds.", "Days 2–3"),
          task("v3", "Summarize the strongest signal", "Pick one painful, frequent problem worth solving first.", "Day 3"),
        ]},
        { id: "scope", name: "Scope the MVP", description: "Define the smallest useful product that proves value.", tasks: [
          task("s1", "Write the core user journey", "Map the shortest path from problem to outcome.", "Day 4"),
          task("s2", "Choose 3 must-have features", "Move every other idea into a later list.", "Day 4"),
          task("s3", "Sketch the main screens", "Use paper or a simple wireframe—speed matters most.", "Day 5"),
        ]},
        { id: "launch", name: "Build the launch loop", description: "Create a direct route to the first real users.", tasks: [
          task("l1", "Create a simple waitlist page", "State the problem, promise, and one clear call to action.", "Day 6"),
          task("l2", "Invite 10 potential users", "Start with interviewees and warm contacts.", "Day 7"),
        ]},
      ],
    },
    "restaurant-operator": {
      target: answers.goal || "A smoother operation and stronger local demand",
      nextAction: "Run a 15-minute pre-shift huddle and choose one service metric to track tonight.",
      buckets: [
        { id: "ops", name: "Stabilize the shift", description: "Make the guest experience predictable every day.", tasks: [
          task("o1", "Choose one shift metric", "Track ticket time, errors, or table turns consistently.", "Day 1"),
          task("o2", "Create a 5-point opening checklist", "Assign one owner and a clear completion time.", "Day 2"),
          task("o3", "Review three service breakdowns", "Find the repeated handoff causing the most friction.", "Day 3"),
        ]},
        { id: "menu", name: "Sharpen the menu", description: "Make profitable favorites easier to notice and order.", tasks: [
          task("m1", "Identify 5 hero items", "Compare popularity, margin, and ease of execution.", "Day 4"),
          task("m2", "Rewrite hero item descriptions", "Lead with flavor and specificity; keep each one brief.", "Day 5"),
        ]},
        { id: "local", name: "Activate local demand", description: "Turn happy guests into discovery and repeat visits.", tasks: [
          task("r1", "Refresh Google profile", "Update hours, menu link, and five current photos.", "Day 6"),
          task("r2", "Ask 10 happy guests for reviews", "Use one natural sentence at the right moment.", "Day 7"),
        ]},
      ],
    },
    "career-helper": {
      target: answers.role || "A focused next career move",
      nextAction: "Choose one ideal job posting and highlight the five capabilities it repeats most.",
      buckets: [
        { id: "position", name: "Clarify your positioning", description: "Make your fit obvious in under 30 seconds.", tasks: [
          task("p1", "Collect 5 ideal job posts", "Highlight repeated skills, outcomes, and language.", "Day 1"),
          task("p2", "Write your 2-line value story", "Connect your strongest proof to the employer's need.", "Day 2"),
        ]},
        { id: "assets", name: "Upgrade your assets", description: "Turn your resume and profile into evidence.", tasks: [
          task("a1", "Rewrite the top resume section", "Lead with role fit and two measurable wins.", "Day 3"),
          task("a2", "Refresh your LinkedIn headline", "Use target-role language recruiters actually search.", "Day 4"),
          task("a3", "Build one tailored resume", "Mirror the priority language without copying blindly.", "Day 5"),
        ]},
        { id: "pipeline", name: "Build your search pipeline", description: "Create consistent activity beyond job boards.", tasks: [
          task("j1", "List 15 target companies", "Mix active openings with strong-fit companies.", "Day 6"),
          task("j2", "Send 5 thoughtful messages", "Ask for perspective, not a job or generic referral.", "Day 7"),
        ]},
      ],
    },
  } as const;

  const selected = templates[agent.id as keyof typeof templates] ?? templates["business-builder"];

  return {
    agentId: agent.id,
    goalSummary: `${agent.shortName} will help turn ${firstAnswer} into a focused plan you can execute with ${time}.`,
    target: selected.target,
    timeline: "7-day starter sprint",
    nextAction: selected.nextAction,
    buckets: selected.buckets.map((bucket) => ({ ...bucket, tasks: bucket.tasks.map((item) => ({ ...item })) })),
    createdAt: new Date().toISOString(),
  };
}
