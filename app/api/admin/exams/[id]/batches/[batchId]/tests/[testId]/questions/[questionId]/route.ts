/**
 * Admin Single Question API
 * 
 * GET - Fetch a single question by ID
 * PUT - Update a question
 * DELETE - Delete a question
 */

import { NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/app/api/auth/[...nextauth]/route"
import { getQuestionById, updateQuestion, deleteQuestion, CorrectOption } from "@/lib/models/question"
import { getTestById, updateTestQuestionCount } from "@/lib/models/test"
import { uploadBase64Image, deleteImage, getPublicIdFromUrl } from "@/lib/cloudinary"

// GET single question by ID
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string; batchId: string; testId: string; questionId: string }> }
) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session || session.user.role !== "admin") {
      return NextResponse.json(
        { success: false, error: "Unauthorized" },
        { status: 401 }
      )
    }

    const { questionId } = await params
    
    const question = await getQuestionById(questionId)
    
    if (!question) {
      return NextResponse.json(
        { success: false, error: "Question not found" },
        { status: 404 }
      )
    }

    return NextResponse.json({
      success: true,
      data: question,
    })
  } catch (error) {
    console.error("Error fetching question:", error)
    return NextResponse.json(
      { success: false, error: "Failed to fetch question" },
      { status: 500 }
    )
  }
}

// PUT update a question
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string; batchId: string; testId: string; questionId: string }> }
) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session || session.user.role !== "admin") {
      return NextResponse.json(
        { success: false, error: "Unauthorized" },
        { status: 401 }
      )
    }

    const { questionId } = await params
    const body = await request.json()
    const { question, optionA, optionB, optionC, optionD, correctOption, image, removeImage } = body

    // Check if question exists
    const existingQuestion = await getQuestionById(questionId)
    if (!existingQuestion) {
      return NextResponse.json(
        { success: false, error: "Question not found" },
        { status: 404 }
      )
    }

    // Build update object
    const updateData: any = {}
    
    if (question !== undefined) {
      if (!question?.trim()) {
        return NextResponse.json(
          { success: false, error: "Question text cannot be empty" },
          { status: 400 }
        )
      }
      updateData.question = question.trim()
    }

    if (optionA !== undefined) {
      if (!optionA?.trim()) {
        return NextResponse.json(
          { success: false, error: "Option A cannot be empty" },
          { status: 400 }
        )
      }
      updateData.optionA = optionA.trim()
    }

    if (optionB !== undefined) {
      if (!optionB?.trim()) {
        return NextResponse.json(
          { success: false, error: "Option B cannot be empty" },
          { status: 400 }
        )
      }
      updateData.optionB = optionB.trim()
    }

    if (optionC !== undefined) {
      if (!optionC?.trim()) {
        return NextResponse.json(
          { success: false, error: "Option C cannot be empty" },
          { status: 400 }
        )
      }
      updateData.optionC = optionC.trim()
    }

    if (optionD !== undefined) {
      if (!optionD?.trim()) {
        return NextResponse.json(
          { success: false, error: "Option D cannot be empty" },
          { status: 400 }
        )
      }
      updateData.optionD = optionD.trim()
    }

    if (correctOption !== undefined) {
      if (!["A", "B", "C", "D"].includes(correctOption)) {
        return NextResponse.json(
          { success: false, error: "Valid correct option (A/B/C/D) is required" },
          { status: 400 }
        )
      }
      updateData.correctOption = correctOption as CorrectOption
    }

    // Handle image removal
    if (removeImage && existingQuestion.imageURL) {
      const publicId = getPublicIdFromUrl(existingQuestion.imageURL)
      if (publicId) {
        await deleteImage(publicId)
      }
      updateData.imageURL = null
    }
    // Handle new image upload
    else if (image && typeof image === "string" && image.startsWith("data:image")) {
      // Delete old image if exists
      if (existingQuestion.imageURL) {
        const publicId = getPublicIdFromUrl(existingQuestion.imageURL)
        if (publicId) {
          await deleteImage(publicId)
        }
      }
      
      try {
        const uploadResult = await uploadBase64Image(image, "questions")
        updateData.imageURL = uploadResult.secure_url
      } catch (uploadError) {
        console.error("Image upload error:", uploadError)
        return NextResponse.json(
          { success: false, error: "Failed to upload image" },
          { status: 500 }
        )
      }
    }

    const updatedQuestion = await updateQuestion(questionId, updateData)

    return NextResponse.json({
      success: true,
      data: updatedQuestion,
    })
  } catch (error: any) {
    console.error("Error updating question:", error)
    
    return NextResponse.json(
      { success: false, error: "Failed to update question" },
      { status: 500 }
    )
  }
}

// DELETE a question
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string; batchId: string; testId: string; questionId: string }> }
) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session || session.user.role !== "admin") {
      return NextResponse.json(
        { success: false, error: "Unauthorized" },
        { status: 401 }
      )
    }

    const { testId, questionId } = await params
    
    const question = await getQuestionById(questionId)
    if (!question) {
      return NextResponse.json(
        { success: false, error: "Question not found" },
        { status: 404 }
      )
    }

    // Delete image from Cloudinary if exists
    if (question.imageURL) {
      const publicId = getPublicIdFromUrl(question.imageURL)
      if (publicId) {
        await deleteImage(publicId)
      }
    }

    await deleteQuestion(questionId)

    // Update test question count
    const test = await getTestById(testId)
    if (test && test.questionCount > 0) {
      await updateTestQuestionCount(testId, test.questionCount - 1)
    }

    return NextResponse.json({
      success: true,
      message: "Question deleted successfully",
    })
  } catch (error) {
    console.error("Error deleting question:", error)
    return NextResponse.json(
      { success: false, error: "Failed to delete question" },
      { status: 500 }
    )
  }
}
