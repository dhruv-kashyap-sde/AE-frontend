/**
 * Payment Repository
 *
 * All database operations for Orders and BatchPurchases.
 * No Razorpay logic. No revalidation. No auth checks.
 */

import dbConnect from "@/lib/mongoose"
import { Order, IOrderDocument } from "@/models/Order.model"
import { BatchPurchase, IBatchPurchaseDocument } from "@/models/BatchPurchase.model"
import mongoose, { Types } from "mongoose"
import getBatchModel from "@/lib/models/batch"

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

/**
 * Fetch user purchases with full batch + exam details.
 * Returns data ready for dashboard display.
 */
export async function findUserPurchasesWithDetails(userId: string) {
  await dbConnect()

  // Ensure all referenced models are registered
  const { ensureModelsRegistered } = await import("@/lib/models/registry")
  ensureModelsRegistered()

  const BPModel = BatchPurchase()
  console.log(Object.keys(mongoose.models));
  
  const purchases = await BPModel.find({
    userId: new Types.ObjectId(userId),
  })
    .populate({
      path: "batchId",
      populate: {
        path: "exam",
        select: "title slug imageURL",
      },
    })
    .sort({ createdAt: -1 })
    .lean()

  // Get test counts for each batch
  const getTestModel = (await import("@/lib/models/test")).default
  const TestModel = getTestModel()

  const enriched = await Promise.all(
    purchases.map(async (purchase) => {
      const batch = purchase.batchId as unknown as Record<string, unknown> | null
      const batchObjId = batch?._id?.toString()
      const totalTests = batchObjId
        ? await TestModel.countDocuments({ batch: batchObjId })
        : 0

      return {
        id: (purchase._id as Types.ObjectId).toString(),
        validFrom: purchase.validFrom.toISOString(),
        validTill: purchase.validTill.toISOString(),
        status: purchase.status,
        batch: batch
          ? {
              id: (batch._id as Types.ObjectId).toString(),
              title: batch.title as string,
              slug: batch.slug as string,
              contentType: batch.contentType as string,
              totalCount: batch.totalCount as number,
              exam: batch.exam
                ? {
                    id: ((batch.exam as Record<string, unknown>)._id as Types.ObjectId).toString(),
                    title: (batch.exam as Record<string, unknown>).title as string,
                    slug: (batch.exam as Record<string, unknown>).slug as string,
                    imageURL: ((batch.exam as Record<string, unknown>).imageURL as string | null),
                  }
                : null,
            }
          : null,
        totalTests,
        // TODO: replace with actual completed count once test attempts exist
        testsCompleted: 0,
      }
    })
  )

  return enriched
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
