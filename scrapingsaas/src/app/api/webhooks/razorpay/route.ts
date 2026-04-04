import { NextRequest, NextResponse } from "next/server";
import crypto from "crypto";
import { db } from "@/db";
import { users, usage_logs } from "@/db/schema";
import { eq, sql } from "drizzle-orm";
import { nanoid } from "nanoid";

const WEBHOOK_SECRET = process.env.RAZORPAY_WEBHOOK_SECRET!;

export async function POST(req: NextRequest) {
  const body = await req.text();
  const signature = req.headers.get("x-razorpay-signature");

  if (!signature) {
    return NextResponse.json({ error: "Missing signature" }, { status: 400 });
  }

  // Verify Webhook Signature
  const expectedSignature = crypto
    .createHmac("sha256", WEBHOOK_SECRET)
    .update(body)
    .digest("hex");

  if (expectedSignature !== signature) {
    return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
  }

  const event = JSON.parse(body);

  if (event.event === "payment.captured") {
    const payment = event.payload.payment.entity;
    const userId = payment.notes.userId;
    const amountInPaise = payment.amount;
    const amountInINR = amountInPaise / 100;

    // Calculate credits (e.g., 1 INR = 10 credits)
    const creditsToAdd = amountInINR * 10;

    if (userId) {
      // Update User Credits
      await db
        .update(users)
        .set({
          credits: sql`${users.credits} + ${creditsToAdd}`,
          tier: "pro", // Auto-upgrade to pro tier after first payment
        })
        .where(eq(users.id, userId));

      // Log Payment in Usage
      await db.insert(usage_logs).values({
        id: nanoid(),
        userId: userId,
        scraperId: "SYSTEM_PAYMENT", // Special log for payments
        creditsUsed: -creditsToAdd, // Negative means credits added
        status: "payment_success",
      });
    }
  }

  return NextResponse.json({ success: true });
}
