import { Target } from "lucide-react";

const STEPS = ["Upload resume", "Search jobs", "Review matches"];

export default function Header({ activeStep }) {
  return (
    <header className="sticky top-0 z-30 border-b border-ink-100 bg-white/80 backdrop-blur">
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-6 py-4">
        <div className="flex items-center gap-2.5">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-ink-950">
            <Target className="h-4.5 w-4.5 text-white" strokeWidth={2.25} />
          </div>
          <div className="leading-tight">
            <p className="text-[15px] font-bold tracking-tight text-ink-950">Matchpoint</p>
            <p className="hidden text-xs text-ink-400 sm:block">AI resume &amp; job matcher</p>
          </div>
        </div>

        <ol className="hidden items-center gap-2 md:flex">
          {STEPS.map((step, i) => {
            const isActive = i === activeStep;
            const isDone = i < activeStep;
            return (
              <li key={step} className="flex items-center gap-2">
                <div className="flex items-center gap-2 rounded-full py-1 pl-1 pr-3 text-xs font-medium">
                  <span
                    className={`flex h-5 w-5 items-center justify-center rounded-full text-[11px] font-bold ${
                      isDone
                        ? "bg-good-500 text-white"
                        : isActive
                          ? "bg-ink-950 text-white"
                          : "bg-ink-100 text-ink-400"
                    }`}
                  >
                    {i + 1}
                  </span>
                  <span className={isActive ? "text-ink-900" : "text-ink-400"}>{step}</span>
                </div>
                {i < STEPS.length - 1 && <span className="h-px w-6 bg-ink-200" />}
              </li>
            );
          })}
        </ol>
      </div>
    </header>
  );
}
