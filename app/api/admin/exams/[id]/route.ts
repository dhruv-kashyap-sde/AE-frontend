/**
 * Exam API Routes (by ID)
 * 
 * GET    /api/admin/exams/[id] - Get an exam by ID
 * PUT    /api/admin/exams/[id] - Update an exam
 * DELETE /api/admin/exams/[id] - Delete an exam
 */

import { NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/app/api/auth/[...nextauth]/route"
import { getExamById, updateExam, deleteExam } from "@/lib/models/exam"

interface RouteParams {
  params: Promise<{ id: string }>
}

// GET - Fetch exam by ID
export async function GET(request: NextRequest, { params }: RouteParams) {
  try {
    const { id } = await params

    // Check admin authentication
    const session = await getServerSession(authOptions)
    if (!session || session.user.role !== "admin") {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      )
    }

    const exam = await getExamById(id)
    if (!exam) {
      return NextResponse.json(
        { error: "Exam not found" },
        { status: 404 }
      )
    }

    return NextResponse.json(exam)
  } catch (error) {
    console.error("Error fetching exam:", error)
    return NextResponse.json(
      { error: "Failed to fetch exam" },
      { status: 500 }
    )
  }
}

// PUT - Update exam
export async function PUT(request: NextRequest, { params }: RouteParams) {
  try {
    const { id } = await params

    // Check admin authentication
    const session = await getServerSession(authOptions)
    if (!session || session.user.role !== "admin") {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      )
    }

    const body = await request.json()
    const { title, slug, imageURL, category } = body

    const exam = await updateExam(id, { title, slug, imageURL, category })
    if (!exam) {
      return NextResponse.json(
        { error: "Exam not found" },
        { status: 404 }
      )
    }

    return NextResponse.json(exam)
  } catch (error: any) {
    console.error("Error updating exam:", error)
    
    // Handle duplicate key error
    if (error.code === 11000) {
      return NextResponse.json(
        { error: "Exam with this slug already exists" },
        { status: 409 }
      )
    }
    
    return NextResponse.json(
      { error: "Failed to update exam" },
      { status: 500 }
    )
  }
}

// DELETE - Delete exam
export async function DELETE(request: NextRequest, { params }: RouteParams) {
  try {
    const { id } = await params

    // Check admin authentication
    const session = await getServerSession(authOptions)
    if (!session || session.user.role !== "admin") {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      )
    }

    const deleted = await deleteExam(id)
    if (!deleted) {
      return NextResponse.json(
        { error: "Exam not found" },
        { status: 404 }
      )
    }

    return NextResponse.json({ message: "Exam deleted successfully" })
  } catch (error) {
    console.error("Error deleting exam:", error)
    return NextResponse.json(
      { error: "Failed to delete exam" },
      { status: 500 }
    )
  }
}
