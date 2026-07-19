import { useState } from "react";

const API_BASE = "http://127.0.0.1:8000";

function App() {
  const [resumeFilename, setResumeFilename] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [matches, setMatches] = useState([]);
  const [suggestions, setSuggestions] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleUpload(event) {
    const file = event.target.files[0];
    if (!file) return;

    const formData = new FormData();
    formData.append("file", file);

    setLoading(true);
    const response = await fetch(`${API_BASE}/upload-resume`, {
      method: "POST",
      body: formData,
    });
    const data = await response.json();
    setResumeFilename(data.filename);
    setLoading(false);
  }

  async function handleSearch() {
    if (!resumeFilename || !searchQuery) return;

    const formData = new FormData();
    formData.append("resume_filename", resumeFilename);
    formData.append("search_query", searchQuery);

    setLoading(true);
    const response = await fetch(`${API_BASE}/get-matches`, {
      method: "POST",
      body: formData,
    });
    const data = await response.json();
    setMatches(data.matches);
    setSuggestions("");
    setLoading(false);
  }

  async function handleGetSuggestions(job) {
    const formData = new FormData();
    formData.append("resume_filename", resumeFilename);
    formData.append("job_title", job.title);
    formData.append("job_description", job.description);

    setLoading(true);
    const response = await fetch(`${API_BASE}/get-recommendations`, {
      method: "POST",
      body: formData,
    });
    const data = await response.json();
    setSuggestions(data.suggestions);
    setLoading(false);
  }

  return (
    <div style={{ maxWidth: 700, margin: "40px auto", fontFamily: "sans-serif" }}>
      <h1>AI Resume-Job Matcher</h1>

      <section>
        <h2>1. Upload your resume</h2>
        <input type="file" accept=".pdf" onChange={handleUpload} />
        {resumeFilename && <p>Uploaded: {resumeFilename}</p>}
      </section>

      <section>
        <h2>2. Search for jobs</h2>
        <input
          type="text"
          placeholder="e.g. data analyst"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
        <button onClick={handleSearch} disabled={!resumeFilename}>
          Find matches
        </button>
      </section>

      {loading && <p>Loading...</p>}

      <section>
        {matches.map((job, i) => (
          <div
            key={i}
            style={{ border: "1px solid #ccc", padding: 12, marginBottom: 10 }}
          >
            <strong>{job.score}</strong> — {job.title} @ {job.company} ({job.location})
            <br />
            <button onClick={() => handleGetSuggestions(job)}>
              Get resume suggestions
            </button>
          </div>
        ))}
      </section>

      {suggestions && (
        <section>
          <h2>Suggested edits</h2>
          <pre style={{ whiteSpace: "pre-wrap" }}>{suggestions}</pre>
        </section>
      )}
    </div>
  );
}

export default App;