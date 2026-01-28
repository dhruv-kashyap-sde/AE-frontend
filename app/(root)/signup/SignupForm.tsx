"use client"

import AuthDialog from "@/components/AuthDialog"

export default function SignupForm() {
  return (
    <AuthDialog
      open={true}
      onOpenChange={() => {}}
      initialMode="signup"
      isPage={true}
    />
  )
}
