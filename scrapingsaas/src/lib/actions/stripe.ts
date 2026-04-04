"use server";

import { stripe } from "@/lib/stripe";
import { auth } from "@/auth";
import { redirect } from "next/navigation";

export async function createCheckoutSession(priceId: string) {
  const session = await auth();

  if (!session?.user?.id) {
    throw new Error("Unauthorized");
  }

  const checkoutSession = await stripe.checkout.sessions.create({
    mode: "subscription",
    customer_email: session.user.email!,
    line_items: [
      {
        price: priceId,
        quantity: 1,
      },
    ],
    success_url: `${process.env.NEXT_PUBLIC_APP_URL}/dashboard?success=true`,
    cancel_url: `${process.env.NEXT_PUBLIC_APP_URL}/dashboard?canceled=true`,
    metadata: {
      userId: session.user.id,
    },
  });

  if (!checkoutSession.url) {
    throw new Error("Could not create checkout session");
  }

  return redirect(checkoutSession.url);
}

export async function createCustomerPortal() {
  const session = await auth();

  if (!session?.user?.id || !session?.user?.stripeCustomerId) {
    throw new Error("Unauthorized or No Stripe Customer ID found");
  }

  const portalSession = await stripe.billingPortal.sessions.create({
    customer: session.user.stripeCustomerId,
    return_url: `${process.env.NEXT_PUBLIC_APP_URL}/dashboard/settings`,
  });

  return redirect(portalSession.url);
}
