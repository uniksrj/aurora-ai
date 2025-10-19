"use client";

import { useEffect, useState } from "react";
import { useSearchParams, useNavigate } from "react-router";
import { useAuth } from "../context/AuthContext";
import { addPurchase, PLAN_TYPES } from "../service/userService";

export default function PaymentSuccess() {
  const [status, setStatus] = useState("processing");
  const searchParams = useSearchParams();
  const navigate = useNavigate();
  const { currentUser } = useAuth();

  const txnid = searchParams.get("txnid");
  const planType = parseInt(searchParams.get("plan"));

  useEffect(() => {
    const processPayment = async () => {
      if (!currentUser || !txnid || !planType) {
        setStatus("error");
        return;
      }

      try {
        // Find plan details
        const plans = {
          [PLAN_TYPES.STARTER]: { name: "Starter", amount: 899, credits: 1000 },
          [PLAN_TYPES.PRO]: { name: "Pro", amount: 1699, credits: 10000 },
          [PLAN_TYPES.STUDIO]: { name: "Studio", amount: 4449, credits: "unlimited" }
        };

        const plan = plans[planType];
        
        if (plan) {
          const purchaseData = {
            planType: planType,
            planName: plan.name,
            amount: plan.amount,
            credits: plan.credits,
            transactionId: txnid
          };

          await addPurchase(currentUser.uid, purchaseData);
          setStatus("success");
        } else {
          setStatus("error");
        }
      } catch (error) {
        console.error("Payment processing error:", error);
        setStatus("error");
      }
    };

    processPayment();
  }, [currentUser, txnid, planType]);

  if (status === "processing") {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-brand mx-auto"></div>
          <p className="mt-4 text-lg">Processing your payment...</p>
        </div>
      </div>
    );
  }

  if (status === "error") {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="text-red-500 text-6xl mb-4">❌</div>
          <h1 className="text-2xl font-bold mb-2">Payment Failed</h1>
          <p className="text-muted-foreground mb-4">
            There was an issue processing your payment.
          </p>
          <button
            onClick={() => navigate("/pricing")}
            className="bg-brand text-white px-6 py-2 rounded-lg hover:opacity-90"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <div className="text-green-500 text-6xl mb-4">✅</div>
        <h1 className="text-2xl font-bold mb-2">Payment Successful!</h1>
        <p className="text-muted-foreground mb-4">
          Thank you for your purchase. Your credits have been added to your account.
        </p>
        <div className="space-x-4">
          <button
            onClick={() => navigate("/generate")}
            className="bg-brand text-white px-6 py-2 rounded-lg hover:opacity-90"
          >
            Start Generating
          </button>
          <button
            onClick={() => navigate("/dashboard")}
            className="border border-brand text-brand px-6 py-2 rounded-lg hover:bg-brand/10"
          >
            View Dashboard
          </button>
        </div>
      </div>
    </div>
  );
}