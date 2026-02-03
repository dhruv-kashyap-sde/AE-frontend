"use client";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from "@/components/ui/input-group";
import {
  BookOpen,
  Target,
  Trophy,
  Users,
  CheckCircle2,
  Clock,
  BarChart3,
  Sparkles,
  GraduationCap,
  Shield,
  Zap,
  Building2,
  Train,
  Landmark,
  FileText,
  School,
  HeartPulse,
  Cog,
  Briefcase,
  ChevronRight,
  Menu,
  SearchIcon,
  XIcon,
} from "lucide-react";
import Image from "next/image";
import logoImage from "@/public/logo.jpg";
import TestPaperCarousel from "@/components/TestPaperCarousel";

interface Category {
  _id: string
  title: string
  imageURL: string | null
}

interface Exam {
  _id: string
  title: string
  slug: string
  imageURL: string | null
  totalBatches: number
  category: {
    _id: string
    title: string
  }
}

interface FeaturedBatch {
  _id: string
  id: string
  title: string
  slug: string
  price: number
  originalPrice: number
  expiry: number | null
  contentType: "test" | "file"
  totalCount: number
  description: string | null
  exam: {
    _id: string
    id: string
    title: string
    slug: string
    imageURL: string | null
  }
}

interface HomePageClientProps {
  categories: Category[]
  exams: Exam[]
  featuredBatches: FeaturedBatch[]
}

// Import the ExamCategoryBrowser component dynamically to avoid hydration issues
import dynamic from "next/dynamic"
const ExamCategoryBrowser = dynamic(() => import("./ExamCategoryBrowser"), {
  ssr: false,
})

export default function HomePageClient({ categories, exams, featuredBatches }: HomePageClientProps) {
  const features = [
    {
      icon: Target,
      title: "Targeted Practice",
      description: "Focus on your weak areas with personalized practice tests",
    },
    {
      icon: BarChart3,
      title: "Detailed Analytics",
      description: "Track your progress with comprehensive performance reports",
    },
    {
      icon: Clock,
      title: "Timed Tests",
      description:
        "Experience real exam conditions with time-bound assessments",
    },
    {
      icon: Shield,
      title: "Quality Content",
      description: "Curated by experts and updated regularly for accuracy",
    },
  ];

  const stats = [
    { value: "50K+", label: "Active Students" },
    { value: "1000+", label: "Mock Tests" },
    { value: "95%", label: "Success Rate" },
    { value: "50+", label: "Exam Categories" },
  ];

  return (
    <>
      {/* Hero Section */}
      <section className="relative py-5 lg:py-28 overflow-hidden">

        <div className="absolute inset-0 bg-primary/10 " />
        <div className="container mx-auto px-4 relative z-10">
          <div className="flex flex-col lg:flex-row-reverse justify-between">
            <Image
              src={logoImage}
              alt="Hero Image"
              className="rounded-full drop-shadow-2xl  mb-5 mx-auto lg:mx-0 w-48 h-48 lg:w-96 lg:h-96 object-cover"
              // width={600}
              // height={400}
            />
            <div className="max-w-4xl flex flex-col items-center lg:items-start space-y-6">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-medium">
                <Sparkles className="h-4 w-4" />
                <span>Trusted by 50,000+ students in India</span>
              </div>

              <h1 className="text-3xl text-center  lg:text-left md:text-4xl font-bold tracking-tight">
                Practice hard with <br />
                <span className="gradient-text text-5xl text-nowrap"> Accurate Exam</span>
              </h1>

              <p className="text-center lg:text-left text-muted-foreground max-w-2xl">
                Access thousands of high-quality mock tests, practice papers,
                and detailed solutions. Prepare smart, score high, and achieve
                your dreams.
              </p>
              <section className="flex flex-col gap-4 w-full max-w-md px-4 lg:px-0">
                <InputGroup>
                  <InputGroupInput placeholder="Search Tests..." />
                  <InputGroupAddon>
                    <SearchIcon />
                  </InputGroupAddon>
                  <InputGroupAddon align="inline-end">
                    <XIcon />
                  </InputGroupAddon>
                </InputGroup>
                <div className="grid grid-cols-2 gap-4">
                  <Button asChild>
                    <Link href="/signup">Explore Tests</Link>
                  </Button>
                  <Button asChild variant="secondary">
                    <Link href="/about">Learn More</Link>
                  </Button>
                </div>
              </section>
            </div>
          </div>
          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 pt-12">
            {stats.map((stat, index) => (
              <div key={index} className="text-center space-y-1">
                <div className="text-3xl md:text-4xl font-bold text-primary">
                  {stat.value}
                </div>
                <div className="text-sm text-muted-foreground">
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Test Paper Carousel */}
      <section className="py-10  ">
        <div className="container mx-auto px-4">
          <div className="text-center text-foreground max-w-3xl mx-auto mb-12 space-y-4">
            <h2 className="text-3xl md:text-4xl font-bold text-primary">
              Featured Practice Sets
            </h2>
            <p className="text-lg text- dark:text-foreground">
              Explore our most popular mock tests and practice papers
            </p>
          </div>
          <TestPaperCarousel featuredBatches={featuredBatches} />
        </div>
      </section>

      {/* Exam Categories - Dynamic */}
      <ExamCategoryBrowser categories={categories} exams={exams} />

      {/* Features Section */}
      <section className="py-20 ">
        <div className="container mx-auto px-4">
          <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
            <h2 className="text-3xl md:text-4xl font-bold">
              Why Choose AccurateExam?
            </h2>
            <p className="text-lg text-muted-foreground">
              We provide everything you need to excel in your exams with
              confidence
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((feature, index) => (
              <Card
                key={index}
                className="border-2 bg-accent hover:border-primary transition-colors"
              >
                <CardHeader>
                  <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                    <feature.icon className="h-6 w-6 text-primary" />
                  </div>
                  <CardTitle className="text-xl">{feature.title}</CardTitle>
                  <CardDescription className="text-base">
                    {feature.description}
                  </CardDescription>
                </CardHeader>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-20 bg-muted/50">
        <div className="container mx-auto px-4">
          <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
            <h2 className="text-3xl md:text-4xl font-bold">
              Simple, Effective Preparation
            </h2>
            <p className="text-lg text-muted-foreground">
              Get started in just three simple steps
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            <div className="text-center space-y-4">
              <div className="h-16 w-16 rounded-full bg-primary text-primary-foreground mx-auto flex items-center justify-center text-2xl font-bold">
                1
              </div>
              <h3 className="text-xl font-semibold">Choose Your Exam</h3>
              <p className="text-muted-foreground">
                Select from our extensive library of exam categories
              </p>
            </div>

            <div className="text-center space-y-4">
              <div className="h-16 w-16 rounded-full bg-primary text-primary-foreground mx-auto flex items-center justify-center text-2xl font-bold">
                2
              </div>
              <h3 className="text-xl font-semibold">Take Mock Tests</h3>
              <p className="text-muted-foreground">
                Practice with real exam-like timed assessments
              </p>
            </div>

            <div className="text-center space-y-4">
              <div className="h-16 w-16 rounded-full bg-primary text-primary-foreground mx-auto flex items-center justify-center text-2xl font-bold">
                3
              </div>
              <h3 className="text-xl font-semibold">Analyze & Improve</h3>
              <p className="text-muted-foreground">
                Review detailed reports and enhance your performance
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <Card className="bg-linear-to-br from-primary to-ring border-0 text-primary-foreground">
            <CardHeader className="text-center space-y-6 py-12">
              <CardTitle className="text-3xl md:text-4xl font-bold">
                Ready to Ace Your Exams?
              </CardTitle>
              <CardDescription className="text-lg text-primary-foreground/90 max-w-2xl mx-auto">
                Join thousands of successful students who have achieved their
                goals with AccurateExam. Start your free trial today!
              </CardDescription>
              <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
                <Link href="/signup">
                  <Button
                    size="lg"
                    variant="secondary"
                    className="text-base px-8 hover:border-background hover:text-background"
                  >
                    Get Started Free
                  </Button>
                </Link>
                <Link href="/contact">
                  <Button
                    size="lg"
                    variant="outline"
                    className="text-base px-8 bg-transparent border-primary-foreground text-primary-foreground hover:text-background hover:bg-primary-foreground/10"
                  >
                    Contact Sales
                  </Button>
                </Link>
              </div>
            </CardHeader>
          </Card>
        </div>
      </section>
    </>
  );
}