"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import NavBar from "../../components/NavBar.js";
import { CATEGORIES } from "../../collection.config.js";
import { createClient } from "../../utils/supabase/client.js";

export default function ContributeRiddle() {
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState({
    category: CATEGORIES[1] || "",
    question: "",
    hint: "",
    answer_kh: "",
    answer_en: "",
    explanation: "",
    source: "",
  });
  const [photoFile, setPhotoFile] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  useEffect(() => {
    async function checkUser() {
      const supabase = createClient();
      if (!supabase) return setLoading(false);
      const { data: { user } } = await supabase.auth.getUser();
      setUser(user);
      setLoading(false);
    }
    checkUser();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg("");
    setIsSubmitting(true);

    try {
      const trimmedData = {
        category: formData.category.trim(),
        question: formData.question.trim(),
        hint: formData.hint.trim(),
        answer_kh: formData.answer_kh.trim(),
        answer_en: formData.answer_en.trim(),
        explanation: formData.explanation.trim(),
        source: formData.source.trim(),
      };

      if (trimmedData.question.length < 5 || trimmedData.question.length > 1000) return setErrorMsg("Question must be between 5 and 1000 characters.");
      if (trimmedData.answer_kh.length < 2 || trimmedData.answer_kh.length > 300) return setErrorMsg("Khmer Answer must be between 2 and 300 characters.");
      if (trimmedData.answer_en.length < 2 || trimmedData.answer_en.length > 300) return setErrorMsg("English Answer must be between 2 and 300 characters.");
      if (trimmedData.category.length < 1) return setErrorMsg("Category is required.");
      if (trimmedData.source.length < 1 || trimmedData.source.length > 500) return setErrorMsg("Source must be between 1 and 500 characters.");
      
      if (!photoFile) {
        return setErrorMsg("A photo is required for new entries.");
      }
      if (photoFile.size > 5242880) return setErrorMsg("Photo must be less than 5MB.");
      if (!['image/jpeg', 'image/png', 'image/webp'].includes(photoFile.type)) return setErrorMsg("Photo must be JPG, PNG, or WEBP.");

      const supabase = createClient();
      
      // Upload Photo
      const ext = photoFile.name.split('.').pop();
      const fileName = `${crypto.randomUUID()}.${ext}`;
      const filePath = `${user.id}/${fileName}`;
      
      const { error: uploadError } = await supabase.storage.from("photos").upload(filePath, photoFile);
      if (uploadError) {
        console.error(uploadError);
        return setErrorMsg("Photo upload failed. Please try again.");
      }

      const { data: publicUrlData } = supabase.storage.from("photos").getPublicUrl(filePath);

      const newRiddle = {
        ...trimmedData,
        owner: user.id,
        image_url: publicUrlData.publicUrl,
      };

      const { error } = await supabase.from("entries").insert([newRiddle]);

      if (error) {
        console.error(error);
        return setErrorMsg("Failed to save the entry. Please try again.");
      }

      // Success, go to homepage (since we don't have individual entry pages yet)
      router.push('/');
    } catch (err) {
      console.error(err);
      setErrorMsg("An unexpected error occurred.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const updateField = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  if (loading) return <div style={{textAlign: "center", padding: "40px"}}>Loading...</div>;

  if (!user) {
    return (
      <>
        <NavBar />
        <main className="gr-submit-container" style={{ textAlign: "center", padding: "80px 20px" }}>
          <h2>Members Only</h2>
          <p style={{ color: "var(--text-secondary)", margin: "20px 0" }}>
            You must be logged in to contribute an entry to the archive.
          </p>
          <Link href="/login" className="gr-btn-primary">Log In</Link>
        </main>
      </>
    );
  }

  return (
    <>
      <NavBar />
      <main className="gr-submit-container">
        <form className="modern-card gr-form-card" onSubmit={handleSubmit}>
          <h2 style={{ marginBottom: "8px", fontSize: "26px", fontWeight: 800 }}>Submit a Khmer Riddle</h2>
          <p style={{ color: "var(--text-secondary)", marginBottom: "28px", fontSize: "14px" }}>
            Share a riddle with a photo to help preserve Khmer oral history.
          </p>

          {errorMsg && (
            <div style={{ padding: "12px", backgroundColor: "#ffebee", color: "#c62828", borderRadius: "8px", marginBottom: "20px", fontSize: "14px", border: "1px solid #ef9a9a" }}>
              {errorMsg}
            </div>
          )}

          <div className="gr-form-group">
            <label className="gr-form-label">Category</label>
            <select 
              className="gr-form-select"
              value={formData.category} 
              onChange={(e) => updateField("category", e.target.value)}
            >
              {CATEGORIES.filter(c => c !== "All").map(c => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>
          </div>

          <div className="gr-form-group">
            <label className="gr-form-label">Riddle Question (Khmer)*</label>
            <input 
              type="text" required className="gr-form-input" placeholder="e.g. ពេលនៅក្មេងស្លៀកសំពត់ខៀវ..."
              value={formData.question} onChange={(e) => updateField("question", e.target.value)}
            />
          </div>

          <div className="gr-form-group">
            <label className="gr-form-label">English Hint/Translation</label>
            <input 
              type="text" className="gr-form-input" placeholder="e.g. Dressed in blue when young..."
              value={formData.hint} onChange={(e) => updateField("hint", e.target.value)}
            />
          </div>

          <div className="gr-form-group">
            <label className="gr-form-label">Answer (Khmer)*</label>
            <input 
              type="text" required className="gr-form-input" placeholder="e.g. ផ្លែម្ទេស"
              value={formData.answer_kh} onChange={(e) => updateField("answer_kh", e.target.value)}
            />
          </div>

          <div className="gr-form-group">
            <label className="gr-form-label">Answer (English)*</label>
            <input 
              type="text" required className="gr-form-input" placeholder="e.g. Chili Pepper"
              value={formData.answer_en} onChange={(e) => updateField("answer_en", e.target.value)}
            />
          </div>

          <div className="gr-form-group">
            <label className="gr-form-label">Explanation (English)</label>
            <textarea 
              className="gr-form-textarea" placeholder="Explain the metaphor or cultural context of the riddle..."
              value={formData.explanation} onChange={(e) => updateField("explanation", e.target.value)}
            />
          </div>

          <div className="gr-form-group">
            <label className="gr-form-label">Source (English)*</label>
            <input 
              type="text" required className="gr-form-input" placeholder="e.g. Grandmother Sokum, Takeo Province"
              value={formData.source} onChange={(e) => updateField("source", e.target.value)}
            />
          </div>

          <div className="gr-form-group">
            <label className="gr-form-label">Photo (Required)*</label>
            <input 
              type="file" 
              accept="image/jpeg, image/png, image/webp"
              required 
              onChange={(e) => setPhotoFile(e.target.files[0])}
            />
            <small style={{display: 'block', color: 'var(--text-muted)', marginTop: 4}}>Max 5MB (JPG, PNG, WEBP)</small>
          </div>

          <button type="submit" className="gr-submit-btn" style={{ marginTop: "12px" }} disabled={isSubmitting}>
            {isSubmitting ? "Uploading & Saving..." : "Publish to Archive"}
          </button>
        </form>
      </main>
    </>
  );
}
