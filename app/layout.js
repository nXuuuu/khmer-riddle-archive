import "./globals.css";
import collection from "../collection.config.js";
import { Instrument_Serif, Inter_Tight, Kantumruy_Pro, Koulen } from "next/font/google";

// Instrument Serif: editorial Latin headings (museum-catalogue feel).
// Inter Tight: clean Latin body and labels. Kantumruy Pro: Khmer body text.
// Koulen: bold Khmer display face for the big Khmer titles.
const serif = Instrument_Serif({ weight: "400", style: ["normal", "italic"], subsets: ["latin"], variable: "--font-serif", display: "swap" });
const sans = Inter_Tight({ subsets: ["latin"], variable: "--font-inter-tight", display: "swap" });
const kantumruy = Kantumruy_Pro({ subsets: ["khmer", "latin"], variable: "--font-kantumruy", display: "swap" });
const koulen = Koulen({ weight: "400", subsets: ["khmer", "latin"], variable: "--font-koulen", display: "swap" });

export const metadata = {
  title: `${collection.name} — Khmer Living Archive`,
  description: collection.description,
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" data-theme="light" suppressHydrationWarning className={`${serif.variable} ${sans.variable} ${kantumruy.variable} ${koulen.variable}`}>
      <head>
        {/*
          Inline script runs synchronously before React hydrates —
          prevents flash of wrong theme (FOUT) on page load.
          Reads localStorage preference, falls back to light mode.
        */}
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function() {
                try {
                  var stored = localStorage.getItem('theme');
                  var theme = stored || 'light';
                  document.documentElement.setAttribute('data-theme', theme);
                } catch(e) {
                  document.documentElement.setAttribute('data-theme', 'light');
                }
              })();
            `,
          }}
        />
      </head>
      <body>{children}</body>
    </html>
  );
}
