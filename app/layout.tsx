import "./globals.css"
import Navbar from "@/components/Navbar/Navbar"
import Footer from "@/components/Footer"

export const metadata = {
  title: "AccurateExam - Premium Exam Preparation Platform",
  description: "Access thousands of high-quality mock tests and practice papers for competitive exams. Prepare smart, score high.",
  keywords: ["exam preparation", "mock tests", "online exams", "test papers", "competitive exams"],
}

export default function RootLayout({ children } : { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="min-h-screen flex flex-col">
        <Navbar />
        <main className="flex-1">{children}</main>
        <Footer />
      </body>
    </html>
  )
}
