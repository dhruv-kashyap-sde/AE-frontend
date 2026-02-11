/**
 * Batch Detail Page
 * 
 * Shows all available tests or files within a specific batch.
 * Displays content based on batch type (tests or files).
 */

import React from "react"
import { notFound } from "next/navigation"
import Link from "next/link"
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
import { getBatchBySlug } from "@/lib/models/batch"
import { getTestsByBatch } from "@/lib/models/test"
import { getFilesByBatch } from "@/lib/models/batchFile"
import { formatDurationFromMonths } from "@/lib/utils"
import {
  BookOpen,
  FileText,
  Clock,
  HelpCircle,
  ArrowRight,
  Download,
  Play,
  IndianRupee,
  Calendar,
  Lock,
  ShoppingCart,
  FileIcon,
  File,
} from "lucide-react"
import Image from "next/image"

interface PageProps {
  params: Promise<{ examSlug: string; batchSlug: string }>
}

export default async function BatchPage({ params }: PageProps) {
  const { examSlug, batchSlug } = await params

  // Fetch exam by slug
  const exam = await getExamBySlug(examSlug)

  if (!exam) {
    notFound()
  }

  const examId = exam._id.toString()

  // Fetch batch by slug
  const batch = await getBatchBySlug(examId, batchSlug)

  if (!batch) {
    notFound()
  }

  const batchId = batch._id.toString()
  const isTestBatch = batch.contentType === "test"

  // Fetch tests or files based on batch type
  let tests: Array<{
    _id: string
    title: string
    slug: string
    questionCount: number
    duration: number
    marksPerQuestion: number
    negativeMarking: boolean
    negativeMarkValue: number
  }> = []

  let files: Array<{
    _id: string
    title: string
    fileType: string
    fileSize: number
  }> = []

  if (isTestBatch) {
    const rawTests = await getTestsByBatch(batchId)
    tests = rawTests.map((test) => ({
      _id: test._id.toString(),
      title: test.title,
      slug: test.slug,
      questionCount: test.questionCount,
      duration: test.duration,
      marksPerQuestion: test.marksPerQuestion,
      negativeMarking: test.negativeMarking,
      negativeMarkValue: test.negativeMarkValue,
    }))
  } else {
    const rawFiles = await getFilesByBatch(batchId)
    files = rawFiles.map((file) => ({
      _id: file._id.toString(),
      title: file.title,
      fileType: file.fileType,
      fileSize: file.fileSize,
    }))
  }

  // Format file size
  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return "0 Bytes"
    const k = 1024
    const sizes = ["Bytes", "KB", "MB", "GB"]
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i]
  }

  // Get file icon based on type
  const getFileIcon = (type: string) => {
    switch (type) {
      case "pdf":
        return <FileText className="h-6 w-6 text-red-500" />
      case "image":
        return <FileIcon className="h-6 w-6 text-green-500" />
      case "document":
        return <File className="h-6 w-6 text-blue-500" />
      default:
        return <FileText className="h-6 w-6 text-gray-500" />
    }
  }

  // Calculate discount
  const discount = batch.originalPrice > batch.price
    ? Math.round(((batch.originalPrice - batch.price) / batch.originalPrice) * 100)
    : 0

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
                <BreadcrumbLink href={`/exam/${examSlug}`}>
                  {exam.title}
                </BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbPage>{batch.title}</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>

          {/* Batch Title with Info */}
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div className="flex items-center gap-4">
              {/* <div className="h-16 w-16 md:h-20 md:w-20 rounded-full bg-primary/20 flex items-center justify-center shrink-0">
                
              </div> */}
              <Image src={exam.imageURL || "/default-exam.png"} alt={exam.title} width={80} height={80} />
              <div>
                <h1 className="text-2xl md:text-4xl font-bold">{batch.title}</h1>
                <div className="flex flex-wrap items-center gap-3 mt-2">
                  <Badge variant="secondary">
                    {isTestBatch ? "Practice Tests" : "Study Materials"}
                  </Badge>
                  <span className="text-muted-foreground text-sm">
                    {isTestBatch
                      ? `${tests.length} Tests`
                      : `${files.length} Files`}
                  </span>
                </div>
              </div>
            </div>

            {/* Price & Buy Section */}
            <Card className="md:w-auto shadow">
              <CardContent className="px-4">
                <div className="flex items-center justify-between gap-4 ">
                  <div>
                    <div className="flex items-baseline gap-2">
                      <span className="text-2xl font-bold text-primary flex items-center">
                        <IndianRupee className="h-5 w-5" />
                        {batch.price.toLocaleString("en-IN")}
                      </span>
                      {discount > 0 && (
                        <>
                          <span className="text-sm text-muted-foreground line-through flex items-center">
                            <IndianRupee className="h-3 w-3" />
                            {batch.originalPrice.toLocaleString("en-IN")}
                          </span>
                          <Badge className="bg-green-500 text-white">
                            {discount}% OFF
                          </Badge>
                        </>
                      )}
                    </div>
                    {batch.expiry !== null && (
                      <p className="text-xs text-muted-foreground flex items-center gap-1 mt-1">
                        <Calendar className="h-3 w-3" />
                        Validity {formatDurationFromMonths(batch.expiry)}
                      </p>
                    )}
                  </div>
                  <Button size="lg">
                    <ShoppingCart className="h-4 w-4 mr-2" />
                    Buy Now
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Description */}
          {batch.description && (
            <p className="text-muted-foreground mt-4 max-w-3xl">
              {batch.description}
            </p>
          )}
        </div>
      </div>

      {/* Content Grid */}
      <div className="container mx-auto px-4 py-8">
        <h2 className="text-xl font-semibold mb-6">
          {isTestBatch ? "Available Tests" : "Available Files"}
        </h2>

        {isTestBatch ? (
          // Tests Grid
          tests.length > 0 ? (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {tests.map((test, index) => (
                <Card
                  key={test._id}
                  className="group hover:shadow-lg transition-all duration-300 border"
                >
                  <CardHeader className="pb-2">
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-3">
                        <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center text-primary font-semibold">
                          {index + 1}
                        </div>
                        <CardTitle className="text-base">{test.title}</CardTitle>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    {/* Test Stats */}
                    <div className="flex flex-wrap gap-x-4 gap-y-2 text-sm text-muted-foreground">
                      <p className="flex items-center gap-1">
                        <HelpCircle className="h-4 w-4" />
                        <span>{test.questionCount} Questions</span>
                      </p>
                      <p className="flex items-center gap-1">
                        <Clock className="h-4 w-4" />
                        <span>{test.duration} min</span>
                      </p>
                    </div>

                    <div className="text-xs text-muted-foreground">
                      {test.marksPerQuestion} marks/Q
                      {test.negativeMarking && ` • -${test.negativeMarkValue} negative`}
                    </div>

                    <Separator />

                    {/* Action Button */}
                    <Button
                      variant="outline"
                      className="w-full hover:bg-primary hover:text-primary-foreground"
                      disabled
                    >
                      <Lock className="h-4 w-4 mr-2" />
                      Purchase to Access
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <div className="text-center py-16">
              <BookOpen className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-xl font-semibold mb-2">No Tests Available</h3>
              <p className="text-muted-foreground">
                Tests will be added soon. Please check back later.
              </p>
            </div>
          )
        ) : (
          // Files Grid
          files.length > 0 ? (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {files.map((file, index) => (
                <Card
                  key={file._id}
                  className="group hover:shadow-lg transition-all duration-300 border hover:border-primary"
                >
                  <CardHeader className="pb-2">
                    <div className="flex items-center gap-3">
                      <div className="h-12 w-12 rounded-lg bg-muted flex items-center justify-center">
                        {getFileIcon(file.fileType)}
                      </div>
                      <div className="flex-1 min-w-0">
                        <CardTitle className="text-base truncate">
                          {file.title}
                        </CardTitle>
                        <p className="text-xs text-muted-foreground mt-1">
                          {formatFileSize(file.fileSize)} • {file.fileType.toUpperCase()}
                        </p>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <Button
                      variant="outline"
                      className="w-full group-hover:bg-primary group-hover:text-primary-foreground"
                      disabled
                    >
                      <Lock className="h-4 w-4 mr-2" />
                      Purchase to Download
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <div className="text-center py-16">
              <FileText className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-xl font-semibold mb-2">No Files Available</h3>
              <p className="text-muted-foreground">
                Files will be added soon. Please check back later.
              </p>
            </div>
          )
        )}
      </div>
    </div>
  )
}
