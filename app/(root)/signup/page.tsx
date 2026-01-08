import type { Metadata } from "next"
import SignupForm from "./SignupForm"

export const metadata: Metadata = {
  title: "Sign Up",
  description: "Create your free AccurateExam account and start preparing for competitive exams with our comprehensive mock tests and practice papers.",
  keywords: [
    "sign up AccurateExam",
    "create account",
    "register",
    "free exam preparation",
    "mock test registration",
  ],
  openGraph: {
    title: "Sign Up - AccurateExam",
    description: "Create your free account and start your exam preparation journey today.",
    type: "website",
  },
  alternates: {
    canonical: "/signup",
  },
  robots: {
    index: false,
    follow: true,
  },
}

export default function SignupPage() {
  return <SignupForm />
}
