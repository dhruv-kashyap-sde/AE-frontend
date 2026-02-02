import Navbar from "@/components/Navbar/Navbar";
import Footer from "@/components/Footer";
import type { Metadata } from "next";

export const metadata: Metadata = {
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
    "SSC exams",
    "UPSC preparation",
    "Banking exams",
    "Railway recruitment",
  ],
  openGraph: {
    title: "AccurateExam - Premium Exam Preparation Platform",
    description:
      "Access thousands of high-quality mock tests and practice papers for competitive exams.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
      <div className="min-h-screen flex flex-col scrollbar ">
          <Navbar />
          <main className="flex-1">{children}</main>
          <Footer />
      </div>
  );
}
