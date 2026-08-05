import { Building2, ExternalLink, Loader2, MapPin, Sparkles } from "lucide-react";
import ScoreBadge from "./ScoreBadge";

export default function JobCard({ job, onGetSuggestions, isActive, isLoadingSuggestions }) {
  return (
    <div
      className={`flex flex-col gap-4 rounded-2xl border bg-white p-5 shadow-[var(--shadow-card)] transition-all hover:shadow-[var(--shadow-card-hover)] sm:flex-row sm:items-center ${
        isActive ? "border-brand-500 ring-2 ring-brand-100" : "border-ink-100"
      }`}
    >
      <div className="min-w-0 flex-1">
        <h3 className="truncate text-[15px] font-semibold text-ink-950">{job.title}</h3>
        <div className="mt-1.5 flex flex-wrap items-center gap-x-3 gap-y-1 text-sm text-ink-500">
          <span className="flex items-center gap-1.5">
            <Building2 className="h-3.5 w-3.5 text-ink-400" />
            {job.company}
          </span>
          {job.location && (
            <span className="flex items-center gap-1.5">
              <MapPin className="h-3.5 w-3.5 text-ink-400" />
              {job.location}
            </span>
          )}
          {job.url && (
            <a
              href={job.url}
              target="_blank"
              rel="noreferrer"
              className="flex items-center gap-1 text-brand-600 hover:underline"
            >
              View posting
              <ExternalLink className="h-3 w-3" />
            </a>
          )}
        </div>
        {job.description && (
          <p className="mt-2 line-clamp-2 text-sm leading-relaxed text-ink-500">{job.description}</p>
        )}
      </div>

      <div className="flex flex-col items-stretch gap-3 sm:w-auto sm:items-end">
        <ScoreBadge score={job.score} />
        <button
          onClick={() => onGetSuggestions(job)}
          disabled={isLoadingSuggestions}
          className="flex items-center justify-center gap-1.5 whitespace-nowrap rounded-lg border border-ink-950 bg-ink-950 px-3.5 py-2 text-xs font-semibold text-white transition-colors hover:bg-ink-800 disabled:cursor-not-allowed disabled:opacity-60 sm:w-36"
        >
          {isLoadingSuggestions ? (
            <>
              <Loader2 className="h-3.5 w-3.5 animate-spin" />
              Analyzing...
            </>
          ) : (
            <>
              <Sparkles className="h-3.5 w-3.5" />
              Get AI edits
            </>
          )}
        </button>
      </div>
    </div>
  );
}
