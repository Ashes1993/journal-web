import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    default: "Reflect | Privacy-First Journal",
    template: "%s | Reflect",
  },
  description:
    "Secure, cryptographically protected personal journal for your daily thoughts, reflections, and mood tracking.",
  metadataBase: new URL("https://reflect-journal.vercel.app"),

  // Open Graph (Controls WhatsApp, Telegram, LinkedIn, Facebook previews)
  openGraph: {
    title: "Reflect | Privacy-First Journal",
    description:
      "Secure, cryptographically protected personal journal for your daily thoughts and mood tracking.",
    url: "https://reflect-journal.vercel.app",
    siteName: "Reflect",
    locale: "en_US",
    type: "website",
  },

  // Twitter Cards (Controls X/Twitter link expansion previews)
  twitter: {
    card: "summary_large_image",
    title: "Reflect | Privacy-First Journal",
    description:
      "Secure, cryptographically protected personal journal for your daily thoughts.",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
