import type { Metadata } from "next";
import { Fraunces, Inter } from "next/font/google";
import "./globals.css";
import { Nav } from "@/components/Nav";

const display = Fraunces({
  subsets: ["latin"],
  variable: "--font-display",
  weight: ["500", "600", "700"],
});

const sans = Inter({
  subsets: ["latin"],
  variable: "--font-sans",
});

export const metadata: Metadata = {
  title: "Colonist Tracker",
  description: "Cumulative Catan stats — wins, streaks, and bragging rights.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${display.variable} ${sans.variable}`}>
      <body className="min-h-screen font-sans antialiased">
        <Nav />
        <main className="mx-auto max-w-5xl px-4 pb-24 pt-8 sm:px-6">{children}</main>
      </body>
    </html>
  );
}
