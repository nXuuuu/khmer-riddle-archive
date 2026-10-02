"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter, useParams } from "next/navigation";
import NavBar from "../../../components/NavBar.js";
import { CATEGORIES } from "../../../collection.config.js";
import { createClient } from "../../../utils/supabase/client.js";

export default function EditRiddle() {
  const router = useRouter();
  const params = useParams();
  const id = params?.id;
  
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState({
    category: "",
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
  const [initialImageUrl, setInitialImageUrl] = useState("");

  useEffect(() => {
    async function loadData() {
      const supabase = createClient();
      if (!supabase) return setLoading(false);
      
      const { data: { user } } = await supabase.auth.getUser();
      setUser(user);

      if (user && id) {
        const { data, error } = await supabase.from("entries").select("*").eq("id", id).single();
        if (data) {
          if (data.owner !== user.id) {
            setErrorMsg("You do not have permission to edit this entry.");
          } else {
            setFormData({
              category: data.category || "",
              question: data.question || "",
              hint: data.hint || "",
              answer_kh: data.answer_kh || "",
              answer_en: data.answer_en || "",
              explanation: data.explanation || "",
              source: data.source || "",
            });
            setInitialImageUrl(data.image_url || "");
          }
        }
      }
      setLoading(false);
    }
    loadData();
  }, [id]);

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
      
      const supabase = createClient();
      let updatedImageUrl = initialImageUrl;

      if (photoFile) {
        if (photoFile.size > 5242880) return setErrorMsg("Photo must be less than 5MB.");
        if (!['image/jpeg', 'image/png', 'image/webp'].includes(photoFile.type)) return setErrorMsg("Photo must be JPG, PNG, or WEBP.");

        const ext = photoFile.name.split('.').pop();
        const fileName = `${crypto.randomUUID()}.${ext}`;
        const filePath = `${user.id}/${fileName}`;
        
        const { error: uploadError } = await supabase.storage.from("photos").upload(filePath, photoFile);
        if (uploadError) {
          console.error(uploadError);
          return setErrorMsg("Photo upload failed. Please try again.");
        }

        const { data: publicUrlData } = supabase.storage.from("photos").getPublicUrl(filePath);
        updatedImageUrl = publicUrlData.publicUrl;
      }

      const updatedRiddle = {
        ...trimmedData,
        image_url: updatedImageUrl,
      };

      // Part 2 Check: Call .select() and check that a row actually came back
      const { data, error } = await supabase
        .from("entries")
        .update(updatedRiddle)
        .eq("id", id)
        .select();

      if (error) {
        console.error(error);
        return setErrorMsg("Failed to update the entry. Please try again.");
      }

      if (!data || data.length === 0) {
        console.error("Update refused by RLS. Zero rows returned.");
        return setErrorMsg("That change wasn't saved.");
      }

      // Success
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

  if (!user || errorMsg === "You do not have permission to edit this entry.") {
    return (
      <>
        <NavBar />
        <main className="gr-submit-container" style={{ textAlign: "center", padding: "80px 20px" }}>
          <h2>Access Denied</h2>
          <p style={{ color: "var(--text-secondary)", margin: "20px 0" }}>
            {errorMsg || "You must be logged in to edit an entry."}
          </p>
          <Link href="/" className="gr-btn-primary">Back Home</Link>
        </main>
      </>
    );
  }

  return (
    <>
      <NavBar />
      <main className="gr-submit-container">
        <form className="modern-card gr-form-card" onSubmit={handleSubmit}>
          <h2 style={{ marginBottom: "8px", fontSize: "26px", fontWeight: 800 }}>Edit Riddle</h2>
          <p style={{ color: "var(--text-secondary)", marginBottom: "28px", fontSize: "14px" }}>
            Make changes to your entry below.
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
              type="text" required className="gr-form-input"
              value={formData.question} onChange={(e) => updateField("question", e.target.value)}
            />
          </div>

          <div className="gr-form-group">
            <label className="gr-form-label">English Hint/Translation</label>
            <input 
              type="text" className="gr-form-input"
              value={formData.hint} onChange={(e) => updateField("hint", e.target.value)}
            />
          </div>

          <div className="gr-form-group">
            <label className="gr-form-label">Answer (Khmer)*</label>
            <input 
              type="text" required className="gr-form-input"
              value={formData.answer_kh} onChange={(e) => updateField("answer_kh", e.target.value)}
            />
          </div>

          <div className="gr-form-group">
            <label className="gr-form-label">Answer (English)*</label>
            <input 
              type="text" required className="gr-form-input"
              value={formData.answer_en} onChange={(e) => updateField("answer_en", e.target.value)}
            />
          </div>

          <div className="gr-form-group">
            <label className="gr-form-label">Explanation (English)</label>
            <textarea 
              className="gr-form-textarea"
              value={formData.explanation} onChange={(e) => updateField("explanation", e.target.value)}
            />
          </div>

          <div className="gr-form-group">
            <label className="gr-form-label">Source (English)*</label>
            <input 
              type="text" required className="gr-form-input"
              value={formData.source} onChange={(e) => updateField("source", e.target.value)}
            />
          </div>

          <div className="gr-form-group">
            <label className="gr-form-label">Update Photo (Optional)</label>
            {initialImageUrl && !photoFile && (
              <div style={{ marginBottom: "8px" }}>
                <img src={initialImageUrl} alt="Current" style={{ maxHeight: "100px", borderRadius: "4px" }} />
              </div>
            )}
            <input 
              type="file" 
              accept="image/jpeg, image/png, image/webp"
              onChange={(e) => setPhotoFile(e.target.files[0])}
            />
            <small style={{display: 'block', color: 'var(--text-muted)', marginTop: 4}}>Max 5MB (JPG, PNG, WEBP). Leave empty to keep current photo.</small>
          </div>

          <div style={{ display: "flex", gap: "12px", marginTop: "24px" }}>
            <button type="submit" className="gr-submit-btn" disabled={isSubmitting} style={{ flex: 1 }}>
              {isSubmitting ? "Saving..." : "Save Changes"}
            </button>
            <Link href="/" className="gr-btn-secondary" style={{ flex: "0 0 auto", display: "inline-flex", alignItems: "center" }}>
              Cancel
            </Link>
          </div>
        </form>
      </main>
    </>
  );
}
