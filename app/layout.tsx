import "./globals.css";
import 'katex/dist/katex.min.css'
import { Toaster } from "@/components/ui/sonner"
import { AuthProvider } from "@/context/AuthContext"

export const metadata = {
  title: "AccurateExam - Premium Exam Preparation Platform",
  description:
    "Access thousands of high-quality mock tests and practice papers for competitive exams. Prepare smart, score high.",
  keywords: [
    "exam preparation",
    "mock tests",
    "online exams",
    "test papers",
    "competitive exams",
  ],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="min-h-screen flex flex-col scrollbar dark">
        <AuthProvider>
          <main className="flex-1">{children}</main>
          <Toaster position="top-center" richColors />
        </AuthProvider>
      </body>
    </html>
  );
}
