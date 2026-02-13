/**
 * Access Service
 *
 * Determines whether a user has active access to a batch.
 * This is the ONLY authority for access decisions.
 * Do NOT check Order or Razorpay for access — only BatchPurchase.
 */

import { findActivePurchase } from "@/server/payments/payment.repository"

/**
 * Returns true if the user currently has an active, non-expired purchase
 * for the given batch.
 */
export async function hasActiveBatchAccess(
  userId: string,
  batchId: string
): Promise<boolean> {
  const purchase = await findActivePurchase(userId, batchId)
  return !!purchase
}
