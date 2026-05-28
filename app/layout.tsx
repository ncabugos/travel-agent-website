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

const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL ??
  (process.env.VERCEL_ENV === "production"
    ? "https://eliteadvisorhub.com"
    : "http://localhost:3000");

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: "Elite Advisor Hub — Websites for Elite Travel Advisors",
    template: "%s · Elite Advisor Hub",
  },
  description:
    "The premium website platform for luxury travel advisors. Stunning templates, curated editorial content, supplier integrations, and zero tech burden.",
  applicationName: "Elite Advisor Hub",
  authors: [{ name: "Elite Advisor Hub" }],
  keywords: [
    "travel advisor websites",
    "luxury travel marketing",
    "Virtuoso advisor website",
    "travel agency website platform",
    "Elite Advisor Hub",
  ],
  openGraph: {
    type: "website",
    siteName: "Elite Advisor Hub",
    title: "Elite Advisor Hub — Websites for Elite Travel Advisors",
    description:
      "Stunning branded websites, curated editorial content, and supplier integrations for luxury travel advisors — with zero tech burden.",
    url: SITE_URL,
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    title: "Elite Advisor Hub — Websites for Elite Travel Advisors",
    description:
      "The premium website platform for luxury travel advisors. Zero tech burden.",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
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
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
