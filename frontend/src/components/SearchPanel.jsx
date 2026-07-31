import { Loader2, Search } from "lucide-react";

export default function SearchPanel({ searchQuery, onQueryChange, onSearch, disabled, searching }) {
  function handleKeyDown(e) {
    if (e.key === "Enter") onSearch();
  }

  return (
    <div className="rounded-2xl border border-ink-100 bg-white p-5 shadow-[var(--shadow-card)]">
      <div className="mb-3 flex items-center gap-2">
        <span
          className={`flex h-6 w-6 items-center justify-center rounded-full text-[11px] font-bold text-white ${
            disabled ? "bg-ink-300" : "bg-ink-950"
          }`}
        >
          2
        </span>
        <h2 className="text-sm font-semibold text-ink-900">Search for jobs</h2>
      </div>

      <div className="relative">
        <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-ink-400" />
        <input
          type="text"
          placeholder="e.g. senior data analyst"
          value={searchQuery}
          onChange={(e) => onQueryChange(e.target.value)}
          onKeyDown={handleKeyDown}
          disabled={disabled}
          className="w-full rounded-lg border border-ink-200 bg-ink-50 py-2.5 pl-9 pr-3 text-sm text-ink-900 outline-none transition-colors placeholder:text-ink-400 focus:border-brand-500 focus:bg-white focus:ring-2 focus:ring-brand-100 disabled:cursor-not-allowed disabled:opacity-60"
        />
      </div>

      <button
        onClick={onSearch}
        disabled={disabled || !searchQuery.trim() || searching}
        className="mt-3 flex w-full items-center justify-center gap-2 rounded-lg bg-ink-950 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-ink-800 disabled:cursor-not-allowed disabled:bg-ink-200 disabled:text-ink-400"
      >
        {searching ? (
          <>
            <Loader2 className="h-4 w-4 animate-spin" />
            Finding matches...
          </>
        ) : (
          <>
            <Search className="h-4 w-4" />
            Find matches
          </>
        )}
      </button>

      {disabled && (
        <p className="mt-2.5 text-xs text-ink-400">Upload a resume first to unlock search.</p>
      )}
    </div>
  );
}
