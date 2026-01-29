/**
 * Categories API Routes
 * 
 * GET  /api/admin/categories - Get all categories
 * POST /api/admin/categories - Create a new category
 */

import { NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/app/api/auth/[...nextauth]/route"
import { getAllCategories, createCategory } from "@/lib/models/category"

// GET - Fetch all categories
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

    const categories = await getAllCategories()
    return NextResponse.json(categories)
  } catch (error) {
    console.error("Error fetching categories:", error)
    return NextResponse.json(
      { error: "Failed to fetch categories" },
      { status: 500 }
    )
  }
}

// POST - Create a new category
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
    const { title, imageURL } = body

    if (!title || typeof title !== "string") {
      return NextResponse.json(
        { error: "Title is required" },
        { status: 400 }
      )
    }

    const category = await createCategory({ title, imageURL })
    return NextResponse.json(category, { status: 201 })
  } catch (error: any) {
    console.error("Error creating category:", error)
    
    // Handle duplicate key error
    if (error.code === 11000) {
      return NextResponse.json(
        { error: "Category with this title already exists" },
        { status: 409 }
      )
    }
    
    return NextResponse.json(
      { error: "Failed to create category" },
      { status: 500 }
    )
  }
}
