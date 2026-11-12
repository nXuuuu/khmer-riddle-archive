"use client";

// Large underlined search field, searches Khmer and English.
export default function SearchBar({ query, onChange }) {
  return (
    <div className="mu-search">
      <input
        type="search"
        value={query}
        onChange={(e) => onChange(e.target.value)}
        placeholder="Search the collection… · ស្វែងរក"
        aria-label="Search the archive"
      />
      {query && (
        <button type="button" className="mu-search-clear" onClick={() => onChange("")} aria-label="Clear search">
          ×
        </button>
      )}
    </div>
  );
}
