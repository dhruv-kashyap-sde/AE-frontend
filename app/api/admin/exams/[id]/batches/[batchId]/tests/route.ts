/**
 * Admin Tests API for a specific Batch
 * 
 * GET - Fetch all tests for a batch
 * POST - Create a new test for a batch
 */

import { NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/app/api/auth/[...nextauth]/route"
import { getTestsByBatch, createTest } from "@/lib/models/test"
import { getBatchById } from "@/lib/models/batch"

// GET all tests for a batch
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string; batchId: string }> }
) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session || session.user.role !== "admin") {
      return NextResponse.json(
        { success: false, error: "Unauthorized" },
        { status: 401 }
      )
    }

    const { batchId } = await params
    
    // Verify batch exists and is type:test
    const batch = await getBatchById(batchId)
    if (!batch) {
      return NextResponse.json(
        { success: false, error: "Batch not found" },
        { status: 404 }
      )
    }

    if (batch.contentType !== "test") {
      return NextResponse.json(
        { success: false, error: "This batch is not configured for tests" },
        { status: 400 }
      )
    }

    const tests = await getTestsByBatch(batchId)
    
    return NextResponse.json({
      success: true,
      data: tests,
    })
  } catch (error) {
    console.error("Error fetching tests:", error)
    return NextResponse.json(
      { success: false, error: "Failed to fetch tests" },
      { status: 500 }
    )
  }
}

// POST create a new test
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string; batchId: string }> }
) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session || session.user.role !== "admin") {
      return NextResponse.json(
        { success: false, error: "Unauthorized" },
        { status: 401 }
      )
    }

    const { batchId } = await params
    const body = await request.json()
    const { title, marksPerQuestion, duration, negativeMarking, negativeMarkValue } = body

    // Validate required fields
    if (!title?.trim()) {
      return NextResponse.json(
        { success: false, error: "Test title is required" },
        { status: 400 }
      )
    }

    if (!marksPerQuestion || marksPerQuestion < 0.25) {
      return NextResponse.json(
        { success: false, error: "Marks per question must be at least 0.25" },
        { status: 400 }
      )
    }

    if (!duration || duration < 1) {
      return NextResponse.json(
        { success: false, error: "Duration must be at least 1 minute" },
        { status: 400 }
      )
    }

    // Verify batch exists and is type:test
    const batch = await getBatchById(batchId)
    if (!batch) {
      return NextResponse.json(
        { success: false, error: "Batch not found" },
        { status: 404 }
      )
    }

    if (batch.contentType !== "test") {
      return NextResponse.json(
        { success: false, error: "This batch is not configured for tests" },
        { status: 400 }
      )
    }

    const test = await createTest({
      title: title.trim(),
      batch: batchId,
      marksPerQuestion,
      duration,
      negativeMarking: negativeMarking || false,
      negativeMarkValue: negativeMarking ? (negativeMarkValue || 0) : 0,
    })

    return NextResponse.json({
      success: true,
      data: test,
    }, { status: 201 })
  } catch (error: any) {
    console.error("Error creating test:", error)
    
    // Handle duplicate slug error
    if (error.code === 11000) {
      return NextResponse.json(
        { success: false, error: "A test with this title already exists in this batch" },
        { status: 400 }
      )
    }
    
    return NextResponse.json(
      { success: false, error: "Failed to create test" },
      { status: 500 }
    )
  }
}
