import { Locale } from "@/types";

export function StepStrip({ active, locale = "en" }: { active: 1 | 2 | 3; locale?: Locale }) {
  const steps = locale === "ko" ? ["팩 선택", "목표 알려주기", "실행 계획 받기"] : ["Choose a pack", "Tell us your goal", "Get your plan"];
  return (
    <div className="flex items-center justify-center gap-2 sm:gap-4">
      {steps.map((step, index) => {
        const number = index + 1;
        const isActive = number <= active;
        return (
          <div key={step} className="flex items-center gap-2 sm:gap-4">
            <div className="flex items-center gap-2">
              <span className={`grid h-7 w-7 place-items-center rounded-full text-xs font-black ${isActive ? "bg-brand-500 text-white" : "bg-black/5 text-black/30"}`}>{number}</span>
              <span className={`hidden text-xs font-bold sm:block ${isActive ? "text-ink" : "text-black/35"}`}>{step}</span>
            </div>
            {index < 2 && <span className={`h-px w-6 sm:w-12 ${number < active ? "bg-brand-500" : "bg-black/10"}`} />}
          </div>
        );
      })}
    </div>
  );
}
