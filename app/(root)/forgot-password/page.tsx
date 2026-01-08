import type { Metadata } from "next"
import ForgotPasswordForm from "./ForgotPasswordForm"

export const metadata: Metadata = {
  title: "Forgot Password",
  description: "Reset your AccurateExam account password. Enter your email to receive a secure OTP for password recovery.",
  keywords: [
    "forgot password",
    "reset password",
    "password recovery",
    "AccurateExam password",
    "account recovery",
  ],
  openGraph: {
    title: "Forgot Password - AccurateExam",
    description: "Reset your AccurateExam account password securely.",
    type: "website",
  },
  alternates: {
    canonical: "/forgot-password",
  },
  robots: {
    index: false,
    follow: true,
  },
}

export default function ForgotPasswordPage() {
  return <ForgotPasswordForm />
}
