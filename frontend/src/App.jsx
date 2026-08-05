import { useState } from "react";
import Header from "./components/Header";
import UploadZone from "./components/UploadZone";
import SearchPanel from "./components/SearchPanel";
import ResultsSection from "./components/ResultsSection";
import SuggestionsPanel from "./components/SuggestionsPanel";

const API_BASE = import.meta.env.VITE_API_BASE;

function App() {
  const [resumeFilename, setResumeFilename] = useState(null);
  const [structuredData, setStructuredData] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState(null);

  const [searchQuery, setSearchQuery] = useState("");
  const [matches, setMatches] = useState([]);
  const [searching, setSearching] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);

  const [activeJob, setActiveJob] = useState(null);
  const [suggestions, setSuggestions] = useState("");
  const [suggestionsLoading, setSuggestionsLoading] = useState(false);
  const [panelOpen, setPanelOpen] = useState(false);

  async function handleFileSelect(file) {
    const formData = new FormData();
    formData.append("file", file);

    setUploading(true);
    setUploadError(null);
    try {
      const response = await fetch(`${API_BASE}/upload-resume`, {
        method: "POST",
        body: formData,
      });
      const data = await response.json();
      setResumeFilename(data.filename);
      setStructuredData(data.structured_data);
    } catch {
      setUploadError("Couldn't upload that resume. Please try again.");
    } finally {
      setUploading(false);
    }
  }

  async function handleSearch() {
    if (!resumeFilename || !searchQuery) return;

    const formData = new FormData();
    formData.append("resume_filename", resumeFilename);
    formData.append("search_query", searchQuery);

    setSearching(true);
    const response = await fetch(`${API_BASE}/get-matches`, {
      method: "POST",
      body: formData,
    });
    const data = await response.json();
    setMatches(data.matches);
    setSuggestions("");
    setHasSearched(true);
    setSearching(false);
  }

  async function handleGetSuggestions(job) {
    setActiveJob(job);
    setPanelOpen(true);
    setSuggestionsLoading(true);
    setSuggestions("");

    const formData = new FormData();
    formData.append("resume_filename", resumeFilename);
    formData.append("job_title", job.title);
    formData.append("job_description", job.description);

    const response = await fetch(`${API_BASE}/get-recommendations`, {
      method: "POST",
      body: formData,
    });
    const data = await response.json();
    setSuggestions(data.suggestions);
    setSuggestionsLoading(false);
  }

  const activeStep = resumeFilename ? (hasSearched ? 2 : 1) : 0;

  return (
    <div className="min-h-screen bg-ink-50">
      <Header activeStep={activeStep} />

      <main className="mx-auto max-w-6xl px-6 py-8">
        <div className="mb-8">
          <h1 className="text-2xl font-bold tracking-tight text-ink-950 sm:text-3xl">
            Find your best-fit roles
          </h1>
          <p className="mt-1.5 max-w-xl text-sm text-ink-500">
            Upload your resume, search open roles, and get AI-ranked matches with tailored edit
            suggestions for each one.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-[340px_1fr] lg:items-start">
          <div className="space-y-5 lg:sticky lg:top-24">
            <UploadZone
              resumeFilename={resumeFilename}
              structuredData={structuredData}
              uploading={uploading}
              error={uploadError}
              onFileSelect={handleFileSelect}
            />
            <SearchPanel
              searchQuery={searchQuery}
              onQueryChange={setSearchQuery}
              onSearch={handleSearch}
              disabled={!resumeFilename}
              searching={searching}
            />
          </div>

          <ResultsSection
            hasResume={Boolean(resumeFilename)}
            hasSearched={hasSearched}
            searching={searching}
            matches={matches}
            activeJobTitle={panelOpen ? activeJob?.title : null}
            suggestionsLoadingTitle={suggestionsLoading ? activeJob?.title : null}
            onGetSuggestions={handleGetSuggestions}
          />
        </div>
      </main>

      <SuggestionsPanel
        open={panelOpen}
        job={activeJob}
        loading={suggestionsLoading}
        suggestions={suggestions}
        onClose={() => setPanelOpen(false)}
      />
    </div>
  );
}

export default App;
