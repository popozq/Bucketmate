// "text" = 자유 입력, "single" = 칩 단일 선택, "multi" = 칩 다중 선택
export type AgentQuestionType = "text" | "single" | "multi";

export type AgentQuestion = {
  id: string;
  label: string;
  type: AgentQuestionType;
  placeholder?: string; // text 타입용
  options?: string[]; // single/multi 타입용 칩 목록
  allowCustom?: boolean; // 칩에 더해 "직접 입력"을 허용할지
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
