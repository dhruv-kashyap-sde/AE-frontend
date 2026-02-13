/**
 * BatchPurchase Model (Mongoose Schema)
 *
 * Controls user access to a batch.
 * Access is determined ONLY by this model — not Order, not Razorpay.
 *
 * When a purchase is made:
 *  - validFrom = purchase date
 *  - validTill = validFrom + batch.expiry (months)
 *  - status = "active"
 *
 * Access check:  status === "active" AND validTill > now
 */

import mongoose, { Schema, Document, Model, Types } from "mongoose"

export type PurchaseStatus = "active" | "expired" | "revoked"

export interface IBatchPurchase {
  userId: Types.ObjectId
  batchId: Types.ObjectId
  orderId: Types.ObjectId | null  // null for ₹0 purchases
  validFrom: Date
  validTill: Date
  status: PurchaseStatus
  createdAt: Date
  updatedAt: Date
}

export interface IBatchPurchaseDocument extends IBatchPurchase, Document {
  id: string
}

const BatchPurchaseSchema = new Schema<IBatchPurchaseDocument>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: [true, "User is required"],
      index: true,
    },
    batchId: {
      type: Schema.Types.ObjectId,
      ref: "Batch",
      required: [true, "Batch is required"],
      index: true,
    },
    orderId: {
      type: Schema.Types.ObjectId,
      ref: "Order",
      default: null,
    },
    validFrom: {
      type: Date,
      required: [true, "Valid from date is required"],
    },
    validTill: {
      type: Date,
      required: [true, "Valid till date is required"],
    },
    status: {
      type: String,
      enum: ["active", "expired", "revoked"],
      default: "active",
    },
  },
  {
    timestamps: true,
    toJSON: {
      virtuals: true,
      transform: (_, ret) => {
        ret.id = ret._id.toString()
        delete (ret as { __v?: number }).__v
        return ret
      },
    },
  }
)

// Compound index: one active purchase per user per batch
BatchPurchaseSchema.index({ userId: 1, batchId: 1, status: 1 })
BatchPurchaseSchema.index({ validTill: 1 })

function getBatchPurchaseModel(): Model<IBatchPurchaseDocument> {
  return (
    mongoose.models.BatchPurchase ||
    mongoose.model<IBatchPurchaseDocument>("BatchPurchase", BatchPurchaseSchema)
  )
}

export const BatchPurchase = getBatchPurchaseModel
