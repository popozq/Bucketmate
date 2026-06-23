import { GoalInput } from "@/components/goal-input";
import { Locale } from "@/types";
import { Reveal } from "@/components/motion";

const copy = {
  ko: {
    badge: "BucketMate v0.1 · 한국어 베타",
    title: "무엇이든 말해보세요,",
    highlight: "버킷이 전문가가 되어 도와줘요.",
    intro: "팩을 고르거나 폼을 채울 필요 없어요. 하고 싶은 일을 한 줄로 적으면, 버킷이 가장 알맞은 전문가가 되어 바로 대화를 시작합니다.",
    points: ["약 10초면 시작", "가입 없이 체험 가능", "내 상황에 맞춘 답변"],
    howLabel: "이용 방법",
    howTitle: "한 줄이면 충분해요.",
    howIntro: "복잡한 설정 없이, 말하면 버킷이 알아서 알맞은 전문가가 됩니다.",
    steps: [
      ["01", "말 걸기", "하고 싶은 일이나 고민을 한 줄로 적으세요."],
      ["02", "버킷이 전문가로", "버킷이 가장 알맞은 전문가 역할을 스스로 맡아요."],
      ["03", "바로 대화", "당신의 맥락에 맞춰 구체적이고 실행 가능한 답을 받아요."],
    ],
    ctaTitle: "지금 버킷에게 말 걸어보세요.",
  },
  en: {
    badge: "BucketMate v0.1",
    title: "Just say it,",
    highlight: "Bucket becomes the expert.",
    intro: "No packs to pick, no forms to fill. Write what you need in one line and Bucket becomes the right expert and starts the conversation.",
    points: ["Start in ~10 seconds", "No account needed", "Answers tuned to you"],
    howLabel: "How it works",
    howTitle: "One line is all it takes.",
    howIntro: "No setup. Say what you need and Bucket takes on the fitting expert role for you.",
    steps: [
      ["01", "Say it", "Type what you're working on, in one line."],
      ["02", "Bucket becomes the expert", "Bucket takes on the most fitting expert role on its own."],
      ["03", "Just chat", "Get specific, actionable answers tuned to your context."],
    ],
    ctaTitle: "Tell Bucket what you need.",
  },
};

export function LandingPage({ locale }: { locale: Locale }) {
  const t = copy[locale];
  return (
    <main className="overflow-hidden">
      {/* 히어로 — 진입점(입력창)을 바로 위에 */}
      <section className="relative">
        <div className="tech-grid absolute inset-0 -z-20 opacity-60" />
        <div className="page-shell flex min-h-[620px] flex-col items-center justify-center py-20 text-center lg:py-28">
          <Reveal>
            <div className="mb-7 inline-flex items-center gap-2 rounded-full border border-brand-500/20 bg-white/70 px-4 py-2 text-xs font-bold text-brand-700 shadow-sm backdrop-blur">
              <span className="live-dot h-2 w-2 rounded-full bg-brand-500" />
              {t.badge}
            </div>
            <h1 className="mx-auto max-w-3xl text-4xl font-black leading-[1.12] tracking-[-0.04em] sm:text-5xl lg:text-6xl">
              {t.title} <span className="gradient-text">{t.highlight}</span>
            </h1>
            <p className="mx-auto mt-6 max-w-xl text-lg leading-8 text-black/55">{t.intro}</p>
          </Reveal>

          <Reveal delay={140} className="mt-10 w-full">
            <div className="relative mx-auto max-w-2xl">
              <div className="absolute -inset-8 -z-10 rounded-[40px] bg-brand-100/60 blur-3xl" />
              <GoalInput locale={locale} />
            </div>
          </Reveal>

          <Reveal delay={220}>
            <div className="mt-9 flex flex-wrap justify-center gap-x-7 gap-y-3 text-sm font-semibold text-black/45">
              {t.points.map((point) => <span key={point}>✓ {point}</span>)}
            </div>
          </Reveal>
        </div>
      </section>

      {/* 작동 방식 */}
      <section id="how-it-works" className="border-y border-black/5 bg-white py-24">
        <div className="page-shell">
          <Reveal className="mx-auto max-w-2xl text-center">
            <p className="eyebrow">{t.howLabel}</p>
            <h2 className="mt-4 text-4xl font-black tracking-tight">{t.howTitle}</h2>
            <p className="mt-4 text-black/55">{t.howIntro}</p>
          </Reveal>
          <div className="mt-14 grid gap-5 md:grid-cols-3">
            {t.steps.map((step, index) => (
              <Reveal key={step[0]} delay={index * 110}>
                <div className="interactive-card h-full rounded-3xl border border-transparent bg-cream p-7 transition duration-500 hover:-translate-y-1.5 hover:border-brand-500/15 hover:bg-white hover:shadow-soft sm:p-8">
                  <span className="text-sm font-black text-brand-600">{step[0]}</span>
                  <h3 className="mt-12 text-xl font-black">{step[1]}</h3>
                  <p className="mt-3 text-sm leading-6 text-black/55">{step[2]}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* 마지막 진입점 — 다시 입력창 */}
      <section className="page-shell py-24">
        <Reveal className="mx-auto max-w-2xl text-center">
          <h2 className="text-3xl font-black tracking-tight sm:text-4xl">{t.ctaTitle}</h2>
          <div className="mt-9">
            <GoalInput locale={locale} showChips={false} />
          </div>
        </Reveal>
      </section>
    </main>
  );
}
