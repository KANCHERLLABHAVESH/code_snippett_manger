const TagFilter = ({ tags, activeTag, onChange }) => {
  if (!tags.length) return null;
  return (
    <div className="tag-filter">
      <button
        type="button"
        className={!activeTag ? "pill active" : "pill"}
        onClick={() => onChange(null)}
      >
        All
      </button>
      {tags.map((tag) => (
        <button
          key={tag}
          type="button"
          className={activeTag === tag ? "pill active" : "pill"}
          onClick={() => onChange(tag)}
        >
          {tag}
        </button>
      ))}
    </div>
  );
};

export default TagFilter;

