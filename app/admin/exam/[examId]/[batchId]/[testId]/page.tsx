/**
 * Test Question Management Page (Server Component)
 * 
 * Displays questions for a specific test.
 * Fetches data server-side and passes to client component.
 */

import React from "react"
import { notFound } from "next/navigation"
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
import { getTestById, getTestBySlug } from "@/lib/models/test"
import { getQuestionsByTest } from "@/lib/models/question"
import QuestionManagementClient from "./QuestionManagementClient"
import mongoose from "mongoose"

// Helper to check if string is a valid MongoDB ObjectId
function isValidObjectId(id: string): boolean {
  return mongoose.Types.ObjectId.isValid(id) && new mongoose.Types.ObjectId(id).toString() === id
}

interface PageProps {
  params: Promise<{ examId: string; batchId: string; testId: string }>
}

export default async function TestQuestionsPage({ params }: PageProps) {
  const { examId, batchId, testId } = await params

  // Fetch exam - try by ID first, then by slug
  const exam = isValidObjectId(examId)
    ? await getExamById(examId)
    : await getExamBySlug(examId)

  if (!exam) {
    notFound()
  }

  const actualExamId = exam._id.toString()

  // Fetch batch - try by ID first, then by slug
  const batch = isValidObjectId(batchId)
    ? await getBatchById(batchId)
    : await getBatchBySlug(actualExamId, batchId)

  if (!batch) {
    notFound()
  }

  const actualBatchId = batch._id.toString()

  // Verify batch belongs to this exam
  if (batch.exam.toString() !== actualExamId) {
    notFound()
  }

  // Fetch test - try by ID first, then by slug
  const test = isValidObjectId(testId)
    ? await getTestById(testId)
    : await getTestBySlug(actualBatchId, testId)

  if (!test) {
    notFound()
  }

  const actualTestId = test._id.toString()

  // Verify test belongs to this batch
  if (test.batch.toString() !== actualBatchId) {
    notFound()
  }

  // Fetch questions for the test
  const questions = await getQuestionsByTest(actualTestId)

  // Serialize data for client component
  const serializedQuestions = questions.map((q) => ({
    _id: q._id.toString(),
    question: q.question,
    optionA: q.optionA,
    optionB: q.optionB,
    optionC: q.optionC,
    optionD: q.optionD,
    correctOption: q.correctOption,
    imageURL: q.imageURL,
    order: q.order,
  }))

  const serializedTest = {
    _id: actualTestId,
    title: test.title,
    marksPerQuestion: test.marksPerQuestion,
    negativeMarking: test.negativeMarking,
    negativeMarkValue: test.negativeMarkValue,
    duration: test.duration,
    questionCount: test.questionCount,
  }

  return (
    <div className="space-y-6 overflow-y-auto">
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink href="/admin/exam">Exams</BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbLink href={`/admin/exam/${actualExamId}`}>
              {exam.title}
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbLink href={`/admin/exam/${actualExamId}/${actualBatchId}`}>
              {batch.title}
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage>{test.title}</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      <QuestionManagementClient
        examId={actualExamId}
        batchId={actualBatchId}
        testId={actualTestId}
        test={serializedTest}
        initialQuestions={serializedQuestions}
      />
    </div>
  )
}
