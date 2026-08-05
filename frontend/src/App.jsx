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
  const [panelOpen, setPanelOpen] = useState(false);
  const [suggestionsLoading, setSuggestionsLoading] = useState(false);

  async function handleFileSelect(file) {
    if (!file) return;

    const formData = new FormData();
    formData.append("file", file);

    setUploading(true);
    setUploadError(null);

    const response = await fetch(`${API_BASE}/upload-resume`, {
      method: "POST",
      body: formData,
    });
    const data = await response.json();

    if (!data.is_resume) {
      setUploadError(data.error);
      setResumeFilename(null);
      setStructuredData(null);
    } else {
      setUploadError(null);
      setResumeFilename(data.filename);
      setStructuredData(data.structured_data);
    }
    setUploading(false);
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

      <main>
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