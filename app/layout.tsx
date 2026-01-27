import "./globals.css";
import 'katex/dist/katex.min.css'
import { Toaster } from "@/components/ui/sonner"
import { Analytics } from "@vercel/analytics/next"
import type { Metadata, Viewport } from "next"

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://accurateexam.com"

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "AccurateExam - Premium Exam Preparation Platform",
    template: "%s | AccurateExam",
  },
  description:
    "Access thousands of high-quality mock tests and practice papers for competitive exams. Prepare smart, score high with AccurateExam.",
  keywords: [
    "exam preparation",
    "mock tests",
    "online exams",
    "test papers",
    "competitive exams",
    "practice tests",
    "SSC",
    "UPSC",
    "Banking",
    "Railway",
    "JEE",
    "NEET",
    "online test series",
  ],
  authors: [{ name: "AccurateExam" }],
  creator: "AccurateExam",
  publisher: "AccurateExam",
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
  openGraph: {
    type: "website",
    locale: "en_IN",
    url: siteUrl,
    siteName: "AccurateExam",
    title: "AccurateExam - Premium Exam Preparation Platform",
    description:
      "Access thousands of high-quality mock tests and practice papers for competitive exams. Prepare smart, score high.",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "AccurateExam - Premium Exam Preparation",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "AccurateExam - Premium Exam Preparation Platform",
    description:
      "Access thousands of high-quality mock tests and practice papers for competitive exams.",
    images: ["/og-image.png"],
    creator: "@accurateexam",
  },
  verification: {
    // Add your verification codes here when available
    // google: "your-google-verification-code",
    // yandex: "your-yandex-verification-code",
  },
  alternates: {
    canonical: siteUrl,
  },
  category: "Education",
}

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#ffffff" },
    { media: "(prefers-color-scheme: dark)", color: "#0a0a0a" },
  ],
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="min-h-screen flex flex-col scrollbar dark">
        {/* <Analytics /> */}
        
          <main className="flex-1">{children}</main>
          <Toaster position="top-center" richColors />
      
      </body>
    </html>
  );
}
