/**
 * Admin Single Batch API
 * 
 * GET - Fetch a batch by ID
 * PUT - Update a batch
 * DELETE - Delete a batch
 */

import { NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/app/api/auth/[...nextauth]/route"
import { getBatchById, updateBatch, deleteBatch } from "@/lib/models/batch"
import { decrementExamBatches } from "@/lib/models/exam"

// GET a batch by ID
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
    const batch = await getBatchById(batchId)
    
    if (!batch) {
      return NextResponse.json(
        { success: false, error: "Batch not found" },
        { status: 404 }
      )
    }

    return NextResponse.json({
      success: true,
      data: batch,
    })
  } catch (error) {
    console.error("Error fetching batch:", error)
    return NextResponse.json(
      { success: false, error: "Failed to fetch batch" },
      { status: 500 }
    )
  }
}

// PUT update a batch
export async function PUT(
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
    const { title, price, originalPrice, expiry, contentType, description } = body

    // Validate fields if provided
    if (title !== undefined && !title.trim()) {
      return NextResponse.json(
        { success: false, error: "Batch title cannot be empty" },
        { status: 400 }
      )
    }

    if (price !== undefined && price < 0) {
      return NextResponse.json(
        { success: false, error: "Price cannot be negative" },
        { status: 400 }
      )
    }

    if (originalPrice !== undefined && originalPrice < 0) {
      return NextResponse.json(
        { success: false, error: "Original price cannot be negative" },
        { status: 400 }
      )
    }

    if (contentType !== undefined && !["test", "file"].includes(contentType)) {
      return NextResponse.json(
        { success: false, error: "Content type must be 'test' or 'file'" },
        { status: 400 }
      )
    }

    const updateData: Record<string, unknown> = {}
    if (title !== undefined) updateData.title = title.trim()
    if (price !== undefined) updateData.price = price
    if (originalPrice !== undefined) updateData.originalPrice = originalPrice
    if (expiry !== undefined) updateData.expiry = expiry ? new Date(expiry) : null
    if (contentType !== undefined) updateData.contentType = contentType
    if (description !== undefined) updateData.description = description?.trim() || null

    const batch = await updateBatch(batchId, updateData)
    
    if (!batch) {
      return NextResponse.json(
        { success: false, error: "Batch not found" },
        { status: 404 }
      )
    }

    return NextResponse.json({
      success: true,
      data: batch,
    })
  } catch (error: any) {
    console.error("Error updating batch:", error)
    
    // Handle duplicate slug error
    if (error.code === 11000) {
      return NextResponse.json(
        { success: false, error: "A batch with this title already exists in this exam" },
        { status: 400 }
      )
    }
    
    return NextResponse.json(
      { success: false, error: "Failed to update batch" },
      { status: 500 }
    )
  }
}

// DELETE a batch
export async function DELETE(
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

    const { id: examId, batchId } = await params
    
    // TODO: Check if batch has any content (tests/files) before deleting
    // For now, we allow deletion

    const batch = await deleteBatch(batchId)
    
    if (!batch) {
      return NextResponse.json(
        { success: false, error: "Batch not found" },
        { status: 404 }
      )
    }

    // Decrement the totalBatches count on the exam
    await decrementExamBatches(examId)

    return NextResponse.json({
      success: true,
      message: "Batch deleted successfully",
    })
  } catch (error) {
    console.error("Error deleting batch:", error)
    return NextResponse.json(
      { success: false, error: "Failed to delete batch" },
      { status: 500 }
    )
  }
}
