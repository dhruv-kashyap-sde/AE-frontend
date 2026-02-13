/**
 * Order Model (Mongoose Schema)
 *
 * Tracks payment intent before confirmation.
 * Each order is tied to a user and a batch.
 * This model only tracks payment state — NOT access.
 */

import mongoose, { Schema, Document, Model, Types } from "mongoose"

export type OrderStatus = "created" | "paid" | "failed"

export interface IOrder {
  userId: Types.ObjectId
  batchId: Types.ObjectId
  amount: number         // in paise (INR × 100)
  currency: string
  provider: string
  providerOrderId: string
  status: OrderStatus
  createdAt: Date
  updatedAt: Date
}

export interface IOrderDocument extends IOrder, Document {
  id: string
}

const OrderSchema = new Schema<IOrderDocument>(
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
    amount: {
      type: Number,
      required: [true, "Amount is required"],
      min: 0,
    },
    currency: {
      type: String,
      default: "INR",
    },
    provider: {
      type: String,
      default: "razorpay",
    },
    providerOrderId: {
      type: String,
      required: [true, "Provider order ID is required"],
      unique: true,
    },
    status: {
      type: String,
      enum: ["created", "paid", "failed"],
      default: "created",
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

OrderSchema.index({ providerOrderId: 1 }, { unique: true })
OrderSchema.index({ userId: 1, batchId: 1 })

function getOrderModel(): Model<IOrderDocument> {
  return mongoose.models.Order || mongoose.model<IOrderDocument>("Order", OrderSchema)
}

export const Order = getOrderModel
