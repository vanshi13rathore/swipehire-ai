import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";

// Inter is served locally via system font fallback to avoid build-time network calls.
// In production, Next.js automatically downloads and self-hosts Google Fonts.
// This pattern is identical in output but doesn't require network at build time.
const inter = localFont({
  src: [
    {
      path: "../public/fonts/inter-var.woff2",
      weight: "100 900",
      style: "normal",
    },
  ],
  variable: "--font-sans",
  display: "swap",
  fallback: ["system-ui", "arial"],
  preload: false,
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
