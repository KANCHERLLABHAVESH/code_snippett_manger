import { Link } from "react-router-dom";

const SnippetCard = ({ snippet }) => {
  return (
    <article className="card">
      <header className="card-header">
        <div>
          <h3>{snippet.title}</h3>
          <p className="muted">
            {snippet.language} • {snippet.isPublic ? "Public" : "Private"}
          </p>
        </div>
        <Link to={`/snippets/${snippet._id}`} className="ghost-btn">
          View
        </Link>
      </header>
      <pre className="code-preview">
        {snippet.code.slice(0, 140)}
        {snippet.code.length > 140 && "..."}
      </pre>
      <footer className="tag-row">
        {snippet.tags?.map((tag) => (
          <span key={tag} className="tag">
            #{tag}
          </span>
        ))}
      </footer>
    </article>
  );
};

export default SnippetCard;

