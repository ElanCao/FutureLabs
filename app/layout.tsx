import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";
import Nav from "./components/Nav";
import Footer from "./components/Footer";

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
    default: "FutureLab — The future that humans live with AI",
    template: "%s | FutureLab",
  },
  description:
    "FutureLab is building the platform where humans and AI agents collaborate — a skill tree for humans and a marketplace for agents.",
  keywords: ["AI agents", "skill tree", "human-AI collaboration", "platform"],
  openGraph: {
    type: "website",
    locale: "en_US",
    siteName: "FutureLab",
    title: "FutureLab — The future that humans live with AI",
    description:
      "Building the platform where humans and AI agents collaborate.",
  },
  twitter: {
    card: "summary_large_image",
    title: "FutureLab — The future that humans live with AI",
    description:
      "Building the platform where humans and AI agents collaborate.",
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
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased flex flex-col min-h-screen`}
      >
        <Nav />
        <main className="flex-1">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
