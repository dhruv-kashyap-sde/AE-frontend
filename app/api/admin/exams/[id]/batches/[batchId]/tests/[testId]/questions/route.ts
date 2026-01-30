/**
 * Admin Questions API for a specific Test
 * 
 * GET - Fetch all questions for a test
 * POST - Create a new question or bulk upload questions
 */

import { NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/app/api/auth/[...nextauth]/route"
import { getQuestionsByTest, createQuestion, createQuestionsBulk, CorrectOption } from "@/lib/models/question"
import { getTestById, updateTestQuestionCount } from "@/lib/models/test"
import { uploadBase64Image } from "@/lib/cloudinary"

// GET all questions for a test
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string; batchId: string; testId: string }> }
) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session || session.user.role !== "admin") {
      return NextResponse.json(
        { success: false, error: "Unauthorized" },
        { status: 401 }
      )
    }

    const { testId } = await params
    
    // Verify test exists
    const test = await getTestById(testId)
    if (!test) {
      return NextResponse.json(
        { success: false, error: "Test not found" },
        { status: 404 }
      )
    }

    const questions = await getQuestionsByTest(testId)
    
    return NextResponse.json({
      success: true,
      data: questions,
    })
  } catch (error) {
    console.error("Error fetching questions:", error)
    return NextResponse.json(
      { success: false, error: "Failed to fetch questions" },
      { status: 500 }
    )
  }
}

// POST create a new question or bulk upload
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string; batchId: string; testId: string }> }
) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session || session.user.role !== "admin") {
      return NextResponse.json(
        { success: false, error: "Unauthorized" },
        { status: 401 }
      )
    }

    const { testId } = await params
    const body = await request.json()
    
    // Verify test exists
    const test = await getTestById(testId)
    if (!test) {
      return NextResponse.json(
        { success: false, error: "Test not found" },
        { status: 404 }
      )
    }

    // Check if bulk upload (array of questions)
    if (Array.isArray(body.questions)) {
      const questionsData = body.questions

      // Validate each question
      for (let i = 0; i < questionsData.length; i++) {
        const q = questionsData[i]
        if (!q.question?.trim()) {
          return NextResponse.json(
            { success: false, error: `Question ${i + 1}: Question text is required` },
            { status: 400 }
          )
        }
        if (!q.optionA?.trim() || !q.optionB?.trim() || !q.optionC?.trim() || !q.optionD?.trim()) {
          return NextResponse.json(
            { success: false, error: `Question ${i + 1}: All options are required` },
            { status: 400 }
          )
        }
        if (!["A", "B", "C", "D"].includes(q.correctOption)) {
          return NextResponse.json(
            { success: false, error: `Question ${i + 1}: Valid correct option (A/B/C/D) is required` },
            { status: 400 }
          )
        }
      }

      // Create questions in bulk
      const questions = await createQuestionsBulk(testId, questionsData)

      // Update test question count
      await updateTestQuestionCount(testId, test.questionCount + questions.length)

      return NextResponse.json({
        success: true,
        data: questions,
        message: `${questions.length} questions added successfully`,
      }, { status: 201 })
    }

    // Single question creation
    const { question, optionA, optionB, optionC, optionD, correctOption, image } = body

    // Validate required fields
    if (!question?.trim()) {
      return NextResponse.json(
        { success: false, error: "Question text is required" },
        { status: 400 }
      )
    }

    if (!optionA?.trim() || !optionB?.trim() || !optionC?.trim() || !optionD?.trim()) {
      return NextResponse.json(
        { success: false, error: "All options are required" },
        { status: 400 }
      )
    }

    if (!["A", "B", "C", "D"].includes(correctOption)) {
      return NextResponse.json(
        { success: false, error: "Valid correct option (A/B/C/D) is required" },
        { status: 400 }
      )
    }

    // Handle image upload if provided (base64)
    let imageURL: string | null = null
    if (image && typeof image === "string" && image.startsWith("data:image")) {
      try {
        const uploadResult = await uploadBase64Image(image, "questions")
        imageURL = uploadResult.secure_url
      } catch (uploadError) {
        console.error("Image upload error:", uploadError)
        // Continue without image if upload fails
      }
    }

    const newQuestion = await createQuestion({
      test: testId,
      question: question.trim(),
      optionA: optionA.trim(),
      optionB: optionB.trim(),
      optionC: optionC.trim(),
      optionD: optionD.trim(),
      correctOption: correctOption as CorrectOption,
      imageURL,
    })

    // Update test question count
    await updateTestQuestionCount(testId, test.questionCount + 1)

    return NextResponse.json({
      success: true,
      data: newQuestion,
    }, { status: 201 })
  } catch (error: any) {
    console.error("Error creating question:", error)
    
    return NextResponse.json(
      { success: false, error: error.message || "Failed to create question" },
      { status: 500 }
    )
  }
}
