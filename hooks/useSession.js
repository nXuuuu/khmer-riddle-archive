"use client";

import { useEffect, useState } from "react";
import { createClient } from "../utils/supabase/client.js";

// The signed-in user, whether they are a reviewer, and a logout function.
// Same Supabase calls as before; only moved out of NavBar.js.
export default function useSession() {
  const [user, setUser] = useState(null);
  const [isReviewer, setIsReviewer] = useState(false);

  useEffect(() => {
    const supabase = createClient();
    if (!supabase) return;

    const checkReviewer = async (u) => {
      if (!u) {
        setIsReviewer(false);
        return;
      }
      try {
        const { data } = await supabase.rpc("is_reviewer");
        setIsReviewer(data === true);
      } catch {
        setIsReviewer(false);
      }
    };

    supabase.auth.getUser().then(({ data }) => {
      const u = data?.user ?? null;
      setUser(u);
      checkReviewer(u);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      const u = session?.user ?? null;
      setUser(u);
      checkReviewer(u);
    });

    return () => subscription?.unsubscribe?.();
  }, []);

  const handleLogout = async () => {
    const supabase = createClient();
    if (supabase) {
      await supabase.auth.signOut();
    }
    setUser(null);
    setIsReviewer(false);
    window.location.href = "/";
  };

  return { user, isReviewer, handleLogout };
}
