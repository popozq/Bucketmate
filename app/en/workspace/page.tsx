import { StepStrip } from "@/components/step-strip";
import { WorkspaceDashboard } from "@/components/workspace-dashboard";

export default function EnglishWorkspacePage() {
  return <><div className="bg-white py-7"><StepStrip active={3} locale="en" /></div><WorkspaceDashboard locale="en" /></>;
}
