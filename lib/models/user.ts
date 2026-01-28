/**
 * User Model (Mongoose Schema)
 * 
 * Handles all user-related database operations.
 * Users are created automatically on first Google OAuth login.
 */

import mongoose, { Schema, Document, Model } from "mongoose"
import dbConnect from "@/lib/mongoose"

// User interface for TypeScript
export interface IUser {
  name: string
  email: string
  avatar: string | null
  provider: string      // "google"
  providerId: string    // Google user ID
  createdAt: Date
  updatedAt: Date
}

// Document interface (includes Mongoose document properties)
export interface IUserDocument extends IUser, Document {
  id: string  // Virtual getter for _id as string
}

// User schema definition
const UserSchema = new Schema<IUserDocument>(
  {
    name: {
      type: String,
      required: [true, "Name is required"],
      trim: true,
      maxlength: [100, "Name cannot exceed 100 characters"],
    },
    email: {
      type: String,
      required: [true, "Email is required"],
      unique: true,
      lowercase: true,
      trim: true,
      match: [/^\S+@\S+\.\S+$/, "Please enter a valid email"],
    },
    avatar: {
      type: String,
      default: null,
    },
    provider: {
      type: String,
      required: true,
      enum: ["google", "credentials"],
      default: "google",
    },
    providerId: {
      type: String,
      required: true,
      index: true,
    },
  },
  {
    timestamps: true, // Automatically adds createdAt and updatedAt
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

// Create compound index for provider + providerId
UserSchema.index({ provider: 1, providerId: 1 }, { unique: true })

// Get or create the model (handles hot reload in development)
function getUserModel(): Model<IUserDocument> {
  return mongoose.models.User || mongoose.model<IUserDocument>("User", UserSchema)
}

/**
 * Find user by email
 */
export async function findUserByEmail(email: string): Promise<IUserDocument | null> {
  await dbConnect()
  const User = getUserModel()
  return User.findOne({ email: email.toLowerCase() })
}

/**
 * Find user by provider ID (Google ID)
 */
export async function findUserByProviderId(
  provider: string,
  providerId: string
): Promise<IUserDocument | null> {
  await dbConnect()
  const User = getUserModel()
  return User.findOne({ provider, providerId })
}

/**
 * Find user by ID
 */
export async function findUserById(id: string): Promise<IUserDocument | null> {
  await dbConnect()
  const User = getUserModel()
  return User.findById(id)
}

/**
 * Create a new user
 */
export async function createUser(userData: {
  name: string
  email: string
  avatar: string | null
  provider: string
  providerId: string
}): Promise<IUserDocument> {
  await dbConnect()
  const User = getUserModel()
  
  const user = new User({
    name: userData.name,
    email: userData.email.toLowerCase(),
    avatar: userData.avatar,
    provider: userData.provider,
    providerId: userData.providerId,
  })

  await user.save()
  return user
}

/**
 * Update user
 */
export async function updateUser(
  id: string,
  updates: Partial<Pick<IUser, "name" | "avatar">>
): Promise<IUserDocument | null> {
  await dbConnect()
  const User = getUserModel()
  
  return User.findByIdAndUpdate(
    id,
    { $set: updates },
    { new: true, runValidators: true }
  )
}

/**
 * Find or create user from OAuth profile
 * This is the main function used during authentication
 */
export async function findOrCreateUser(profile: {
  name: string
  email: string
  image: string | null
  provider: string
  providerId: string
}): Promise<IUserDocument> {
  await dbConnect()
  
  // First, try to find by provider ID (most reliable)
  let user = await findUserByProviderId(profile.provider, profile.providerId)

  if (user) {
    // Update avatar if changed
    if (user.avatar !== profile.image) {
      user = await updateUser(user.id, { avatar: profile.image })
    }
    return user!
  }

  // If not found by provider ID, check by email (account linking)
  user = await findUserByEmail(profile.email)

  if (user) {
    // User exists with same email but different provider
    // For now, we'll return the existing user
    // You could implement account linking logic here
    return user
  }

  // Create new user
  return createUser({
    name: profile.name,
    email: profile.email,
    avatar: profile.image,
    provider: profile.provider,
    providerId: profile.providerId,
  })
}

// Export the model for direct access when needed
export const User = getUserModel
