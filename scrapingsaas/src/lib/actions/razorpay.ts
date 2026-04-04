"use server";

import { razorpay } from "@/lib/razorpay";
import { auth } from "@/auth";
import { nanoid } from "nanoid";

export async function createRazorpayOrder(amount: number) {
  const session = await auth();

  if (!session?.user?.id) {
    throw new Error("Unauthorized");
  }

  // Multiply by 100 as Razorpay expects amount in paise (for INR)
  const options = {
    amount: amount * 100,
    currency: "INR",
    receipt: `receipt_${nanoid()}`,
    notes: {
      userId: session.user.id,
    },
  };

  try {
    const order = await razorpay.orders.create(options);
    return {
      id: order.id,
      amount: order.amount,
      currency: order.currency,
    };
  } catch (error) {
    console.error("Razorpay Order Error:", error);
    throw new Error("Failed to create order");
  }
}
