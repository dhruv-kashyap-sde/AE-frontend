"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  ArrowLeft,
  Clock,
  HelpCircle,
  Minus,
  Star,
} from "lucide-react"
import Link from "next/link"
import JEEInstructions from "@/components/instructions/JeeInstructions"

interface TestItem {
  id: string
  title: string
  slug: string
  duration: number
  questionCount: number
  marksPerQuestion: number
  negativeMarking: boolean
  negativeMarkValue: number
  totalMarks: number
}

interface BatchInfo {
  id: string
  title: string
  slug: string
  contentType: string
  totalCount: number
  examTitle: string
  examSlug: string
}

interface BatchTestsClientProps {
  batch: BatchInfo
  tests: TestItem[]
}

export default function BatchTestsClient({
  batch,
  tests,
}: BatchTestsClientProps) {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-start gap-3">
        <Link href="/dashboard">
          <Button variant="ghost" size="icon" className="mt-0.5 shrink-0">
            <ArrowLeft className="h-5 w-5" />
          </Button>
        </Link>
        <div>
          <h1 className="text-2xl font-bold">{batch.title}</h1>
          <p className="text-sm text-muted-foreground">{batch.examTitle}</p>
        </div>
      </div>

      {/* Summary */}
      <div className="flex items-center gap-3 text-sm text-muted-foreground">
        <Badge variant="outline">{tests.length} Tests</Badge>
      </div>

      {/* Tests Grid */}
      {tests.length > 0 ? (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {tests.map((test) => (
            <TestCard key={test.id} test={test} />
          ))}
        </div>
      ) : (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <HelpCircle className="h-12 w-12 text-muted-foreground mb-3" />
            <h3 className="text-lg font-semibold mb-1">No Tests Available</h3>
            <p className="text-sm text-muted-foreground text-center max-w-sm">
              Tests for this batch haven&apos;t been added yet. Check back
              later — new tests appear automatically.
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  )
}

function TestCard({ test }: { test: TestItem }) {
  return (
    <>
    <Card className="transition-shadow hover:shadow-md flex flex-col">
      <CardHeader className="pb-3">
        <CardTitle className="text-base font-semibold leading-tight">
          {test.title}
        </CardTitle>
      </CardHeader>

      <CardContent className="flex-1 flex flex-col justify-between gap-4">
        {/* Details */}
        <div className="grid grid-cols-2 gap-y-2 text-sm">
          <div className="flex items-center gap-1.5 text-muted-foreground">
            <HelpCircle className="h-3.5 w-3.5" />
            <span>Questions</span>
          </div>
          <span className="text-right font-medium">{test.questionCount}</span>

          <div className="flex items-center gap-1.5 text-muted-foreground">
            <Clock className="h-3.5 w-3.5" />
            <span>Duration</span>
          </div>
          <span className="text-right font-medium">{test.duration} min</span>

          <div className="flex items-center gap-1.5 text-muted-foreground">
            <Star className="h-3.5 w-3.5" />
            <span>Total Marks</span>
          </div>
          <span className="text-right font-medium">{test.totalMarks}</span>

          {test.negativeMarking && (
            <>
              <div className="flex items-center gap-1.5 text-muted-foreground">
                <Minus className="h-3.5 w-3.5" />
                <span>Negative</span>
              </div>
              <span className="text-right font-medium text-destructive">
                -{test.negativeMarkValue}
              </span>
            </>
          )}
        </div>

        <JEEInstructions test={test} />
      </CardContent>
    </Card>
    </>
  )
}
