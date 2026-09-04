import "./globals.css";
import collection from "../collection.config.js";
import { Montserrat, Inter } from "next/font/google";

const montserrat = Montserrat({ weight: ["400", "500", "600", "700", "800", "900"], subsets: ["latin"], variable: '--font-montserrat', display: 'swap' });
const inter = Inter({ subsets: ["latin"], variable: '--font-inter', display: 'swap' });

export const metadata = {
  title: `${collection.name} — Khmer Living Archive`,
  description: collection.description,
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" suppressHydrationWarning className={`${montserrat.variable} ${inter.variable}`}>
      <head>
        {/*
          Inline script runs synchronously before React hydrates —
          prevents flash of wrong theme (FOUT) on page load.
          Reads localStorage preference, falls back to system preference.
        */}
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function() {
                try {
                  var stored = localStorage.getItem('theme');
                  var prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
                  var theme = stored || (prefersDark ? 'dark' : 'light');
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
