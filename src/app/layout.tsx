import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { Toaster } from "@/components/ui/sonner";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#09090b",
};

export const metadata: Metadata = {
  title: {
    default: "Vibe Architect Central",
    template: "%s | Vibe Architect Central",
  },
  description:
    "Discover cutting-edge AI tools and orchestration prompts for Senior Vibe Architects. Build, orchestrate, and deploy with the latest AI-powered development tools.",
  keywords: [
    "AI tools",
    "vibe coding",
    "prompt engineering",
    "AI orchestration",
    "no-code",
    "low-code",
    "AI agents",
    "Claude",
    "ChatGPT",
    "Cursor",
    "Bolt.new",
  ],
  authors: [{ name: "Vibe Architect Central" }],
  creator: "Vibe Architect Central",
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://vibe-architect.vercel.app",
    siteName: "Vibe Architect Central",
    title: "Vibe Architect Central",
    description:
      "Discover cutting-edge AI tools and orchestration prompts for Senior Vibe Architects",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "Vibe Architect Central - AI Tools Directory",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Vibe Architect Central",
    description:
      "Discover cutting-edge AI tools and orchestration prompts for Senior Vibe Architects",
    images: ["/og-image.png"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  manifest: "/manifest.json",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {children}
        <Toaster position="bottom-right" />
      </body>
    </html>
  );
}
