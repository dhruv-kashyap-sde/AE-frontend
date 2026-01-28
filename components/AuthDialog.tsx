"use client"

import { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { signIn } from "next-auth/react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { BookOpen, Eye, EyeOff, Shield } from "lucide-react"
import { toast } from "sonner"

type AuthMode = "login" | "signup" | "admin"

interface AuthDialogProps {
  /** Whether the dialog is open */
  open: boolean
  /** Callback when dialog open state changes */
  onOpenChange: (open: boolean) => void
  /** Initial mode: login, signup, or admin */
  initialMode?: AuthMode
  /** Whether this is rendered as a standalone page (affects close behavior) */
  isPage?: boolean
}

export default function AuthDialog({
  open,
  onOpenChange,
  initialMode = "login",
  isPage = false,
}: AuthDialogProps) {
  const router = useRouter()
  const [mode, setMode] = useState<AuthMode>(initialMode)
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)

  const isAdminLogin = mode === "admin"

  const handleAdminLogin = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    
    if (!email || !password) {
      toast.error("Please enter email and password")
      return
    }

    try {
      setLoading(true)
      
      const result = await signIn("admin-login", {
        email,
        password,
        redirect: false,
      })

      if (result?.error) {
        toast.error(result.error || "Invalid credentials")
        setLoading(false)
        return
      }

      if (result?.ok) {
        toast.success("Welcome back, Admin!")
        router.push("/admin")
        onOpenChange(false)
      }
    } catch (error) {
      console.error("Admin login error:", error)
      toast.error("Failed to sign in. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  const handleGoogleAuth = async () => {
    try {
      setLoading(true)
      // Redirect to dashboard after successful login
      await signIn("google", { callbackUrl: "/dashboard" })
    } catch (error) {
      console.error("Google sign-in error:", error)
      toast.error("Failed to sign in with Google. Please try again.")
      setLoading(false)
    }
  }

  const handleOpenChange = (newOpen: boolean) => {
    if (!newOpen && isPage) {
      // If closing and it's a page, navigate back home
      router.push("/")
    }
    onOpenChange(newOpen)
  }

  const switchMode = (newMode: AuthMode) => {
    setMode(newMode)
    // Update URL without full navigation if on a page
    if (isPage && newMode !== "admin") {
      router.replace(`/${newMode}`, { scroll: false })
    }
  }

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader className="text-center">
          <div className="flex justify-center mb-4">
            <div className={`h-12 w-12 rounded-lg flex items-center justify-center ${isAdminLogin ? 'bg-destructive' : 'bg-primary'}`}>
              {isAdminLogin ? (
                <Shield className="h-7 w-7 text-primary-foreground" />
              ) : (
                <BookOpen className="h-7 w-7 text-primary-foreground" />
              )}
            </div>
          </div>
          <DialogTitle className="text-2xl text-center">
            {isAdminLogin 
              ? "Admin Login" 
              : mode === "login" 
                ? "Welcome Back" 
                : "Create an Account"}
          </DialogTitle>
          <DialogDescription className="text-center">
            {isAdminLogin 
              ? "Enter your admin credentials to access the dashboard"
              : mode === "login"
                ? "Sign in to your account to continue"
                : "Start your exam preparation journey"}
          </DialogDescription>
        </DialogHeader>

        <div className="mt-4">
          {isAdminLogin ? (
            // Admin Login - Email/Password form
            <form onSubmit={handleAdminLogin} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email Address</Label>
                <Input
                  type="email"
                  id="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  placeholder="admin@accurateexam.com"
                  disabled={loading}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <div className="relative">
                  <Input
                    type={showPassword ? "text" : "password"}
                    id="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    placeholder="Enter your password"
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

              <Button 
                type="submit" 
                className="w-full bg-destructive hover:bg-destructive/90" 
                size="lg" 
                disabled={loading}
              >
                {loading ? "Signing in..." : "Admin Sign In"}
              </Button>
            </form>
          ) : (
            // Regular User - Google Only
            <div className="space-y-6">
              <Button 
                variant="outline" 
                type="button" 
                onClick={handleGoogleAuth}
                className="w-full"
                size="lg"
                disabled={loading}
              >
                <svg className="h-5 w-5 mr-2" viewBox="0 0 24 24">
                  <path
                    fill="currentColor"
                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                  />
                  <path
                    fill="currentColor"
                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                  />
                  <path
                    fill="currentColor"
                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                  />
                  <path
                    fill="currentColor"
                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                  />
                </svg>
                Continue with Google
              </Button>

              {mode === "signup" && (
                <p className="text-center text-xs text-muted-foreground">
                  By signing up, you agree to our{" "}
                  <Link href="/terms" className="text-primary hover:underline">
                    Terms of Service
                  </Link>{" "}
                  and{" "}
                  <Link href="/privacy" className="text-primary hover:underline">
                    Privacy Policy
                  </Link>
                </p>
              )}

              <p className="text-center text-sm text-muted-foreground">
                {mode === "login" ? (
                  <>
                    Don&apos;t have an account?{" "}
                    <button
                      type="button"
                      onClick={() => switchMode("signup")}
                      className="text-primary font-medium hover:underline"
                    >
                      Sign up
                    </button>
                  </>
                ) : (
                  <>
                    Already have an account?{" "}
                    <button
                      type="button"
                      onClick={() => switchMode("login")}
                      className="text-primary font-medium hover:underline"
                    >
                      Sign in
                    </button>
                  </>
                )}
              </p>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  )
}
