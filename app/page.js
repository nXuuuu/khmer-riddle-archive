"use client";

import { useState, useMemo, useEffect, useCallback } from "react";
import { CATEGORIES, CATEGORY_LABELS } from "../collection.config.js";
import { createClient } from "../utils/supabase/client.js";
import NavBar from "../components/NavBar.js";
import HeroSection from "../components/HeroSection.js";
import IntroEssay from "../components/IntroEssay.js";
import GalleryCovers from "../components/GalleryCovers.js";
import CollectionToolbar from "../components/CollectionToolbar.js";
import RiddleCard from "../components/RiddleCard.js";
import RiddleIndex from "../components/RiddleIndex.js";
import EmptyState from "../components/EmptyState.js";
import CuratorSpotlight from "../components/CuratorSpotlight.js";
import AboutFacts from "../components/AboutFacts.js";
import SiteFooter from "../components/SiteFooter.js";
import SectionHeading from "../components/SectionHeading.js";
import CursorLabel from "../components/CursorLabel.js";
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

export default function Home() {
  const [query, setQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [riddles, setRiddles] = useState(SEED_RIDDLES);
  const [currentUser, setCurrentUser] = useState(null);
  const [view, setView] = useState("gallery"); // "gallery" or "index"
  const [loaded, setLoaded] = useState(false); // true once Supabase has answered (or failed)

  useEffect(() => {
    async function loadData() {
      const supabase = createClient();
      if (!supabase) {
        setLoaded(true); // no Supabase: keep showing the seed riddles
        return;
      }

      try {
        const [authRes, entriesRes] = await Promise.all([
          supabase.auth.getUser(),
          supabase.from("entries").select("*").eq("status", "published").order("created_at", { ascending: false }),
        ]);

        if (authRes?.data?.user) {
          setCurrentUser(authRes.data.user);
        }
        if (entriesRes?.data && entriesRes.data.length > 0) {
          setRiddles(entriesRes.data);
        }
      } catch (err) {
        console.error("Data load error:", err);
      } finally {
        setLoaded(true);
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
  // Re-run on the list itself, not its length: seed → Supabase swaps same-length lists.
  // Re-run on the list itself, not its length: seed → Supabase swaps same-length lists.
  useReveal(filteredRiddles);
  useReveal(view); // new cards appear when switching back to the Gallery view

  // Each object keeps the same catalogue number however the list is filtered.
  const numberOf = useCallback((item) => riddles.indexOf(item) + 1, [riddles]);

  const handleReset = () => {
    setQuery("");
    setSelectedCategory("All");
  };

  // Clicking a gallery cover filters the collection and scrolls down to it.
  const openGallery = (cat) => {
    setSelectedCategory(cat);
    document.getElementById("collection")?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <>
      <NavBar />
      <CursorLabel />
      <HeroSection riddles={riddles} totalCategories={CATEGORIES.length - 1} loaded={loaded} />
      <IntroEssay />
      <GalleryCovers categories={CATEGORIES} riddles={riddles} onOpen={openGallery} />

      <main id="collection" className="mu-section" aria-label="The collection">
        <div className="gr-container">
          <SectionHeading
            label="The collection"
            km="បណ្តុំពាក្យបណ្តៅ"
            en={<>Every riddle, <em>one object at a time</em></>}
          />

          <CollectionToolbar
            query={query}
            onQuery={setQuery}
            categories={CATEGORIES}
            selected={selectedCategory}
            onSelect={setSelectedCategory}
            riddles={riddles}
            visibleCount={filteredRiddles.length}
            view={view}
            onView={setView}
          />

          {filteredRiddles.length === 0 ? (
            <EmptyState onReset={handleReset} />
          ) : view === "gallery" ? (
            <section className="mu-grid" aria-label="Riddle entries">
              {filteredRiddles.map((riddle) => (
                <div key={riddle.id} className="reveal">
                  <RiddleCard item={riddle} number={numberOf(riddle)} currentUser={currentUser} />
                </div>
              ))}
            </section>
          ) : (
            <RiddleIndex riddles={filteredRiddles} numberOf={numberOf} currentUser={currentUser} />
          )}
        </div>
      </main>

      <section className="mu-section" aria-label="Curator's note">
        <div className="gr-container">
          <CuratorSpotlight />
        </div>
      </section>

      <AboutFacts />
      <SiteFooter />
    </>
  );
}
