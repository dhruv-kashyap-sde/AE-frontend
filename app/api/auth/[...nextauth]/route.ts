/**
 * NextAuth Configuration
 * 
 * Handles Google OAuth authentication with custom MongoDB user storage.
 * Creates user accounts automatically on first login.
 */

import NextAuth, { NextAuthOptions, Session } from "next-auth"
import { JWT } from "next-auth/jwt"
import GoogleProvider from "next-auth/providers/google"
import { findOrCreateUser } from "@/lib/models/user"

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
  ],

  callbacks: {
    /**
     * Sign In Callback
     * Called when user signs in - creates account if first time
     */
    async signIn({ user, account, profile }) {
      if (account?.provider === "google" && profile) {
        try {
          // Find or create user in our database
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
      // Initial sign in
      if (account && profile) {
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
        session.user.image = token.picture as string
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