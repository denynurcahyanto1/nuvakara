import type { Metadata, Viewport } from "next";
import { Cormorant_Garamond, Plus_Jakarta_Sans } from "next/font/google";
import "./globals.css";

const cormorant = Cormorant_Garamond({
  variable: "--font-cormorant",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  display: "swap",
});

const jakarta = Plus_Jakarta_Sans({
  variable: "--font-jakarta",
  subsets: ["latin"],
  display: "swap",
});

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "NUVAKARA — Every Moment Deserves a Beautiful Invitation.",
    template: "%s | NUVAKARA",
  },
  description:
    "Platform undangan digital premium untuk pernikahan, ulang tahun, wisuda, dan berbagai acara lainnya. Buat, publikasikan, dan bagikan undangan Anda dengan mudah.",
  applicationName: "NUVAKARA",
  keywords: [
    "undangan digital",
    "undangan online",
    "undangan pernikahan",
    "invitation",
    "RSVP",
    "guestbook",
  ],
  openGraph: {
    type: "website",
    siteName: "NUVAKARA",
    title: "NUVAKARA — Every Moment Deserves a Beautiful Invitation.",
    description:
      "Platform undangan digital premium untuk momen yang layak dikenang.",
  },
  twitter: {
    card: "summary_large_image",
    title: "NUVAKARA — Every Moment Deserves a Beautiful Invitation.",
    description:
      "Platform undangan digital premium untuk momen yang layak dikenang.",
  },
};

export const viewport: Viewport = {
  themeColor: "#141c2b",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="id"
      className={`${cormorant.variable} ${jakarta.variable} h-full antialiased`}
    >
      <body className="flex min-h-full flex-col">{children}</body>
    </html>
  );
}
