"use client";

import React, { useState } from "react";
import NeonButton from "@/components/NeonButton";
import { createRazorpayOrder } from "@/lib/actions/razorpay";

declare global {
  interface Window {
    Razorpay: any;
  }
}

interface RazorpayButtonProps {
  amount: number; // in INR
  label?: string;
  onSuccess?: () => void;
}

const RazorpayButton: React.FC<RazorpayButtonProps> = ({ 
  amount, 
  label = "Buy Credits",
  onSuccess 
}) => {
  const [isLoading, setIsLoading] = useState(false);

  const loadScript = (src: string) => {
    return new Promise((resolve) => {
      const script = document.createElement("script");
      script.src = src;
      script.onload = () => {
        resolve(true);
      };
      script.onerror = () => {
        resolve(false);
      };
      document.body.appendChild(script);
    });
  };

  const handlePayment = async () => {
    setIsLoading(true);
    const res = await loadScript("https://checkout.razorpay.com/v1/checkout.js");

    if (!res) {
      alert("Razorpay SDK failed to load. Are you online?");
      setIsLoading(false);
      return;
    }

    try {
      const order = await createRazorpayOrder(amount);

      const options = {
        key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID, // Use public key id
        amount: order.amount,
        currency: order.currency,
        name: "ScrapingSaaS",
        description: `Purchase ${amount * 10} Credits`,
        order_id: order.id,
        handler: function (response: any) {
          // You can verify the payment signature here if needed via another action
          // but our webhook will handle the backend update
          if (onSuccess) onSuccess();
          window.location.reload(); // Refresh to show new credits
        },
        theme: {
          color: "#3399cc",
        },
      };

      const paymentObject = new window.Razorpay(options);
      paymentObject.open();
    } catch (error) {
      console.error(error);
      alert("Error starting payment. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <NeonButton
      label={isLoading ? "Processing..." : label}
      variant="secondary"
      onClick={handlePayment}
      disabled={isLoading}
    />
  );
};

export default RazorpayButton;
