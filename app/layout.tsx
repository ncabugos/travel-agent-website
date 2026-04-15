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
    default: "EliteAdvisorHub — Websites for Elite Travel Advisors",
    template: "%s · EliteAdvisorHub",
  },
  description:
    "The premium website platform for luxury travel advisors. Stunning templates, curated editorial content, supplier integrations, and zero tech burden.",
  applicationName: "EliteAdvisorHub",
  authors: [{ name: "EliteAdvisorHub" }],
  keywords: [
    "travel advisor websites",
    "luxury travel marketing",
    "Virtuoso advisor website",
    "travel agency website platform",
    "EliteAdvisorHub",
  ],
  openGraph: {
    type: "website",
    siteName: "EliteAdvisorHub",
    title: "EliteAdvisorHub — Websites for Elite Travel Advisors",
    description:
      "Stunning branded websites, curated editorial content, and supplier integrations for luxury travel advisors — with zero tech burden.",
    url: SITE_URL,
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    title: "EliteAdvisorHub — Websites for Elite Travel Advisors",
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
