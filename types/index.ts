// "text" = 자유 입력, "single" = 칩 단일 선택, "multi" = 칩 다중 선택
export type AgentQuestionType = "text" | "single" | "multi";

// scope: 답변이 "그 사람"에 대한 지속 정보(profile)인지, "이번 목표"에 대한 정보(context)인지.
// → profile은 Phase 2 user_profile 테이블로, context는 session 테이블로 승격된다.
export type QuestionScope = "profile" | "context";

// 칩 옵션은 "고정 코드(value)" + "표시 라벨(label)"로 분리한다.
// 저장은 value(예: "creator_solo"), 화면은 label(예: "크리에이터·1인 사업자").
// → 다국어·분석·추천·로직 모두 가능해진다.
export type QuestionOption = { value: string; label: string };

export type AgentQuestion = {
  id: string;
  field: string; // 의미 키 (예: "time_budget"). 저장 시 이 키로 묶인다.
  scope: QuestionScope; // profile | context
  label: string;
  type: AgentQuestionType;
  placeholder?: string; // text 타입용
  options?: QuestionOption[]; // single/multi 타입용
  allowCustom?: boolean; // 칩에 더해 "직접 입력" 허용 여부
};

// 인테이크 결과의 저장 구조 (세션 프로파일).
// text → string, single → string(value 또는 직접입력), multi → string[](value 배열)
export type IntakeData = {
  profile: Record<string, string | string[]>;
  context: Record<string, string | string[]>;
};

export type AgentPack = {
  id: string;
  name: string;
  shortName: string;
  description: string;
  category: string;
  persona: string;
  accent: string;
  icon: string;
  intakeQuestions: AgentQuestion[];
  systemPrompt: string;
  outputFormat: string[];
  suggestedWorkflows: string[];
};

export type PlanTask = {
  id: string;
  title: string;
  detail: string;
  day: string;
  completed: boolean;
};

export type PlanBucket = {
  id: string;
  name: string;
  description: string;
  tasks: PlanTask[];
};

export type ExecutionPlan = {
  agentId: string;
  goalSummary: string;
  target: string;
  timeline: string;
  nextAction: string;
  buckets: PlanBucket[];
  createdAt: string;
};
export type Locale = "ko" | "en";
