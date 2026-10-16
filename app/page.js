"use client";

import { useState, useMemo, useEffect } from "react";
import collection, { CATEGORIES, CATEGORY_LABELS } from "../collection.config.js";
import { createClient } from "../utils/supabase/client.js";
import NavBar from "../components/NavBar.js";
import HeroSection from "../components/HeroSection.js";
import SearchBar from "../components/SearchBar.js";
import CategoryFilter from "../components/CategoryFilter.js";
import StatsBar from "../components/StatsBar.js";
import RiddleCard from "../components/RiddleCard.js";
import EmptyState from "../components/EmptyState.js";
import RiddleShowcase from "../components/RiddleShowcase.js";
import CuratorSpotlight from "../components/CuratorSpotlight.js";
import CosmicTransitionZone from "../components/CosmicTransitionZone.js";
import { SEED_RIDDLES } from "../data/seedRiddles.js";

/* ── Normalize Khmer & English text (NFC + strip zero-width chars) ── */
function cleanKhmer(str) {
  if (!str) return "";
  return String(str)
    .normalize("NFC")
    .replace(/[\u200B-\u200D\uFEFF]/g, "")
    .toLowerCase();
}

/* ── Scroll-reveal via IntersectionObserver (vanilla browser API) ── */
function useReveal(deps) {
  useEffect(() => {
    const els = document.querySelectorAll(".reveal:not(.visible)");
    const io = new IntersectionObserver(
      entries => entries.forEach(e => {
        if (e.isIntersecting) {
          e.target.classList.add("visible");
          io.unobserve(e.target);
        }
      }),
      { threshold: 0.08 }
    );
    els.forEach(el => io.observe(el));
    return () => io.disconnect();
  }, [deps]);
}

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
    color: "var(--text-secondary)",
    letterSpacing: 1,
    marginBottom: 8,
    display: "block",
  },
  infoValue: {
    fontSize: "var(--text-sm)",
    color: "var(--text-primary)",
    lineHeight: 1.65,
  },
  footer: {
    borderTop: "1px solid var(--border)",
    textAlign: "center",
    padding: "clamp(24px, 4vw, 40px) var(--container-padding)",
    fontFamily: "var(--mono)",
    fontSize: "var(--text-xs)",
    color: "var(--text-secondary)",
    lineHeight: 1.9,
  },
};

const aboutCards = [
  {
    label: "CURATED BY",
    value: collection.curator,
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M3 21h18M3 10h18M4 10l8-6 8 6M6 10v11M10 10v11M14 10v11M18 10v11" />
      </svg>
    ),
  },
  {
    label: "SOURCE",
    value: collection.source,
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M8 21h12a2 2 0 0 0 2-2v-2H10v2a2 2 0 1 1-4 0V5a2 2 0 1 0-4 0v3h4" />
        <path d="M19 17V5a2 2 0 0 0-2-2H4" />
        <path d="M15 8h-5M15 12h-5" />
      </svg>
    ),
  },
  {
    label: "COURSE",
    value: "ICT 340 — Vibe Coding · AUPP",
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M22 10v6M2 10l10-5 10 5-10 5z" />
        <path d="M6 12v5c3 3 9 3 12 0v-5" />
      </svg>
    ),
  },
  {
    label: "STATUS",
    value: "Living archive — actively growing",
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 22v-9" />
        <path d="M9 13a4.5 4.5 0 0 0 3-4.2V3s-5 .5-7 5c-1.5 3.5 1 5 4 5z" />
        <path d="M15 13a4.5 4.5 0 0 1-3-4.2V3s5 .5 7 5c1.5 3.5-1 5-4 5z" />
      </svg>
    ),
  },
];

export default function Home() {
  const [query, setQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [riddles, setRiddles] = useState(SEED_RIDDLES);
  const [currentUser, setCurrentUser] = useState(null);

  useEffect(() => {
    async function loadData() {
      const supabase = createClient();
      if (!supabase) return;

      try {
        const [authRes, entriesRes] = await Promise.all([
          supabase.auth.getUser(),
          supabase.from("entries").select("*").order("created_at", { ascending: false }),
        ]);

        if (authRes?.data?.user) {
          setCurrentUser(authRes.data.user);
        }
        if (entriesRes?.data && entriesRes.data.length > 0) {
          setRiddles(entriesRes.data);
        }
      } catch (err) {
        console.error("Data load error:", err);
      }
    }
    
    loadData();
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
        item.hint,
        item.answer_kh,
        item.answer_en,
        item.explanation,
        item.source,
        item.category,
        kmCat,
      ]
        .map(cleanKhmer)
        .join(" ");

      return searchable.includes(q);
    });
  }, [query, selectedCategory, riddles]);
  useReveal(filteredRiddles.length);

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
        riddles={riddles}
      />

      {/* Transition Zone 1: Celestial clearing before Showcase */}
      <CosmicTransitionZone />

      <div className="gr-container">
        <RiddleShowcase riddles={riddles} />
        <CuratorSpotlight />
      </div>

      {/* Transition Zone 2: Celestial clearing before Archive */}
      <CosmicTransitionZone />

      {/* ── Archive ── */}
      <div className="vt-ambient-wrap">
        <div className="vt-ambient-orb vt-ambient-orb-1" aria-hidden="true" />
        <div className="vt-ambient-orb vt-ambient-orb-2" aria-hidden="true" />

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
                    <RiddleCard item={riddle} currentUser={currentUser} />
                  </div>
                ))
            }
          </section>
        </main>

        {/* Transition Zone 3: Celestial clearing before About */}
        <CosmicTransitionZone />

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
                <div key={item.label} className={`vt-about-card reveal delay-${i + 1}`}>
                  <div className="vt-about-icon" aria-hidden="true">{item.icon}</div>
                  <span className="vt-about-label">{item.label}</span>
                  <p className="vt-about-value">{item.value}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      </div>

      <footer style={S.footer}>
        <div style={{ fontFamily: "var(--font-sans)", fontWeight: 900, letterSpacing: "4px", textTransform: "uppercase", fontSize: 14, color: "var(--text-primary)", marginBottom: 8 }}>
          {collection.name.split(" ")[0]} <span style={{ color: "var(--accent)" }}>·</span> {collection.name.split(" ").slice(1).join(" ")}
        </div>
        <span style={{ color: "var(--text-secondary)" }}>
          Preserving the oral wit and wisdom of the Khmer people, one riddle at a time.
        </span>
        <div>
          <a href="/login" className="vt-footer-admin-link">
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
              <path d="M7 11V7a5 5 0 0 1 10 0v4" />
            </svg>
            Admin Portal · ចូលគ្រប់គ្រង
          </a>
        </div>
      </footer>
    </>
  );
}
