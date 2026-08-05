import { FileSearch, SearchX, UploadCloud } from "lucide-react";
import JobCard from "./JobCard";

function JobCardSkeleton() {
  return (
    <div className="flex animate-pulse flex-col gap-4 rounded-2xl border border-ink-100 bg-white p-5 sm:flex-row sm:items-center">
      <div className="min-w-0 flex-1 space-y-2.5">
        <div className="h-4 w-1/2 rounded bg-ink-100" />
        <div className="h-3 w-3/4 rounded bg-ink-100" />
        <div className="h-3 w-full rounded bg-ink-100" />
      </div>
      <div className="flex flex-col items-stretch gap-3 sm:w-36">
        <div className="h-2 w-full rounded-full bg-ink-100" />
        <div className="h-8 w-full rounded-lg bg-ink-100" />
      </div>
    </div>
  );
}

function EmptyState({ icon: Icon, title, subtitle }) {
  return (
    <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-ink-200 bg-white/60 px-6 py-16 text-center">
      <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-ink-100">
        <Icon className="h-5.5 w-5.5 text-ink-400" />
      </div>
      <p className="text-sm font-semibold text-ink-800">{title}</p>
      <p className="mt-1 max-w-sm text-sm text-ink-400">{subtitle}</p>
    </div>
  );
}

export default function ResultsSection({
  hasResume,
  hasSearched,
  searching,
  matches,
  activeJobTitle,
  suggestionsLoadingTitle,
  onGetSuggestions,
}) {
  if (searching) {
    return (
      <div className="space-y-3">
        <p className="flex items-center gap-2 text-sm font-medium text-ink-500">
          <FileSearch className="h-4 w-4 animate-pulse text-brand-600" />
          Finding your best matches...
        </p>
        {[...Array(4)].map((_, i) => (
          <JobCardSkeleton key={i} />
        ))}
      </div>
    );
  }

  if (!hasSearched) {
    return (
      <EmptyState
        icon={UploadCloud}
        title={hasResume ? "Ready when you are" : "Upload a resume to get started"}
        subtitle={
          hasResume
            ? "Search for a role above and we'll rank openings by how well they match your resume."
            : "Once your resume is parsed, search for a role and we'll surface AI-ranked matches here."
        }
      />
    );
  }

  if (matches.length === 0) {
    return (
      <EmptyState
        icon={SearchX}
        title="No matches found"
        subtitle="Try a broader search query, e.g. a job title or skill instead of a full sentence."
      />
    );
  }

  return (
    <div className="space-y-3">
      <p className="text-sm font-medium text-ink-500">
        {matches.length} match{matches.length === 1 ? "" : "es"}, ranked by fit
      </p>
      {matches.map((job, i) => (
        <JobCard
          key={`${job.title}-${job.company}-${i}`}
          job={job}
          isActive={activeJobTitle === job.title}
          isLoadingSuggestions={suggestionsLoadingTitle === job.title}
          onGetSuggestions={onGetSuggestions}
        />
      ))}
    </div>
  );
}
