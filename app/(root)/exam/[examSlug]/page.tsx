/**
 * Exam Detail Page
 * 
 * Shows all available batches for a specific exam.
 * Users can see batch details and navigate to purchase or view contents.
 */

import React from "react"
import { notFound } from "next/navigation"
import Link from "next/link"
import Image from "next/image"
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { getExamBySlug } from "@/lib/models/exam"
import { getBatchesByExam } from "@/lib/models/batch"
import { formatDurationFromMonths } from "@/lib/utils"
import {
  BookOpen,
  FileText,
  Clock,
  IndianRupee,
  ArrowRight,
  Eye,
  Calendar,
} from "lucide-react"
import BuyBatchButton from "@/components/BuyBatchButton"

interface PageProps {
  params: Promise<{ examSlug: string }>
}

export default async function ExamPage({ params }: PageProps) {
  const { examSlug } = await params

  // Fetch exam by slug
  const exam = await getExamBySlug(examSlug)

  if (!exam) {
    notFound()
  }

  const examId = exam._id.toString()

  // Fetch all batches for this exam
  const batches = await getBatchesByExam(examId)

  // Serialize batches for rendering
  const serializedBatches = batches.map((batch) => ({
    _id: batch._id.toString(),
    title: batch.title,
    slug: batch.slug,
    price: batch.price,
    originalPrice: batch.originalPrice,
    expiry: batch.expiry ?? null,
    contentType: batch.contentType,
    totalCount: batch.totalCount,
    description: batch.description,
  }))

  // Calculate discount percentage
  const getDiscount = (price: number, originalPrice: number) => {
    if (originalPrice <= price) return 0
    return Math.round(((originalPrice - price) / originalPrice) * 100)
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header Section */}
      <div className="bg-linear-to-r from-primary/10 via-primary/5 to-background border-b">
        <div className="container mx-auto px-4 py-8">
          {/* Breadcrumb */}
          <Breadcrumb className="mb-6">
            <BreadcrumbList>
              <BreadcrumbItem>
                <BreadcrumbLink href="/">Home</BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbPage>{exam.title}</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>

          {/* Exam Title with Icon */}
          <div className="flex items-center gap-4">
            <div className="h-16 w-16 md:h-20 md:w-20 rounded-full bg-primary/20 flex items-center justify-center shrink-0">
              {exam.imageURL ? (
                <Image
                  src={exam.imageURL}
                  alt={exam.title}
                  width={80}
                  height={80}
                  className="rounded-full object-cover"
                />
              ) : (
                <BookOpen className="h-8 w-8 md:h-10 md:w-10 text-primary" />
              )}
            </div>
            <div>
              <h1 className="text-2xl md:text-4xl font-bold">{exam.title}</h1>
              <p className="text-muted-foreground mt-1">
                {serializedBatches.length} {serializedBatches.length === 1 ? "batch" : "batches"} available
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Batches Grid */}
      <div className="container mx-auto px-4 py-8">
        {serializedBatches.length > 0 ? (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {serializedBatches.map((batch) => {
              const discount = getDiscount(batch.price, batch.originalPrice)
              const isTest = batch.contentType === "test"

              return (
                <Card
                  key={batch._id}
                  className="group relative hover:shadow-xl transition-all duration-300 border overflow-hidden  bg-linear-to-b from-primary/10 to-background"
                >
                  {/* Badge for NEW or Discount */}
                  {discount > 0 && (
                    <div className="absolute top-3 right-3 z-10">
                      <Badge className="bg-green-500 hover:bg-green-600 text-white">
                        {discount}% OFF
                      </Badge>
                    </div>
                  )}

                  <CardHeader className="pb-3">
                    <div className="flex items-start gap-3">
                      <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                        {isTest ? (
                          <BookOpen className="h-6 w-6 text-primary" />
                        ) : (
                          <FileText className="h-6 w-6 text-primary" />
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <CardTitle className="text-lg leading-tight">
                          {batch.title}
                        </CardTitle>
                        <Badge variant="secondary" className="mt-1">
                          {isTest ? "Practice Tests" : "Study Materials"}
                        </Badge>
                      </div>
                    </div>
                  </CardHeader>

                  <CardContent className="space-y-4">
                    {/* Description */}
                    {batch.description && (
                      <p className="text-sm text-muted-foreground line-clamp-2">
                        {batch.description}
                      </p>
                    )}

                    {/* Stats */}
                    <div className="flex flex-wrap gap-3 text-sm text-muted-foreground">
                      <div className="flex items-center gap-1">
                        {isTest ? (
                          <BookOpen className="h-4 w-4" />
                        ) : (
                          <FileText className="h-4 w-4" />
                        )}
                        <span>
                          {batch.totalCount} {isTest ? "Tests" : "Files"}
                        </span>
                      </div>
                      {batch.expiry !== null && (
                        <div className="flex items-center gap-1">
                          <Calendar className="h-4 w-4" />
                          <span>Validity {formatDurationFromMonths(batch.expiry)}</span>
                        </div>
                      )}
                    </div>

                    <Separator />

                    {/* Pricing */}
                    <div className="flex items-baseline gap-2">
                      <span className="text-2xl font-bold text-primary flex items-center">
                        <IndianRupee className="h-5 w-5" />
                        {batch.price.toLocaleString("en-IN")}
                      </span>
                      {batch.originalPrice > batch.price && (
                        <span className="text-sm text-muted-foreground line-through flex items-center">
                          <IndianRupee className="h-3 w-3" />
                          {batch.originalPrice.toLocaleString("en-IN")}
                        </span>
                      )}
                    </div>

                    {/* Action Buttons */}
                    <div className="flex gap-2 pt-2">
                      <BuyBatchButton
                        batchId={batch._id}
                        price={batch.price}
                        className="flex-1"
                        size="sm"
                      />
                      <Button variant="outline" size="sm" asChild>
                        <Link href={`/exam/${examSlug}/${batch.slug}`}>
                          <Eye className="h-4 w-4 mr-2" />
                          View
                        </Link>
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              )
            })}
          </div>
        ) : (
          <div className="text-center py-16">
            <BookOpen className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-xl font-semibold mb-2">No Batches Available</h3>
            <p className="text-muted-foreground mb-6">
              Check back later for new batches and test series.
            </p>
            <Button asChild>
              <Link href="/">
                <ArrowRight className="h-4 w-4 mr-2" />
                Browse Other Exams
              </Link>
            </Button>
          </div>
        )}
      </div>
    </div>
  )
}
