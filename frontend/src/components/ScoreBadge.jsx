function toPercent(score) {
  if (typeof score !== "number" || Number.isNaN(score)) return 0;
  const pct = score <= 1 ? score * 100 : score;
  return Math.max(0, Math.min(100, Math.round(pct)));
}

function tier(pct) {
  if (pct >= 80) {
    return {
      label: "Strong match",
      bar: "bg-good-500",
      text: "text-good-600",
      chip: "bg-good-100 text-good-600",
    };
  }
  if (pct >= 60) {
    return {
      label: "Good match",
      bar: "bg-brand-500",
      text: "text-brand-600",
      chip: "bg-brand-100 text-brand-600",
    };
  }
  return {
    label: "Fair match",
    bar: "bg-mid-500",
    text: "text-mid-600",
    chip: "bg-mid-100 text-mid-600",
  };
}

export default function ScoreBadge({ score }) {
  const pct = toPercent(score);
  const { label, bar, text, chip } = tier(pct);

  return (
    <div className="flex w-full items-center gap-3 sm:w-36 sm:flex-col sm:items-end sm:gap-1.5">
      <div className={`shrink-0 rounded-full px-2.5 py-0.5 text-xs font-semibold sm:order-2 ${chip}`}>
        {label}
      </div>
      <div className="flex flex-1 items-center gap-2 sm:order-1 sm:w-full sm:flex-none">
        <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-ink-100 sm:w-full">
          <div
            className={`h-full rounded-full ${bar} transition-[width] duration-500 ease-out`}
            style={{ width: `${pct}%` }}
          />
        </div>
        <span className={`text-sm font-bold tabular-nums ${text}`}>{pct}%</span>
      </div>
    </div>
  );
}
