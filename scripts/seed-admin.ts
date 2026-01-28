/**
 * Admin Seeder Script
 * 
 * Creates an admin account with the provided credentials.
 * Run with: npx ts-node --compiler-options '{"module":"CommonJS"}' scripts/seed-admin.ts
 * Or add to package.json scripts: "seed:admin": "tsx scripts/seed-admin.ts"
 */

import mongoose from "mongoose"
import bcrypt from "bcryptjs"
import * as dotenv from "dotenv"

// Load environment variables
dotenv.config({ path: ".env.local" })

const MONGODB_URI = process.env.MONGODB_URI

if (!MONGODB_URI) {
  console.error("❌ MONGODB_URI is not defined in .env.local")
  process.exit(1)
}

// Admin Schema (duplicated here to avoid Next.js path alias issues)
const AdminSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    password: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
)

// Default admin credentials - CHANGE THESE IN PRODUCTION
const DEFAULT_ADMIN = {
  name: process.env.ADMIN_NAME || "Admin",
  email: process.env.ADMIN_EMAIL || "admin@accurateexam.com",
  password: process.env.ADMIN_PASSWORD || "Admin@123456",
}

async function seedAdmin() {
  try {
    console.log("🔄 Connecting to MongoDB...")
    await mongoose.connect(MONGODB_URI as string)
    console.log("✅ Connected to MongoDB")

    const Admin = mongoose.models.Admin || mongoose.model("Admin", AdminSchema)

    // Check if admin already exists
    const existingAdmin = await Admin.findOne({ email: DEFAULT_ADMIN.email })
    
    if (existingAdmin) {
      console.log(`⚠️  Admin with email "${DEFAULT_ADMIN.email}" already exists`)
      console.log("   Skipping creation...")
    } else {
      // Hash password
      const salt = await bcrypt.genSalt(12)
      const hashedPassword = await bcrypt.hash(DEFAULT_ADMIN.password, salt)

      // Create admin
      const admin = new Admin({
        name: DEFAULT_ADMIN.name,
        email: DEFAULT_ADMIN.email,
        password: hashedPassword,
      })

      await admin.save()

      console.log("✅ Admin created successfully!")
      console.log("   Name:", DEFAULT_ADMIN.name)
      console.log("   Email:", DEFAULT_ADMIN.email)
      console.log("   Password:", DEFAULT_ADMIN.password)
      console.log("")
      console.log("⚠️  IMPORTANT: Change these credentials in production!")
    }
  } catch (error) {
    console.error("❌ Error seeding admin:", error)
    process.exit(1)
  } finally {
    await mongoose.disconnect()
    console.log("🔌 Disconnected from MongoDB")
    process.exit(0)
  }
}

seedAdmin()
