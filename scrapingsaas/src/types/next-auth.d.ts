import { DefaultSession } from "next-auth";

declare module "next-auth" {
  interface User {
    stripeCustomerId?: string | null;
    stripeSubscriptionId?: string | null;
    credits: number;
    tier: "free" | "pro" | "enterprise";
  }

  interface AdapterUser {
    credits: number;
    tier: "free" | "pro" | "enterprise";
  }

  interface Session {
    user: {
      id: string;
      stripeCustomerId?: string | null;
      stripeSubscriptionId?: string | null;
      credits: number;
      tier: "free" | "pro" | "enterprise";
    } & DefaultSession["user"];
  }
}
