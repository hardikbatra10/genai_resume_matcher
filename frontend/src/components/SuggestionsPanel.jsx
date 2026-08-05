import { useEffect } from "react";
import { Building2, CheckCircle2, Loader2, Sparkles, X } from "lucide-react";
import { parseSuggestions, stripInlineMarkdown } from "../lib/parseSuggestions";

export default function SuggestionsPanel({ open, job, loading, suggestions, onClose }) {
  useEffect(() => {
    if (!open) return;
    function handleKey(e) {
      if (e.key === "Escape") onClose();
    }
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [open, onClose]);

  if (!open) return null;

  const blocks = parseSuggestions(suggestions);

  return (
    <div className="fixed inset-0 z-40">
      <button
        aria-label="Close suggestions"
        onClick={onClose}
        className="absolute inset-0 animate-fade-in bg-ink-950/40 backdrop-blur-[2px]"
      />

      <aside className="animate-slide-in absolute right-0 top-0 flex h-full w-full max-w-lg flex-col bg-white shadow-[var(--shadow-panel)]">
        <div className="flex items-start justify-between gap-4 border-b border-ink-100 px-6 py-5">
          <div className="min-w-0">
            <div className="flex items-center gap-2 text-brand-600">
              <Sparkles className="h-4 w-4" />
              <span className="text-xs font-semibold uppercase tracking-wide">AI resume edits</span>
            </div>
            {job && (
              <>
                <h2 className="mt-1.5 truncate text-lg font-bold text-ink-950">{job.title}</h2>
                <p className="mt-0.5 flex items-center gap-1.5 text-sm text-ink-500">
                  <Building2 className="h-3.5 w-3.5" />
                  {job.company}
                </p>
              </>
            )}
          </div>
          <button
            onClick={onClose}
            className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-ink-400 transition-colors hover:bg-ink-100 hover:text-ink-800"
            aria-label="Close"
          >
            <X className="h-4.5 w-4.5" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto px-6 py-6">
          {loading ? (
            <div className="flex h-full flex-col items-center justify-center gap-3 text-center">
              <Loader2 className="h-7 w-7 animate-spin text-brand-600" />
              <p className="text-sm font-medium text-ink-800">Analyzing job fit...</p>
              <p className="max-w-xs text-xs text-ink-400">
                Comparing your resume against this role's requirements to suggest targeted edits.
              </p>
            </div>
          ) : blocks.length === 0 ? (
            <p className="text-sm text-ink-400">No suggestions were returned for this role.</p>
          ) : (
            <div className="space-y-4">
              {blocks.map((block, i) => {
                if (block.type === "heading") {
                  return (
                    <h3 key={i} className="text-sm font-bold text-ink-900">
                      {stripInlineMarkdown(block.text)}
                    </h3>
                  );
                }
                if (block.type === "list") {
                  return (
                    <ul key={i} className="space-y-2.5">
                      {block.items.map((item, j) => (
                        <li key={j} className="flex items-start gap-2.5 text-sm leading-relaxed text-ink-700">
                          <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-good-600" />
                          <span>{stripInlineMarkdown(item)}</span>
                        </li>
                      ))}
                    </ul>
                  );
                }
                return (
                  <p key={i} className="text-sm leading-relaxed text-ink-700">
                    {stripInlineMarkdown(block.text)}
                  </p>
                );
              })}
            </div>
          )}
        </div>
      </aside>
    </div>
  );
}
