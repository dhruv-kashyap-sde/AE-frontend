/**
 * NextAuth TypeScript Type Extensions
 * 
 * Extends default NextAuth types to include custom user properties.
 */

import "next-auth"
import { JWT } from "next-auth/jwt"

declare module "next-auth" {
  interface Session {
    user: {
      id: string
      name: string
      email: string
      image: string | null
      role: string // "user" | "admin"
    }
  }

  interface User {
    id: string
    name: string
    email: string
    image?: string | null
    role?: string
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id: string
    name: string
    email: string
    picture?: string | null
    provider: string
    role?: string
  }
}
