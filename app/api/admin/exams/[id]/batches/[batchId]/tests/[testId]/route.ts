/**
 * Admin Single Test API
 * 
 * GET - Fetch a test by ID
 * PUT - Update a test
 * DELETE - Delete a test
 */

import { NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/app/api/auth/[...nextauth]/route"
import { getTestById, updateTest, deleteTest } from "@/lib/models/test"

// GET a test by ID
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
    const test = await getTestById(testId)
    
    if (!test) {
      return NextResponse.json(
        { success: false, error: "Test not found" },
        { status: 404 }
      )
    }

    return NextResponse.json({
      success: true,
      data: test,
    })
  } catch (error) {
    console.error("Error fetching test:", error)
    return NextResponse.json(
      { success: false, error: "Failed to fetch test" },
      { status: 500 }
    )
  }
}

// PUT update a test
export async function PUT(
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
    const { title, marksPerQuestion, duration, negativeMarking, negativeMarkValue } = body

    // Validate fields if provided
    if (title !== undefined && !title.trim()) {
      return NextResponse.json(
        { success: false, error: "Test title cannot be empty" },
        { status: 400 }
      )
    }

    if (marksPerQuestion !== undefined && marksPerQuestion < 0.25) {
      return NextResponse.json(
        { success: false, error: "Marks per question must be at least 0.25" },
        { status: 400 }
      )
    }

    if (duration !== undefined && duration < 1) {
      return NextResponse.json(
        { success: false, error: "Duration must be at least 1 minute" },
        { status: 400 }
      )
    }

    const updateData: Record<string, unknown> = {}
    if (title !== undefined) updateData.title = title.trim()
    if (marksPerQuestion !== undefined) updateData.marksPerQuestion = marksPerQuestion
    if (duration !== undefined) updateData.duration = duration
    if (negativeMarking !== undefined) updateData.negativeMarking = negativeMarking
    if (negativeMarkValue !== undefined) updateData.negativeMarkValue = negativeMarkValue

    const test = await updateTest(testId, updateData)
    
    if (!test) {
      return NextResponse.json(
        { success: false, error: "Test not found" },
        { status: 404 }
      )
    }

    return NextResponse.json({
      success: true,
      data: test,
    })
  } catch (error: any) {
    console.error("Error updating test:", error)
    
    // Handle duplicate slug error
    if (error.code === 11000) {
      return NextResponse.json(
        { success: false, error: "A test with this title already exists in this batch" },
        { status: 400 }
      )
    }
    
    return NextResponse.json(
      { success: false, error: "Failed to update test" },
      { status: 500 }
    )
  }
}

// DELETE a test
export async function DELETE(
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
    
    // TODO: Check if test has any questions before deleting
    // For now, we allow deletion

    const test = await deleteTest(testId)
    
    if (!test) {
      return NextResponse.json(
        { success: false, error: "Test not found" },
        { status: 404 }
      )
    }

    return NextResponse.json({
      success: true,
      message: "Test deleted successfully",
    })
  } catch (error) {
    console.error("Error deleting test:", error)
    return NextResponse.json(
      { success: false, error: "Failed to delete test" },
      { status: 500 }
    )
  }
}
