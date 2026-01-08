import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Terms of Service",
  description: "Read our terms of service and understand your rights and obligations when using AccurateExam platform.",
  keywords: [
    "terms of service",
    "user agreement",
    "terms and conditions",
    "AccurateExam terms",
    "legal terms",
  ],
  openGraph: {
    title: "Terms of Service - AccurateExam",
    description: "Read our terms of service and understand your rights and obligations when using AccurateExam.",
    type: "website",
  },
  alternates: {
    canonical: "/terms",
  },
  robots: {
    index: true,
    follow: true,
  },
}

export default function TermsPage() {
  return (
    <div className="py-12 md:py-20">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12 space-y-4">
            <h1 className="text-4xl md:text-5xl font-bold">
              Terms of Service
            </h1>
            <p className="text-muted-foreground">
              Last updated: December 21, 2025
            </p>
          </div>

          <Card>
            <CardContent className="prose prose-lg max-w-none p-8 space-y-8">
              <section>
                <h2 className="text-2xl font-semibold mb-4">1. Acceptance of Terms</h2>
                <p className="text-muted-foreground leading-relaxed">
                  By accessing and using AccurateExam ("the Service"), you accept and agree to be bound by the terms and provision of this agreement. If you do not agree to abide by the above, please do not use this service.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-semibold mb-4">2. Use License</h2>
                <p className="text-muted-foreground leading-relaxed">
                  Permission is granted to temporarily access the materials (mock tests, study materials, analytics) on AccurateExam for personal, non-commercial use only. This is the grant of a license, not a transfer of title, and under this license you may not:
                </p>
                <ul className="list-disc pl-6 text-muted-foreground space-y-2">
                  <li>Modify or copy the materials</li>
                  <li>Use the materials for any commercial purpose or public display</li>
                  <li>Attempt to reverse engineer any software contained on AccurateExam</li>
                  <li>Remove any copyright or proprietary notations from the materials</li>
                  <li>Transfer the materials to another person or "mirror" the materials on any other server</li>
                </ul>
              </section>

              <section>
                <h2 className="text-2xl font-semibold mb-4">3. User Account</h2>
                <p className="text-muted-foreground leading-relaxed">
                  To access certain features of the Service, you must register for an account. When you register, you agree to provide accurate and complete information. You are solely responsible for the activity that occurs on your account, and you must keep your account password secure.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-semibold mb-4">4. Payment Terms</h2>
                <p className="text-muted-foreground leading-relaxed">
                  Some parts of the Service are billed on a subscription basis. You will be billed in advance on a recurring basis. Billing cycles are set on a monthly or annual basis, depending on the subscription plan selected. At the end of each billing cycle, your subscription will automatically renew unless canceled.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-semibold mb-4">5. Refund Policy</h2>
                <p className="text-muted-foreground leading-relaxed">
                  We offer a 7-day money-back guarantee for all new subscriptions. If you are not satisfied with our service, you may request a full refund within 7 days of your initial purchase. Refunds requested after this period will be evaluated on a case-by-case basis.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-semibold mb-4">6. Intellectual Property</h2>
                <p className="text-muted-foreground leading-relaxed">
                  The Service and its original content, features, and functionality are and will remain the exclusive property of AccurateExam and its licensors. The Service is protected by copyright, trademark, and other laws. Our trademarks may not be used in connection with any product or service without prior written consent.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-semibold mb-4">7. User Conduct</h2>
                <p className="text-muted-foreground leading-relaxed">
                  You agree not to engage in any of the following prohibited activities:
                </p>
                <ul className="list-disc pl-6 text-muted-foreground space-y-2">
                  <li>Copying, distributing, or disclosing any part of the Service</li>
                  <li>Using any automated system to access the Service</li>
                  <li>Attempting to interfere with, compromise the system integrity or security</li>
                  <li>Sharing your account credentials with others</li>
                  <li>Using the Service for any illegal or unauthorized purpose</li>
                </ul>
              </section>

              <section>
                <h2 className="text-2xl font-semibold mb-4">8. Termination</h2>
                <p className="text-muted-foreground leading-relaxed">
                  We may terminate or suspend your account and bar access to the Service immediately, without prior notice or liability, under our sole discretion, for any reason whatsoever, including without limitation if you breach the Terms.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-semibold mb-4">9. Limitation of Liability</h2>
                <p className="text-muted-foreground leading-relaxed">
                  In no event shall AccurateExam, nor its directors, employees, partners, agents, suppliers, or affiliates, be liable for any indirect, incidental, special, consequential or punitive damages, including without limitation, loss of profits, data, use, goodwill, or other intangible losses, resulting from your access to or use of or inability to access or use the Service.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-semibold mb-4">10. Changes to Terms</h2>
                <p className="text-muted-foreground leading-relaxed">
                  We reserve the right to modify or replace these Terms at any time. If a revision is material, we will provide at least 30 days' notice prior to any new terms taking effect. What constitutes a material change will be determined at our sole discretion.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-semibold mb-4">11. Contact Us</h2>
                <p className="text-muted-foreground leading-relaxed">
                  If you have any questions about these Terms, please contact us at support@accurateexam.com.
                </p>
              </section>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
