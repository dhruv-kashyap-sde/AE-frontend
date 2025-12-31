"use client"

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/context/AuthContext'
import { Spinner } from '@/components/ui/spinner'

/**
 * ProtectedRoute - Wrapper component for route protection
 * 
 * @param {Object} props
 * @param {React.ReactNode} props.children - Child components to render
 * @param {string[]} props.allowedRoles - Array of roles allowed to access this route
 * @param {string} props.redirectTo - Where to redirect if not authorized (default: /login)
 */
export function ProtectedRoute({ 
  children, 
  allowedRoles = ['user', 'admin'], 
  redirectTo = '/login' 
}) {
  const { user, loading, isAuthenticated } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (loading) return

    // Not authenticated - redirect to login
    if (!isAuthenticated) {
      router.replace(redirectTo)
      return
    }

    // Check role-based access
    if (user && !allowedRoles.includes(user.role)) {
      // Redirect based on user's actual role
      if (user.role === 'admin') {
        router.replace('/admin')
      } else {
        router.replace('/dashboard')
      }
    }
  }, [loading, isAuthenticated, user, allowedRoles, redirectTo, router])

  // Show loading spinner while checking auth
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Spinner className="h-8 w-8" />
      </div>
    )
  }

  // Not authenticated
  if (!isAuthenticated) {
    return null
  }

  // Wrong role
  if (user && !allowedRoles.includes(user.role)) {
    return null
  }

  return <>{children}</>
}

/**
 * AdminRoute - Shorthand for admin-only routes
 */
export function AdminRoute({ children }) {
  return (
    <ProtectedRoute allowedRoles={['admin']} redirectTo="/login?admin=true">
      {children}
    </ProtectedRoute>
  )
}

/**
 * UserRoute - Shorthand for user-only routes
 */
export function UserRoute({ children }) {
  return (
    <ProtectedRoute allowedRoles={['user']} redirectTo="/login">
      {children}
    </ProtectedRoute>
  )
}
