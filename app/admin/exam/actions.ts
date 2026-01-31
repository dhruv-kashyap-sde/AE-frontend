"use server"

/**
 * Server Actions for Exam Management
 * 
 * These actions handle all exam CRUD operations.
 * They are called directly from client components.
 */

import { revalidatePath } from "next/cache"
import { getServerSession } from "next-auth"
import { authOptions } from "@/app/api/auth/[...nextauth]/route"
import {
  createExam as createExamModel,
  updateExam as updateExamModel,
  deleteExam as deleteExamModel,
  getAllExams,
} from "@/lib/models/exam"
import {
  createCategory as createCategoryModel,
  updateCategory as updateCategoryModel,
  deleteCategory as deleteCategoryModel,
  getAllCategories,
} from "@/lib/models/category"

// Types for action responses
type ActionResponse<T = void> = 
  | { success: true; data: T }
  | { success: false; error: string }

// ==================== EXAM ACTIONS ====================

/**
 * Create a new exam
 */
export async function createExam(data: {
  title: string
  category: string
  imageURL?: string | null
}): Promise<ActionResponse<{ id: string }>> {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session || session.user.role !== "admin") {
      return { success: false, error: "Unauthorized" }
    }

    if (!data.title?.trim()) {
      return { success: false, error: "Exam title is required" }
    }

    if (!data.category) {
      return { success: false, error: "Category is required" }
    }

    const exam = await createExamModel({
      title: data.title.trim(),
      category: data.category,
      imageURL: data.imageURL || null,
    })

    revalidatePath("/admin/exam")
    revalidatePath("/")
    
    return { success: true, data: { id: exam._id.toString() } }
  } catch (error: any) {
    console.error("Error creating exam:", error)
    
    // Handle duplicate slug error
    if (error.code === 11000) {
      return { success: false, error: "An exam with this title already exists" }
    }
    
    return { success: false, error: "Failed to create exam" }
  }
}

/**
 * Update an existing exam
 */
export async function updateExam(
  id: string,
  data: {
    title?: string
    category?: string
    imageURL?: string | null
  }
): Promise<ActionResponse> {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session || session.user.role !== "admin") {
      return { success: false, error: "Unauthorized" }
    }

    if (!id) {
      return { success: false, error: "Exam ID is required" }
    }

    const updateData: Record<string, unknown> = {}
    
    if (data.title?.trim()) {
      updateData.title = data.title.trim()
    }
    
    if (data.category) {
      updateData.category = data.category
    }
    
    if (data.imageURL !== undefined) {
      updateData.imageURL = data.imageURL || null
    }

    const exam = await updateExamModel(id, updateData)
    
    if (!exam) {
      return { success: false, error: "Exam not found" }
    }

    revalidatePath("/admin/exam")
    revalidatePath("/")
    
    return { success: true, data: undefined }
  } catch (error: any) {
    console.error("Error updating exam:", error)
    
    if (error.code === 11000) {
      return { success: false, error: "An exam with this title already exists" }
    }
    
    return { success: false, error: "Failed to update exam" }
  }
}

/**
 * Delete an exam (cascade deletes batches, tests, questions, files)
 */
export async function deleteExam(id: string): Promise<ActionResponse> {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session || session.user.role !== "admin") {
      return { success: false, error: "Unauthorized" }
    }

    if (!id) {
      return { success: false, error: "Exam ID is required" }
    }

    const deleted = await deleteExamModel(id)
    
    if (!deleted) {
      return { success: false, error: "Exam not found" }
    }

    revalidatePath("/admin/exam")
    revalidatePath("/")
    
    return { success: true, data: undefined }
  } catch (error) {
    console.error("Error deleting exam:", error)
    return { success: false, error: "Failed to delete exam" }
  }
}

/**
 * Refresh exams list (used after mutations for optimistic updates)
 */
export async function refreshExams() {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session || session.user.role !== "admin") {
      return { success: false, error: "Unauthorized", data: [] }
    }

    const exams = await getAllExams()
    return { success: true, data: JSON.parse(JSON.stringify(exams)) }
  } catch (error) {
    console.error("Error fetching exams:", error)
    return { success: false, error: "Failed to fetch exams", data: [] }
  }
}

// ==================== CATEGORY ACTIONS ====================

/**
 * Create a new category
 */
export async function createCategory(data: {
  title: string
  imageURL?: string | null
}): Promise<ActionResponse<{ id: string }>> {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session || session.user.role !== "admin") {
      return { success: false, error: "Unauthorized" }
    }

    if (!data.title?.trim()) {
      return { success: false, error: "Category title is required" }
    }

    const category = await createCategoryModel({
      title: data.title.trim(),
      imageURL: data.imageURL || null,
    })

    revalidatePath("/admin/exam")
    revalidatePath("/")
    
    return { success: true, data: { id: category._id.toString() } }
  } catch (error: any) {
    console.error("Error creating category:", error)
    
    if (error.code === 11000) {
      return { success: false, error: "A category with this title already exists" }
    }
    
    return { success: false, error: "Failed to create category" }
  }
}

/**
 * Update an existing category
 */
export async function updateCategory(
  id: string,
  data: {
    title?: string
    imageURL?: string | null
  }
): Promise<ActionResponse> {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session || session.user.role !== "admin") {
      return { success: false, error: "Unauthorized" }
    }

    if (!id) {
      return { success: false, error: "Category ID is required" }
    }

    const updateData: Record<string, unknown> = {}
    
    if (data.title?.trim()) {
      updateData.title = data.title.trim()
    }
    
    if (data.imageURL !== undefined) {
      updateData.imageURL = data.imageURL || null
    }

    const category = await updateCategoryModel(id, updateData)
    
    if (!category) {
      return { success: false, error: "Category not found" }
    }

    revalidatePath("/admin/exam")
    revalidatePath("/")
    
    return { success: true, data: undefined }
  } catch (error: any) {
    console.error("Error updating category:", error)
    
    if (error.code === 11000) {
      return { success: false, error: "A category with this title already exists" }
    }
    
    return { success: false, error: "Failed to update category" }
  }
}

/**
 * Delete a category
 */
export async function deleteCategory(id: string): Promise<ActionResponse> {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session || session.user.role !== "admin") {
      return { success: false, error: "Unauthorized" }
    }

    if (!id) {
      return { success: false, error: "Category ID is required" }
    }

    const deleted = await deleteCategoryModel(id)
    
    if (!deleted) {
      return { success: false, error: "Category not found" }
    }

    revalidatePath("/admin/exam")
    revalidatePath("/")
    
    return { success: true, data: undefined }
  } catch (error) {
    console.error("Error deleting category:", error)
    return { success: false, error: "Failed to delete category" }
  }
}

/**
 * Refresh categories list
 */
export async function refreshCategories() {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session || session.user.role !== "admin") {
      return { success: false, error: "Unauthorized", data: [] }
    }

    const categories = await getAllCategories()
    return { success: true, data: JSON.parse(JSON.stringify(categories)) }
  } catch (error) {
    console.error("Error fetching categories:", error)
    return { success: false, error: "Failed to fetch categories", data: [] }
  }
}
