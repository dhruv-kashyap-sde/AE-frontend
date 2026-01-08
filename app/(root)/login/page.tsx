import type { Metadata } from "next"
import LoginForm from "./LoginForm"

export const metadata: Metadata = {
  title: "Login",
  description: "Sign in to your AccurateExam account to access mock tests, track your progress, and continue your exam preparation journey.",
  keywords: [
    "login AccurateExam",
    "sign in",
    "student login",
    "exam portal login",
    "mock test login",
  ],
  openGraph: {
    title: "Login - AccurateExam",
    description: "Sign in to access your personalized exam preparation dashboard.",
    type: "website",
  },
  alternates: {
    canonical: "/login",
  },
  robots: {
    index: false,
    follow: true,
  },
}

export default function LoginPage() {
  return <LoginForm />
}
