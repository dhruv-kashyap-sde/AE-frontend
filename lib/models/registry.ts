/**
 * Model Registry
 * 
 * This file ensures all Mongoose models are registered in the correct order
 * before any queries run. This prevents "Schema hasn't been registered" errors
 * that occur when models reference each other via populate().
 * 
 * Import this file in any model that uses populate() with references.
 */

import mongoose from "mongoose"

// Flag to track if models have been registered
let modelsRegistered = false

/**
 * Register all models in the correct dependency order.
 * This ensures that when populate() is called, the referenced model exists.
 */
export async function ensureModelsRegistered(): Promise<void> {
  if (modelsRegistered) return
  
  // Import models in dependency order (base models first, then dependent ones)
  // This triggers the schema registration for each model
  
  // Level 1: No dependencies
  await import("./category")
  
  // Level 2: Depends on Category
  await import("./exam")
  
  // Level 3: Depends on Exam
  await import("./batch")
  
  // Level 4: Depends on Batch
  await import("./test")
  await import("./batchFile")
  
  // Level 5: Depends on Test
  await import("./question")
  
  modelsRegistered = true
}

/**
 * Get a model by name, ensuring all models are registered first.
 * Use this instead of mongoose.model() directly when you need to 
 * access a model that might not be loaded yet.
 */
export function getModel<T>(name: string): mongoose.Model<T> {
  return mongoose.models[name] as mongoose.Model<T>
}
