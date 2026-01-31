/**
 * Batch Model (Mongoose Schema)
 * 
 * Represents batches within an exam like "Batch 24-25", "Batch 25-26".
 * Each batch contains either tests or files that users can purchase.
 */

import mongoose, { Schema, Document, Model, Types } from "mongoose"
import dbConnect from "@/lib/mongoose"

// Content type enum
export type BatchContentType = "test" | "file"

// Batch interface for TypeScript
export interface IBatch {
  title: string
  slug: string
  exam: Types.ObjectId
  price: number
  originalPrice: number
  expiry: Date | null
  contentType: BatchContentType
  totalCount: number
  description: string | null
  createdAt: Date
  updatedAt: Date
}

// Document interface (includes Mongoose document properties)
export interface IBatchDocument extends IBatch, Document {
  id: string
}

// Populated batch interface (when exam is populated)
export interface IBatchPopulated extends Omit<IBatchDocument, "exam"> {
  exam: {
    _id: Types.ObjectId
    id: string
    title: string
    slug: string
    imageURL: string | null
  }
}

// Batch schema definition
const BatchSchema = new Schema<IBatchDocument>(
  {
    title: {
      type: String,
      required: [true, "Batch title is required"],
      trim: true,
      maxlength: [200, "Title cannot exceed 200 characters"],
    },
    slug: {
      type: String,
      required: [true, "Slug is required"],
      lowercase: true,
      trim: true,
    },
    exam: {
      type: Schema.Types.ObjectId,
      ref: "Exam",
      required: [true, "Exam is required"],
      index: true,
    },
    price: {
      type: Number,
      required: [true, "Price is required"],
      min: [0, "Price cannot be negative"],
    },
    originalPrice: {
      type: Number,
      required: [true, "Original price is required"],
      min: [0, "Original price cannot be negative"],
    },
    expiry: {
      type: Date,
      default: null,
    },
    contentType: {
      type: String,
      enum: ["test", "file"],
      required: [true, "Content type is required"],
      default: "test",
    },
    totalCount: {
      type: Number,
      default: 0,
      min: 0,
    },
    description: {
      type: String,
      default: null,
      maxlength: [1000, "Description cannot exceed 1000 characters"],
    },
  },
  {
    timestamps: true,
    toJSON: {
      virtuals: true,
      transform: (_, ret) => {
        ret.id = ret._id.toString()
        delete (ret as { __v?: number }).__v
        return ret
      },
    },
    toObject: {
      virtuals: true,
    },
  }
)

// Compound unique index: slug must be unique within an exam
BatchSchema.index({ exam: 1, slug: 1 }, { unique: true })

// Pre-save middleware to generate slug
BatchSchema.pre("save", function () {
  if (this.isModified("title") && !this.slug) {
    this.slug = this.title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)/g, "")
  }
})

// Get or create the model (handles hot reload in development)
function getBatchModel(): Model<IBatchDocument> {
  return mongoose.models.Batch || mongoose.model<IBatchDocument>("Batch", BatchSchema)
}

// ============================================
// CRUD Functions
// ============================================

/**
 * Get all batches for an exam
 */
export async function getBatchesByExam(examId: string): Promise<IBatchDocument[]> {
  await dbConnect()
  const Batch = getBatchModel()
  return Batch.find({ exam: examId }).sort({ createdAt: -1 }).lean()
}

/**
 * Get a batch by ID
 */
export async function getBatchById(id: string): Promise<IBatchDocument | null> {
  await dbConnect()
  const Batch = getBatchModel()
  return Batch.findById(id).lean()
}

/**
 * Get a batch by slug within an exam
 */
export async function getBatchBySlug(examId: string, slug: string): Promise<IBatchDocument | null> {
  await dbConnect()
  const Batch = getBatchModel()
  return Batch.findOne({ exam: examId, slug }).lean()
}

/**
 * Create a new batch
 */
export async function createBatch(data: {
  title: string
  exam: string
  price: number
  originalPrice: number
  expiry?: Date | null
  contentType: BatchContentType
  description?: string | null
}): Promise<IBatchDocument> {
  await dbConnect()
  const Batch = getBatchModel()
  
  // Generate slug from title
  const slug = data.title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "")
  
  const batch = new Batch({
    ...data,
    slug,
  })
  
  return batch.save()
}

/**
 * Update a batch
 */
export async function updateBatch(
  id: string,
  data: Partial<{
    title: string
    price: number
    originalPrice: number
    expiry: Date | null
    contentType: BatchContentType
    description: string | null
  }>
): Promise<IBatchDocument | null> {
  await dbConnect()
  const Batch = getBatchModel()
  
  // If title is being updated, update slug as well
  const updateData: Record<string, unknown> = { ...data }
  if (data.title) {
    updateData.slug = data.title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)/g, "")
  }
  
  return Batch.findByIdAndUpdate(id, updateData, { new: true, runValidators: true }).lean()
}

/**
 * Delete a batch (cascade deletes all tests/files and their children)
 */
export async function deleteBatch(id: string): Promise<IBatchDocument | null> {
  await dbConnect()
  const Batch = getBatchModel()
  
  // Import here to avoid circular dependency
  const { deleteTestsByBatch } = await import("./test")
  const { deleteFilesByBatch } = await import("./batchFile")
  
  // First get the batch to know its content type
  const batch = await Batch.findById(id).lean()
  
  if (batch) {
    // Cascade delete based on content type
    if (batch.contentType === "test") {
      await deleteTestsByBatch(id)
    } else {
      await deleteFilesByBatch(id)
    }
    
    // Delete the batch itself
    return Batch.findByIdAndDelete(id).lean()
  }
  
  return null
}

/**
 * Delete all batches for an exam (cascade deletes all tests/files and their children)
 */
export async function deleteBatchesByExam(examId: string): Promise<number> {
  await dbConnect()
  const Batch = getBatchModel()
  
  // Import here to avoid circular dependency
  const { deleteTestsByBatch } = await import("./test")
  const { deleteFilesByBatch } = await import("./batchFile")
  
  // Get all batches for this exam
  const batches = await Batch.find({ exam: examId }).lean()
  
  // Cascade delete for each batch
  for (const batch of batches) {
    if (batch.contentType === "test") {
      await deleteTestsByBatch(batch._id.toString())
    } else {
      await deleteFilesByBatch(batch._id.toString())
    }
  }
  
  // Delete all batches
  const result = await Batch.deleteMany({ exam: examId })
  return result.deletedCount
}

/**
 * Update batch total count
 */
export async function updateBatchCount(id: string, count: number): Promise<IBatchDocument | null> {
  await dbConnect()
  const Batch = getBatchModel()
  return Batch.findByIdAndUpdate(id, { totalCount: count }, { new: true }).lean()
}

/**
 * Get batch count for an exam
 */
export async function getBatchCountByExam(examId: string): Promise<number> {
  await dbConnect()
  const Batch = getBatchModel()
  return Batch.countDocuments({ exam: examId })
}

export default getBatchModel
