"use server"

/**
 * Server Actions for Batch Management
 * 
 * These actions handle all batch CRUD operations.
 * They are called directly from client components.
 */

import { revalidatePath } from "next/cache"
import { getServerSession } from "next-auth"
import { authOptions } from "@/app/api/auth/[...nextauth]/route"
import {
  createBatch as createBatchModel,
  updateBatch as updateBatchModel,
  deleteBatch as deleteBatchModel,
  getBatchesByExam,
  type BatchContentType,
} from "@/lib/models/batch"
import { incrementExamBatches, decrementExamBatches } from "@/lib/models/exam"

// Types for action responses
type ActionResponse<T = void> = 
  | { success: true; data: T }
  | { success: false; error: string }

// ==================== BATCH ACTIONS ====================

/**
 * Create a new batch
 */
export async function createBatch(
  examId: string,
  examSlug: string,
  data: {
    title: string
    price: number
    originalPrice: number
    expiry?: number | null
    contentType: BatchContentType
    description?: string | null
    isFeatured?: boolean
  }
): Promise<ActionResponse<{ id: string }>> {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session || session.user.role !== "admin") {
      return { success: false, error: "Unauthorized" }
    }

    if (!data.title?.trim()) {
      return { success: false, error: "Batch title is required" }
    }

    if (data.price < 0) {
      return { success: false, error: "Price cannot be negative" }
    }

    if (data.originalPrice < 0) {
      return { success: false, error: "Original price cannot be negative" }
    }

    const batch = await createBatchModel({
      title: data.title.trim(),
      exam: examId,
      price: data.price,
      originalPrice: data.originalPrice,
      expiry: data.expiry ?? null,
      contentType: data.contentType,
      description: data.description || null,
      isFeatured: data.isFeatured || false,
    })

    // Increment exam's batch count
    await incrementExamBatches(examId)

    revalidatePath(`/admin/exam/${examSlug}`)
    revalidatePath("/admin/exam")
    revalidatePath("/")
    
    return { success: true, data: { id: batch._id.toString() } }
  } catch (error: any) {
    console.error("Error creating batch:", error)
    
    // Handle duplicate slug error
    if (error.code === 11000) {
      return { success: false, error: "A batch with this title already exists in this exam" }
    }
    
    return { success: false, error: "Failed to create batch" }
  }
}

/**
 * Update an existing batch
 */
export async function updateBatch(
  batchId: string,
  examSlug: string,
  data: {
    title?: string
    price?: number
    originalPrice?: number
    expiry?: number | null
    contentType?: BatchContentType
    description?: string | null
    isFeatured?: boolean
  }
): Promise<ActionResponse> {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session || session.user.role !== "admin") {
      return { success: false, error: "Unauthorized" }
    }

    if (!batchId) {
      return { success: false, error: "Batch ID is required" }
    }

    const updateData: Record<string, unknown> = {}
    
    if (data.title?.trim()) {
      updateData.title = data.title.trim()
    }
    
    if (data.price !== undefined) {
      if (data.price < 0) {
        return { success: false, error: "Price cannot be negative" }
      }
      updateData.price = data.price
    }
    
    if (data.originalPrice !== undefined) {
      if (data.originalPrice < 0) {
        return { success: false, error: "Original price cannot be negative" }
      }
      updateData.originalPrice = data.originalPrice
    }
    
    if (data.expiry !== undefined) {
      updateData.expiry = data.expiry ?? null
    }
    
    if (data.contentType) {
      updateData.contentType = data.contentType
    }
    
    if (data.description !== undefined) {
      updateData.description = data.description || null
    }

    if (data.isFeatured !== undefined) {
      updateData.isFeatured = data.isFeatured
    }

    const batch = await updateBatchModel(batchId, updateData)
    
    if (!batch) {
      return { success: false, error: "Batch not found" }
    }

    revalidatePath(`/admin/exam/${examSlug}`)
    revalidatePath("/admin/exam")
    revalidatePath("/")
    
    return { success: true, data: undefined }
  } catch (error: any) {
    console.error("Error updating batch:", error)
    
    if (error.code === 11000) {
      return { success: false, error: "A batch with this title already exists in this exam" }
    }
    
    return { success: false, error: "Failed to update batch" }
  }
}

/**
 * Delete a batch (cascade deletes tests/files and their children)
 */
export async function deleteBatch(
  batchId: string,
  examId: string,
  examSlug: string
): Promise<ActionResponse> {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session || session.user.role !== "admin") {
      return { success: false, error: "Unauthorized" }
    }

    if (!batchId) {
      return { success: false, error: "Batch ID is required" }
    }

    const deleted = await deleteBatchModel(batchId)
    
    if (!deleted) {
      return { success: false, error: "Batch not found" }
    }

    // Decrement exam's batch count
    await decrementExamBatches(examId)

    revalidatePath(`/admin/exam/${examSlug}`)
    revalidatePath("/admin/exam")
    revalidatePath("/")
    
    return { success: true, data: undefined }
  } catch (error) {
    console.error("Error deleting batch:", error)
    return { success: false, error: "Failed to delete batch" }
  }
}

/**
 * Refresh batches list (used after mutations for optimistic updates)
 */
export async function refreshBatches(examId: string) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session || session.user.role !== "admin") {
      return { success: false, error: "Unauthorized", data: [] }
    }

    const batches = await getBatchesByExam(examId)
    return { success: true, data: JSON.parse(JSON.stringify(batches)) }
  } catch (error) {
    console.error("Error fetching batches:", error)
    return { success: false, error: "Failed to fetch batches", data: [] }
  }
}
