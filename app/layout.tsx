import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({
  variable: "--font-sans",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "SwipeHire - Swipe Right. Get Hired.",
  description: "AI-powered career matchmaking inspired by dating apps.",
  keywords: ["jobs", "career", "AI resume builder", "SwipeHire", "mock interview"],
  openGraph: {
    title: "SwipeHire - Swipe Right. Get Hired.",
    description: "AI-powered career matchmaking inspired by dating apps.",
    url: "https://swipehire.example.com",
    siteName: "SwipeHire",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "SwipeHire - Swipe Right. Get Hired.",
    description: "AI-powered career matchmaking inspired by dating apps.",
  },
  robots: {
    index: true,
    follow: true,
  }
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`dark ${inter.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-background text-foreground">{children}</body>
    </html>
  );
}
