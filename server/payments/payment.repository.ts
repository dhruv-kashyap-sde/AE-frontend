/**
 * Payment Repository
 *
 * All database operations for Orders and BatchPurchases.
 * No Razorpay logic. No revalidation. No auth checks.
 */

import dbConnect from "@/lib/mongoose"
import { Order, IOrderDocument } from "@/models/Order.model"
import { BatchPurchase, IBatchPurchaseDocument } from "@/models/BatchPurchase.model"
import { Types } from "mongoose"

// ─── Order Operations ────────────────────────────────────────

export async function createOrderRecord(data: {
  userId: string
  batchId: string
  amount: number
  providerOrderId: string
}): Promise<IOrderDocument> {
  await dbConnect()
  const OrderModel = Order()

  const order = new OrderModel({
    userId: new Types.ObjectId(data.userId),
    batchId: new Types.ObjectId(data.batchId),
    amount: data.amount,
    currency: "INR",
    provider: "razorpay",
    providerOrderId: data.providerOrderId,
    status: "created",
  })

  return order.save()
}

export async function findOrderByProviderOrderId(
  providerOrderId: string
): Promise<IOrderDocument | null> {
  await dbConnect()
  const OrderModel = Order()
  return OrderModel.findOne({ providerOrderId })
}

export async function markOrderAsPaid(
  providerOrderId: string
): Promise<IOrderDocument | null> {
  await dbConnect()
  const OrderModel = Order()
  return OrderModel.findOneAndUpdate(
    { providerOrderId },
    { $set: { status: "paid" } },
    { new: true }
  )
}

export async function markOrderAsFailed(
  providerOrderId: string
): Promise<IOrderDocument | null> {
  await dbConnect()
  const OrderModel = Order()
  return OrderModel.findOneAndUpdate(
    { providerOrderId },
    { $set: { status: "failed" } },
    { new: true }
  )
}

// ─── BatchPurchase Operations ────────────────────────────────

export async function createBatchPurchase(data: {
  userId: string
  batchId: string
  orderId: string | null
  validFrom: Date
  validTill: Date
}): Promise<IBatchPurchaseDocument> {
  await dbConnect()
  const BPModel = BatchPurchase()

  const purchase = new BPModel({
    userId: new Types.ObjectId(data.userId),
    batchId: new Types.ObjectId(data.batchId),
    orderId: data.orderId ? new Types.ObjectId(data.orderId) : null,
    validFrom: data.validFrom,
    validTill: data.validTill,
    status: "active",
  })

  return purchase.save()
}

export async function findActivePurchase(
  userId: string,
  batchId: string
): Promise<IBatchPurchaseDocument | null> {
  await dbConnect()
  const BPModel = BatchPurchase()
  return BPModel.findOne({
    userId: new Types.ObjectId(userId),
    batchId: new Types.ObjectId(batchId),
    status: "active",
    validTill: { $gt: new Date() },
  })
}

export async function findUserPurchases(
  userId: string
): Promise<IBatchPurchaseDocument[]> {
  await dbConnect()
  const BPModel = BatchPurchase()
  return BPModel.find({
    userId: new Types.ObjectId(userId),
    status: "active",
    validTill: { $gt: new Date() },
  })
    .populate("batchId")
    .sort({ createdAt: -1 })
    .lean()
}

export async function expireOldPurchases(): Promise<number> {
  await dbConnect()
  const BPModel = BatchPurchase()
  const result = await BPModel.updateMany(
    { status: "active", validTill: { $lte: new Date() } },
    { $set: { status: "expired" } }
  )
  return result.modifiedCount
}
