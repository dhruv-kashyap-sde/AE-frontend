/**
 * Razorpay Client Utility
 *
 * Initialises a singleton Razorpay instance for server-side usage.
 * Never import this file on the client.
 */

import Razorpay from "razorpay"

const RAZORPAY_KEY_ID = process.env.RAZORPAY_KEY_ID!
const RAZORPAY_KEY_SECRET = process.env.RAZORPAY_KEY_SECRET!

if (!RAZORPAY_KEY_ID || !RAZORPAY_KEY_SECRET) {
  throw new Error("Missing Razorpay key environment variables")
}

const razorpay = new Razorpay({
  key_id: RAZORPAY_KEY_ID,
  key_secret: RAZORPAY_KEY_SECRET,
})

export default razorpay
