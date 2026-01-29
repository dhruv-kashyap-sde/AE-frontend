/**
 * Exams API Routes
 * 
 * GET  /api/admin/exams - Get all exams
 * POST /api/admin/exams - Create a new exam
 */

import { NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/app/api/auth/[...nextauth]/route"
import { getAllExams, createExam } from "@/lib/models/exam"

// GET - Fetch all exams
export async function GET() {
  try {
    // Check admin authentication
    const session = await getServerSession(authOptions)
    if (!session || session.user.role !== "admin") {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      )
    }

    const exams = await getAllExams()
    return NextResponse.json(exams)
  } catch (error) {
    console.error("Error fetching exams:", error)
    return NextResponse.json(
      { error: "Failed to fetch exams" },
      { status: 500 }
    )
  }
}

// POST - Create a new exam
export async function POST(request: NextRequest) {
  try {
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

    if (!title || typeof title !== "string") {
      return NextResponse.json(
        { error: "Title is required" },
        { status: 400 }
      )
    }

    if (!category || typeof category !== "string") {
      return NextResponse.json(
        { error: "Category is required" },
        { status: 400 }
      )
    }

    const exam = await createExam({ title, slug, imageURL, category })
    return NextResponse.json(exam, { status: 201 })
  } catch (error: any) {
    console.error("Error creating exam:", error)
    
    // Handle duplicate key error
    if (error.code === 11000) {
      return NextResponse.json(
        { error: "Exam with this slug already exists" },
        { status: 409 }
      )
    }
    
    return NextResponse.json(
      { error: "Failed to create exam" },
      { status: 500 }
    )
  }
}
