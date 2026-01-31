/**
 * BatchFile Model (Mongoose Schema)
 * 
 * Represents uploaded files within a batch (PDFs, images, documents, etc.)
 */

import mongoose, { Schema, Document, Model, Types } from "mongoose"
import dbConnect from "@/lib/mongoose"

// File type enum
export type FileType = "pdf" | "image" | "document" | "other"

// BatchFile interface for TypeScript
export interface IBatchFile {
  title: string
  batch: Types.ObjectId
  fileURL: string
  fileName: string
  fileType: FileType
  fileSize: number // in bytes
  mimeType: string
  createdAt: Date
  updatedAt: Date
}

// Document interface (includes Mongoose document properties)
export interface IBatchFileDocument extends IBatchFile, Document {
  id: string
}

// BatchFile schema definition
const BatchFileSchema = new Schema<IBatchFileDocument>(
  {
    title: {
      type: String,
      required: [true, "File title is required"],
      trim: true,
      maxlength: [200, "Title cannot exceed 200 characters"],
    },
    batch: {
      type: Schema.Types.ObjectId,
      ref: "Batch",
      required: [true, "Batch is required"],
      index: true,
    },
    fileURL: {
      type: String,
      required: [true, "File URL is required"],
    },
    fileName: {
      type: String,
      required: [true, "File name is required"],
    },
    fileType: {
      type: String,
      enum: ["pdf", "image", "document", "other"],
      required: [true, "File type is required"],
      default: "other",
    },
    fileSize: {
      type: Number,
      required: [true, "File size is required"],
      min: 0,
    },
    mimeType: {
      type: String,
      required: [true, "MIME type is required"],
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

// Get or create the model (handles hot reload in development)
function getBatchFileModel(): Model<IBatchFileDocument> {
  return mongoose.models.BatchFile || mongoose.model<IBatchFileDocument>("BatchFile", BatchFileSchema)
}

// Helper to determine file type from mime type
export function getFileTypeFromMime(mimeType: string): FileType {
  if (mimeType === "application/pdf") return "pdf"
  if (mimeType.startsWith("image/")) return "image"
  if (
    mimeType.includes("document") ||
    mimeType.includes("msword") ||
    mimeType.includes("spreadsheet") ||
    mimeType.includes("presentation") ||
    mimeType === "text/plain"
  ) {
    return "document"
  }
  return "other"
}

// ============================================
// CRUD Functions
// ============================================

/**
 * Get all files for a batch
 */
export async function getFilesByBatch(batchId: string): Promise<IBatchFileDocument[]> {
  await dbConnect()
  const BatchFile = getBatchFileModel()
  return BatchFile.find({ batch: batchId }).sort({ createdAt: -1 }).lean()
}

/**
 * Get a file by ID
 */
export async function getFileById(id: string): Promise<IBatchFileDocument | null> {
  await dbConnect()
  const BatchFile = getBatchFileModel()
  return BatchFile.findById(id).lean()
}

/**
 * Create a new file entry
 */
export async function createBatchFile(data: {
  title: string
  batch: string
  fileURL: string
  fileName: string
  fileSize: number
  mimeType: string
}): Promise<IBatchFileDocument> {
  await dbConnect()
  const BatchFile = getBatchFileModel()
  
  const fileType = getFileTypeFromMime(data.mimeType)
  
  const batchFile = new BatchFile({
    ...data,
    fileType,
  })
  
  return batchFile.save()
}

/**
 * Update a file
 */
export async function updateBatchFile(
  id: string,
  data: Partial<{
    title: string
  }>
): Promise<IBatchFileDocument | null> {
  await dbConnect()
  const BatchFile = getBatchFileModel()
  return BatchFile.findByIdAndUpdate(id, data, { new: true, runValidators: true }).lean()
}

/**
 * Delete a file
 */
export async function deleteBatchFile(id: string): Promise<IBatchFileDocument | null> {
  await dbConnect()
  const BatchFile = getBatchFileModel()
  return BatchFile.findByIdAndDelete(id).lean()
}

/**
 * Delete all files for a batch (cascade delete)
 */
export async function deleteFilesByBatch(batchId: string): Promise<number> {
  await dbConnect()
  const BatchFile = getBatchFileModel()
  const result = await BatchFile.deleteMany({ batch: batchId })
  return result.deletedCount
}

/**
 * Get file count for a batch
 */
export async function getFileCountByBatch(batchId: string): Promise<number> {
  await dbConnect()
  const BatchFile = getBatchFileModel()
  return BatchFile.countDocuments({ batch: batchId })
}

export default getBatchFileModel
