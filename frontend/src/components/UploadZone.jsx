import { useRef, useState } from "react";
import { CheckCircle2, FileText, Loader2, UploadCloud } from "lucide-react";

export default function UploadZone({ resumeFilename, structuredData, uploading, error, onFileSelect }) {
  const [isDragging, setIsDragging] = useState(false);
  const inputRef = useRef(null);

  function handleDrop(e) {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files?.[0];
    if (file) onFileSelect(file);
  }

  function handleInputChange(e) {
    const file = e.target.files?.[0];
    if (file) onFileSelect(file);
    e.target.value = "";
  }

  const isUploaded = Boolean(resumeFilename) && !uploading;

  return (
    <div className="rounded-2xl border border-ink-100 bg-white p-5 shadow-[var(--shadow-card)]">
      <div className="mb-3 flex items-center gap-2">
        <span className="flex h-6 w-6 items-center justify-center rounded-full bg-ink-950 text-[11px] font-bold text-white">
          1
        </span>
        <h2 className="text-sm font-semibold text-ink-900">Upload your resume</h2>
      </div>

      <button
        type="button"
        onClick={() => inputRef.current?.click()}
        onDragOver={(e) => {
          e.preventDefault();
          setIsDragging(true);
        }}
        onDragLeave={() => setIsDragging(false)}
        onDrop={handleDrop}
        disabled={uploading}
        className={`group flex w-full flex-col items-center justify-center rounded-xl border-2 border-dashed px-4 py-8 text-center transition-colors ${
          isDragging
            ? "border-brand-500 bg-brand-50"
            : isUploaded
              ? "border-good-500/40 bg-good-100/40"
              : "border-ink-200 bg-ink-50 hover:border-brand-500/50 hover:bg-brand-50/50"
        } ${uploading ? "cursor-wait opacity-70" : "cursor-pointer"}`}
      >
        <input
          ref={inputRef}
          type="file"
          accept=".pdf"
          className="hidden"
          onChange={handleInputChange}
          disabled={uploading}
        />

        {uploading ? (
          <>
            <Loader2 className="mb-3 h-7 w-7 animate-spin text-brand-600" />
            <p className="text-sm font-medium text-ink-800">Uploading &amp; parsing resume...</p>
            <p className="mt-1 text-xs text-ink-400">This takes a few seconds</p>
          </>
        ) : isUploaded ? (
          <>
            <CheckCircle2 className="mb-3 h-7 w-7 text-good-600" />
            <p className="flex max-w-full items-center gap-1.5 text-sm font-medium text-ink-900">
              <FileText className="h-4 w-4 shrink-0 text-ink-400" />
              <span className="truncate">{resumeFilename}</span>
            </p>
            <p className="mt-1 text-xs text-ink-400">Click or drop a file to replace it</p>
          </>
        ) : (
          <>
            <UploadCloud className="mb-3 h-7 w-7 text-ink-400 transition-colors group-hover:text-brand-600" />
            <p className="text-sm font-medium text-ink-800">
              Drag &amp; drop your resume, or <span className="text-brand-600">browse</span>
            </p>
            <p className="mt-1 text-xs text-ink-400">PDF only</p>
          </>
        )}
      </button>

      {error && <p className="mt-3 text-xs font-medium text-red-600">{error}</p>}

      {isUploaded && structuredData && (
        <div className="mt-4 space-y-2 border-t border-ink-100 pt-4">
          {structuredData.name && (
            <p className="text-sm font-semibold text-ink-900">{structuredData.name}</p>
          )}
          {Array.isArray(structuredData.skills) && structuredData.skills.length > 0 && (
            <div className="flex flex-wrap gap-1.5">
              {structuredData.skills.slice(0, 8).map((skill, i) => (
                <span
                  key={i}
                  className="rounded-md bg-ink-100 px-2 py-0.5 text-[11px] font-medium text-ink-600"
                >
                  {skill}
                </span>
              ))}
              {structuredData.skills.length > 8 && (
                <span className="rounded-md px-2 py-0.5 text-[11px] font-medium text-ink-400">
                  +{structuredData.skills.length - 8} more
                </span>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
