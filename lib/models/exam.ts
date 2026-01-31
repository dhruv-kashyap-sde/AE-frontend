/**
 * Exam Model (Mongoose Schema)
 * 
 * Represents exams like JEE Main, NEET, SSC CGL, etc.
 * Each exam belongs to a category.
 */

import mongoose, { Schema, Document, Model, Types } from "mongoose"
import dbConnect from "@/lib/mongoose"
import { ensureModelsRegistered } from "./registry"

// Exam interface for TypeScript
export interface IExam {
  title: string
  slug: string
  imageURL: string | null
  category: Types.ObjectId
  totalBatches: number
  createdAt: Date
  updatedAt: Date
}

// Document interface (includes Mongoose document properties)
export interface IExamDocument extends IExam, Document {
  id: string
}

// Populated exam interface (when category is populated)
export interface IExamPopulated extends Omit<IExamDocument, "category"> {
  category: {
    _id: Types.ObjectId
    id: string
    title: string
    imageURL: string | null
  }
}

// Exam schema definition
const ExamSchema = new Schema<IExamDocument>(
  {
    title: {
      type: String,
      required: [true, "Exam title is required"],
      trim: true,
      maxlength: [200, "Title cannot exceed 200 characters"],
    },
    slug: {
      type: String,
      required: [true, "Slug is required"],
      unique: true,
      lowercase: true,
      trim: true,
    },
    imageURL: {
      type: String,
      default: null,
    },
    category: {
      type: Schema.Types.ObjectId,
      ref: "Category",
      required: [true, "Category is required"],
      index: true,
    },
    totalBatches: {
      type: Number,
      default: 0,
      min: 0,
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

// Note: slug index is automatically created by unique: true
// Do NOT add ExamSchema.index({ slug: 1 }) - it causes duplicate index warning

// Pre-save middleware to generate slug
ExamSchema.pre("save", function () {
  if (this.isModified("title") && !this.slug) {
    this.slug = this.title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)/g, "")
  }
})

// Get or create the model (handles hot reload in development)
function getExamModel(): Model<IExamDocument> {
  return mongoose.models.Exam || mongoose.model<IExamDocument>("Exam", ExamSchema)
}

/**
 * Get all exams (with category populated)
 */
export async function getAllExams(): Promise<IExamPopulated[]> {
  await dbConnect()
  await ensureModelsRegistered()
  const Exam = getExamModel()
  return Exam.find()
    .populate("category", "title imageURL")
    .sort({ createdAt: -1 }) as unknown as Promise<IExamPopulated[]>
}

/**
 * Get exams by category
 */
export async function getExamsByCategory(categoryId: string): Promise<IExamPopulated[]> {
  await dbConnect()
  await ensureModelsRegistered()
  const Exam = getExamModel()
  return Exam.find({ category: categoryId })
    .populate("category", "title imageURL")
    .sort({ title: 1 }) as unknown as Promise<IExamPopulated[]>
}

/**
 * Get exam by ID
 */
export async function getExamById(id: string): Promise<IExamPopulated | null> {
  await dbConnect()
  await ensureModelsRegistered()
  const Exam = getExamModel()
  return Exam.findById(id)
    .populate("category", "title imageURL") as unknown as Promise<IExamPopulated | null>
}

/**
 * Get exam by slug
 */
export async function getExamBySlug(slug: string): Promise<IExamPopulated | null> {
  await dbConnect()
  await ensureModelsRegistered()
  const Exam = getExamModel()
  return Exam.findOne({ slug })
    .populate("category", "title imageURL") as unknown as Promise<IExamPopulated | null>
}

/**
 * Create a new exam
 */
export async function createExam(data: {
  title: string
  slug?: string
  imageURL?: string | null
  category: string
}): Promise<IExamDocument> {
  await dbConnect()
  const Exam = getExamModel()
  
  // Generate slug if not provided
  const slug = data.slug || data.title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "")
  
  const exam = new Exam({
    title: data.title,
    slug,
    imageURL: data.imageURL || null,
    category: data.category,
    totalBatches: 0,
  })

  await exam.save()
  return exam
}

/**
 * Update an exam
 */
export async function updateExam(
  id: string,
  data: Partial<Pick<IExam, "title" | "slug" | "imageURL" | "category" | "totalBatches">>
): Promise<IExamDocument | null> {
  await dbConnect()
  const Exam = getExamModel()
  
  // If title is being updated and no new slug provided, regenerate slug
  if (data.title && !data.slug) {
    data.slug = data.title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)/g, "")
  }
  
  return Exam.findByIdAndUpdate(
    id,
    { $set: data },
    { new: true, runValidators: true }
  )
}

/**
 * Delete an exam (cascade deletes all batches, tests, questions, and files)
 */
export async function deleteExam(id: string): Promise<boolean> {
  await dbConnect()
  const Exam = getExamModel()
  
  // Import here to avoid circular dependency
  const { deleteBatchesByExam } = await import("./batch")
  
  // First cascade delete all batches (which will delete tests, questions, files)
  await deleteBatchesByExam(id)
  
  // Then delete the exam itself
  const result = await Exam.findByIdAndDelete(id)
  return !!result
}

/**
 * Increment total batches count
 */
export async function incrementExamBatches(examId: string): Promise<IExamDocument | null> {
  await dbConnect()
  const Exam = getExamModel()
  
  return Exam.findByIdAndUpdate(
    examId,
    { $inc: { totalBatches: 1 } },
    { new: true }
  )
}

/**
 * Decrement total batches count
 */
export async function decrementExamBatches(examId: string): Promise<IExamDocument | null> {
  await dbConnect()
  const Exam = getExamModel()
  
  return Exam.findByIdAndUpdate(
    examId,
    { $inc: { totalBatches: -1 } },
    { new: true }
  )
}

// Export the model for direct access
export const Exam = getExamModel
