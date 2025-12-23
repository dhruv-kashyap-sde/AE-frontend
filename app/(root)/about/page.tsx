import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { CheckCircle2, Users, Target, Award } from "lucide-react"

export const metadata = {
  title: "About Us - AccurateExam",
  description: "Learn about AccurateExam's mission to provide quality exam preparation resources for students worldwide.",
}

export default function AboutPage() {
  const values = [
    {
      icon: Target,
      title: "Our Mission",
      description: "To empower students worldwide with comprehensive, accessible, and effective exam preparation tools that lead to academic success."
    },
    {
      icon: Users,
      title: "Our Community",
      description: "A thriving community of over 50,000 students who support and motivate each other towards achieving their academic goals."
    },
    {
      icon: Award,
      title: "Quality First",
      description: "Every test paper is crafted by subject matter experts and reviewed rigorously to ensure accuracy and relevance."
    },
    {
      icon: CheckCircle2,
      title: "Proven Results",
      description: "95% of our students report improved scores and confidence levels after using our platform consistently."
    },
  ]

  return (
    <div className="py-12 md:py-20">
      <div className="container mx-auto px-4">
        {/* Hero Section */}
        <div className="max-w-4xl mx-auto text-center mb-16 space-y-6">
          <h1 className="text-4xl md:text-5xl font-bold">
            About AccurateExam
          </h1>
          <p className="text-xl text-muted-foreground">
            Transforming exam preparation through technology and expertise
          </p>
        </div>

        {/* Story Section */}
        <div className="max-w-4xl mx-auto mb-20 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-2xl">Our Story</CardTitle>
            </CardHeader>
            <CardContent className="prose prose-lg max-w-none">
              <p className="text-muted-foreground leading-relaxed">
                AccurateExam was founded in 2020 with a simple yet powerful vision: to make quality exam preparation accessible to every student, regardless of their location or background. We recognized that students needed more than just study materials – they needed realistic practice, detailed feedback, and a clear path to improvement.
              </p>
              <p className="text-muted-foreground leading-relaxed">
                Today, we're proud to serve over 50,000 active students preparing for various competitive exams. Our platform offers more than 1,000 carefully curated mock tests across 50+ exam categories, all designed to mirror real exam patterns and difficulty levels.
              </p>
              <p className="text-muted-foreground leading-relaxed">
                What sets us apart is our commitment to continuous improvement. We regularly update our question banks, incorporate student feedback, and leverage advanced analytics to provide personalized learning experiences. Our success is measured not just in numbers, but in the countless success stories of students who achieved their dreams with our support.
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Values Grid */}
        <div className="mb-20">
          <h2 className="text-3xl font-bold text-center mb-12">What We Stand For</h2>
          <div className="grid md:grid-cols-2 gap-6">
            {values.map((value, index) => (
              <Card key={index} className="border-2">
                <CardHeader>
                  <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                    <value.icon className="h-6 w-6 text-primary" />
                  </div>
                  <CardTitle className="text-xl">{value.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">{value.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Stats Section */}
        <Card className="bg-linear-to-br from-primary to-primary/80 text-primary-foreground">
          <CardContent className="py-12">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
              <div>
                <div className="text-4xl font-bold mb-2">2020</div>
                <div className="text-primary-foreground/80">Founded</div>
              </div>
              <div>
                <div className="text-4xl font-bold mb-2">50K+</div>
                <div className="text-primary-foreground/80">Students</div>
              </div>
              <div>
                <div className="text-4xl font-bold mb-2">1000+</div>
                <div className="text-primary-foreground/80">Mock Tests</div>
              </div>
              <div>
                <div className="text-4xl font-bold mb-2">50+</div>
                <div className="text-primary-foreground/80">Categories</div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
