"use client";

import { useState } from "react";
import NavBar from "../../components/NavBar.js";
import AdminPanel from "../../components/AdminPanel.js";
import collection from "../../collection.config.js";
import Link from "next/link";

export default function AdminPage() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleLogin = (e) => {
    e.preventDefault();
    // Use the curator's first name from collection.config.js as a safe dummy password
    const curatorFirstName = collection.curator.split(" ")[0].toLowerCase();
    
    if (password.trim().toLowerCase() === curatorFirstName) {
      setIsLoggedIn(true);
      setError("");
    } else {
      setError("Incorrect password. (Hint: curator's first name)");
    }
  };

  return (
    <>
      <NavBar />
      <main style={{ maxWidth: 900, margin: "80px auto", padding: "0 24px" }}>
        {!isLoggedIn ? (
          <div className="modern-card" style={{ maxWidth: 400, margin: "0 auto", padding: 32 }}>
            <h2 style={{ marginBottom: 16, fontSize: 24, fontWeight: 700 }}>Curator Login</h2>
            <p style={{ color: "var(--text-secondary)", marginBottom: 24, fontSize: 14 }}>
              Enter your passcode to manage riddle submissions and edit the archive.
            </p>
            <form onSubmit={handleLogin} style={{ display: "flex", flexDirection: "column", gap: 12 }}>
              <input 
                type="password" 
                placeholder="Enter password" 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="gr-form-input"
                autoFocus
              />
              <button type="submit" className="gr-btn-primary">
                Login
              </button>
              {error && <p style={{ color: "var(--accent)", fontSize: 13, marginTop: 4 }}>{error}</p>}
            </form>
          </div>
        ) : (
          <div>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 32 }}>
              <div>
                <h1 style={{ fontSize: 32, fontWeight: 800 }}>Admin Dashboard</h1>
                <p style={{ color: "var(--text-secondary)", marginTop: 4 }}>
                  Welcome back, {collection.curator}.
                </p>
              </div>
              <button className="gr-btn-secondary" onClick={() => {
                setIsLoggedIn(false);
                setPassword("");
              }}>
                Logout
              </button>
            </div>
            
            <AdminPanel />
            
            <div style={{ marginTop: 40, textAlign: "center" }}>
              <Link href="/" style={{ color: "var(--text-secondary)", textDecoration: "none", fontSize: 14 }}>
                &larr; Back to Public Archive
              </Link>
            </div>
          </div>
        )}
      </main>
    </>
  );
}
