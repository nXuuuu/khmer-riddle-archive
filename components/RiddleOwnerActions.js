"use client";

import Link from "next/link";
import { createClient } from "../utils/supabase/client.js";

// Edit / Delete buttons, shown only to the riddle's owner.
// The delete logic is unchanged from the original RiddleCard; it just lives here now.
export default function RiddleOwnerActions({ item, onDeleted }) {
  const handleDelete = async () => {
    if (!window.confirm("តើអ្នកប្រាកដថាចង់លុបពាក្យបណ្តៅនេះមែនទេ? · Are you sure you want to delete this riddle?")) return;

    const supabase = createClient();
    if (!supabase) return;

    // Delete through supabase-js and .select() to verify
    const { data, error } = await supabase
      .from("entries")
      .delete()
      .eq("id", item.id)
      .select();

    if (error) {
      console.error(error);
      alert("មានកំហុសកើតឡើងកំឡុងពេលលុប។ · An error occurred during deletion.");
      return;
    }

    if (!data || data.length === 0) {
      console.error("Deletion refused by RLS. Zero rows returned.");
      alert("ការផ្លាស់ប្តូរនេះមិនត្រូវបានរក្សាទុកទេ។ · That change wasn't saved.");
      return;
    }

    // Success
    onDeleted();
    // Optional cleanup: if image_url exists, parse path and remove from storage
    if (item.image_url) {
      try {
        const urlObj = new URL(item.image_url);
        const pathSegments = urlObj.pathname.split('/');
        const userFolder = pathSegments[pathSegments.length - 2];
        const fileName = pathSegments[pathSegments.length - 1];
        await supabase.storage.from("photos").remove([`${userFolder}/${fileName}`]);
      } catch (e) {
        console.error("Cleanup photo error:", e);
      }
    }
  };

  return (
    <div className="gr-card-owner">
      <Link href={`/edit/${item.id}`} className="gr-card-reveal-btn" title="កែសម្រួល · Edit">
        <span lang="km">កែសម្រួល</span> · Edit
      </Link>
      <button type="button" onClick={handleDelete} className="gr-card-reveal-btn gr-card-delete-btn" title="លុប · Delete">
        <span lang="km">លុប</span> · Delete
      </button>
    </div>
  );
}
