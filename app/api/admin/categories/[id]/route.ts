/**
 * Category API Routes (by ID)
 * 
 * GET    /api/admin/categories/[id] - Get a category by ID
 * PUT    /api/admin/categories/[id] - Update a category
 * DELETE /api/admin/categories/[id] - Delete a category
 */

import { NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/app/api/auth/[...nextauth]/route"
import { getCategoryById, updateCategory, deleteCategory } from "@/lib/models/category"
import { getExamsByCategory } from "@/lib/models/exam"

interface RouteParams {
  params: Promise<{ id: string }>
}

// GET - Fetch category by ID
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

    const category = await getCategoryById(id)
    if (!category) {
      return NextResponse.json(
        { error: "Category not found" },
        { status: 404 }
      )
    }

    return NextResponse.json(category)
  } catch (error) {
    console.error("Error fetching category:", error)
    return NextResponse.json(
      { error: "Failed to fetch category" },
      { status: 500 }
    )
  }
}

// PUT - Update category
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
    const { title, imageURL } = body

    const category = await updateCategory(id, { title, imageURL })
    if (!category) {
      return NextResponse.json(
        { error: "Category not found" },
        { status: 404 }
      )
    }

    return NextResponse.json(category)
  } catch (error: any) {
    console.error("Error updating category:", error)
    
    // Handle duplicate key error
    if (error.code === 11000) {
      return NextResponse.json(
        { error: "Category with this title already exists" },
        { status: 409 }
      )
    }
    
    return NextResponse.json(
      { error: "Failed to update category" },
      { status: 500 }
    )
  }
}

// DELETE - Delete category
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

    // Check if category has exams
    const exams = await getExamsByCategory(id)
    if (exams.length > 0) {
      return NextResponse.json(
        { error: "Cannot delete category with existing exams. Delete exams first." },
        { status: 400 }
      )
    }

    const deleted = await deleteCategory(id)
    if (!deleted) {
      return NextResponse.json(
        { error: "Category not found" },
        { status: 404 }
      )
    }

    return NextResponse.json({ message: "Category deleted successfully" })
  } catch (error) {
    console.error("Error deleting category:", error)
    return NextResponse.json(
      { error: "Failed to delete category" },
      { status: 500 }
    )
  }
}
