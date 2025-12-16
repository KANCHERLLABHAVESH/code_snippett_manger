import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import api from "../api/client.js";
import SnippetCard from "../components/SnippetCard.jsx";
import TagFilter from "../components/TagFilter.jsx";

const DashboardPage = () => {
  const [snippets, setSnippets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [language, setLanguage] = useState("");
  const [activeTag, setActiveTag] = useState(null);
  const [error, setError] = useState("");

  const fetchSnippets = async () => {
    setLoading(true);
    try {
      const params = {};
      if (language) params.language = language;
      if (activeTag) params.tags = activeTag;
      const { data } = await api.get("/snippets", { params });
      setSnippets(data);
    } catch (err) {
      setError(err.response?.data?.message || "Could not load snippets");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSnippets();
  }, [language, activeTag]);

  const allTags = useMemo(() => {
    const tags = new Set();
    snippets.forEach((s) => s.tags?.forEach((t) => tags.add(t)));
    return Array.from(tags);
  }, [snippets]);

  return (
    <section className="stack-lg">
      <header className="page-header">
        <div>
          <h1>Your snippets</h1>
          <p className="muted">Public and private snippets you can access.</p>
        </div>
        <Link to="/snippets/new" className="primary-btn">
          + New snippet
        </Link>
      </header>

      <div className="filters">
        <label>
          Language
          <select value={language} onChange={(e) => setLanguage(e.target.value)}>
            <option value="">Any</option>
            <option value="javascript">JavaScript</option>
            <option value="python">Python</option>
            <option value="typescript">TypeScript</option>
            <option value="go">Go</option>
            <option value="java">Java</option>
          </select>
        </label>
        <TagFilter tags={allTags} activeTag={activeTag} onChange={setActiveTag} />
      </div>

      {loading && <p>Loading snippets…</p>}
      {error && <p className="error">{error}</p>}
      {!loading && snippets.length === 0 && <p>No snippets yet. Create one!</p>}

      <div className="grid">
        {snippets.map((snippet) => (
          <SnippetCard key={snippet._id} snippet={snippet} />
        ))}
      </div>
    </section>
  );
};

export default DashboardPage;

