import type { Metadata } from "next";
import HomeClient from "./home-client";

/**
 * Marketing Homepage SEO Metadata
 * Strictly configured for the marketing landing page only.
 * Private member and administrative routes remain unindexed.
 */
export const metadata: Metadata = {
  title: "Spotter",
  description: "Your gym, verified records",
  robots: {
    index: true,
    follow: true,
  },
  openGraph: {
    title: "Spotter",
    description: "Your gym, verified records",
    url: "https://spotter.gym",
    siteName: "Spotter",
    locale: "en_NG",
    type: "website",
  },
  twitter: {
    card: "summary",
    title: "Spotter",
    description: "Your gym, verified records",
  },
  alternates: {
    canonical: "/",
  },
  other: {
    "theme-color": "#0f4ee3",
  },
};

export default function HomePage() {
  return <HomeClient />;
}
