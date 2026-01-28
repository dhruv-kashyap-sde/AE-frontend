"use client"

import { useSearchParams } from "next/navigation"
import AuthDialog from "@/components/AuthDialog"

export default function LoginForm() {
  const searchParams = useSearchParams()
  const isAdminLogin = searchParams.get("admin") === "true"

  return (
    <AuthDialog
      open={true}
      onOpenChange={() => {}}
      initialMode={isAdminLogin ? "admin" : "login"}
      isPage={true}
    />
  )
}
