// Nav bar link text in both languages. The nav shows one language at a time
// (picked with the toggle button) instead of stacking both, which looked
// crowded on a phone. Khmer is the default.
// UNSURE: Khmer wording written by Claude — please have a native speaker check it.
const NAV_LABELS = {
  home: { km: "ទំព័រដើម", en: "Home" },
  daily: { km: "ល្បែងប្រចាំថ្ងៃ", en: "Daily Challenge" },
  submit: { km: "ដាក់ស្នើពាក្យបណ្តៅ", en: "Submit Riddle" },
  myEntries: { km: "ធាតុរបស់ខ្ញុំ", en: "My Entries" },
  reviewQueue: { km: "ជួរត្រួតពិនិត្យ", en: "Review Queue" },
  logIn: { km: "ចូលគណនី", en: "Log In" },
  signUp: { km: "ចុះឈ្មោះ", en: "Sign Up" },
  logOut: { km: "ចាកចេញ", en: "Log Out" },
  signedInAs: { km: "ចូលគណនីក្នុងនាម៖", en: "Signed in as:" },
  admin: { km: "ចូលគ្រប់គ្រង", en: "Admin" },
};

export default NAV_LABELS;
