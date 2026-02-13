"use server"

/**
 * Payment Server Actions
 *
 * Orchestrates the payment flow:
 *  1. Validate batch & user
 *  2. If price === 0 → create BatchPurchase directly
 *  3. If price > 0  → create Razorpay order + Order record
 *
 * Webhook handles the actual purchase creation for paid orders.
 */

import { getServerSession } from "next-auth"
import { authOptions } from "@/app/api/auth/[...nextauth]/route"
import { revalidatePath } from "next/cache"
import dbConnect from "@/lib/mongoose"
import razorpay from "@/lib/razorpay"
import { getBatchById } from "@/lib/models/batch"
import {
  createOrderRecord,
  createBatchPurchase,
  findActivePurchase,
} from "@/server/payments/payment.repository"

function addMonths(date: Date, months: number): Date {
  const d = new Date(date)
  d.setMonth(d.getMonth() + months)
  return d
}

// ─── Create Batch Order ──────────────────────────────────────

export async function createBatchOrderAction(batchId: string) {
  try {
    // 1. Authenticate
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
      return { success: false, error: "Please sign in to continue" }
    }

    const userId = session.user.id

    // 2. Fetch batch from DB (never trust frontend price)
    await dbConnect()
    const batch = await getBatchById(batchId)
    if (!batch) {
      return { success: false, error: "Batch not found" }
    }

    // 3. Check for existing active purchase
    const existing = await findActivePurchase(userId, batchId)
    if (existing) {
      return { success: false, error: "You already have access to this batch" }
    }

    // 4. Determine expiry duration
    const expiryMonths = batch.expiry ?? 12 // default 12 months if null

    // ─── FREE BATCH (₹0) ───────────────────────────────────
    if (batch.price === 0) {
      const now = new Date()
      await createBatchPurchase({
        userId,
        batchId,
        orderId: null,
        validFrom: now,
        validTill: addMonths(now, expiryMonths),
      })

      revalidatePath("/dashboard")
      return { success: true, free: true }
    }

    // ─── PAID BATCH ─────────────────────────────────────────
    const amountInPaise = Math.round(batch.price * 100)

    // Create Razorpay order
    const razorpayOrder = await razorpay.orders.create({
      amount: amountInPaise,
      currency: "INR",
      receipt: `batch_${batchId}_${Date.now()}`,
      notes: {
        userId,
        batchId,
        batchTitle: batch.title,
      },
    })

    // Persist order record
    await createOrderRecord({
      userId,
      batchId,
      amount: amountInPaise,
      providerOrderId: razorpayOrder.id,
    })

    return {
      success: true,
      free: false,
      order: {
        id: razorpayOrder.id,
        amount: amountInPaise,
        currency: "INR",
        keyId: process.env.RAZORPAY_KEY_ID!,
        batchTitle: batch.title,
        userName: session.user.name,
        userEmail: session.user.email,
      },
    }
  } catch (error: unknown) {
    console.error("createBatchOrderAction error:", error)
    return {
      success: false,
      error: "Something went wrong. Please try again.",
    }
  }
}

// ─── Verify Payment (client-side callback fallback) ─────────

export async function verifyPaymentAction(data: {
  razorpay_order_id: string
  razorpay_payment_id: string
  razorpay_signature: string
}) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
      return { success: false, error: "Not authenticated" }
    }

    // Verify signature
    const crypto = await import("crypto")
    const expectedSignature = crypto
      .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET!)
      .update(`${data.razorpay_order_id}|${data.razorpay_payment_id}`)
      .digest("hex")

    if (expectedSignature !== data.razorpay_signature) {
      return { success: false, error: "Invalid payment signature" }
    }

    // Note: actual purchase creation is done by the webhook.
    // This action only validates the signature for immediate UI feedback.
    revalidatePath("/dashboard")
    return { success: true }
  } catch (error) {
    console.error("verifyPaymentAction error:", error)
    return { success: false, error: "Verification failed" }
  }
}
