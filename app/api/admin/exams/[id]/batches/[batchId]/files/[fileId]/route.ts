/**
 * Admin Single File API
 * 
 * GET - Fetch a single file by ID
 * PUT - Update a file entry
 * DELETE - Delete a file entry
 */

import { NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/app/api/auth/[...nextauth]/route"
import { getFileById, updateBatchFile, deleteBatchFile } from "@/lib/models/batchFile"

// GET single file by ID
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string; batchId: string; fileId: string }> }
) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session || session.user.role !== "admin") {
      return NextResponse.json(
        { success: false, error: "Unauthorized" },
        { status: 401 }
      )
    }

    const { fileId } = await params
    
    const file = await getFileById(fileId)
    
    if (!file) {
      return NextResponse.json(
        { success: false, error: "File not found" },
        { status: 404 }
      )
    }

    return NextResponse.json({
      success: true,
      data: file,
    })
  } catch (error) {
    console.error("Error fetching file:", error)
    return NextResponse.json(
      { success: false, error: "Failed to fetch file" },
      { status: 500 }
    )
  }
}

// PUT update a file entry
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string; batchId: string; fileId: string }> }
) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session || session.user.role !== "admin") {
      return NextResponse.json(
        { success: false, error: "Unauthorized" },
        { status: 401 }
      )
    }

    const { fileId } = await params
    const body = await request.json()
    const { title, fileURL, fileName, fileSize, mimeType } = body

    // Check if file exists
    const existingFile = await getFileById(fileId)
    if (!existingFile) {
      return NextResponse.json(
        { success: false, error: "File not found" },
        { status: 404 }
      )
    }

    // Build update object
    const updateData: any = {}
    
    if (title !== undefined) {
      if (!title?.trim()) {
        return NextResponse.json(
          { success: false, error: "File title cannot be empty" },
          { status: 400 }
        )
      }
      updateData.title = title.trim()
    }

    if (fileURL !== undefined) {
      if (!fileURL?.trim()) {
        return NextResponse.json(
          { success: false, error: "File URL cannot be empty" },
          { status: 400 }
        )
      }
      updateData.fileURL = fileURL.trim()
    }

    if (fileName !== undefined) {
      if (!fileName?.trim()) {
        return NextResponse.json(
          { success: false, error: "File name cannot be empty" },
          { status: 400 }
        )
      }
      updateData.fileName = fileName.trim()
    }

    if (fileSize !== undefined) {
      updateData.fileSize = fileSize
    }

    if (mimeType !== undefined) {
      if (!mimeType?.trim()) {
        return NextResponse.json(
          { success: false, error: "MIME type cannot be empty" },
          { status: 400 }
        )
      }
      updateData.mimeType = mimeType.trim()
    }

    const updatedFile = await updateBatchFile(fileId, updateData)

    return NextResponse.json({
      success: true,
      data: updatedFile,
    })
  } catch (error: any) {
    console.error("Error updating file:", error)
    
    return NextResponse.json(
      { success: false, error: "Failed to update file" },
      { status: 500 }
    )
  }
}

// DELETE a file entry
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string; batchId: string; fileId: string }> }
) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session || session.user.role !== "admin") {
      return NextResponse.json(
        { success: false, error: "Unauthorized" },
        { status: 401 }
      )
    }

    const { fileId } = await params
    
    const file = await getFileById(fileId)
    if (!file) {
      return NextResponse.json(
        { success: false, error: "File not found" },
        { status: 404 }
      )
    }

    await deleteBatchFile(fileId)

    return NextResponse.json({
      success: true,
      message: "File deleted successfully",
    })
  } catch (error) {
    console.error("Error deleting file:", error)
    return NextResponse.json(
      { success: false, error: "Failed to delete file" },
      { status: 500 }
    )
  }
}
