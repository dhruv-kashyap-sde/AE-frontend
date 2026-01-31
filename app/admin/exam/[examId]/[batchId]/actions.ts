"use server"

/**
 * Server Actions for Test Management
 * 
 * These actions handle all test CRUD operations.
 * They are called directly from client components.
 */

import { revalidatePath } from "next/cache"
import { getServerSession } from "next-auth"
import { authOptions } from "@/app/api/auth/[...nextauth]/route"
import {
  createTest as createTestModel,
  updateTest as updateTestModel,
  deleteTest as deleteTestModel,
  getTestsByBatch,
} from "@/lib/models/test"
import { updateBatchCount } from "@/lib/models/batch"

// Types for action responses
type ActionResponse<T = void> = 
  | { success: true; data: T }
  | { success: false; error: string }

// ==================== TEST ACTIONS ====================

/**
 * Create a new test
 */
export async function createTest(
  examId: string,
  batchId: string,
  data: {
    title: string
    marksPerQuestion: number
    duration: number
    negativeMarking: boolean
    negativeMarkValue: number
  }
): Promise<ActionResponse<{ 
  _id: string
  title: string
  slug: string
  marksPerQuestion: number
  negativeMarking: boolean
  negativeMarkValue: number
  duration: number
  questionCount: number
  createdAt: string
}>> {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session || session.user.role !== "admin") {
      return { success: false, error: "Unauthorized" }
    }

    if (!data.title?.trim()) {
      return { success: false, error: "Test title is required" }
    }

    if (data.marksPerQuestion < 0.25) {
      return { success: false, error: "Marks per question must be at least 0.25" }
    }

    if (data.duration < 1) {
      return { success: false, error: "Duration must be at least 1 minute" }
    }

    const test = await createTestModel({
      title: data.title.trim(),
      batch: batchId,
      marksPerQuestion: data.marksPerQuestion,
      duration: data.duration,
      negativeMarking: data.negativeMarking,
      negativeMarkValue: data.negativeMarking ? data.negativeMarkValue : 0,
    })

    // Update batch's total count
    const tests = await getTestsByBatch(batchId)
    await updateBatchCount(batchId, tests.length)

    revalidatePath(`/admin/exam/${examId}/${batchId}`)
    revalidatePath(`/admin/exam/${examId}`)
    
    return { 
      success: true, 
      data: {
        _id: test._id.toString(),
        title: test.title,
        slug: test.slug,
        marksPerQuestion: test.marksPerQuestion,
        negativeMarking: test.negativeMarking,
        negativeMarkValue: test.negativeMarkValue,
        duration: test.duration,
        questionCount: test.questionCount,
        createdAt: test.createdAt.toISOString(),
      }
    }
  } catch (error: any) {
    console.error("Error creating test:", error)
    
    if (error.code === 11000) {
      return { success: false, error: "A test with this title already exists in this batch" }
    }
    
    return { success: false, error: "Failed to create test" }
  }
}

/**
 * Update an existing test
 */
export async function updateTest(
  examId: string,
  batchId: string,
  testId: string,
  data: {
    title?: string
    marksPerQuestion?: number
    duration?: number
    negativeMarking?: boolean
    negativeMarkValue?: number
  }
): Promise<ActionResponse<{
  _id: string
  title: string
  slug: string
  marksPerQuestion: number
  negativeMarking: boolean
  negativeMarkValue: number
  duration: number
  questionCount: number
  createdAt: string
}>> {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session || session.user.role !== "admin") {
      return { success: false, error: "Unauthorized" }
    }

    if (!testId) {
      return { success: false, error: "Test ID is required" }
    }

    const updateData: Record<string, unknown> = {}
    
    if (data.title?.trim()) {
      updateData.title = data.title.trim()
    }
    
    if (data.marksPerQuestion !== undefined) {
      if (data.marksPerQuestion < 0.25) {
        return { success: false, error: "Marks per question must be at least 0.25" }
      }
      updateData.marksPerQuestion = data.marksPerQuestion
    }
    
    if (data.duration !== undefined) {
      if (data.duration < 1) {
        return { success: false, error: "Duration must be at least 1 minute" }
      }
      updateData.duration = data.duration
    }
    
    if (data.negativeMarking !== undefined) {
      updateData.negativeMarking = data.negativeMarking
      if (!data.negativeMarking) {
        updateData.negativeMarkValue = 0
      }
    }
    
    if (data.negativeMarkValue !== undefined && data.negativeMarking !== false) {
      updateData.negativeMarkValue = data.negativeMarkValue
    }

    const test = await updateTestModel(testId, updateData)
    
    if (!test) {
      return { success: false, error: "Test not found" }
    }

    revalidatePath(`/admin/exam/${examId}/${batchId}`)
    
    return { 
      success: true, 
      data: {
        _id: test._id.toString(),
        title: test.title,
        slug: test.slug,
        marksPerQuestion: test.marksPerQuestion,
        negativeMarking: test.negativeMarking,
        negativeMarkValue: test.negativeMarkValue,
        duration: test.duration,
        questionCount: test.questionCount,
        createdAt: test.createdAt.toISOString(),
      }
    }
  } catch (error: any) {
    console.error("Error updating test:", error)
    
    if (error.code === 11000) {
      return { success: false, error: "A test with this title already exists in this batch" }
    }
    
    return { success: false, error: "Failed to update test" }
  }
}

/**
 * Delete a test (cascade deletes all questions)
 */
export async function deleteTest(
  examId: string,
  batchId: string,
  testId: string
): Promise<ActionResponse> {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session || session.user.role !== "admin") {
      return { success: false, error: "Unauthorized" }
    }

    if (!testId) {
      return { success: false, error: "Test ID is required" }
    }

    const deleted = await deleteTestModel(testId)
    
    if (!deleted) {
      return { success: false, error: "Test not found" }
    }

    // Update batch's total count
    const tests = await getTestsByBatch(batchId)
    await updateBatchCount(batchId, tests.length)

    revalidatePath(`/admin/exam/${examId}/${batchId}`)
    revalidatePath(`/admin/exam/${examId}`)
    
    return { success: true, data: undefined }
  } catch (error) {
    console.error("Error deleting test:", error)
    return { success: false, error: "Failed to delete test" }
  }
}

/**
 * Refresh tests list
 */
export async function refreshTests(batchId: string) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session || session.user.role !== "admin") {
      return { success: false, error: "Unauthorized", data: [] }
    }

    const tests = await getTestsByBatch(batchId)
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
    
    return { success: true, data: serializedTests }
  } catch (error) {
    console.error("Error fetching tests:", error)
    return { success: false, error: "Failed to fetch tests", data: [] }
  }
}
