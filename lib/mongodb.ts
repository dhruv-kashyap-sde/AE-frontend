/**
 * MongoDB Connection Utility
 * 
 * Singleton pattern to reuse connection across hot reloads in development.
 * Uses connection pooling for optimal performance.
 */

import { MongoClient, Db } from "mongodb"

if (!process.env.MONGODB_URI) {
  throw new Error('Missing environment variable: "MONGODB_URI"')
}

const uri = process.env.MONGODB_URI
const options = {}

let client: MongoClient
let clientPromise: Promise<MongoClient>

// In development, use global variable to preserve connection across hot reloads
if (process.env.NODE_ENV === "development") {
  const globalWithMongo = global as typeof globalThis & {
    _mongoClientPromise?: Promise<MongoClient>
  }

  if (!globalWithMongo._mongoClientPromise) {
    client = new MongoClient(uri, options)
    globalWithMongo._mongoClientPromise = client.connect()
  }
  clientPromise = globalWithMongo._mongoClientPromise
} else {
  // In production, create new client
  client = new MongoClient(uri, options)
  clientPromise = client.connect()
}

/**
 * Get MongoDB database instance
 */
export async function getDb(): Promise<Db> {
  const client = await clientPromise
  return client.db() // Uses database from connection string
}

export default clientPromise
