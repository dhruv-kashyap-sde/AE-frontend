/**
 * NextAuth Configuration
 * 
 * Handles Google OAuth authentication for users and
 * credentials authentication for admins.
 */

import NextAuth, { NextAuthOptions, Session } from "next-auth"
import { JWT } from "next-auth/jwt"
import GoogleProvider from "next-auth/providers/google"
import CredentialsProvider from "next-auth/providers/credentials"
import { findOrCreateUser } from "@/lib/models/user"
import { verifyAdminCredentials } from "@/lib/models/admin"

const GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID!
const GOOGLE_CLIENT_SECRET = process.env.GOOGLE_CLIENT_SECRET!

export const authOptions: NextAuthOptions = {
  // Use JWT for session management (stateless, fast)
  session: {
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },

  providers: [
    GoogleProvider({
      clientId: GOOGLE_CLIENT_ID,
      clientSecret: GOOGLE_CLIENT_SECRET,
    }),
    CredentialsProvider({
      id: "admin-login",
      name: "Admin Login",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          throw new Error("Email and password are required")
        }

        const admin = await verifyAdminCredentials(
          credentials.email,
          credentials.password
        )

        if (!admin) {
          throw new Error("Invalid email or password")
        }

        // Return admin data for JWT
        return {
          id: admin.id,
          name: admin.name,
          email: admin.email,
          role: "admin",
        }
      },
    }),
  ],

  callbacks: {
    /**
     * Sign In Callback
     * Called when user signs in - creates account if first time
     */
    async signIn({ user, account, profile }) {
      // Admin login via credentials
      if (account?.provider === "admin-login") {
        return true
      }

      // Google OAuth for regular users
      if (account?.provider === "google" && profile) {
        try {
          await findOrCreateUser({
            name: profile.name || user.name || "User",
            email: profile.email || user.email!,
            image: user.image || null,
            provider: "google",
            providerId: account.providerAccountId,
          })
          return true
        } catch (error) {
          console.error("Error during sign in:", error)
          return false
        }
      }
      return true
    },

    /**
     * JWT Callback
     * Called when JWT is created or updated
     * Add user data to token
     */
    async jwt({ token, user, account, profile }) {
      // Admin login - user object comes from authorize()
      if (account?.provider === "admin-login" && user) {
        token.id = user.id
        token.name = user.name
        token.email = user.email
        token.role = "admin"
        token.provider = "credentials"
        return token
      }

      // Google OAuth - initial sign in
      if (account?.provider === "google" && profile) {
        const dbUser = await findOrCreateUser({
          name: profile.name || user?.name || "User",
          email: profile.email || user?.email || "",
          image: user?.image || null,
          provider: "google",
          providerId: account.providerAccountId,
        })

        token.id = dbUser.id || ""
        token.name = dbUser.name
        token.email = dbUser.email
        token.picture = dbUser.avatar
        token.role = "user"
        token.provider = dbUser.provider
      }

      return token
    },

    /**
     * Session Callback
     * Called when session is accessed
     * Expose user data to client
     */
    async session({ session, token }: { session: Session; token: JWT }) {
      if (session.user) {
        session.user.id = token.id as string
        session.user.name = token.name as string
        session.user.email = token.email as string
        session.user.image = token.picture as string || ""
        session.user.role = token.role as string || "user"
      }
      return session
    },
  },

  pages: {
    // Custom pages (optional - uses default NextAuth pages if not set)
    // signIn: "/login",
    // error: "/login",
  },

  // Debug mode in development
  debug: process.env.NODE_ENV === "development",
}

const handler = NextAuth(authOptions)

export { handler as GET, handler as POST }