import type { Metadata } from "next"
import ContactForm from "./ContactForm"

export const metadata: Metadata = {
  title: "Contact Us",
  description: "Get in touch with AccurateExam. We're here to help with your exam preparation questions and support needs.",
  keywords: [
    "contact AccurateExam",
    "customer support",
    "exam help",
    "get in touch",
    "support team",
  ],
  openGraph: {
    title: "Contact Us - AccurateExam",
    description: "Have questions? We're here to help. Reach out to AccurateExam anytime.",
    type: "website",
  },
  alternates: {
    canonical: "/contact",
  },
}

export default function ContactPage() {
  return <ContactForm />
}
