import type { Metadata } from "next";
import { Inter, Allura } from "next/font/google";
import "./globals.css";
import { GlobalHeader } from "@/components/GlobalHeader";
import { GlobalFooter } from "@/components/GlobalFooter";

const inter = Inter({ variable: "--font-inter", subsets: ["latin"], display: "swap" });
const allura = Allura({ variable: "--font-allura", subsets: ["latin"], weight: "400", display: "swap" });

const SITE_URL = "https://almispanish.almiworld.com";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: "AlmiSpanish | Practise Spanish Exams with Honest AI Feedback",
    template: "%s · AlmiSpanish",
  },
  description:
    "Stop guessing your Spanish level. Practise real DELE, SIELE and CCSE task formats across all CEFR levels (A1–C2) with honest score scales mapped to CEFR.",
  applicationName: "AlmiSpanish",
  authors: [{ name: "AlmiWorld" }],
  keywords: ["DELE A2", "DELE B2", "DELE C1", "SIELE Global", "CCSE", "Spanish nationality DELE A2 CCSE", "Spanish test for citizenship", "examen DELE", "study in Spain Spanish test", "SIELE 0-1000", "CEFR", "Spanish exam practice", "AlmiSpanish", "AlmiWorld"],
  openGraph: {
    title: "AlmiSpanish — honest DELE · SIELE · CCSE practice",
    description: "Real Spanish-exam task formats with honest AI estimates on each exam's own scale, mapped to CEFR. Choose the test your goal needs.",
    url: SITE_URL,
    siteName: "AlmiSpanish",
    type: "website",
    locale: "en_US",
  },
  twitter: { card: "summary_large_image", title: "AlmiSpanish — DELE · SIELE · CCSE practice", description: "Honest Spanish-exam estimates on each exam's real scale, mapped to CEFR — not inflated numbers." },
  robots: { index: true, follow: true, googleBot: { index: true, follow: true, "max-image-preview": "large" } },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={`${inter.variable} ${allura.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col">
        <GlobalHeader />
        <div className="flex flex-1 flex-col">{children}</div>
        <GlobalFooter />
      </body>
    </html>
  );
}
