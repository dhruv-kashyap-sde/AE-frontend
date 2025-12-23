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
  InputGroupButton,
  InputGroupInput,
  InputGroupText,
  InputGroupTextarea,
} from "@/components/ui/input-group";
import { Input } from "@/components/ui/input";
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
  Search,
  Menu,
  X,
  SearchIcon,
  XIcon,
} from "lucide-react";
import Image from "next/image";
import logoImage from "@/public/logo.jpg";
import { useState, createElement } from "react";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import TestPaperCarousel from "@/components/TestPaperCarousel";

export default function HomePage() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState("Bank");
  const [searchQuery, setSearchQuery] = useState("");

  const categories = [
    { id: "Bank", name: "Bank", icon: Building2 },
    { id: "SSC", name: "SSC", icon: Landmark },
    { id: "Railway", name: "Railway", icon: Train },
    { id: "State", name: "State", icon: Briefcase },
    { id: "Other", name: "Other", icon: FileText },
    { id: "Teaching", name: "Teaching", icon: School },
    { id: "Insurance", name: "Insurance", icon: Shield },
    { id: "Medical", name: "Medical", icon: HeartPulse },
    { id: "Engineering", name: "Engineering", icon: Cog },
    { id: "Defence", name: "Defence", icon: Trophy },
    { id: "GATE", name: "GATE", icon: GraduationCap },
  ];

  const exams = {
    Bank: [
      { name: "RRB NTPC", category: "Bank" },
      { name: "RRB Group-D", category: "Bank" },
      { name: "RRB JE", category: "Bank" },
      { name: "RRB ALP", category: "Bank" },
      { name: "RPF SI", category: "Bank" },
      { name: "RPF Constable", category: "Bank" },
      { name: "RRB Technician", category: "Bank" },
    ],
    SSC: [
      { name: "SSC CGL", category: "SSC" },
      { name: "SSC CHSL", category: "SSC" },
      { name: "SSC MTS", category: "SSC" },
      { name: "SSC CPO", category: "SSC" },
    ],
    Railway: [
      { name: "Railway RRB", category: "Railway" },
      { name: "Railway Group D", category: "Railway" },
      { name: "Railway ALP", category: "Railway" },
    ],
    State: [
      { name: "State PSC", category: "State" },
      { name: "State Police", category: "State" },
    ],
    Other: [
      { name: "UPSC", category: "Other" },
      { name: "Banking", category: "Other" },
    ],
    Teaching: [
      { name: "CTET", category: "Teaching" },
      { name: "UPTET", category: "Teaching" },
    ],
    Insurance: [
      { name: "LIC AAO", category: "Insurance" },
      { name: "NIACL", category: "Insurance" },
    ],
    Medical: [
      { name: "NEET", category: "Medical" },
      { name: "AIIMS", category: "Medical" },
    ],
    Engineering: [
      { name: "JEE Main", category: "Engineering" },
      { name: "JEE Advanced", category: "Engineering" },
    ],
    Defence: [
      { name: "NDA", category: "Defence" },
      { name: "CDS", category: "Defence" },
    ],
    GATE: [
      { name: "GATE CSE", category: "GATE" },
      { name: "GATE ECE", category: "GATE" },
    ],
  };

  const filteredExams = (
    exams[selectedCategory as keyof typeof exams] || []
  ).filter((exam: { name: string; category: string }) =>
    exam.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

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
        <div className="absolute inset-0 bg-linear-to-r from-blue-100 to-background" />
        <div className="container mx-auto px-4 relative z-10">
          <div className="flex flex-col lg:flex-row-reverse justify-between">
            <Image
              src={logoImage}
              alt="Hero Image"
              className="rounded-full md:rounded-lg mb-5 mx-auto lg:mx-0 w-48 h-48 lg:w-96 lg:h-96 object-cover"
              // width={600}
              // height={400}
            />
            <div className="max-w-4xl flex flex-col items-center lg:items-start space-y-6">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-medium">
                <Sparkles className="h-4 w-4" />
                <span>Trusted by 50,000+ students in India</span>
              </div>

              <h1 className="text-5xl text-center lg:text-left md:text-6xl font-bold tracking-tight">
                Practice hard with <br />
                <span className="gradient-text"> Accurate Exam</span>
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

      {/* Features Section */}
      <section className="py-20 bg-muted/50">
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

      {/* Exam Categories with Sidebar */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="text-center max-w-3xl mx-auto mb-12 space-y-4">
            <h2 className="text-3xl md:text-4xl font-bold">
              Browse by Exam Category
            </h2>
            <p className="text-lg text-muted-foreground">
              Find mock tests tailored for your specific exam preparation needs
            </p>
          </div>

          <div className="flex gap-6">
            {/* Desktop Sidebar */}
            <div className="hidden lg:block w-64 shrink-0">
              <Card className="sticky top-4">
                <CardHeader>
                  <CardTitle className="text-lg">Categories</CardTitle>
                </CardHeader>
                <CardContent className="p-0">
                  <nav className="space-y-1">
                    {categories.map((category) => (
                      <button
                        key={category.id}
                        onClick={() => setSelectedCategory(category.id)}
                        className={`w-full flex items-center gap-3 px-4 py-3 text-left transition-colors ${
                          selectedCategory === category.id
                            ? "bg-primary text-primary-foreground"
                            : "hover:bg-accent"
                        }`}
                      >
                        <category.icon className="h-5 w-5 shrink-0" />
                        <span className="font-medium">{category.name}</span>
                        <ChevronRight
                          className={`h-4 w-4 ml-auto ${
                            selectedCategory === category.id
                              ? "opacity-100"
                              : "opacity-0"
                          }`}
                        />
                      </button>
                    ))}
                  </nav>
                </CardContent>
              </Card>
            </div>

            {/* Main Content */}
            <div className="flex-1">
              {/* Mobile Category Selector & Search */}
              <div className="lg:hidden mb-6 space-y-4">
                <Sheet
                  open={isMobileMenuOpen}
                  onOpenChange={setIsMobileMenuOpen}
                >
                  <SheetTrigger asChild>
                    <Button
                      variant="outline"
                      className="w-full justify-between"
                    >
                      <span className="flex items-center gap-2">
                        {createElement(
                          categories.find((c) => c.id === selectedCategory)
                            ?.icon || FileText,
                          { className: "h-5 w-5" }
                        )}
                        {selectedCategory}
                      </span>
                      <Menu className="h-5 w-5" />
                    </Button>
                  </SheetTrigger>
                  <SheetContent side="left" className="w-70 p-0">
                    <div className="py-6 px-4 border-b">
                      <h2 className="text-lg font-semibold">Categories</h2>
                    </div>
                    <nav className="space-y-1 p-2">
                      {categories.map((category) => (
                        <button
                          key={category.id}
                          onClick={() => {
                            setSelectedCategory(category.id);
                            setIsMobileMenuOpen(false);
                          }}
                          className={`w-full flex items-center gap-3 px-4 py-3 text-left transition-colors rounded-lg ${
                            selectedCategory === category.id
                              ? "bg-primary text-primary-foreground"
                              : "hover:bg-accent"
                          }`}
                        >
                          <category.icon className="h-5 w-5 shrink-0" />
                          <span className="font-medium">{category.name}</span>
                        </button>
                      ))}
                    </nav>
                  </SheetContent>
                </Sheet>
              </div>

              {/* Search Bar */}
              {/* <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                <Input
                  type="text"
                  placeholder="Search exams..."
                  
                  className="pl-10 h-12 text-base"
                />
                
              </div> */}
               <InputGroup className=" mb-6">
                  <InputGroupInput 
                  type="text"
                  placeholder="Search Tests..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  />
                  <InputGroupAddon>
                    <SearchIcon />
                  </InputGroupAddon>
                  {searchQuery && (<InputGroupAddon className="cursor-pointer" onClick={() => setSearchQuery('')} align="inline-end">
                    <XIcon className="hover:bg-accent rounded-full"/>
                  </InputGroupAddon>)}
                </InputGroup>

              {/* Exam Cards Grid */}
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {filteredExams.length > 0 ? (
                  filteredExams.map(
                    (
                      exam: { name: string; category: string },
                      index: number
                    ) => (
                      <Card
                        key={index}
                        className="group cursor-pointer hover:shadow-lg transition-all border-2 hover:border-primary"
                      >
                        <CardHeader className="pb-3">
                          <div className="flex items-center gap-3">
                            <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                              <BookOpen className="h-6 w-6 text-primary" />
                            </div>
                            <CardTitle className="text-lg">
                              {exam.name}
                            </CardTitle>
                          </div>
                        </CardHeader>
                        <CardContent className="pt-0">
                          <Link
                            href={`exam/${exam.name}`}
                            className="w-full group-hover:text-primary"
                          >
                            View Tests →
                          </Link>
                        </CardContent>
                      </Card>
                    )
                  )
                ) : (
                  <div className="col-span-full text-center py-12">
                    <FileText className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                    <p className="text-lg text-muted-foreground">
                      No exams found matching "{searchQuery}"
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Test Paper Carousel */}
      <section className="py-10 bg-primary/80">
        <div className="container mx-auto px-4">
          <div className="text-center text-primary-foreground max-w-3xl mx-auto mb-12 space-y-4">
            <h2 className="text-3xl md:text-4xl font-bold">
              Featured Test Papers
            </h2>
            <p className="text-lg text-muted">
              Explore our most popular mock tests and practice papers
            </p>
          </div>
          <TestPaperCarousel />
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
