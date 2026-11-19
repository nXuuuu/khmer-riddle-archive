"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter, useParams } from "next/navigation";
import NavBar from "../../../components/NavBar.js";
import { CATEGORIES, CATEGORY_LABELS } from "../../../collection.config.js";
import { createClient } from "../../../utils/supabase/client.js";
import KmEn from "../../../components/KmEn.js";

// Khmer wording below was written by Claude for the November Khmer-first pass —
// flagged for a native-speaker check (see README section 5).
const NO_PERMISSION = "អ្នកមិនមានសិទ្ធិកែប្រែធាតុនេះទេ។ · You do not have permission to edit this entry.";

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
            setErrorMsg(NO_PERMISSION);
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

      if (trimmedData.question.length < 5 || trimmedData.question.length > 1000) return setErrorMsg("សំណួរត្រូវមានចន្លោះ ៥ ទៅ ១០០០ តួអក្សរ។ · Question must be between 5 and 1000 characters.");
      if (trimmedData.answer_kh.length < 2 || trimmedData.answer_kh.length > 300) return setErrorMsg("ចម្លើយខ្មែរត្រូវមានចន្លោះ ២ ទៅ ៣០០ តួអក្សរ។ · Khmer Answer must be between 2 and 300 characters.");
      if (trimmedData.answer_en.length < 2 || trimmedData.answer_en.length > 300) return setErrorMsg("ចម្លើយអង់គ្លេសត្រូវមានចន្លោះ ២ ទៅ ៣០០ តួអក្សរ។ · English Answer must be between 2 and 300 characters.");
      if (trimmedData.category.length < 1) return setErrorMsg("ត្រូវការប្រភេទ។ · Category is required.");
      if (trimmedData.source.length < 1 || trimmedData.source.length > 500) return setErrorMsg("ប្រភពត្រូវមានចន្លោះ ១ ទៅ ៥០០ តួអក្សរ។ · Source must be between 1 and 500 characters.");

      const supabase = createClient();
      let updatedImageUrl = initialImageUrl;

      if (photoFile) {
        if (photoFile.size > 5242880) return setErrorMsg("រូបភាពត្រូវតិចជាង ៥MB។ · Photo must be less than 5MB.");
        if (!['image/jpeg', 'image/png', 'image/webp'].includes(photoFile.type)) return setErrorMsg("រូបភាពត្រូវជា JPG, PNG, ឬ WEBP។ · Photo must be JPG, PNG, or WEBP.");

        const ext = photoFile.name.split('.').pop();
        const fileName = `${crypto.randomUUID()}.${ext}`;
        const filePath = `${user.id}/${fileName}`;

        const { error: uploadError } = await supabase.storage.from("photos").upload(filePath, photoFile);
        if (uploadError) {
          console.error(uploadError);
          return setErrorMsg("ការបញ្ចូលរូបភាពបរាជ័យ។ សូមព្យាយាមម្តងទៀត។ · Photo upload failed. Please try again.");
        }

        const { data: publicUrlData } = supabase.storage.from("photos").getPublicUrl(filePath);
        updatedImageUrl = publicUrlData.publicUrl;
      }

      const updatedRiddle = {
        ...trimmedData,
        image_url: updatedImageUrl,
      };

      // Check if the current user is a reviewer; if not, editing sends entry back to pending
      const { data: reviewerCheck } = await supabase.rpc("is_reviewer");
      if (!reviewerCheck) {
        updatedRiddle.status = "pending";
      }

      // Part 2 Check: Call .select() and check that a row actually came back
      const { data, error } = await supabase
        .from("entries")
        .update(updatedRiddle)
        .eq("id", id)
        .select();

      if (error) {
        console.error(error);
        return setErrorMsg("មិនអាចកែប្រែធាតុបានទេ។ សូមព្យាយាមម្តងទៀត។ · Failed to update the entry. Please try again.");
      }

      if (!data || data.length === 0) {
        console.error("Update refused by RLS. Zero rows returned.");
        return setErrorMsg("ការផ្លាស់ប្តូរនេះមិនត្រូវបានរក្សាទុកទេ។ · That change wasn't saved.");
      }

      // Success — return to My Entries so contributor immediately sees pending status
      router.push('/my-entries');
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

  if (!user || errorMsg === NO_PERMISSION) {
    return (
      <>
        <NavBar />
        <main className="gr-submit-container" style={{ textAlign: "center", padding: "80px 20px" }}>
          <h2><KmEn km="គ្មានការអនុញ្ញាត" en="Access Denied" /></h2>
          <p style={{ color: "var(--text-secondary)", margin: "20px 0" }}>
            {errorMsg || "អ្នកត្រូវតែចូលគណនីដើម្បីកែប្រែធាតុ។ · You must be logged in to edit an entry."}
          </p>
          <Link href="/" className="gr-btn-primary"><KmEn km="ត្រឡប់ទៅទំព័រដើម" en="Back Home" inline /></Link>
        </main>
      </>
    );
  }

  return (
    <>
      <NavBar />
      <main className="gr-submit-container">
        <form className="modern-card gr-form-card" onSubmit={handleSubmit}>
          <h2 style={{ marginBottom: "8px", fontSize: "26px", fontWeight: 800 }}><KmEn km="កែសម្រួលពាក្យបណ្តៅ" en="Edit Riddle" /></h2>
          <p style={{ color: "var(--text-secondary)", marginBottom: "28px", fontSize: "14px" }}>
            <span lang="km">ធ្វើការផ្លាស់ប្តូរធាតុរបស់អ្នកខាងក្រោម។</span> · Make changes to your entry below.
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
              type="text" required className="gr-form-input"
              value={formData.question} onChange={(e) => updateField("question", e.target.value)}
            />
          </div>

          <div className="gr-form-group">
            <label className="gr-form-label"><span lang="km">ការណែនាំ/ការបកប្រែជាភាសាអង់គ្លេស</span> · English Hint/Translation</label>
            <input
              type="text" className="gr-form-input"
              value={formData.hint} onChange={(e) => updateField("hint", e.target.value)}
            />
          </div>

          <div className="gr-form-group">
            <label className="gr-form-label"><span lang="km">ចម្លើយ (ខ្មែរ)</span> · Answer (Khmer)*</label>
            <input
              type="text" required className="gr-form-input"
              value={formData.answer_kh} onChange={(e) => updateField("answer_kh", e.target.value)}
            />
          </div>

          <div className="gr-form-group">
            <label className="gr-form-label"><span lang="km">ចម្លើយ (អង់គ្លេស)</span> · Answer (English)*</label>
            <input
              type="text" required className="gr-form-input"
              value={formData.answer_en} onChange={(e) => updateField("answer_en", e.target.value)}
            />
          </div>

          <div className="gr-form-group">
            <label className="gr-form-label"><span lang="km">ការពន្យល់ (អង់គ្លេស)</span> · Explanation (English)</label>
            <textarea
              className="gr-form-textarea"
              value={formData.explanation} onChange={(e) => updateField("explanation", e.target.value)}
            />
          </div>

          <div className="gr-form-group">
            <label className="gr-form-label"><span lang="km">ប្រភព (អង់គ្លេស)</span> · Source (English)*</label>
            <input
              type="text" required className="gr-form-input"
              value={formData.source} onChange={(e) => updateField("source", e.target.value)}
            />
          </div>

          <div className="gr-form-group">
            <label className="gr-form-label"><span lang="km">ប្តូររូបភាព (ស្រេចចិត្ត)</span> · Update Photo (Optional)</label>
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
            <small style={{ display: 'block', color: 'var(--text-secondary)', marginTop: 4 }}>
              <span lang="km">អតិបរមា ៥MB (JPG, PNG, WEBP)។ ទុកទទេដើម្បីរក្សារូបភាពបច្ចុប្បន្ន។</span> · Max 5MB (JPG, PNG, WEBP). Leave empty to keep current photo.
            </small>
          </div>

          <div style={{ display: "flex", gap: "12px", marginTop: "24px" }}>
            <button type="submit" className="gr-submit-btn" disabled={isSubmitting} style={{ flex: 1 }}>
              {isSubmitting
                ? <><span lang="km">កំពុងរក្សាទុក...</span> · Saving...</>
                : <><span lang="km">រក្សាទុកការផ្លាស់ប្តូរ</span> · Save Changes</>}
            </button>
            <Link href="/" className="gr-btn-secondary" style={{ flex: "0 0 auto", display: "inline-flex", alignItems: "center" }}>
              <KmEn km="បោះបង់" en="Cancel" inline />
            </Link>
          </div>
        </form>
      </main>
    </>
  );
}
