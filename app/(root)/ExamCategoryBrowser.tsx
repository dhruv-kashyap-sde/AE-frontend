"use client"

import { useState, createElement } from "react"
import Link from "next/link"
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from "@/components/ui/input-group"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import {
  BookOpen,
  Building2,
  Train,
  Landmark,
  FileText,
  School,
  Shield,
  HeartPulse,
  Cog,
  Trophy,
  GraduationCap,
  Briefcase,
  ChevronRight,
  Menu,
  Search as SearchIcon,
  X as XIcon,
  FolderOpen,
} from "lucide-react"
import { LucideIcon } from "lucide-react"

// Map category titles to icons
const categoryIconMap: Record<string, LucideIcon> = {
  Bank: Building2,
  SSC: Landmark,
  Railway: Train,
  State: Briefcase,
  Other: FileText,
  Teaching: School,
  Insurance: Shield,
  Medical: HeartPulse,
  Engineering: Cog,
  Defence: Trophy,
  GATE: GraduationCap,
}

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

interface ExamCategoryBrowserProps {
  categories: Category[]
  exams: Exam[]
}

export default function ExamCategoryBrowser({
  categories,
  exams,
}: ExamCategoryBrowserProps) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [selectedCategory, setSelectedCategory] = useState<string>(
    categories[0]?.title || ""
  )
  const [searchQuery, setSearchQuery] = useState("")

  // Filter exams by selected category and search query
  const filteredExams = exams.filter((exam) => {
    const matchesCategory = exam.category.title === selectedCategory
    const matchesSearch = exam.title
      .toLowerCase()
      .includes(searchQuery.toLowerCase())
    return matchesCategory && matchesSearch
  })

  // Get icon for category
  const getCategoryIcon = (title: string): LucideIcon => {
    return categoryIconMap[title] || FolderOpen
  }

  // Get exam count for a category
  const getExamCount = (categoryTitle: string): number => {
    return exams.filter((exam) => exam.category.title === categoryTitle).length
  }

  return (
    <section className="py-20 bg-muted/50">
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
                  {categories.map((category) => {
                    const Icon = getCategoryIcon(category.title)
                    const count = getExamCount(category.title)
                    return (
                      <button
                        key={category._id}
                        onClick={() => setSelectedCategory(category.title)}
                        className={`w-full flex items-center gap-3 px-4 py-3 text-left transition-colors ${
                          selectedCategory === category.title
                            ? "bg-primary text-primary-foreground"
                            : "hover:bg-accent"
                        }`}
                      >
                        <Icon className="h-5 w-5 shrink-0" />
                        <span className="font-medium">
                          {category.title}
                          <span className="ml-1 opacity-70">({count})</span>
                        </span>
                        <ChevronRight
                          className={`h-4 w-4 ml-auto ${
                            selectedCategory === category.title
                              ? "opacity-100"
                              : "opacity-0"
                          }`}
                        />
                      </button>
                    )
                  })}
                </nav>
              </CardContent>
            </Card>
          </div>

          {/* Main Content */}
          <div className="flex-1">
            {/* Mobile Category Selector */}
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
                      {createElement(getCategoryIcon(selectedCategory), {
                        className: "h-5 w-5",
                      })}
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
                    {categories.map((category) => {
                      const Icon = getCategoryIcon(category.title)
                      const count = getExamCount(category.title)
                      return (
                        <button
                          key={category._id}
                          onClick={() => {
                            setSelectedCategory(category.title)
                            setIsMobileMenuOpen(false)
                          }}
                          className={`w-full flex items-center gap-3 px-4 py-3 text-left transition-colors rounded-lg ${
                            selectedCategory === category.title
                              ? "bg-primary text-primary-foreground"
                              : "hover:bg-accent"
                          }`}
                        >
                          <Icon className="h-5 w-5 shrink-0" />
                          <span className="font-medium">
                            {category.title}
                            <span className="ml-1 opacity-70">({count})</span>
                          </span>
                        </button>
                      )
                    })}
                  </nav>
                </SheetContent>
              </Sheet>
            </div>

            {/* Search Bar */}
            <InputGroup className="mb-6">
              <InputGroupInput
                type="text"
                placeholder="Search Tests..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              <InputGroupAddon>
                <SearchIcon className="h-4 w-4" />
              </InputGroupAddon>
              {searchQuery && (
                <InputGroupAddon
                  className="cursor-pointer"
                  onClick={() => setSearchQuery("")}
                  align="inline-end"
                >
                  <XIcon className="h-4 w-4 hover:bg-accent rounded-full" />
                </InputGroupAddon>
              )}
            </InputGroup>

            {/* Exam Cards Grid */}
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredExams.length > 0 ? (
                filteredExams.map((exam) => {
                  return (
                    <Link href={`exam/${exam.slug}`} key={exam._id}>
                    <Card className="group cursor-pointer hover:shadow-lg transition-all border-2 hover:border-primary h-full">
                      <CardHeader className="pb-3">
                        <div className="flex items-center gap-3">
                          <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                            <BookOpen className="h-6 w-6 text-primary" />
                          </div>
                          <div>
                            <CardTitle className="text-lg">{exam.title}</CardTitle>
                            <p className="text-sm text-muted-foreground">
                              {exam.totalBatches} {exam.totalBatches === 1 ? "batch" : "batches"} available
                            </p>
                          </div>
                        </div>
                      </CardHeader>
                      <CardContent className="pt-0">
                        <span className="text-sm text-muted-foreground group-hover:text-primary transition-colors">
                          View Batches →
                        </span>
                      </CardContent>
                    </Card>
                    </Link>
                  )
                })
              ) : (
                <div className="col-span-full text-center py-12">
                  <FileText className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <p className="text-lg text-muted-foreground">
                    {searchQuery
                      ? `No exams found matching "${searchQuery}"`
                      : "No exams available in this category"}
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
