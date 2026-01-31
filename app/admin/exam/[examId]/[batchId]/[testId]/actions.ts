"use server"

/**
 * Server Actions for Question Management
 * 
 * These actions handle all question CRUD operations.
 * They are called directly from client components.
 */

import { revalidatePath } from "next/cache"
import { getServerSession } from "next-auth"
import { authOptions } from "@/app/api/auth/[...nextauth]/route"
import {
  createQuestion as createQuestionModel,
  createQuestionsBulk,
  updateQuestion as updateQuestionModel,
  deleteQuestion as deleteQuestionModel,
  getQuestionsByTest,
} from "@/lib/models/question"
import { updateTestQuestionCount } from "@/lib/models/test"

// Types
type CorrectOption = "A" | "B" | "C" | "D"

type ActionResponse<T = void> = 
  | { success: true; data: T }
  | { success: false; error: string }

interface QuestionData {
  _id: string
  question: string
  optionA: string
  optionB: string
  optionC: string
  optionD: string
  correctOption: CorrectOption
  imageURL: string | null
  order: number
}

// ==================== QUESTION ACTIONS ====================

/**
 * Create a new question
 */
export async function createQuestion(
  examId: string,
  batchId: string,
  testId: string,
  data: {
    question: string
    optionA: string
    optionB: string
    optionC: string
    optionD: string
    correctOption: CorrectOption
    image?: string | null // base64 string
  }
): Promise<ActionResponse<QuestionData>> {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session || session.user.role !== "admin") {
      return { success: false, error: "Unauthorized" }
    }

    if (!data.question?.trim()) {
      return { success: false, error: "Question text is required" }
    }

    if (!data.optionA?.trim() || !data.optionB?.trim() || 
        !data.optionC?.trim() || !data.optionD?.trim()) {
      return { success: false, error: "All options are required" }
    }

    // Get current question count for order
    const existingQuestions = await getQuestionsByTest(testId)
    const order = existingQuestions.length + 1

    // Handle image upload if provided
    let imageURL: string | null = null
    if (data.image && data.image.startsWith("data:image")) {
      // In production, you'd upload to cloud storage here
      // For now, we'll store the base64 directly (not recommended for production)
      imageURL = data.image
    }

    const question = await createQuestionModel({
      test: testId,
      question: data.question.trim(),
      optionA: data.optionA.trim(),
      optionB: data.optionB.trim(),
      optionC: data.optionC.trim(),
      optionD: data.optionD.trim(),
      correctOption: data.correctOption,
      imageURL,
      order,
    })

    // Update test's question count
    await updateTestQuestionCount(testId, existingQuestions.length + 1)

    revalidatePath(`/admin/exam/${examId}/${batchId}/${testId}`)
    
    return { 
      success: true, 
      data: {
        _id: question._id.toString(),
        question: question.question,
        optionA: question.optionA,
        optionB: question.optionB,
        optionC: question.optionC,
        optionD: question.optionD,
        correctOption: question.correctOption,
        imageURL: question.imageURL,
        order: question.order,
      }
    }
  } catch (error: any) {
    console.error("Error creating question:", error)
    return { success: false, error: "Failed to create question" }
  }
}

/**
 * Create multiple questions (bulk upload from Excel)
 */
export async function createManyQuestions(
  examId: string,
  batchId: string,
  testId: string,
  questions: Array<{
    question: string
    optionA: string
    optionB: string
    optionC: string
    optionD: string
    correctOption: CorrectOption
  }>
): Promise<ActionResponse<{ data: QuestionData[]; message: string }>> {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session || session.user.role !== "admin") {
      return { success: false, error: "Unauthorized" }
    }

    if (!questions || questions.length === 0) {
      return { success: false, error: "No questions provided" }
    }

    // Validate all questions
    for (let i = 0; i < questions.length; i++) {
      const q = questions[i]
      if (!q.question?.trim()) {
        return { success: false, error: `Question ${i + 1} is missing question text` }
      }
      if (!q.optionA?.trim() || !q.optionB?.trim() || 
          !q.optionC?.trim() || !q.optionD?.trim()) {
        return { success: false, error: `Question ${i + 1} is missing options` }
      }
      if (!["A", "B", "C", "D"].includes(q.correctOption)) {
        return { success: false, error: `Question ${i + 1} has invalid correct option` }
      }
    }

    // Get current question count for order
    const existingQuestions = await getQuestionsByTest(testId)

    // Prepare questions for bulk insert (without test and order - handled by createQuestionsBulk)
    const questionsToCreate = questions.map((q) => ({
      question: q.question.trim(),
      optionA: q.optionA.trim(),
      optionB: q.optionB.trim(),
      optionC: q.optionC.trim(),
      optionD: q.optionD.trim(),
      correctOption: q.correctOption,
    }))

    const createdQuestions = await createQuestionsBulk(testId, questionsToCreate)

    // Update test's question count
    await updateTestQuestionCount(testId, existingQuestions.length + createdQuestions.length)

    revalidatePath(`/admin/exam/${examId}/${batchId}/${testId}`)
    
    const serializedQuestions = createdQuestions.map((q) => ({
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

    return { 
      success: true, 
      data: {
        data: serializedQuestions,
        message: `${createdQuestions.length} questions added successfully`,
      }
    }
  } catch (error: any) {
    console.error("Error creating questions:", error)
    return { success: false, error: "Failed to create questions" }
  }
}

/**
 * Update an existing question
 */
export async function updateQuestion(
  examId: string,
  batchId: string,
  testId: string,
  questionId: string,
  data: {
    question?: string
    optionA?: string
    optionB?: string
    optionC?: string
    optionD?: string
    correctOption?: CorrectOption
    image?: string | null // base64 string or null to keep, undefined to not change
    removeImage?: boolean
  }
): Promise<ActionResponse<QuestionData>> {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session || session.user.role !== "admin") {
      return { success: false, error: "Unauthorized" }
    }

    if (!questionId) {
      return { success: false, error: "Question ID is required" }
    }

    const updateData: Record<string, unknown> = {}
    
    if (data.question?.trim()) {
      updateData.question = data.question.trim()
    }
    
    if (data.optionA?.trim()) {
      updateData.optionA = data.optionA.trim()
    }
    
    if (data.optionB?.trim()) {
      updateData.optionB = data.optionB.trim()
    }
    
    if (data.optionC?.trim()) {
      updateData.optionC = data.optionC.trim()
    }
    
    if (data.optionD?.trim()) {
      updateData.optionD = data.optionD.trim()
    }
    
    if (data.correctOption) {
      updateData.correctOption = data.correctOption
    }

    // Handle image
    if (data.removeImage) {
      updateData.imageURL = null
    } else if (data.image && data.image.startsWith("data:image")) {
      updateData.imageURL = data.image
    }

    const question = await updateQuestionModel(questionId, updateData)
    
    if (!question) {
      return { success: false, error: "Question not found" }
    }

    revalidatePath(`/admin/exam/${examId}/${batchId}/${testId}`)
    
    return { 
      success: true, 
      data: {
        _id: question._id.toString(),
        question: question.question,
        optionA: question.optionA,
        optionB: question.optionB,
        optionC: question.optionC,
        optionD: question.optionD,
        correctOption: question.correctOption,
        imageURL: question.imageURL,
        order: question.order,
      }
    }
  } catch (error: any) {
    console.error("Error updating question:", error)
    return { success: false, error: "Failed to update question" }
  }
}

/**
 * Delete a question
 */
export async function deleteQuestion(
  examId: string,
  batchId: string,
  testId: string,
  questionId: string
): Promise<ActionResponse> {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session || session.user.role !== "admin") {
      return { success: false, error: "Unauthorized" }
    }

    if (!questionId) {
      return { success: false, error: "Question ID is required" }
    }

    const deleted = await deleteQuestionModel(questionId)
    
    if (!deleted) {
      return { success: false, error: "Question not found" }
    }

    // Update test's question count
    const remainingQuestions = await getQuestionsByTest(testId)
    await updateTestQuestionCount(testId, remainingQuestions.length)

    revalidatePath(`/admin/exam/${examId}/${batchId}/${testId}`)
    
    return { success: true, data: undefined }
  } catch (error) {
    console.error("Error deleting question:", error)
    return { success: false, error: "Failed to delete question" }
  }
}

/**
 * Refresh questions list
 */
export async function refreshQuestions(testId: string) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session || session.user.role !== "admin") {
      return { success: false, error: "Unauthorized", data: [] }
    }

    const questions = await getQuestionsByTest(testId)
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
    
    return { success: true, data: serializedQuestions }
  } catch (error) {
    console.error("Error fetching questions:", error)
    return { success: false, error: "Failed to fetch questions", data: [] }
  }
}
