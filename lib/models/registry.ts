/**
 * Model Registry
 *
 * This file ensures all Mongoose models are registered in the correct order
 * before any queries run. This prevents "Schema hasn't been registered" errors
 * that occur when models reference each other via populate().
 *
 * Import this file in any model that uses populate() with references.
 */

import mongoose from "mongoose";
import { getExamModel } from "./exam";
import getBatchModel from "./batch";
import getBatchFileModel from "./batchFile";
import { getCategoryById, getCategoryModel } from "./category";
import { getQuestionModel } from "./question";

/**
 * Register all models in the correct dependency order.
 * This ensures that when populate() is called, the referenced model exists.
 *
 * Note: We check mongoose.models directly instead of a flag because
 * hot reload in development can clear models while keeping the flag.
 */
export async function ensureModelsRegistered(): Promise<void> {
  getBatchModel();
  getExamModel();  
  getBatchFileModel()
  getCategoryModel()
  getQuestionModel()
  await import("@/models/Order.model");
  await import("@/models/BatchPurchase.model");
}

/**
 * Get a model by name, ensuring all models are registered first.
 * Use this instead of mongoose.model() directly when you need to
 * access a model that might not be loaded yet.
 */
export function getModel<T>(name: string): mongoose.Model<T> {
  return mongoose.models[name] as mongoose.Model<T>;
}
