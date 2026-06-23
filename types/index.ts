export type AgentQuestion = {
  id: string;
  label: string;
  placeholder: string;
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
