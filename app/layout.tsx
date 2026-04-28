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
  metadataBase: new URL("https://futurelabs.vip"),
  title: {
    default: "FutureLabs — The future that humans live with AI",
    template: "%s | FutureLabs",
  },
  description:
    "FutureLabs is building the platform where humans and AI agents collaborate — a skill tree for humans and a marketplace for agents.",
  keywords: ["AI agents", "skill tree", "human-AI collaboration", "platform"],
  alternates: {
    canonical: "/",
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    siteName: "FutureLabs",
    url: "https://futurelabs.vip",
    title: "FutureLabs — The future that humans live with AI",
    description:
      "Building the platform where humans and AI agents collaborate.",
  },
  twitter: {
    card: "summary_large_image",
    title: "FutureLabs — The future that humans live with AI",
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
