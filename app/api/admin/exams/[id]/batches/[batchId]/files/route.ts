/**
 * Admin Files API for a specific Batch
 * 
 * GET - Fetch all files for a batch
 * POST - Create a new file entry for a batch
 */

import { NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/app/api/auth/[...nextauth]/route"
import { getFilesByBatch, createBatchFile } from "@/lib/models/batchFile"
import { getBatchById } from "@/lib/models/batch"

// GET all files for a batch
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
    
    // Verify batch exists and is type:file
    const batch = await getBatchById(batchId)
    if (!batch) {
      return NextResponse.json(
        { success: false, error: "Batch not found" },
        { status: 404 }
      )
    }

    if (batch.contentType !== "file") {
      return NextResponse.json(
        { success: false, error: "This batch is not configured for files" },
        { status: 400 }
      )
    }

    const files = await getFilesByBatch(batchId)
    
    return NextResponse.json({
      success: true,
      data: files,
    })
  } catch (error) {
    console.error("Error fetching files:", error)
    return NextResponse.json(
      { success: false, error: "Failed to fetch files" },
      { status: 500 }
    )
  }
}

// POST create a new file entry
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
    const { title, fileURL, fileName, fileSize, mimeType } = body

    // Validate required fields
    if (!title?.trim()) {
      return NextResponse.json(
        { success: false, error: "File title is required" },
        { status: 400 }
      )
    }

    if (!fileURL?.trim()) {
      return NextResponse.json(
        { success: false, error: "File URL is required" },
        { status: 400 }
      )
    }

    if (!fileName?.trim()) {
      return NextResponse.json(
        { success: false, error: "File name is required" },
        { status: 400 }
      )
    }

    if (!mimeType?.trim()) {
      return NextResponse.json(
        { success: false, error: "MIME type is required" },
        { status: 400 }
      )
    }

    // Verify batch exists and is type:file
    const batch = await getBatchById(batchId)
    if (!batch) {
      return NextResponse.json(
        { success: false, error: "Batch not found" },
        { status: 404 }
      )
    }

    if (batch.contentType !== "file") {
      return NextResponse.json(
        { success: false, error: "This batch is not configured for files" },
        { status: 400 }
      )
    }

    const file = await createBatchFile({
      title: title.trim(),
      batch: batchId,
      fileURL: fileURL.trim(),
      fileName: fileName.trim(),
      fileSize: fileSize || 0,
      mimeType: mimeType.trim(),
    })

    return NextResponse.json({
      success: true,
      data: file,
    }, { status: 201 })
  } catch (error: any) {
    console.error("Error creating file:", error)
    
    return NextResponse.json(
      { success: false, error: "Failed to create file entry" },
      { status: 500 }
    )
  }
}
