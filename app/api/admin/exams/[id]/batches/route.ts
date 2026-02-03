/**
 * Admin Batches API for a specific Exam
 * 
 * GET - Fetch all batches for an exam
 * POST - Create a new batch for an exam
 */

import { NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/app/api/auth/[...nextauth]/route"
import { getBatchesByExam, createBatch } from "@/lib/models/batch"
import { getExamById, incrementExamBatches } from "@/lib/models/exam"

// GET all batches for an exam
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session || session.user.role !== "admin") {
      return NextResponse.json(
        { success: false, error: "Unauthorized" },
        { status: 401 }
      )
    }

    const { id: examId } = await params
    
    // Verify exam exists
    const exam = await getExamById(examId)
    if (!exam) {
      return NextResponse.json(
        { success: false, error: "Exam not found" },
        { status: 404 }
      )
    }

    const batches = await getBatchesByExam(examId)
    
    return NextResponse.json({
      success: true,
      data: batches,
    })
  } catch (error) {
    console.error("Error fetching batches:", error)
    return NextResponse.json(
      { success: false, error: "Failed to fetch batches" },
      { status: 500 }
    )
  }
}

// POST create a new batch
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session || session.user.role !== "admin") {
      return NextResponse.json(
        { success: false, error: "Unauthorized" },
        { status: 401 }
      )
    }

    const { id: examId } = await params
    const body = await request.json()
    const { title, price, originalPrice, expiry, contentType, description } = body

    // Validate required fields
    if (!title?.trim()) {
      return NextResponse.json(
        { success: false, error: "Batch title is required" },
        { status: 400 }
      )
    }

    if (price === undefined || price < 0) {
      return NextResponse.json(
        { success: false, error: "Valid price is required" },
        { status: 400 }
      )
    }

    if (originalPrice === undefined || originalPrice < 0) {
      return NextResponse.json(
        { success: false, error: "Valid original price is required" },
        { status: 400 }
      )
    }

    if (expiry !== undefined && expiry !== null && expiry < 0) {
      return NextResponse.json(
        { success: false, error: "Expiry months cannot be negative" },
        { status: 400 }
      )
    }

    if (!contentType || !["test", "file"].includes(contentType)) {
      return NextResponse.json(
        { success: false, error: "Content type must be 'test' or 'file'" },
        { status: 400 }
      )
    }

    // Verify exam exists
    const exam = await getExamById(examId)
    if (!exam) {
      return NextResponse.json(
        { success: false, error: "Exam not found" },
        { status: 404 }
      )
    }

    const batch = await createBatch({
      title: title.trim(),
      exam: examId,
      price,
      originalPrice,
      expiry: expiry ?? null,
      contentType,
      description: description?.trim() || null,
    })

    // Increment the totalBatches count on the exam
    await incrementExamBatches(examId)

    return NextResponse.json({
      success: true,
      data: batch,
    }, { status: 201 })
  } catch (error: any) {
    console.error("Error creating batch:", error)
    
    // Handle duplicate slug error
    if (error.code === 11000) {
      return NextResponse.json(
        { success: false, error: "A batch with this title already exists in this exam" },
        { status: 400 }
      )
    }
    
    return NextResponse.json(
      { success: false, error: "Failed to create batch" },
      { status: 500 }
    )
  }
}
