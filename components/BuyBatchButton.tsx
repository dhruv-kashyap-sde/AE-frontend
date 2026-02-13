"use client"

/**
 * BuyBatchButton
 *
 * Client component that handles the Razorpay checkout flow.
 *
 * Flow:
 *  1. User clicks "Buy Now"
 *  2. Server action creates Razorpay order (or free purchase)
 *  3. Razorpay checkout modal opens
 *  4. On success → verify signature via server action
 *  5. Webhook handles actual purchase creation
 */

import { useState } from "react"
import { useRouter } from "next/navigation"
import { useSession } from "next-auth/react"
import { Button } from "@/components/ui/button"
import { ShoppingCart, Loader2, Check } from "lucide-react"
import { toast } from "sonner"
import {
  createBatchOrderAction,
  verifyPaymentAction,
} from "@/server/payments/payment.actions"

// Load Razorpay script dynamically
function loadRazorpayScript(): Promise<boolean> {
  return new Promise((resolve) => {
    if (typeof window !== "undefined" && (window as any).Razorpay) {
      resolve(true)
      return
    }
    const script = document.createElement("script")
    script.src = "https://checkout.razorpay.com/v1/checkout.js"
    script.onload = () => resolve(true)
    script.onerror = () => resolve(false)
    document.body.appendChild(script)
  })
}

interface BuyBatchButtonProps {
  batchId: string
  price: number
  className?: string
  size?: "default" | "sm" | "lg" | "icon"
  variant?: "default" | "outline" | "secondary"
}

export default function BuyBatchButton({
  batchId,
  price,
  className,
  size = "default",
  variant = "default",
}: BuyBatchButtonProps) {
  const [isLoading, setIsLoading] = useState(false)
  const [isPurchased, setIsPurchased] = useState(false)
  const router = useRouter()
  const { data: session } = useSession()

  const handleBuy = async () => {
    if (!session?.user) {
      router.push("/login")
      return
    }

    setIsLoading(true)

    try {
      // 1. Create order via server action
      const result = await createBatchOrderAction(batchId)

      if (!result.success) {
        toast.error(result.error)
        return
      }

      // 2. Free batch — already purchased by server action
      if (result.free) {
        setIsPurchased(true)
        toast.success("Batch activated successfully!")
        router.refresh()
        return
      }

      // 3. Paid batch — open Razorpay checkout
      const loaded = await loadRazorpayScript()
      if (!loaded) {
        toast.error("Payment system failed to load. Please try again.")
        return
      }

      const order = result.order!

      const options = {
        key: order.keyId,
        amount: order.amount,
        currency: order.currency,
        name: "AccurateExam",
        description: order.batchTitle,
        order_id: order.id,
        prefill: {
          name: order.userName,
          email: order.userEmail,
        },
        theme: {
          color: "#2563eb",
        },
        handler: async (response: {
          razorpay_order_id: string
          razorpay_payment_id: string
          razorpay_signature: string
        }) => {
          // 4. Verify on server
          const verification = await verifyPaymentAction(response)

          if (verification.success) {
            setIsPurchased(true)
            toast.success("Payment successful! Access granted.")
            router.refresh()
          } else {
            toast.error(verification.error || "Payment verification failed")
          }
        },
        modal: {
          ondismiss: () => {
            toast.info("Payment cancelled")
          },
        },
      }

      const rzp = new (window as any).Razorpay(options)
      rzp.on("payment.failed", (response: any) => {
        toast.error(
          response.error?.description || "Payment failed. Please try again."
        )
      })
      rzp.open()
    } catch (error) {
      console.error("Buy error:", error)
      toast.error("Something went wrong. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  if (isPurchased) {
    return (
      <Button
        size={size}
        variant="outline"
        className={className}
        disabled
      >
        <Check className="h-4 w-4 mr-2" />
        Purchased
      </Button>
    )
  }

  return (
    <Button
      size={size}
      variant={variant}
      className={className}
      onClick={handleBuy}
      disabled={isLoading}
    >
      {isLoading ? (
        <Loader2 className="h-4 w-4 mr-2 animate-spin" />
      ) : (
        <ShoppingCart className="h-4 w-4 mr-2" />
      )}
      {price === 0 ? "Get Free Access" : "Buy Now"}
    </Button>
  )
}
