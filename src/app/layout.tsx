import type { Metadata } from "next";
import { Nunito } from "next/font/google";
import "./globals.css";

const nunito = Nunito({
  variable: "--font-nunito",
  subsets: ["latin"],
  weight: ["400", "600", "700", "800"],
});

export const metadata: Metadata = {
  title: "SwearLingo | Profanity perfects Proficiency",
  description:
    "Profanity perfects Proficiency. A Duolingo-inspired app that teaches essential French swear phrases.",
  icons: {
    icon: "/swearlingo.png",
    apple: "/swearlingo.png",
  },
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" className={`${nunito.variable} antialiased`}>
      <body className="min-h-svh font-sans text-ink">{children}</body>
    </html>
  );
}
