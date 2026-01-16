import type { Metadata, Viewport } from "next";
import { Fira_Code, Space_Grotesk } from "next/font/google";
import { Toaster } from "@/components/ui/sonner";
import { ThemeProvider } from "@/components/ThemeProvider";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import "./globals.css";

const firaCode = Fira_Code({
  variable: "--font-fira-code",
  subsets: ["latin"],
  weight: ["400", "500", "700"],
});

const spaceGrotesk = Space_Grotesk({
  variable: "--font-space-grotesk",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
});

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#0D0D0D",
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
    <html lang="en" className="dark" suppressHydrationWarning>
      <body
        className={`${firaCode.variable} ${spaceGrotesk.variable} font-mono antialiased terminal-theme terminal-bg text-[var(--terminal-green)] selection:bg-[var(--terminal-purple)] selection:text-white`}
      >
        <ThemeProvider>
          {/* CRT Overlay Effect */}
          <div className="crt-overlay" aria-hidden="true" />
          <div className="flex flex-col min-h-screen">
            <Header />
            <main className="flex-1">{children}</main>
            <Footer />
          </div>
          <Toaster position="bottom-right" />
        </ThemeProvider>
      </body>
    </html>
  );
}
