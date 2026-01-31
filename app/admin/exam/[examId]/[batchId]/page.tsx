/**
 * Batch Content Management Page (Server Component)
 * 
 * Displays either tests or files based on the batch's contentType.
 * Fetches data server-side and passes to client components.
 */

import React from "react"
import { notFound } from "next/navigation"
import { Separator } from "@/components/ui/separator"
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"
import { getBatchById, getBatchBySlug } from "@/lib/models/batch"
import { getExamById, getExamBySlug } from "@/lib/models/exam"
import { getTestsByBatch } from "@/lib/models/test"
import { getFilesByBatch } from "@/lib/models/batchFile"
import TestManagementClient from "./TestManagementClient"
import FileManagementClient from "./FileManagementClient"
import mongoose from "mongoose"

// Helper to check if string is a valid MongoDB ObjectId
function isValidObjectId(id: string): boolean {
  return mongoose.Types.ObjectId.isValid(id) && new mongoose.Types.ObjectId(id).toString() === id
}

interface PageProps {
  params: Promise<{ examId: string; batchId: string }>
}

export default async function BatchContentPage({ params }: PageProps) {
  const { examId, batchId } = await params

  // Fetch exam - try by ID first, then by slug
  const exam = isValidObjectId(examId)
    ? await getExamById(examId)
    : await getExamBySlug(examId)

  // Handle not found cases
  if (!exam) {
    notFound()
  }

  // Get the actual exam ID for further queries
  const actualExamId = exam._id.toString()

  // Fetch batch - try by ID first, then by slug
  const batch = isValidObjectId(batchId)
    ? await getBatchById(batchId)
    : await getBatchBySlug(actualExamId, batchId)

  if (!batch) {
    notFound()
  }

  // Get the actual batch ID for further queries
  const actualBatchId = batch._id.toString()

  // Verify batch belongs to this exam (only needed if fetched by ID)
  if (batch.exam.toString() !== actualExamId) {
    notFound()
  }

  // Fetch content based on batch type
  let tests: any[] = []
  let files: any[] = []

  if (batch.contentType === "test") {
    tests = await getTestsByBatch(actualBatchId)
  } else {
    files = await getFilesByBatch(actualBatchId)
  }

  // Serialize data for client components
  const serializedTests = tests.map((test) => ({
    _id: test._id.toString(),
    title: test.title,
    slug: test.slug,
    marksPerQuestion: test.marksPerQuestion,
    negativeMarking: test.negativeMarking,
    negativeMarkValue: test.negativeMarkValue,
    duration: test.duration,
    questionCount: test.questionCount,
    createdAt: test.createdAt?.toISOString() || new Date().toISOString(),
  }))

  const serializedFiles = files.map((file) => ({
    _id: file._id.toString(),
    title: file.title,
    fileURL: file.fileURL,
    fileName: file.fileName,
    fileType: file.fileType,
    fileSize: file.fileSize,
    mimeType: file.mimeType,
    createdAt: file.createdAt?.toISOString() || new Date().toISOString(),
  }))

  return (
    <div className="space-y-6 overflow-y-auto">
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink href="/admin/exam">Exams</BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbLink href={`/admin/exam/${examId}`}>
              {exam.title}
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage>{batch.title}</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      <div>
        <h2 className="md:text-2xl font-bold">{batch.title}</h2>
        {batch.description && (
          <p className="text-sm text-muted-foreground mt-1">{batch.description}</p>
        )}
      </div>

      <Separator />

      {batch.contentType === "test" ? (
        <TestManagementClient
          examId={actualExamId}
          batchId={actualBatchId}
          initialTests={serializedTests}
        />
      ) : (
        <FileManagementClient
          examId={actualExamId}
          batchId={actualBatchId}
          initialFiles={serializedFiles}
        />
      )}
    </div>
  )
}
