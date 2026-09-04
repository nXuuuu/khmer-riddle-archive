"use client";

import { useState, useMemo, useEffect } from "react";
import { INITIAL_RIDDLES, CATEGORIES } from "../data/riddles.js";
import NavBar from "../components/NavBar.js";
import HeroSection from "../components/HeroSection.js";
import SearchBar from "../components/SearchBar.js";
import CategoryFilter from "../components/CategoryFilter.js";
import StatsBar from "../components/StatsBar.js";
import RiddleCard from "../components/RiddleCard.js";
import EmptyState from "../components/EmptyState.js";
import SourceFilter from "../components/SourceFilter.js";
import collection from "../collection.config.js";




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
  archiveSection: { maxWidth: 900, margin: "0 auto", padding: "80px 24px 120px" },
  sectionLabel: {
    fontFamily: "var(--mono)", fontSize: 12, color: "var(--accent)",
    letterSpacing: 1.5, display: "block", marginBottom: 6,
  },
  sectionTitle: {
    fontSize: "clamp(24px, 4vw, 36px)", fontWeight: 700,
    color: "var(--text-primary)", letterSpacing: "-0.02em", lineHeight: 1.15, marginBottom: 8,
  },
  sectionDesc: { fontSize: 15, color: "var(--text-secondary)", lineHeight: 1.7, marginBottom: 36 },
  grid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fill, minmax(min(100%, 420px), 1fr))",
    gap: 16,
  },
  aboutSection: {
    borderTop: "1px solid var(--border)",
    maxWidth: 900, margin: "0 auto", padding: "80px 24px",
    display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))", gap: 20,
  },
  infoCard: {
    backgroundColor: "var(--bg-card)", border: "1px solid var(--border)",
    borderRadius: "var(--radius-md)", padding: "20px 22px",
    boxShadow: "var(--shadow-card)",
  },
  infoLabel: {
    fontFamily: "var(--mono)", fontSize: 11, color: "var(--text-muted)",
    letterSpacing: 1, marginBottom: 8, display: "block",
  },
  infoValue: { fontSize: 14, color: "var(--text-secondary)", lineHeight: 1.7 },
  footer: {
    borderTop: "1px solid var(--border)", textAlign: "center",
    padding: "28px 24px", fontFamily: "var(--mono)", fontSize: 12,
    color: "var(--text-muted)", lineHeight: 1.9,
  },
};

const aboutCards = [
  { label: "CURATED BY", value: collection.curator },
  { label: "SOURCE", value: collection.source },
  { label: "COURSE", value: "" },
  { label: "STATUS", value: "" },
];

export default function Home() {
  const [query, setQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [selectedSource, setSelectedSource] = useState("All");
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

  const allSources = useMemo(() => {
    return [...new Set(riddles.map((r) => r.sourceEn))].filter(Boolean);
  }, [riddles]);

  const uniqueSources = useMemo(() => {
    return new Set(riddles.map(r => r.source)).size;
  }, [riddles]);

  const filteredRiddles = useMemo(() => {
    return riddles.filter(item => {
      const matchCat = selectedCategory === "All" || item.category === selectedCategory;
      const matchSrc = selectedSource === "All" || item.sourceEn === selectedSource;
      const q = query.trim().toLowerCase();
      const matchQ = !q ||
        item.question.toLowerCase().includes(q) ||
        item.answer.toLowerCase().includes(q) ||
        item.answerEn.toLowerCase().includes(q) ||
        item.questionHint.toLowerCase().includes(q) ||
        item.sourceEn.toLowerCase().includes(q) ||
        item.category.toLowerCase().includes(q) ||
        item.explanation.toLowerCase().includes(q);
      return matchCat && matchSrc && matchQ;
    });
  }, [query, selectedCategory, selectedSource, riddles]);

  const handleReset = () => {
    setQuery("");
    setSelectedCategory("All");
    setSelectedSource("All");
  };

  return (
    <>
      <NavBar />

      <HeroSection
        totalEntries={riddles.length}
        totalCategories={CATEGORIES.length - 1}
        totalSources={uniqueSources}
      />

      {/* ── Archive ── */}
      <main id="archive" style={S.archiveSection}>
        <div className="reveal">
          <span style={S.sectionLabel}>ARCHIVE · ព្រឹត្តប័ត្រ</span>
          <h2 style={S.sectionTitle}>Browse All Riddles</h2>
          <p style={S.sectionDesc}>
            Explore the full collection of Khmer riddles, sourced from oral traditions, elders, and books.
            Filter by category or search in English and Khmer.
          </p>
        </div>

        <div className="reveal delay-1">
          <SearchBar query={query} onChange={setQuery} />
          <CategoryFilter categories={CATEGORIES} selected={selectedCategory} onSelect={setSelectedCategory} />
          <SourceFilter sources={allSources} selected={selectedSource} onSelect={setSelectedSource} />
          <StatsBar total={riddles.length} visibleCount={filteredRiddles.length} />
        </div>

        <section aria-label="Riddle entries" style={S.grid}>
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
      <section id="about" aria-label="About this archive">
        <div style={{ maxWidth: 900, margin: "0 auto", padding: "0 24px 40px" }} className="reveal">
          <span style={S.sectionLabel}>ABOUT · អំពី</span>
          <h2 style={S.sectionTitle}>About This Archive</h2>
          <p style={S.sectionDesc}>
            The Khmer Riddle Archive is a living digital preservation effort, collecting oral riddles
            passed down through generations of Cambodian elders, families, and communities.
          </p>
        </div>
        <div style={S.aboutSection}>
          {aboutCards.map((item, i) => (
            <div key={item.label} style={S.infoCard} className={`reveal delay-${i + 1}`}>
              <span style={S.infoLabel}>{item.label}</span>
              <p style={S.infoValue}>{item.value}</p>
            </div>
          ))}
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
