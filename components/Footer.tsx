import Link from "next/link"
import { BookOpen, Mail, MapPin, Phone } from "lucide-react"

export default function Footer() {
  const currentYear = new Date().getFullYear()

  return (
    <footer className="border-t bg-background text-background-foreground">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand Section */}
          <div className="space-y-4">
            <Link href="/" className="flex items-center gap-2">
              <div className="h-10 w-10 rounded-lg bg-background flex items-center justify-center">
                <BookOpen className="h-6 w-6 text-background-foreground" />
              </div>
              <span className="text-xl font-bold">AccurateExam</span>
            </Link>
            <p className="text-sm text-secondary-foreground">
              Your trusted partner in exam preparation. Access premium mock tests and ace your exams.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li>
                <Link 
                  href="/about" 
                  className="text-sm text-secondary-foreground hover:underline hover:text-background transition-colors"
                >
                  About Us
                </Link>
              </li>
              <li>
                <Link 
                  href="/contact" 
                  className="text-sm text-secondary-foreground hover:underline hover:text-background transition-colors"
                >
                  Contact
                </Link>
              </li>
              <li>
                <Link 
                  href="/exams" 
                  className="text-sm text-secondary-foreground hover:underline hover:text-background transition-colors"
                >
                  Browse Exams
                </Link>
              </li>
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h3 className="font-semibold mb-4">Legal</h3>
            <ul className="space-y-2">
              <li>
                <Link 
                  href="/terms" 
                  className="text-sm text-secondary-foreground hover:underline hover:text-background transition-colors"
                >
                  Terms of Service
                </Link>
              </li>
              <li>
                <Link 
                  href="/privacy" 
                  className="text-sm text-secondary-foreground hover:underline hover:text-background transition-colors"
                >
                  Privacy Policy
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="font-semibold mb-4">Get in Touch</h3>
            <ul className="space-y-3">
              <li className="flex items-start gap-2 text-sm text-secondary-foreground">
                <Mail className="h-4 w-4 mt-0.5 shrink-0" />
                <span>support@accurateexam.com</span>
              </li>
              <li className="flex items-start gap-2 text-sm text-secondary-foreground">
                <Phone className="h-4 w-4 mt-0.5 shrink-0" />
                <span>+1 (555) 123-4567</span>
              </li>
              <li className="flex items-start gap-2 text-sm text-secondary-foreground">
                <MapPin className="h-4 w-4 mt-0.5 shrink-0" />
                <span>123 Education St, Learning City</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-8 pt-8 border-t text-center">
          <p className="text-sm text-secondary-foreground">
            © {currentYear} AccurateExam. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  )
}
