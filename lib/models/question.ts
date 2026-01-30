/**
 * Question Model (Mongoose Schema)
 * 
 * Represents MCQ questions within a test.
 * Each question belongs to a test and has 4 options with one correct answer.
 */

import mongoose, { Schema, Document, Model, Types } from "mongoose"
import dbConnect from "@/lib/mongoose"

// Correct option type
export type CorrectOption = "A" | "B" | "C" | "D"

// Question interface for TypeScript
export interface IQuestion {
  test: Types.ObjectId
  question: string
  optionA: string
  optionB: string
  optionC: string
  optionD: string
  correctOption: CorrectOption
  imageURL: string | null
  order: number
  createdAt: Date
  updatedAt: Date
}

// Document interface (includes Mongoose document properties)
export interface IQuestionDocument extends IQuestion, Document {
  id: string
}

// Question schema definition
const QuestionSchema = new Schema<IQuestionDocument>(
  {
    test: {
      type: Schema.Types.ObjectId,
      ref: "Test",
      required: [true, "Test is required"],
      index: true,
    },
    question: {
      type: String,
      required: [true, "Question text is required"],
      trim: true,
    },
    optionA: {
      type: String,
      required: [true, "Option A is required"],
      trim: true,
    },
    optionB: {
      type: String,
      required: [true, "Option B is required"],
      trim: true,
    },
    optionC: {
      type: String,
      required: [true, "Option C is required"],
      trim: true,
    },
    optionD: {
      type: String,
      required: [true, "Option D is required"],
      trim: true,
    },
    correctOption: {
      type: String,
      enum: ["A", "B", "C", "D"],
      required: [true, "Correct option is required"],
    },
    imageURL: {
      type: String,
      default: null,
    },
    order: {
      type: Number,
      default: 0,
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

// Index for ordering questions within a test
QuestionSchema.index({ test: 1, order: 1 })

// Get or create the model (handles hot reload in development)
function getQuestionModel(): Model<IQuestionDocument> {
  return mongoose.models.Question || mongoose.model<IQuestionDocument>("Question", QuestionSchema)
}

// ============================================
// CRUD Functions
// ============================================

/**
 * Get all questions for a test
 */
export async function getQuestionsByTest(testId: string): Promise<IQuestionDocument[]> {
  await dbConnect()
  const Question = getQuestionModel()
  return Question.find({ test: testId }).sort({ order: 1, createdAt: 1 }).lean()
}

/**
 * Get a question by ID
 */
export async function getQuestionById(id: string): Promise<IQuestionDocument | null> {
  await dbConnect()
  const Question = getQuestionModel()
  return Question.findById(id).lean()
}

/**
 * Create a single question
 */
export async function createQuestion(data: {
  test: string
  question: string
  optionA: string
  optionB: string
  optionC: string
  optionD: string
  correctOption: CorrectOption
  imageURL?: string | null
  order?: number
}): Promise<IQuestionDocument> {
  await dbConnect()
  const Question = getQuestionModel()

  // Get the next order number if not provided
  if (data.order === undefined) {
    const lastQuestion = await Question.findOne({ test: data.test })
      .sort({ order: -1 })
      .select("order")
      .lean()
    data.order = lastQuestion ? (lastQuestion.order || 0) + 1 : 1
  }

  const question = new Question(data)
  return question.save()
}

/**
 * Create multiple questions (bulk insert)
 */
export async function createQuestionsBulk(
  testId: string,
  questions: Array<{
    question: string
    optionA: string
    optionB: string
    optionC: string
    optionD: string
    correctOption: CorrectOption
    imageURL?: string | null
  }>
): Promise<IQuestionDocument[]> {
  await dbConnect()
  const Question = getQuestionModel()

  // Get the starting order number
  const lastQuestion = await Question.findOne({ test: testId })
    .sort({ order: -1 })
    .select("order")
    .lean()
  let startOrder = lastQuestion ? (lastQuestion.order || 0) + 1 : 1

  // Prepare questions with order and test reference
  const questionsToInsert = questions.map((q, index) => ({
    ...q,
    test: testId,
    order: startOrder + index,
    imageURL: q.imageURL || null,
  }))

  const inserted = await Question.insertMany(questionsToInsert)
  return inserted as unknown as IQuestionDocument[]
}

/**
 * Update a question
 */
export async function updateQuestion(
  id: string,
  data: Partial<{
    question: string
    optionA: string
    optionB: string
    optionC: string
    optionD: string
    correctOption: CorrectOption
    imageURL: string | null
    order: number
  }>
): Promise<IQuestionDocument | null> {
  await dbConnect()
  const Question = getQuestionModel()
  return Question.findByIdAndUpdate(
    id,
    { $set: data },
    { new: true, runValidators: true }
  ).lean()
}

/**
 * Delete a question
 */
export async function deleteQuestion(id: string): Promise<IQuestionDocument | null> {
  await dbConnect()
  const Question = getQuestionModel()
  return Question.findByIdAndDelete(id).lean()
}

/**
 * Delete all questions for a test
 */
export async function deleteQuestionsByTest(testId: string): Promise<number> {
  await dbConnect()
  const Question = getQuestionModel()
  const result = await Question.deleteMany({ test: testId })
  return result.deletedCount
}

/**
 * Get question count for a test
 */
export async function getQuestionCountByTest(testId: string): Promise<number> {
  await dbConnect()
  const Question = getQuestionModel()
  return Question.countDocuments({ test: testId })
}

/**
 * Reorder questions within a test
 */
export async function reorderQuestions(
  testId: string,
  questionIds: string[]
): Promise<void> {
  await dbConnect()
  const Question = getQuestionModel()

  const bulkOps = questionIds.map((id, index) => ({
    updateOne: {
      filter: { _id: id, test: testId },
      update: { $set: { order: index + 1 } },
    },
  }))

  await Question.bulkWrite(bulkOps)
}
