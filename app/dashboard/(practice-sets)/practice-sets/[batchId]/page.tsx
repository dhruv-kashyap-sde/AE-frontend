import { getServerSession } from "next-auth"
import { authOptions } from "@/app/api/auth/[...nextauth]/route"
import { redirect, notFound } from "next/navigation"
import { hasActiveBatchAccess } from "@/server/batches/access.service"
import { getBatchById } from "@/lib/models/batch"
import { getTestsByBatch } from "@/lib/models/test"
import { ensureModelsRegistered } from "@/lib/models/registry"
import dbConnect from "@/lib/mongoose"
import BatchTestsClient from "./BatchTestsClient"

interface BatchTestsPageProps {
  params: Promise<{ batchId: string }>
}

export default async function BatchTestsPage({ params }: BatchTestsPageProps) {
  const { batchId } = await params
  const session = await getServerSession(authOptions)

  if (!session?.user?.id) {
    redirect("/login")
  }

  // Verify the user has active access to this batch
  const hasAccess = await hasActiveBatchAccess(session.user.id, batchId)
  if (!hasAccess) {
    redirect("/dashboard")
  }

  await dbConnect()
  ensureModelsRegistered()

  const batch = await getBatchById(batchId)
  if (!batch) {
    notFound()
  }

  // Populate exam info
  const { getExamById } = await import("@/lib/models/exam")
  const exam = await getExamById(batch.exam.toString())

  // Get all tests for this batch
  const tests = await getTestsByBatch(batchId)

  const serializedBatch = {
    id: batch._id.toString(),
    title: batch.title,
    slug: batch.slug,
    contentType: batch.contentType,
    totalCount: batch.totalCount,
    examTitle: exam?.title || "Exam",
    examSlug: exam?.slug || "",
  }

  const serializedTests = tests.map((test) => ({
    id: test._id.toString(),
    title: test.title,
    slug: test.slug,
    duration: test.duration,
    questionCount: test.questionCount,
    marksPerQuestion: test.marksPerQuestion,
    negativeMarking: test.negativeMarking,
    negativeMarkValue: test.negativeMarkValue,
    totalMarks: test.questionCount * test.marksPerQuestion,
  }))

  return (
    <>
    <BatchTestsClient batch={serializedBatch} tests={serializedTests} />
    </>
  )
}
