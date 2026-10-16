import "./globals.css";
import collection from "../collection.config.js";
import { Playfair_Display, Inter } from "next/font/google";

const playfair = Playfair_Display({ subsets: ["latin"], variable: '--font-playfair', display: 'swap' });
const inter = Inter({ subsets: ["latin"], variable: '--font-inter', display: 'swap' });

export const metadata = {
  title: `${collection.name} — Khmer Living Archive`,
  description: collection.description,
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" data-theme="dark" suppressHydrationWarning className={`${playfair.variable} ${inter.variable}`}>
      <head>
        {/*
          Inline script runs synchronously before React hydrates —
          prevents flash of wrong theme (FOUT) on page load.
          Reads localStorage preference, falls back to dark mode.
        */}
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function() {
                try {
                  var stored = localStorage.getItem('theme');
                  var theme = stored || 'dark';
                  document.documentElement.setAttribute('data-theme', theme);
                } catch(e) {
                  document.documentElement.setAttribute('data-theme', 'dark');
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
