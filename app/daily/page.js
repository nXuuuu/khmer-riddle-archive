"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import NavBar from "../../components/NavBar.js";
import { createClient } from "../../utils/supabase/client.js";

export default function DailyChallenge() {
  const [step, setStep] = useState(0); // 0, 1, 2 = riddle steps, 3 = success, -1 = fail
  const [riddles, setRiddles] = useState([]);
  const [selectedRiddles, setSelectedRiddles] = useState([]);
  const [options, setOptions] = useState([]);
  const [selected, setSelected] = useState(null);
  const [hint, setHint] = useState(false);
  const [streak, setStreak] = useState(0);

  // Initialize game
  const initGame = (dataList) => {
    const rData = dataList || riddles;
    if (rData.length < 3) return;
    // Shuffle and pick 3 unique riddles
    const shuffled = [...rData].sort(() => 0.5 - Math.random());
    setSelectedRiddles(shuffled.slice(0, 3));
    setStep(0);
    setSelected(null);
    setHint(false);
  };

  useEffect(() => {
    async function loadRiddles() {
      const supabase = createClient();
      if (!supabase) return;
      const { data } = await supabase.from("entries").select("*");
      if (data) {
        setRiddles(data);
        initGame(data);
      }
    }
    loadRiddles();
    
    const storedStreak = localStorage.getItem("riddle-streak");
    if (storedStreak) setStreak(parseInt(storedStreak, 10));
  }, []);

  // Generate options for the current riddle step
  useEffect(() => {
    if (selectedRiddles.length === 0 || step < 0 || step > 2) return;
    const current = selectedRiddles[step];
    const distractors = riddles
      .filter(r => r.id !== current.id)
      .sort(() => 0.5 - Math.random())
      .slice(0, 3);
    const opts = [current, ...distractors].sort(() => 0.5 - Math.random());
    setOptions(opts);
    setSelected(null);
    setHint(false);
  }, [step, selectedRiddles, riddles]);

  const handleSelect = (opt) => {
    if (selected) return;
    setSelected(opt.id);
    const current = selectedRiddles[step];
    
    if (opt.id === current.id) {
      setTimeout(() => {
        if (step === 2) {
          // Success! Update streak
          const newStreak = streak + 1;
          setStreak(newStreak);
          localStorage.setItem("riddle-streak", newStreak);
          // Dispatch custom event to notify NavBar in real-time
          window.dispatchEvent(new Event("streak-updated"));
          setStep(3);
        } else {
          setStep(prev => prev + 1);
        }
      }, 1000);
    } else {
      setTimeout(() => {
        setStep(-1); // Fail state
      }, 1000);
    }
  };

  const currentRiddle = selectedRiddles[step];

  return (
    <>
      <NavBar />
      <main className="gr-daily-container">
        {step >= 0 && step <= 2 && (
          <div>
            <div className="gr-daily-progress">
              <div className={`gr-daily-step ${step >= 0 ? "active" : ""}`} />
              <div className={`gr-daily-step ${step >= 1 ? "active" : ""}`} />
              <div className={`gr-daily-step ${step >= 2 ? "active" : ""}`} />
            </div>
            {currentRiddle ? (
              <div className="modern-card gr-quiz-card">
                <span className="gr-quiz-label">Question {step + 1} of 3</span>
                <div className="gr-quiz-question" lang="km">
                  « {currentRiddle.question} »
                </div>
                <div className="gr-quiz-options">
                  {options.map((opt) => {
                    const isSelected = selected === opt.id;
                    const isCorrect = opt.id === currentRiddle.id;
                    const btnClass = `gr-quiz-opt ${
                      selected
                        ? isCorrect
                          ? "correct"
                          : isSelected
                          ? "incorrect"
                          : ""
                        : ""
                    }`;
                    return (
                      <button
                        key={opt.id}
                        disabled={!!selected}
                        onClick={() => handleSelect(opt)}
                        className={btnClass}
                      >
                        <span lang="km">{opt.answer_kh}</span>
                        <span style={{ fontSize: "0.85em", opacity: 0.85, marginLeft: 6 }}>
                          ({opt.answer_en})
                        </span>
                      </button>
                    );
                  })}
                </div>
                <div className="gr-quiz-footer">
                  <span className="gr-quiz-hint" onClick={() => setHint(true)}>
                    {hint
                      ? `💡 ${currentRiddle.hint || "No hint available"}`
                      : "💡 Need a hint? · ត្រូវការតម្រុយ?"}
                  </span>
                </div>
              </div>
            ) : (
              <p style={{ textAlign: "center", marginTop: "40px" }}>Loading daily challenge...</p>
            )}
          </div>
        )}

        {step === 3 && (
          <div className="modern-card gr-daily-success">
            <div className="gr-daily-success-icon">🔥</div>
            <h2 style={{ marginBottom: "12px", fontSize: "28px" }}>Challenge Completed!</h2>
            <p style={{ color: "var(--text-secondary)", marginBottom: "24px" }}>
              Awesome job! You solved all 3 daily Khmer riddles.
            </p>
            <div style={{ fontSize: "20px", fontWeight: 700, color: "var(--accent)", marginBottom: "32px" }}>
              Current Streak: {streak} Day{streak > 1 ? "s" : ""}
            </div>
            <Link href="/" className="gr-btn-primary">Back Home</Link>
          </div>
        )}

        {step === -1 && (
          <div className="modern-card gr-daily-success">
            <div className="gr-daily-success-icon">❌</div>
            <h2 style={{ marginBottom: "12px", fontSize: "28px" }}>Incorrect Answer</h2>
            <p style={{ color: "var(--text-secondary)", marginBottom: "32px" }}>
              Don't worry, daily challenges can be tried as many times as you like!
            </p>
            <button className="gr-btn-primary" onClick={() => initGame()}>Try Again</button>
          </div>
        )}
      </main>
    </>
  );
}
