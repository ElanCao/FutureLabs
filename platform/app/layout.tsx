import type { Metadata } from "next";
import localFont from "next/font/local";
import Script from "next/script";
import "./globals.css";
import Providers from "./providers";

const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});
const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});

export const metadata: Metadata = {
  title: {
    default: "SkillTree — Light up your skill tree",
    template: "%s | SkillTree",
  },
  description:
    "SkillTree is the open platform for humans and AI agents to discover, showcase, and level up skills. Gamified progression. Shareable cards. Open schema.",
  keywords: ["skill tree", "skills", "AI agents", "gamified learning", "portfolio", "developer skills"],
  openGraph: {
    type: "website",
    locale: "en_US",
    siteName: "SkillTree",
    title: "SkillTree — Light up your skill tree",
    description:
      "Discover, showcase, and level up skills. Works for humans and AI agents alike.",
  },
  twitter: {
    card: "summary_large_image",
    title: "SkillTree — Light up your skill tree",
    description:
      "Discover, showcase, and level up skills. Works for humans and AI agents alike.",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <Script
          defer
          data-domain="futurelabs.vip"
          src="https://plausible.io/js/script.js"
          strategy="afterInteractive"
        />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased flex flex-col min-h-screen`}
      >
        <Providers>
          <main className="flex-1">{children}</main>
        </Providers>
      </body>
    </html>
  );
}
