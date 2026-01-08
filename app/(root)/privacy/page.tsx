import { Card, CardContent } from "@/components/ui/card"
import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Privacy Policy",
  description: "Learn how AccurateExam collects, uses, and protects your personal information. Read our comprehensive privacy policy.",
  keywords: [
    "privacy policy",
    "data protection",
    "user privacy",
    "AccurateExam privacy",
    "personal information",
  ],
  openGraph: {
    title: "Privacy Policy - AccurateExam",
    description: "Learn how AccurateExam collects, uses, and protects your personal information.",
    type: "website",
  },
  alternates: {
    canonical: "/privacy",
  },
  robots: {
    index: true,
    follow: true,
  },
}

export default function PrivacyPage() {
  return (
    <div className="py-12 md:py-20">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12 space-y-4">
            <h1 className="text-4xl md:text-5xl font-bold">
              Privacy Policy
            </h1>
            <p className="text-muted-foreground">
              Last updated: December 21, 2025
            </p>
          </div>

          <Card>
            <CardContent className="prose prose-lg max-w-none p-8 space-y-8">
              <section>
                <h2 className="text-2xl font-semibold mb-4">1. Introduction</h2>
                <p className="text-muted-foreground leading-relaxed">
                  AccurateExam ("we," "our," or "us") is committed to protecting your privacy. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you use our service. Please read this privacy policy carefully. If you do not agree with the terms of this privacy policy, please do not access the service.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-semibold mb-4">2. Information We Collect</h2>
                <p className="text-muted-foreground leading-relaxed mb-4">
                  We collect information about you in various ways when you use our Service:
                </p>
                
                <h3 className="text-xl font-semibold mb-3">Personal Information</h3>
                <ul className="list-disc pl-6 text-muted-foreground space-y-2 mb-4">
                  <li>Name and email address</li>
                  <li>Phone number (optional)</li>
                  <li>Educational background and exam preferences</li>
                  <li>Payment and billing information</li>
                  <li>Profile information you choose to provide</li>
                </ul>

                <h3 className="text-xl font-semibold mb-3">Usage Data</h3>
                <ul className="list-disc pl-6 text-muted-foreground space-y-2">
                  <li>Test performance and scores</li>
                  <li>Time spent on tests and individual questions</li>
                  <li>Browser type and version</li>
                  <li>Device information and IP address</li>
                  <li>Pages visited and features used</li>
                </ul>
              </section>

              <section>
                <h2 className="text-2xl font-semibold mb-4">3. How We Use Your Information</h2>
                <p className="text-muted-foreground leading-relaxed mb-4">
                  We use the information we collect in the following ways:
                </p>
                <ul className="list-disc pl-6 text-muted-foreground space-y-2">
                  <li>To provide, operate, and maintain our Service</li>
                  <li>To improve, personalize, and expand our Service</li>
                  <li>To understand and analyze how you use our Service</li>
                  <li>To develop new products, services, features, and functionality</li>
                  <li>To process your transactions and manage your orders</li>
                  <li>To send you updates, marketing communications, and other information</li>
                  <li>To provide customer support and respond to inquiries</li>
                  <li>To detect, prevent, and address technical issues and fraud</li>
                  <li>To generate performance analytics and reports</li>
                </ul>
              </section>

              <section>
                <h2 className="text-2xl font-semibold mb-4">4. Sharing Your Information</h2>
                <p className="text-muted-foreground leading-relaxed mb-4">
                  We may share your information in the following situations:
                </p>
                <ul className="list-disc pl-6 text-muted-foreground space-y-2">
                  <li><strong>Service Providers:</strong> We may share your information with third-party service providers that perform services on our behalf</li>
                  <li><strong>Business Transfers:</strong> If we are involved in a merger, acquisition, or sale of assets, your information may be transferred</li>
                  <li><strong>Legal Requirements:</strong> We may disclose your information where required by law or to protect our rights</li>
                  <li><strong>With Your Consent:</strong> We may share your information with your explicit consent</li>
                </ul>
                <p className="text-muted-foreground leading-relaxed mt-4">
                  We do not sell your personal information to third parties.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-semibold mb-4">5. Data Security</h2>
                <p className="text-muted-foreground leading-relaxed">
                  We implement appropriate technical and organizational security measures to protect your personal information. However, please note that no method of transmission over the Internet or electronic storage is 100% secure. While we strive to use commercially acceptable means to protect your personal information, we cannot guarantee its absolute security.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-semibold mb-4">6. Data Retention</h2>
                <p className="text-muted-foreground leading-relaxed">
                  We retain your personal information only for as long as necessary to fulfill the purposes outlined in this Privacy Policy, unless a longer retention period is required or permitted by law. When we no longer need your information, we will securely delete or anonymize it.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-semibold mb-4">7. Your Rights</h2>
                <p className="text-muted-foreground leading-relaxed mb-4">
                  Depending on your location, you may have the following rights:
                </p>
                <ul className="list-disc pl-6 text-muted-foreground space-y-2">
                  <li><strong>Access:</strong> Request access to your personal information</li>
                  <li><strong>Correction:</strong> Request correction of inaccurate data</li>
                  <li><strong>Deletion:</strong> Request deletion of your personal information</li>
                  <li><strong>Portability:</strong> Request transfer of your data</li>
                  <li><strong>Objection:</strong> Object to processing of your personal information</li>
                  <li><strong>Withdrawal:</strong> Withdraw consent at any time</li>
                </ul>
                <p className="text-muted-foreground leading-relaxed mt-4">
                  To exercise these rights, please contact us at privacy@accurateexam.com.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-semibold mb-4">8. Cookies and Tracking</h2>
                <p className="text-muted-foreground leading-relaxed">
                  We use cookies and similar tracking technologies to track activity on our Service and hold certain information. Cookies are files with small amounts of data which may include an anonymous unique identifier. You can instruct your browser to refuse all cookies or to indicate when a cookie is being sent.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-semibold mb-4">9. Children's Privacy</h2>
                <p className="text-muted-foreground leading-relaxed">
                  Our Service is intended for users who are at least 13 years old. We do not knowingly collect personal information from children under 13. If you are a parent or guardian and believe your child has provided us with personal information, please contact us.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-semibold mb-4">10. International Data Transfers</h2>
                <p className="text-muted-foreground leading-relaxed">
                  Your information may be transferred to and maintained on computers located outside of your state, province, country, or other governmental jurisdiction where data protection laws may differ. By using our Service, you consent to such transfers.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-semibold mb-4">11. Changes to This Privacy Policy</h2>
                <p className="text-muted-foreground leading-relaxed">
                  We may update our Privacy Policy from time to time. We will notify you of any changes by posting the new Privacy Policy on this page and updating the "Last updated" date. You are advised to review this Privacy Policy periodically for any changes.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-semibold mb-4">12. Contact Us</h2>
                <p className="text-muted-foreground leading-relaxed">
                  If you have any questions about this Privacy Policy, please contact us at:
                </p>
                <ul className="list-none text-muted-foreground space-y-2 mt-4">
                  <li>Email: privacy@accurateexam.com</li>
                  <li>Phone: +1 (555) 123-4567</li>
                  <li>Address: 123 Education St, Learning City</li>
                </ul>
              </section>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
