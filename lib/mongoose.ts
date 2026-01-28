/**
 * Mongoose Connection Utility
 * 
 * Singleton pattern to reuse connection across hot reloads in development.
 * Uses Mongoose for schema validation and model management.
 */

import mongoose, { Mongoose } from "mongoose"

const MONGODB_URI = process.env.MONGODB_URI!

if (!MONGODB_URI) {
  throw new Error('Missing environment variable: "MONGODB_URI"')
}

interface MongooseCache {
  conn: Mongoose | null
  promise: Promise<Mongoose> | null
}

/**
 * Global is used to preserve connection across hot reloads in development
 */
declare global {
  // eslint-disable-next-line no-var
  var mongooseCache: MongooseCache | undefined
}

const cached: MongooseCache = global.mongooseCache ?? { conn: null, promise: null }

if (!global.mongooseCache) {
  global.mongooseCache = cached
}

/**
 * Connect to MongoDB using Mongoose
 * Returns the cached connection if available
 */
async function dbConnect(): Promise<Mongoose> {
  if (cached.conn) {
    return cached.conn
  }

  if (!cached.promise) {
    const opts = {
      bufferCommands: false,
    }

    cached.promise = mongoose.connect(MONGODB_URI, opts)
  }

  try {
    cached.conn = await cached.promise
  } catch (e) {
    cached.promise = null
    throw e
  }

  return cached.conn
}

export default dbConnect
