/**
 * Razorpay Webhook Route
 *
 * Handles payment confirmation from Razorpay.
 *
 * Flow:
 *  1. Verify webhook signature
 *  2. Find the Order in DB by providerOrderId
 *  3. If already paid → return 200 (idempotent)
 *  4. Mark order as paid
 *  5. Create BatchPurchase → grants access
 *
 * ONLY the webhook creates BatchPurchase for paid orders.
 * The client-side callback is for UI feedback only.
 */

import { NextRequest, NextResponse } from "next/server"
import crypto from "crypto"
import dbConnect from "@/lib/mongoose"
import { getBatchById } from "@/lib/models/batch"
import {
  findOrderByProviderOrderId,
  markOrderAsPaid,
  markOrderAsFailed,
  createBatchPurchase,
  findActivePurchase,
} from "@/server/payments/payment.repository"

function addMonths(date: Date, months: number): Date {
  const d = new Date(date)
  d.setMonth(d.getMonth() + months)
  return d
}

export async function POST(request: NextRequest) {
  try {
    // 1. Read raw body for signature verification
    const body = await request.text()
    const signature = request.headers.get("x-razorpay-signature")

    if (!signature) {
      return NextResponse.json({ error: "Missing signature" }, { status: 400 })
    }

    // 2. Verify webhook signature
    const webhookSecret = process.env.RAZORPAY_WEBHOOK_SECRET!
    const expectedSignature = crypto
      .createHmac("sha256", webhookSecret)
      .update(body)
      .digest("hex")

    if (expectedSignature !== signature) {
      console.error("Webhook signature mismatch")
      return NextResponse.json({ error: "Invalid signature" }, { status: 400 })
    }

    // 3. Parse event
    const event = JSON.parse(body)
    const eventType: string = event.event

    await dbConnect()

    // ─── Handle payment.captured ───────────────────────────
    if (eventType === "payment.captured") {
      const payment = event.payload.payment.entity
      const razorpayOrderId: string = payment.order_id

      // Find order in DB
      const order = await findOrderByProviderOrderId(razorpayOrderId)
      if (!order) {
        console.error("Order not found for providerOrderId:", razorpayOrderId)
        return NextResponse.json({ status: "order_not_found" }, { status: 200 })
      }

      // Idempotency: already processed
      if (order.status === "paid") {
        return NextResponse.json({ status: "already_processed" }, { status: 200 })
      }

      // Mark order as paid
      await markOrderAsPaid(razorpayOrderId)

      // Check if purchase already exists (double-fire protection)
      const userId = order.userId.toString()
      const batchId = order.batchId.toString()

      const existing = await findActivePurchase(userId, batchId)
      if (existing) {
        return NextResponse.json({ status: "purchase_exists" }, { status: 200 })
      }

      // Get batch to determine expiry
      const batch = await getBatchById(batchId)
      const expiryMonths = batch?.expiry ?? 12

      // Create BatchPurchase → grants access
      const now = new Date()
      await createBatchPurchase({
        userId,
        batchId,
        orderId: order._id.toString(),
        validFrom: now,
        validTill: addMonths(now, expiryMonths),
      })

      return NextResponse.json({ status: "success" }, { status: 200 })
    }

    // ─── Handle payment.failed ─────────────────────────────
    if (eventType === "payment.failed") {
      const payment = event.payload.payment.entity
      const razorpayOrderId: string = payment.order_id

      await markOrderAsFailed(razorpayOrderId)
      return NextResponse.json({ status: "failed_recorded" }, { status: 200 })
    }

    // Unknown event — acknowledge anyway
    return NextResponse.json({ status: "ignored" }, { status: 200 })
  } catch (error) {
    console.error("Webhook processing error:", error)
    // Return 200 even on error to prevent Razorpay retries on server bugs
    return NextResponse.json({ status: "error" }, { status: 200 })
  }
}
