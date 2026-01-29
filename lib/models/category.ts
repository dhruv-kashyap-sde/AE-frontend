/**
 * Category Model (Mongoose Schema)
 * 
 * Represents exam categories like Engineering, Medical, Banking, etc.
 */

import mongoose, { Schema, Document, Model } from "mongoose"
import dbConnect from "@/lib/mongoose"

// Category interface for TypeScript
export interface ICategory {
  title: string
  imageURL: string | null
  createdAt: Date
  updatedAt: Date
}

// Document interface (includes Mongoose document properties)
export interface ICategoryDocument extends ICategory, Document {
  id: string
}

// Category schema definition
const CategorySchema = new Schema<ICategoryDocument>(
  {
    title: {
      type: String,
      required: [true, "Category title is required"],
      trim: true,
      unique: true,
      maxlength: [100, "Title cannot exceed 100 characters"],
    },
    imageURL: {
      type: String,
      default: null,
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
function getCategoryModel(): Model<ICategoryDocument> {
  return mongoose.models.Category || mongoose.model<ICategoryDocument>("Category", CategorySchema)
}

/**
 * Get all categories
 */
export async function getAllCategories(): Promise<ICategoryDocument[]> {
  await dbConnect()
  const Category = getCategoryModel()
  return Category.find().sort({ title: 1 })
}

/**
 * Get category by ID
 */
export async function getCategoryById(id: string): Promise<ICategoryDocument | null> {
  await dbConnect()
  const Category = getCategoryModel()
  return Category.findById(id)
}

/**
 * Create a new category
 */
export async function createCategory(data: {
  title: string
  imageURL?: string | null
}): Promise<ICategoryDocument> {
  await dbConnect()
  const Category = getCategoryModel()
  
  const category = new Category({
    title: data.title,
    imageURL: data.imageURL || null,
  })

  await category.save()
  return category
}

/**
 * Update a category
 */
export async function updateCategory(
  id: string,
  data: Partial<Pick<ICategory, "title" | "imageURL">>
): Promise<ICategoryDocument | null> {
  await dbConnect()
  const Category = getCategoryModel()
  
  return Category.findByIdAndUpdate(
    id,
    { $set: data },
    { new: true, runValidators: true }
  )
}

/**
 * Delete a category
 */
export async function deleteCategory(id: string): Promise<boolean> {
  await dbConnect()
  const Category = getCategoryModel()
  
  const result = await Category.findByIdAndDelete(id)
  return !!result
}

// Export the model for direct access
export const Category = getCategoryModel
