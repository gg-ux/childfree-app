import type { Metadata } from "next";
import Script from "next/script";
import "./globals.css";

const GA_MEASUREMENT_ID = "G-BWBFZC4ZZ0";

export const metadata: Metadata = {
  metadataBase: new URL("https://chosn.co"),
  title: {
    default: "Chosn | Childfree Dating & Community. Find Your Chosen Family.",
    template: "%s | Chosn",
  },
  description:
    "The modern platform for childfree adults seeking meaningful connections—dating, friendship, and chosen family.",
  keywords: [
    "childfree",
    "childfree dating",
    "DINK",
    "no kids",
    "childfree community",
    "childfree friends",
    "childfree by choice",
    "dating without kids",
  ],
  authors: [{ name: "Chosn" }],
  creator: "Chosn",
  publisher: "Chosn",
  openGraph: {
    title: "Chosn | Childfree Dating & Community. Find Your Chosen Family.",
    description:
      "The modern platform for childfree adults seeking meaningful connections.",
    type: "website",
    locale: "en_US",
    url: "https://chosn.co",
    siteName: "Chosn",
    images: [
      {
        url: "/assets/og-pic.jpg",
        width: 1200,
        height: 630,
        alt: "Chosn - Childfree Dating & Community",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Chosn | Childfree Dating & Community. Find Your Chosen Family.",
    description:
      "The modern platform for childfree adults seeking meaningful connections.",
    images: ["/assets/og-pic.jpg"],
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
  alternates: {
    canonical: "https://chosn.co",
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
          src={`https://www.googletagmanager.com/gtag/js?id=${GA_MEASUREMENT_ID}`}
          strategy="afterInteractive"
        />
        <Script id="google-analytics" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', '${GA_MEASUREMENT_ID}');
          `}
        </Script>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@graph": [
                {
                  "@type": "Organization",
                  "@id": "https://chosn.co/#organization",
                  name: "Chosn",
                  url: "https://chosn.co",
                  logo: {
                    "@type": "ImageObject",
                    url: "https://chosn.co/logo.svg",
                  },
                  sameAs: [],
                },
                {
                  "@type": "WebSite",
                  "@id": "https://chosn.co/#website",
                  url: "https://chosn.co",
                  name: "Chosn",
                  description:
                    "The modern platform for childfree adults seeking meaningful connections—dating, friendship, and chosen family.",
                  publisher: { "@id": "https://chosn.co/#organization" },
                },
              ],
            }),
          }}
        />
      </head>
      <body className="antialiased">{children}</body>
    </html>
  );
}
