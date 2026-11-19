"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import NavBar from "../../components/NavBar.js";
import { CATEGORIES, CATEGORY_LABELS } from "../../collection.config.js";
import { createClient } from "../../utils/supabase/client.js";
import KmEn from "../../components/KmEn.js";
import Icon from "../../components/Icon.js";

// Khmer wording below was written by Claude for the November Khmer-first pass —
// flagged for a native-speaker check (see README section 5).
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
  const [submitted, setSubmitted] = useState(false);

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

      if (trimmedData.question.length < 5 || trimmedData.question.length > 1000) return setErrorMsg("សំណួរត្រូវមានចន្លោះ ៥ ទៅ ១០០០ តួអក្សរ។ · Question must be between 5 and 1000 characters.");
      if (trimmedData.answer_kh.length < 2 || trimmedData.answer_kh.length > 300) return setErrorMsg("ចម្លើយខ្មែរត្រូវមានចន្លោះ ២ ទៅ ៣០០ តួអក្សរ។ · Khmer Answer must be between 2 and 300 characters.");
      if (trimmedData.answer_en.length < 2 || trimmedData.answer_en.length > 300) return setErrorMsg("ចម្លើយអង់គ្លេសត្រូវមានចន្លោះ ២ ទៅ ៣០០ តួអក្សរ។ · English Answer must be between 2 and 300 characters.");
      if (trimmedData.category.length < 1) return setErrorMsg("ត្រូវការប្រភេទ។ · Category is required.");
      if (trimmedData.source.length < 1 || trimmedData.source.length > 500) return setErrorMsg("ប្រភពត្រូវមានចន្លោះ ១ ទៅ ៥០០ តួអក្សរ។ · Source must be between 1 and 500 characters.");

      if (!photoFile) {
        return setErrorMsg("ត្រូវការរូបភាពសម្រាប់ធាតុថ្មី។ · A photo is required for new entries.");
      }
      if (photoFile.size > 5242880) return setErrorMsg("រូបភាពត្រូវតិចជាង ៥MB។ · Photo must be less than 5MB.");
      if (!['image/jpeg', 'image/png', 'image/webp'].includes(photoFile.type)) return setErrorMsg("រូបភាពត្រូវជា JPG, PNG, ឬ WEBP។ · Photo must be JPG, PNG, or WEBP.");

      const supabase = createClient();

      // Upload Photo
      const ext = photoFile.name.split('.').pop();
      const fileName = `${crypto.randomUUID()}.${ext}`;
      const filePath = `${user.id}/${fileName}`;

      const { error: uploadError } = await supabase.storage.from("photos").upload(filePath, photoFile);
      if (uploadError) {
        console.error(uploadError);
        return setErrorMsg("ការបញ្ចូលរូបភាពបរាជ័យ។ សូមព្យាយាមម្តងទៀត។ · Photo upload failed. Please try again.");
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
        return setErrorMsg("មិនអាចរក្សាទុកធាតុបានទេ។ សូមព្យាយាមម្តងទៀត។ · Failed to save the entry. Please try again.");
      }

      // Success — show pending message instead of redirecting
      setSubmitted(true);
    } catch (err) {
      console.error(err);
      setErrorMsg("មានកំហុសដែលមិនបានរំពឹងទុក។ · An unexpected error occurred.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const updateField = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  if (loading) return <div style={{ textAlign: "center", padding: "40px" }}><span lang="km">កំពុងផ្ទុក</span>… · Loading...</div>;

  if (!user) {
    return (
      <>
        <NavBar />
        <main className="gr-submit-container" style={{ textAlign: "center", padding: "80px 20px" }}>
          <h2><KmEn km="សម្រាប់សមាជិកប៉ុណ្ណោះ" en="Members Only" /></h2>
          <p style={{ color: "var(--text-secondary)", margin: "20px 0" }}>
            <span lang="km">អ្នកត្រូវតែចូលគណនីដើម្បីចូលរួមវិភាគទានធាតុទៅបណ្ណសារ។</span><br />
            You must be logged in to contribute an entry to the archive.
          </p>
          <Link href="/login" className="gr-btn-primary"><KmEn km="ចូលគណនី" en="Log In" inline /></Link>
        </main>
      </>
    );
  }

  if (submitted) {
    return (
      <>
        <NavBar />
        <main className="gr-submit-container" style={{ textAlign: "center", padding: "80px 20px" }}>
          <div className="modern-card gr-form-card" style={{ padding: "40px 32px" }}>
            <p style={{ marginBottom: "16px", color: "var(--accent)" }}><Icon name="clock" size={40} /></p>
            <h2 style={{ marginBottom: "12px" }}><KmEn km="បានដាក់ស្នើរួចរាល់!" en="Riddle submitted!" /></h2>
            <p lang="km" style={{ color: "var(--accent)", fontSize: "15px", marginBottom: "8px" }}>
              ពាក្យបណ្ដៅរបស់អ្នកកំពុងរង់ចាំការត្រួតពិនិត្យ។ នឹងបង្ហាញនៅពេលអ្នកថែរក្សាអនុម័ត។
            </p>
            <p style={{ color: "var(--text-secondary)", marginBottom: "28px" }}>
              Your riddle is waiting for review. It will appear in the archive once the curator approves it.
            </p>
            <div style={{ display: "flex", gap: "12px", justifyContent: "center", flexWrap: "wrap" }}>
              <Link href="/my-entries" className="gr-btn-primary"><KmEn km="មើលធាតុរបស់ខ្ញុំ" en="View My Entries" inline /></Link>
              <Link href="/" className="gr-btn-secondary"><KmEn km="ត្រឡប់ទៅបណ្ណសារ" en="Back to Archive" inline /></Link>
            </div>
          </div>
        </main>
      </>
    );
  }

  return (
    <>
      <NavBar />
      <main className="gr-submit-container">
        <form className="modern-card gr-form-card" onSubmit={handleSubmit}>
          <h2 style={{ marginBottom: "8px", fontSize: "26px", fontWeight: 800 }}><KmEn km="ដាក់ស្នើពាក្យបណ្តៅខ្មែរ" en="Submit a Khmer Riddle" /></h2>
          <p style={{ color: "var(--text-secondary)", marginBottom: "28px", fontSize: "14px" }}>
            <span lang="km">ចែករំលែកពាក្យបណ្តៅជាមួយរូបភាព ដើម្បីជួយអភិរក្សប្រពៃណីផ្ទាល់មាត់ខ្មែរ។</span> · Share a riddle with a photo to help preserve Khmer oral history.
          </p>

          {errorMsg && (
            <div className="gr-alert-error">
              {errorMsg}
            </div>
          )}

          <div className="gr-form-group">
            <label className="gr-form-label"><span lang="km">ប្រភេទ</span> · Category</label>
            <select
              className="gr-form-select"
              value={formData.category}
              onChange={(e) => updateField("category", e.target.value)}
            >
              {CATEGORIES.filter(c => c !== "All").map(c => (
                <option key={c} value={c}>{CATEGORY_LABELS[c]} · {c}</option>
              ))}
            </select>
          </div>

          <div className="gr-form-group">
            <label className="gr-form-label"><span lang="km">សំណួរពាក្យបណ្តៅ (ខ្មែរ)</span> · Riddle Question (Khmer)*</label>
            <input
              type="text" required className="gr-form-input" placeholder="e.g. ពេលនៅក្មេងស្លៀកសំពត់ខៀវ..."
              value={formData.question} onChange={(e) => updateField("question", e.target.value)}
            />
          </div>

          <div className="gr-form-group">
            <label className="gr-form-label"><span lang="km">ការណែនាំ/ការបកប្រែជាភាសាអង់គ្លេស</span> · English Hint/Translation</label>
            <input
              type="text" className="gr-form-input" placeholder="e.g. Dressed in blue when young..."
              value={formData.hint} onChange={(e) => updateField("hint", e.target.value)}
            />
          </div>

          <div className="gr-form-group">
            <label className="gr-form-label"><span lang="km">ចម្លើយ (ខ្មែរ)</span> · Answer (Khmer)*</label>
            <input
              type="text" required className="gr-form-input" placeholder="e.g. ផ្លែម្ទេស"
              value={formData.answer_kh} onChange={(e) => updateField("answer_kh", e.target.value)}
            />
          </div>

          <div className="gr-form-group">
            <label className="gr-form-label"><span lang="km">ចម្លើយ (អង់គ្លេស)</span> · Answer (English)*</label>
            <input
              type="text" required className="gr-form-input" placeholder="e.g. Chili Pepper"
              value={formData.answer_en} onChange={(e) => updateField("answer_en", e.target.value)}
            />
          </div>

          <div className="gr-form-group">
            <label className="gr-form-label"><span lang="km">ការពន្យល់ (អង់គ្លេស)</span> · Explanation (English)</label>
            <textarea
              className="gr-form-textarea" placeholder="Explain the metaphor or cultural context of the riddle..."
              value={formData.explanation} onChange={(e) => updateField("explanation", e.target.value)}
            />
          </div>

          <div className="gr-form-group">
            <label className="gr-form-label"><span lang="km">ប្រភព (អង់គ្លេស)</span> · Source (English)*</label>
            <input
              type="text" required className="gr-form-input" placeholder="e.g. Grandmother Sokum, Takeo Province"
              value={formData.source} onChange={(e) => updateField("source", e.target.value)}
            />
          </div>

          <div className="gr-form-group">
            <label className="gr-form-label"><span lang="km">រូបភាព (ត្រូវការ)</span> · Photo (Required)*</label>
            <input
              type="file"
              accept="image/jpeg, image/png, image/webp"
              required
              onChange={(e) => setPhotoFile(e.target.files[0])}
            />
            <small style={{ display: 'block', color: 'var(--text-secondary)', marginTop: 4 }}>
              <span lang="km">អតិបរមា ៥MB (JPG, PNG, WEBP)</span> · Max 5MB (JPG, PNG, WEBP)
            </small>
          </div>

          <button type="submit" className="gr-submit-btn" style={{ marginTop: "12px" }} disabled={isSubmitting}>
            {isSubmitting
              ? <><span lang="km">កំពុងបញ្ចូល និងរក្សាទុក...</span> · Uploading &amp; Saving...</>
              : <><span lang="km">បោះពុម្ពផ្សាយទៅបណ្ណសារ</span> · Publish to Archive</>}
          </button>
        </form>
      </main>
    </>
  );
}
