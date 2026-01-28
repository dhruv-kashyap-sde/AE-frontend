/**
 * Admin Model (Mongoose Schema)
 * 
 * Handles admin authentication with email/password.
 * Admins are created via seeder script, not through public registration.
 */

import mongoose, { Schema, Document, Model } from "mongoose"
import bcrypt from "bcryptjs"
import dbConnect from "@/lib/mongoose"

// Admin interface for TypeScript
export interface IAdmin {
  name: string
  email: string
  password: string
  createdAt: Date
  updatedAt: Date
}

// Document interface (includes Mongoose document properties)
export interface IAdminDocument extends IAdmin, Document {
  id: string
  comparePassword(candidatePassword: string): Promise<boolean>
}

// Admin schema definition
const AdminSchema = new Schema<IAdminDocument>(
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
    password: {
      type: String,
      required: [true, "Password is required"],
      minlength: [8, "Password must be at least 8 characters"],
      select: false, // Don't include password in queries by default
    },
  },
  {
    timestamps: true,
    toJSON: {
      virtuals: true,
      transform: (_, ret) => {
        ret.id = ret._id.toString()
        delete (ret as { password?: string }).password
        delete (ret as { __v?: number }).__v
        return ret
      },
    },
    toObject: {
      virtuals: true,
    },
  }
)

// Hash password before saving
AdminSchema.pre("save", async function () {
  if (!this.isModified("password")) {
    return
  }
  
  const salt = await bcrypt.genSalt(12)
  this.password = await bcrypt.hash(this.password, salt)
})

// Method to compare passwords
AdminSchema.methods.comparePassword = async function (
  candidatePassword: string
): Promise<boolean> {
  return bcrypt.compare(candidatePassword, this.password)
}

// Get or create the model (handles hot reload in development)
function getAdminModel(): Model<IAdminDocument> {
  return mongoose.models.Admin || mongoose.model<IAdminDocument>("Admin", AdminSchema)
}

/**
 * Find admin by email (includes password for authentication)
 */
export async function findAdminByEmail(email: string): Promise<IAdminDocument | null> {
  await dbConnect()
  const Admin = getAdminModel()
  return Admin.findOne({ email: email.toLowerCase() }).select("+password")
}

/**
 * Find admin by ID
 */
export async function findAdminById(id: string): Promise<IAdminDocument | null> {
  await dbConnect()
  const Admin = getAdminModel()
  return Admin.findById(id)
}

/**
 * Create a new admin (used by seeder)
 */
export async function createAdmin(adminData: {
  name: string
  email: string
  password: string
}): Promise<IAdminDocument> {
  await dbConnect()
  const Admin = getAdminModel()
  
  // Check if admin already exists
  const existingAdmin = await Admin.findOne({ email: adminData.email.toLowerCase() })
  if (existingAdmin) {
    throw new Error("Admin with this email already exists")
  }
  
  const admin = new Admin({
    name: adminData.name,
    email: adminData.email.toLowerCase(),
    password: adminData.password,
  })

  await admin.save()
  return admin
}

/**
 * Verify admin credentials
 */
export async function verifyAdminCredentials(
  email: string,
  password: string
): Promise<IAdminDocument | null> {
  const admin = await findAdminByEmail(email)
  
  if (!admin) {
    return null
  }
  
  const isMatch = await admin.comparePassword(password)
  
  if (!isMatch) {
    return null
  }
  
  return admin
}

// Export the model for direct access when needed
export const Admin = getAdminModel
