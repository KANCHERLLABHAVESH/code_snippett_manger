import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import api from "../api/client.js";
import { useAuthContext } from "../context/AuthContext.jsx";

const SnippetDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuthContext();
  const [snippet, setSnippet] = useState(null);
  const [preview, setPreview] = useState(null);
  const [error, setError] = useState("");

  const fetchSnippet = async () => {
    setError("");
    try {
      const { data } = await api.get(`/snippets/${id}`);
      setSnippet(data);
    } catch (err) {
      setError(err.response?.data?.message || "Could not load snippet");
    }
  };

  useEffect(() => {
    fetchSnippet();
  }, [id]);

  const runPreview = async () => {
    try {
      const { data } = await api.get(`/snippets/${id}/preview`);
      setPreview(data);
    } catch (err) {
      setError(err.response?.data?.message || "Preview failed");
    }
  };

  const forkSnippet = async () => {
    try {
      const { data } = await api.post(`/snippets/${id}/fork`);
      navigate(`/snippets/${data._id}`);
    } catch (err) {
      setError(err.response?.data?.message || "Could not fork");
    }
  };

  const deleteSnippet = async () => {
    try {
      await api.delete(`/snippets/${id}`);
      navigate("/dashboard");
    } catch (err) {
      setError(err.response?.data?.message || "Delete failed");
    }
  };

  if (!snippet) {
    return (
      <section className="stack">
        {error ? <p className="error">{error}</p> : <p>Loading…</p>}
      </section>
    );
  }

  const isOwner = user && snippet.owner?._id === user.id;

  return (
    <section className="stack-lg">
      <header className="page-header">
        <div>
          <h1>{snippet.title}</h1>
          <p className="muted">
            {snippet.language} • {snippet.isPublic ? "Public" : "Private"}
          </p>
          <div className="tag-row">
            {snippet.tags?.map((tag) => (
              <span key={tag} className="tag">
                #{tag}
              </span>
            ))}
          </div>
        </div>
        <div className="row">
          <button onClick={forkSnippet} className="ghost-btn">
            Fork
          </button>
          {isOwner && (
            <button onClick={deleteSnippet} className="danger-btn">
              Delete
            </button>
          )}
        </div>
      </header>

      <pre className="code-full">{snippet.code}</pre>
      {error && <p className="error">{error}</p>}

      {snippet.language.toLowerCase() === "javascript" && (
        <div className="card">
          <div className="card-header">
            <h3>Preview (sandboxed)</h3>
            <button onClick={runPreview} className="ghost-btn">
              Run
            </button>
          </div>
          {preview && (
            <div className="stack">
              <p className="muted">Result: {String(preview.result)}</p>
              {preview.logs?.length > 0 && (
                <div className="logs">
                  {preview.logs.map((log, idx) => (
                    <code key={idx}>{log}</code>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      )}
    </section>
  );
};

export default SnippetDetailPage;

