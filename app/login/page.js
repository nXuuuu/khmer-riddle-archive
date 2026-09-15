"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import NavBar from "../../components/NavBar.js";
import { createClient } from "../../utils/supabase/client.js";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const supabase = createClient();
      if (!supabase) {
        setError("Authentication is not configured on this deployment.");
        setLoading(false);
        return;
      }

      const { error: signInError } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (signInError) {
        // Uniform error to prevent user enumeration
        setError("Invalid email or password");
        setLoading(false);
        return;
      }

      router.push("/");
      router.refresh();
    } catch {
      setError("Invalid email or password");
      setLoading(false);
    }
  };

  return (
    <>
      <NavBar />
      <main style={{ maxWidth: 440, margin: "clamp(40px, 8vw, 80px) auto", padding: "0 20px" }}>
        <form className="modern-card gr-form-card" onSubmit={handleSubmit}>
          <h1 style={{ fontSize: "24px", fontWeight: 800, marginBottom: "8px" }}>
            Log In
          </h1>
          <p style={{ color: "var(--text-secondary)", fontSize: "14px", marginBottom: "24px" }}>
            Sign in to your contributor account.
          </p>

          {error && (
            <div
              style={{
                backgroundColor: "rgba(239, 68, 68, 0.12)",
                border: "1px solid rgba(239, 68, 68, 0.3)",
                color: "#f87171",
                padding: "10px 14px",
                borderRadius: "var(--radius-sm)",
                fontSize: "14px",
                marginBottom: "20px",
              }}
              role="alert"
            >
              {error}
            </div>
          )}

          <div className="gr-form-group">
            <label className="gr-form-label" htmlFor="login-email">
              Email
            </label>
            <input
              id="login-email"
              type="email"
              required
              autoComplete="email"
              className="gr-form-input"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
            />
          </div>

          <div className="gr-form-group" style={{ marginBottom: "24px" }}>
            <label className="gr-form-label" htmlFor="login-password">
              Password
            </label>
            <input
              id="login-password"
              type="password"
              required
              autoComplete="current-password"
              className="gr-form-input"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="gr-submit-btn"
            style={{ opacity: loading ? 0.7 : 1, cursor: loading ? "wait" : "pointer" }}
          >
            {loading ? "Signing in…" : "Log In"}
          </button>

          <p style={{ marginTop: "20px", fontSize: "14px", color: "var(--text-secondary)", textAlign: "center" }}>
            Don&apos;t have an account?{" "}
            <Link href="/signup" style={{ color: "var(--accent)", textDecoration: "underline" }}>
              Sign up
            </Link>
          </p>
        </form>
      </main>
    </>
  );
}
