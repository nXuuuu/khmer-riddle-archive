"use client";

import { useEffect, useState } from "react";

// Reads and updates the "custom-riddles" list kept in this browser's localStorage
// (used by the /admin page). Logic moved unchanged from AdminPanel.js.
export default function useCustomRiddles() {
  const [pending, setPending] = useState([]);
  const [published, setPublished] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchData = () => {
    setLoading(true);
    const allCustom = JSON.parse(localStorage.getItem("custom-riddles") || "[]");
    setPending(allCustom.filter(r => r.status === "pending"));
    setPublished(allCustom.filter(r => r.status === "published"));
    setLoading(false);
  };

  useEffect(() => {
    fetchData();
    window.addEventListener("riddleSubmitted", fetchData);
    window.addEventListener("storage", fetchData);
    return () => {
      window.removeEventListener("riddleSubmitted", fetchData);
      window.removeEventListener("storage", fetchData);
    };
  }, []);

  const handleApprove = (id) => {
    const allCustom = JSON.parse(localStorage.getItem("custom-riddles") || "[]");
    const updated = allCustom.map(r => r.id === id ? { ...r, status: "published" } : r);
    localStorage.setItem("custom-riddles", JSON.stringify(updated));
    fetchData();
    window.dispatchEvent(new Event("riddlesUpdated"));
  };

  const handleRemove = (id) => {
    if (!window.confirm("Are you sure you want to remove this published riddle?")) return;
    const allCustom = JSON.parse(localStorage.getItem("custom-riddles") || "[]");
    const updated = allCustom.filter(r => r.id !== id);
    localStorage.setItem("custom-riddles", JSON.stringify(updated));
    fetchData();
    window.dispatchEvent(new Event("riddlesUpdated"));
  };

  const handleReject = (id) => {
    if (!window.confirm("Are you sure you want to reject and delete this submission?")) return;
    const allCustom = JSON.parse(localStorage.getItem("custom-riddles") || "[]");
    const updated = allCustom.filter(r => r.id !== id);
    localStorage.setItem("custom-riddles", JSON.stringify(updated));
    fetchData();
  };

  return { pending, published, loading, handleApprove, handleRemove, handleReject };
}
