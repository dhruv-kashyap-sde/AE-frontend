"use client"

import { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { BookOpen, ArrowLeft, Eye, EyeOff } from "lucide-react"
import { toast } from "sonner"
import { authApi } from "@/lib/auth-api"

export default function ForgotPasswordForm() {
  const router = useRouter()
  const [step, setStep] = useState<'email' | 'otp' | 'success'>('email')
  const [email, setEmail] = useState("")
  const [otp, setOtp] = useState("")
  const [newPassword, setNewPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)

  const handleRequestOtp = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setLoading(true)

    try {
      await authApi.requestPasswordReset(email)
      toast.success('If an account exists with this email, you will receive a password reset OTP.')
      setStep('otp')
    } catch (error: any) {
      // Always show success to prevent email enumeration
      toast.success('If an account exists with this email, you will receive a password reset OTP.')
      setStep('otp')
    } finally {
      setLoading(false)
    }
  }

  const handleResetPassword = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()

    if (newPassword.length < 6) {
      toast.error('Password must be at least 6 characters long')
      return
    }

    if (newPassword !== confirmPassword) {
      toast.error('Passwords do not match')
      return
    }

    setLoading(true)

    try {
      await authApi.resetPassword(email, otp, newPassword)
      toast.success('Password reset successful!')
      setStep('success')
    } catch (error: any) {
      toast.error(error.message || 'Failed to reset password. Please check your OTP.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center py-12 px-4 bg-muted/50">
      <div className="w-full max-w-md">
        <Link href="/" className="flex items-center justify-center gap-2 mb-8">
          <div className="h-12 w-12 rounded-lg bg-primary flex items-center justify-center">
            <BookOpen className="h-7 w-7 text-primary-foreground" />
          </div>
          <span className="text-2xl font-bold">AccurateExam</span>
        </Link>

        <Card>
          <CardHeader className="space-y-1">
            <CardTitle className="text-2xl text-center">
              {step === 'success' ? 'Password Reset!' : 'Reset Password'}
            </CardTitle>
            <CardDescription className="text-center">
              {step === 'email' && 'Enter your email to receive a password reset OTP'}
              {step === 'otp' && 'Enter the OTP and your new password'}
              {step === 'success' && 'Your password has been reset successfully'}
            </CardDescription>
          </CardHeader>
          <CardContent>
            {step === 'email' && (
              <form onSubmit={handleRequestOtp} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="email">Email Address</Label>
                  <Input
                    type="email"
                    id="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    placeholder="you@example.com"
                    disabled={loading}
                  />
                </div>

                <Button type="submit" className="w-full" size="lg" disabled={loading}>
                  {loading ? 'Sending...' : 'Send OTP'}
                </Button>

                <Link 
                  href="/login" 
                  className="flex items-center justify-center gap-2 text-sm text-muted-foreground hover:text-foreground mt-4"
                >
                  <ArrowLeft className="h-4 w-4" />
                  Back to login
                </Link>
              </form>
            )}

            {step === 'otp' && (
              <form onSubmit={handleResetPassword} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="otp">Enter OTP</Label>
                  <Input
                    type="text"
                    id="otp"
                    value={otp}
                    onChange={(e) => setOtp(e.target.value.replace(/\D/g, '').slice(0, 6))}
                    required
                    placeholder="000000"
                    maxLength={6}
                    disabled={loading}
                  />
                  <p className="text-xs text-muted-foreground">
                    OTP sent to {email}
                  </p>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="newPassword">New Password</Label>
                  <div className="relative">
                    <Input
                      type={showPassword ? "text" : "password"}
                      id="newPassword"
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      required
                      placeholder="At least 6 characters"
                      disabled={loading}
                      className="pr-10"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                    >
                      {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </button>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="confirmPassword">Confirm New Password</Label>
                  <Input
                    type="password"
                    id="confirmPassword"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    required
                    placeholder="Confirm your new password"
                    disabled={loading}
                  />
                </div>

                <div className="flex gap-2">
                  <Button
                    type="button"
                    variant="outline"
                    className="flex-1"
                    onClick={() => setStep('email')}
                    disabled={loading}
                  >
                    Back
                  </Button>
                  <Button type="submit" className="flex-1" disabled={loading}>
                    {loading ? 'Resetting...' : 'Reset Password'}
                  </Button>
                </div>
              </form>
            )}

            {step === 'success' && (
              <div className="space-y-4">
                <div className="flex justify-center">
                  <div className="h-16 w-16 rounded-full bg-green-100 flex items-center justify-center">
                    <svg
                      className="h-8 w-8 text-green-600"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M5 13l4 4L19 7"
                      />
                    </svg>
                  </div>
                </div>
                <p className="text-center text-muted-foreground">
                  You can now login with your new password.
                </p>
                <Button 
                  className="w-full" 
                  size="lg"
                  onClick={() => router.push('/login')}
                >
                  Go to Login
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
