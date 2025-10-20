"use client";

import { useContext, useEffect, useState } from "react";
import { Link, useNavigate } from "react-router";
import { toast, ToastContainer } from "react-toastify";
import { useAuth } from "../../context/AuthContext";
import { PLAN_TYPES, getUserDocument, addPurchase, updateUserCredits, getUserCredits } from "../../service/userService";
import '../../css/custome.css';
import LoginPrompt from '../../component/LoginPrompt';

const plans = [
  {
    name: "Starter",
    price: 899,
    credits: 1000,
    amount: "899",
    productinfo: "Starter 1000 credits",
    features: ["HD outputs", "Basic styles", "Email support"],
    cta: "Buy credits",
    popular: false,
    planType: PLAN_TYPES.STARTER // 1
  },
  {
    name: "Pro",
    price: 1699,
    credits: 10000,
    amount: "1699",
    productinfo: "Pro 10000 credits",
    features: ["HD+ outputs", "All styles", "Priority support", "Batch processing"],
    cta: "Buy credits",
    popular: true,
    planType: PLAN_TYPES.PRO // 2
  },
  {
    name: "Studio",
    price: 4449,
    credits: "unlimited", // Special handling for unlimited
    amount: "4449",
    productinfo: "Studio unlimited",
    features: ["Unlimited renders", "All features", "Commercial license", "Dedicated support"],
    cta: "Start trial",
    popular: false,
    planType: PLAN_TYPES.STUDIO // 3
  },
];

export default function Pricing() {
  const [selectedPlan, setSelectedPlan] = useState(null);
  const [userData, setUserData] = useState({ name: "", email: "" });
  const [showModal, setShowModal] = useState(false);
  const [disabled, setDisabled] = useState(false);
  const [userCredits, setUserCredits] = useState(0);
    const [showLoginPrompt, setShowLoginPrompt] = useState(false);
  const { currentUser } = useAuth();
  const navigate = useNavigate();

  const PAYU_BASE_URL = "https://test.payu.in/_payment";

  useEffect(() => {
    if (currentUser) {
      setUserData({
        name: currentUser.displayName || "",
        email: currentUser.email || ""
      });
      setDisabled(true);
      loadUserCredits();
    } else {
      setDisabled(false);
      setUserCredits(0);
    }
  }, [currentUser]);

  const loadUserCredits = async () => {
    if (currentUser) {
      try {
        const credits = await getUserCredits(currentUser.uid);
        setUserCredits(credits);
      } catch (error) {
        console.error("Error loading user credits:", error);
      }
    }
  };

  const openModal = (plan) => {
    if (!currentUser) {
     setShowLoginPrompt(true);
    return;
    }
    setSelectedPlan(plan);
    setShowModal(true);
  };

  const closeModal = () => {
    setSelectedPlan(null);
    setShowModal(false);
  };

  const handlePaymentSuccess = async (transactionId) => {
    try {
      if (!currentUser || !selectedPlan) return;

      const purchaseData = {
        planType: selectedPlan.planType,
        planName: selectedPlan.name,
        amount: parseInt(selectedPlan.amount),
        credits: selectedPlan.planType === PLAN_TYPES.STUDIO ?
          'unlimited' : selectedPlan.credits,
        transactionId: transactionId
      };

      await addPurchase(currentUser.uid, purchaseData);

      toast.success(`Successfully purchased ${selectedPlan.name} plan!`, {
        position: "top-right",
      });

      // Reload credits
      await loadUserCredits();

    } catch (error) {
      console.error("Error saving purchase:", error);
      toast.error("Error saving purchase details", {
        position: "top-right",
      });
    }
  };

  const handlePayment = async () => {
    if (!userData.name || !userData.email) {
      toast.error("Please fill in name and email.", {
        position: "top-right",
      });
      return;
    }

    if (!currentUser) {
      setShowLoginPrompt(true);
      return;
    }

    const txnid = "txn_" + Date.now();
    const amount = selectedPlan.amount;
    const productinfo = selectedPlan.productinfo;
    const firstname = userData.name;
    const email = userData.email;

    try {
      const response = await fetch("/api", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ txnid, amount, productinfo, firstname, email }),
      });

      const data = await response.json();
      if (data.error) {
        toast.error("Error: " + data.error, {
          position: "top-right",
        });
        return;
      }
      await handlePaymentSuccess(data.txnid);
      // Auto-create payment form
      const form = document.createElement("form");
      form.method = "POST";
      form.action = PAYU_BASE_URL;

      const fields = {
        key: data.key,
        txnid: data.txnid,
        amount: data.amount,
        productinfo: data.productinfo,
        firstname: data.firstname,
        email: data.email,
        phone: "9999999999",
        surl: `${window.location.origin}/payment/success?txnid=${txnid}&plan=${selectedPlan.planType}`,
        furl: `${window.location.origin}/payment/failure`,
        hash: data.hash,
        service_provider: "payu_paisa",
      };

      for (const name in fields) {
        const input = document.createElement("input");
        input.type = "hidden";
        input.name = name;
        input.value = fields[name];
        form.appendChild(input);
      }

      document.body.appendChild(form);
      form.submit();

    } catch (error) {
      console.error(error);
      toast.error("Payment server error", {
        position: "top-right",
      });
    }
  };

  return (
    <div className="mx-auto max-w-7xl px-4 py-10">
      {/* User Credits Display */}
      {currentUser && (
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2 bg-primary/10 px-4 py-2 rounded-full">
            <span className="text-sm text-muted-foreground">Available Credits:</span>
            <span className="text-lg font-bold text-primary">
              {userCredits === 'unlimited' ? 'Unlimited' : userCredits.toLocaleString()}
            </span>
          </div>
        </div>
      )}

      <h1 className="text-2xl font-semibold text-center">Pricing</h1>
      <p className="mt-2 text-center text-sm text-muted-foreground">
        Flexible options for creators and teams.
      </p>

      {showLoginPrompt && <LoginPrompt />}

      <div className="mt-8 grid gap-6 md:grid-cols-3">
        {plans.map((plan) => (
          <div
            key={plan.name}
            className={`rounded-xl border border-accent-foreground/10 p-6 ${plan.popular ? "bg-white/5 ring-1 ring-brand/40" : "bg-transparent"
              }`}
          >
            <div className="flex items-baseline justify-between">
              <h3 className="text-lg font-medium">{plan.name}</h3>
              {plan.popular && (
                <span className="rounded-full bg-brand/15 px-2 py-1 text-xs text-brand-foreground">
                  Popular
                </span>
              )}
            </div>
            <div className="mt-4">
              <span className="text-3xl font-semibold">₹{plan.price}</span>
              <span className="text-muted-foreground">
                {" "}
                /{plan.credits === "unlimited" ? "unlimited 7 days" : `${plan.credits} credits`}
              </span>
            </div>
            <ul className="mt-4 space-y-2 text-sm text-muted-foreground">
              {plan.features.map((feature) => (
                <li key={feature}>• {feature}</li>
              ))}
            </ul>
            <button
              onClick={() => openModal(plan)}
              className="mt-6 w-full rounded-lg bg-brand px-4 py-2 text-sm font-medium text-brand-foreground hover:opacity-90 transition"
            >
              {plan.cta}
            </button>
            <p className="mt-3 text-center text-xs text-muted-foreground">
              Need more?{" "}
              <Link to="/contact" className="text-primary hover:underline">
                Contact sales
              </Link>
            </p>
          </div>
        ))}
      </div>

      {/* Payment Modal */}
      {showModal && selectedPlan && (
        <div
          className="fixed inset-0 bg-black/50 backdrop-blur-sm flex justify-center items-center z-50"
          onClick={closeModal}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="bg-[var(--payment-bg)] text-[var(--payment-text)] rounded-lg p-6 w-[90%] max-w-md shadow-xl relative"
          >
            <button
              onClick={closeModal}
              className="absolute top-2 right-3 text-gray-500 hover:text-black text-xl"
            >
              ×
            </button>

            <h2 className="text-xl font-semibold mb-4">
              Buy {selectedPlan.name} Plan
            </h2>

            {/* Current Credits Display */}
            {currentUser && (
              <div className="mb-4 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                <p className="text-sm">
                  Current Credits: <strong>{userCredits}</strong>
                </p>
                <p className="text-sm mt-1">
                  After purchase: <strong>
                    {selectedPlan.credits === 'unlimited' ?
                      'Unlimited' :
                      (userCredits + selectedPlan.credits).toLocaleString()
                    }
                  </strong>
                </p>
              </div>
            )}

            <div className="space-y-3">
              <input
                type="text"
                placeholder="Name"
                value={userData.name}
                disabled={disabled}
                onChange={(e) => setUserData({ ...userData, name: e.target.value })}
                className="w-full border border-[var(--payment-border)] p-2 rounded-md bg-transparent"
              />
              <input
                type="email"
                placeholder="Email"
                value={userData.email}
                disabled={disabled}
                onChange={(e) => setUserData({ ...userData, email: e.target.value })}
                className="w-full border border-[var(--payment-border)] p-2 rounded-md bg-transparent"
              />
              <input
                type="number"
                placeholder="Amount"
                disabled
                value={selectedPlan.amount}
                className="w-full border border-[var(--payment-border)] p-2 rounded-md bg-gray-100 dark:bg-gray-800"
              />
            </div>

            <button
              className="mt-5 w-full bg-[var(--payment-primary)] text-[var(--payment-primary-text)] py-2 rounded-md font-medium hover:bg-[var(--payment-primary-hover)] transition"
              onClick={handlePayment}
            >
              Pay ₹{selectedPlan.amount} Now
            </button>
          </div>
        </div>
      )}
    </div>
  );
}