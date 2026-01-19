import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Flourish | Find Your People. Thrive Together.",
  description:
    "The modern platform for childfree adults seeking meaningful connections—dating, friendship, and chosen family.",
  keywords: [
    "childfree",
    "childfree dating",
    "DINK",
    "no kids",
    "childfree community",
    "childfree friends",
  ],
  authors: [{ name: "Flourish" }],
  openGraph: {
    title: "Flourish | Find Your People. Thrive Together.",
    description:
      "The modern platform for childfree adults seeking meaningful connections.",
    type: "website",
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    title: "Flourish | Find Your People. Thrive Together.",
    description:
      "The modern platform for childfree adults seeking meaningful connections.",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased">{children}</body>
    </html>
  );
}
