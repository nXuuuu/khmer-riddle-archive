"use client";

import { useState, useMemo, useEffect } from "react";
import { INITIAL_RIDDLES, CATEGORIES, CATEGORY_LABELS } from "../data/riddles.js";
import NavBar from "../components/NavBar.js";
import HeroSection from "../components/HeroSection.js";
import SearchBar from "../components/SearchBar.js";
import CategoryFilter from "../components/CategoryFilter.js";
import StatsBar from "../components/StatsBar.js";
import RiddleCard from "../components/RiddleCard.js";
import EmptyState from "../components/EmptyState.js";
import collection from "../collection.config.js";

/* ── Normalize Khmer & English text (NFC + strip zero-width chars) ── */
function cleanKhmer(str) {
  if (!str) return "";
  return String(str)
    .normalize("NFC")
    .replace(/[\u200B-\u200D\uFEFF]/g, "")
    .toLowerCase();
}




/* ── Scroll-reveal via IntersectionObserver (vanilla browser API) ── */
function useReveal() {
  useEffect(() => {
    const els = document.querySelectorAll(".reveal");
    const io = new IntersectionObserver(
      entries => entries.forEach(e => { if (e.isIntersecting) e.target.classList.add("visible"); }),
      { threshold: 0.1 }
    );
    els.forEach(el => io.observe(el));
    return () => io.disconnect();
  }, []);
}

const UNIQUE_SOURCES = new Set(INITIAL_RIDDLES.map(r => r.source)).size;

const S = {
  archiveSection: {
    paddingTop: "var(--space-xl)",
    paddingBottom: "var(--space-2xl)",
  },
  infoCard: {
    backgroundColor: "var(--bg-card)",
    border: "1px solid var(--border)",
    borderRadius: "var(--radius-md)",
    padding: "clamp(16px, 3vw, 24px)",
    boxShadow: "var(--shadow-card)",
  },
  infoLabel: {
    fontFamily: "var(--mono)",
    fontSize: "var(--text-xs)",
    color: "var(--text-muted)",
    letterSpacing: 1,
    marginBottom: 8,
    display: "block",
  },
  infoValue: {
    fontSize: "var(--text-sm)",
    color: "var(--text-secondary)",
    lineHeight: 1.65,
  },
  footer: {
    borderTop: "1px solid var(--border)",
    textAlign: "center",
    padding: "clamp(24px, 4vw, 40px) var(--container-padding)",
    fontFamily: "var(--mono)",
    fontSize: "var(--text-xs)",
    color: "var(--text-muted)",
    lineHeight: 1.9,
  },
};

const aboutCards = [
  { label: "CURATED BY", value: collection.curator },
  { label: "SOURCE", value: collection.source },
  { label: "COURSE", value: "ICT 340 — Vibe Coding · AUPP" },
  { label: "STATUS", value: "Living archive — actively growing" },
];

export default function Home() {
  const [query, setQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [riddles, setRiddles] = useState(INITIAL_RIDDLES);
  useReveal();

  const loadPublishedRiddles = () => {
    const custom = JSON.parse(localStorage.getItem("custom-riddles") || "[]");
    const published = custom.filter((r) => r.status === "published");
    if (published.length > 0) {
      setRiddles([...published, ...INITIAL_RIDDLES]);
    } else {
      setRiddles(INITIAL_RIDDLES);
    }
  };

  useEffect(() => {
    loadPublishedRiddles();
    window.addEventListener("riddlesUpdated", loadPublishedRiddles);
    return () => window.removeEventListener("riddlesUpdated", loadPublishedRiddles);
  }, []);

  const filteredRiddles = useMemo(() => {
    const q = cleanKhmer(query.trim());
    return riddles.filter(item => {
      const matchCat = selectedCategory === "All" || item.category === selectedCategory;
      if (!matchCat) return false;
      if (!q) return true;

      const kmCat = CATEGORY_LABELS[item.category] || "";
      const searchable = [
        item.question,
        item.questionHint,
        item.answer,
        item.answerEn,
        item.explanation,
        item.explanationKm,
        item.source,
        item.sourceEn,
        item.category,
        kmCat,
        item.contributor,
      ]
        .map(cleanKhmer)
        .join(" ");

      return searchable.includes(q);
    });
  }, [query, selectedCategory, riddles]);

  const handleReset = () => {
    setQuery("");
    setSelectedCategory("All");
  };

  return (
    <>
      <NavBar />

      <HeroSection
        totalEntries={riddles.length}
        totalCategories={CATEGORIES.length - 1}
      />

      {/* ── Archive ── */}
      <main id="archive" className="gr-container" style={S.archiveSection}>
        <div className="gr-section-header reveal">
          <span className="gr-section-label">ARCHIVE · ព្រឹត្តប័ត្រ</span>
          <h2 className="gr-section-title">Browse All Riddles</h2>
          <p className="gr-section-desc">
            Explore the full collection of Khmer riddles, sourced from oral traditions, elders, and books.
            Filter by category or search in English and Khmer.
          </p>
        </div>

        <div className="reveal delay-1" style={{ marginBottom: "var(--space-lg)" }}>
          <SearchBar query={query} onChange={setQuery} />
          <CategoryFilter categories={CATEGORIES} selected={selectedCategory} onSelect={setSelectedCategory} />
          <StatsBar total={riddles.length} visibleCount={filteredRiddles.length} />
        </div>

        <section aria-label="Riddle entries" className="gr-archive-grid">
          {filteredRiddles.length === 0
            ? <EmptyState onReset={handleReset} />
            : filteredRiddles.map((riddle, i) => (
                <div key={riddle.id} className={`reveal delay-${Math.min(i + 1, 5)}`}>
                  <RiddleCard item={riddle} />
                </div>
              ))
          }
        </section>
      </main>

      {/* ── About ── */}
      <section id="about" aria-label="About this archive" style={{ borderTop: "1px solid var(--border)", paddingTop: "var(--space-xl)", paddingBottom: "var(--space-2xl)" }}>
        <div className="gr-container">
          <div className="gr-section-header reveal">
            <span className="gr-section-label">ABOUT · អំពី</span>
            <h2 className="gr-section-title">About This Archive</h2>
            <p className="gr-section-desc">
              The Khmer Riddle Archive is a living digital preservation effort, collecting oral riddles
              passed down through generations of Cambodian elders, families, and communities.
            </p>
          </div>
          <div className="gr-about-grid">
            {aboutCards.map((item, i) => (
              <div key={item.label} style={S.infoCard} className={`reveal delay-${i + 1}`}>
                <span style={S.infoLabel}>{item.label}</span>
                <p style={S.infoValue}>{item.value}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <footer style={S.footer}>
        <span>「ប」 {collection.name} </span>
        <br />
        <span style={{ color: "var(--text-muted)" }}>
          Preserving the oral wit and wisdom of the Khmer people, one riddle at a time.
        </span>
        <br />
        <a href="/admin" style={{ color: "var(--text-muted)", textDecoration: "none", fontSize: 11, marginTop: 16, display: "inline-block", opacity: 0.6 }}>
          Admin Login
        </a>
      </footer>
    </>
  );
}
