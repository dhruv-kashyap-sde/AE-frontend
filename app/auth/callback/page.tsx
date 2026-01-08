"use client"

import { Suspense, useEffect } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { useAuth } from '@/context/AuthContext'
import { authApi } from '@/lib/auth-api'
import { toast } from 'sonner'

function AuthCallbackContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const { login } = useAuth()

  useEffect(() => {
    const handleCallback = async () => {
      const success = searchParams.get('success')
      const error = searchParams.get('error')

      if (error) {
        toast.error('Authentication failed. Please try again.')
        router.push('/login')
        return
      }

      if (success === 'true') {
        try {
          // Fetch user profile (cookies were set by the server)
          const response = await authApi.getProfile()
          if (response.success && response.data.user) {
            const user = response.data.user
            await login(user)
            toast.success('Successfully logged in!')
            // Redirect based on role
            if (user.role === 'admin') {
              router.push('/admin')
            } else {
              router.push('/dashboard')
            }
          } else {
            throw new Error('Failed to get user profile')
          }
        } catch (error) {
          console.error('Auth callback error:', error)
          toast.error('Authentication failed')
          router.push('/login')
        }
      } else {
        router.push('/login')
      }
    }

    handleCallback()
  }, [searchParams, router, login])

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
        <p className="mt-4 text-muted-foreground">Completing authentication...</p>
      </div>
    </div>
  )
}

export default function AuthCallbackPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4 text-muted-foreground">Loading...</p>
        </div>
      </div>
    }>
      <AuthCallbackContent />
    </Suspense>
  )
}
