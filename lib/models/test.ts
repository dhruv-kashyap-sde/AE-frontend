/**
 * Test Model (Mongoose Schema)
 * 
 * Represents practice tests within a batch.
 * Each test is a container for MCQ questions.
 */

import mongoose, { Schema, Document, Model, Types } from "mongoose"
import dbConnect from "@/lib/mongoose"

// Test interface for TypeScript
export interface ITest {
  title: string
  slug: string
  batch: Types.ObjectId
  marksPerQuestion: number
  duration: number // in minutes
  negativeMarking: boolean
  negativeMarkValue: number
  questionCount: number
  createdAt: Date
  updatedAt: Date
}

// Document interface (includes Mongoose document properties)
export interface ITestDocument extends ITest, Document {
  id: string
}

// Test schema definition
const TestSchema = new Schema<ITestDocument>(
  {
    title: {
      type: String,
      required: [true, "Test title is required"],
      trim: true,
      maxlength: [200, "Title cannot exceed 200 characters"],
    },
    slug: {
      type: String,
      required: [true, "Slug is required"],
      lowercase: true,
      trim: true,
    },
    batch: {
      type: Schema.Types.ObjectId,
      ref: "Batch",
      required: [true, "Batch is required"],
      index: true,
    },
    marksPerQuestion: {
      type: Number,
      required: [true, "Marks per question is required"],
      min: [0.25, "Marks must be at least 0.25"],
      default: 1,
    },
    duration: {
      type: Number,
      required: [true, "Duration is required"],
      min: [1, "Duration must be at least 1 minute"],
      default: 60,
    },
    negativeMarking: {
      type: Boolean,
      default: false,
    },
    negativeMarkValue: {
      type: Number,
      default: 0,
      min: [0, "Negative mark value cannot be negative"],
    },
    questionCount: {
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

// Compound unique index: slug must be unique within a batch
TestSchema.index({ batch: 1, slug: 1 }, { unique: true })

// Pre-save middleware to generate slug
TestSchema.pre("save", function () {
  if (this.isModified("title") && !this.slug) {
    this.slug = this.title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)/g, "")
  }
})

// Get or create the model (handles hot reload in development)
function getTestModel(): Model<ITestDocument> {
  return mongoose.models.Test || mongoose.model<ITestDocument>("Test", TestSchema)
}

// ============================================
// CRUD Functions
// ============================================

/**
 * Get all tests for a batch
 */
export async function getTestsByBatch(batchId: string): Promise<ITestDocument[]> {
  await dbConnect()
  const Test = getTestModel()
  return Test.find({ batch: batchId }).sort({ createdAt: -1 }).lean()
}

/**
 * Get a test by ID
 */
export async function getTestById(id: string): Promise<ITestDocument | null> {
  await dbConnect()
  const Test = getTestModel()
  return Test.findById(id).lean()
}

/**
 * Get a test by slug within a batch
 */
export async function getTestBySlug(batchId: string, slug: string): Promise<ITestDocument | null> {
  await dbConnect()
  const Test = getTestModel()
  return Test.findOne({ batch: batchId, slug }).lean()
}

/**
 * Create a new test
 */
export async function createTest(data: {
  title: string
  batch: string
  marksPerQuestion: number
  duration: number
  negativeMarking: boolean
  negativeMarkValue: number
}): Promise<ITestDocument> {
  await dbConnect()
  const Test = getTestModel()
  
  // Generate slug from title
  const slug = data.title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "")
  
  const test = new Test({
    ...data,
    slug,
    negativeMarkValue: data.negativeMarking ? data.negativeMarkValue : 0,
  })
  
  return test.save()
}

/**
 * Update a test
 */
export async function updateTest(
  id: string,
  data: Partial<{
    title: string
    marksPerQuestion: number
    duration: number
    negativeMarking: boolean
    negativeMarkValue: number
  }>
): Promise<ITestDocument | null> {
  await dbConnect()
  const Test = getTestModel()
  
  // If title is being updated, update slug as well
  const updateData: Record<string, unknown> = { ...data }
  if (data.title) {
    updateData.slug = data.title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)/g, "")
  }
  
  // If negative marking is disabled, set value to 0
  if (data.negativeMarking === false) {
    updateData.negativeMarkValue = 0
  }
  
  return Test.findByIdAndUpdate(id, updateData, { new: true, runValidators: true }).lean()
}

/**
 * Delete a test
 */
export async function deleteTest(id: string): Promise<ITestDocument | null> {
  await dbConnect()
  const Test = getTestModel()
  return Test.findByIdAndDelete(id).lean()
}

/**
 * Update test question count
 */
export async function updateTestQuestionCount(id: string, count: number): Promise<ITestDocument | null> {
  await dbConnect()
  const Test = getTestModel()
  return Test.findByIdAndUpdate(id, { questionCount: count }, { new: true }).lean()
}

/**
 * Get test count for a batch
 */
export async function getTestCountByBatch(batchId: string): Promise<number> {
  await dbConnect()
  const Test = getTestModel()
  return Test.countDocuments({ batch: batchId })
}

export default getTestModel
