"use client";

import { useState } from "react";
import { Link } from "react-router";
import { toast, ToastContainer } from "react-toastify";
const plans = [
  {
    name: "Starter",
    price: 899,
    credits: 1000,
    amount: "899", // in INR
    productinfo: "Starter 1000 credits",
    features: ["HD outputs", "Basic styles", "Email support"],
    cta: "Buy credits",
    popular: false,
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
  },
  {
    name: "Studio",
    price: 4449,
    credits: "unlimited 7 days",
    amount: "4449",
    productinfo: "Studio unlimited",
    features: ["Unlimited renders", "All features", "Commercial license", "Dedicated support"],
    cta: "Start trial",
    popular: false,
  },
];

export default function Pricing() {
  const [selectedPlan, setSelectedPlan] = useState(null);
  const [userData, setUserData] = useState({ name: "", email: "" });
  const [showModal, setShowModal] = useState(false);

  const PAYU_BASE_URL = "https://test.payu.in/_payment"; // ✅ sandbox, switch to secure.payu.in for live

  const openModal = (plan) => {
    setSelectedPlan(plan);
    setShowModal(true);
  };

  const closeModal = () => {
    setSelectedPlan(null);
    setUserData({ name: "", email: "" });
    setShowModal(false);
  };

  const handlePayment = async () => {
    if (!userData.name || !userData.email) {
      alert("Please fill in name and email.");
      return;
    }

    const txnid = "txn_" + Date.now();
    const amount = selectedPlan.amount;
    const productinfo = selectedPlan.productinfo;
    const firstname = userData.name;
    const email = userData.email;
    try {
      const response = await fetch("/api/api", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ txnid, amount, productinfo, firstname, email }),
      });

      const data = await response.json();
      if (data.error) {
        alert("Error: " + data.error);
        return;
      }
      toast.success("Purchased successfully", {
        position: "top-right",
      });
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
        surl: "https://yourdomain.com/payment/success",
        furl: "https://yourdomain.com/payment/failure",
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
      toast.error("Failed purchased Server error", {
        position: "top-right",
      });
    }

  };

  return (
    <div className="mx-auto max-w-7xl px-4 py-10">
      <h1 className="text-2xl font-semibold text-center">Pricing</h1>
      <p className="mt-2 text-center text-sm text-muted-foreground">
        Flexible options for creators and teams.
      </p>
      <ToastContainer
        position="top-right"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick={false}
      />
      <div className="mt-8 grid gap-6 md:grid-cols-3">
        {plans.map((p) => (
          <div
            key={p.name}
            className={`rounded-xl border border-accent-foreground/10 p-6 ${p.popular ? "bg-white/5 ring-1 ring-brand/40" : "bg-transparent"
              }`}
          >
            <div className="flex items-baseline justify-between">
              <h3 className="text-lg font-medium">{p.name}</h3>
              {p.popular && (
                <span className="rounded-full bg-brand/15 px-2 py-1 text-xs text-brand-foreground">
                  Popular
                </span>
              )}
            </div>
            <div className="mt-4">
              <span className="text-3xl font-semibold">₹{p.price}</span>
              <span className="text-muted-foreground"> /{p.credits} credits</span>
            </div>
            <ul className="mt-4 space-y-2 text-sm text-muted-foreground">
              {p.features.map((f) => (
                <li key={f}>• {f}</li>
              ))}
            </ul>
            <button
              onClick={() => openModal(p)}
              className="mt-6 w-full rounded-lg bg-brand px-4 py-2 text-sm font-medium text-brand-foreground hover:opacity-90 transition"
            >
              {p.cta}
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

      {/* MODAL */}
      {showModal && selectedPlan && (
        <div
          className="fixed inset-0 bg-black/50 backdrop-blur-sm flex justify-center items-center z-50"
          onClick={closeModal} // click outside to close
        >
          <div
            onClick={(e) => e.stopPropagation()} // prevent closing when clicking inside
            className="bg-[var(--payment-bg)] text-[var(--payment-text)] rounded-lg p-6 w-[90%] max-w-md shadow-xl relative"
          >
            {/* Close button */}
            <button
              onClick={closeModal}
              className="absolute top-2 right-3 text-gray-500 hover:text-black text-xl"
            >
              ×
            </button>

            {/* Modal Header */}
            <h2 className="text-xl font-semibold mb-4">
              Buy {selectedPlan.name} Plan
            </h2>

            {/* Form */}
            <div className="space-y-3">
              <input
                type="text"
                placeholder="Name"
                value={userData.name}
                onChange={(e) => setUserData({ ...userData, name: e.target.value })}
                className="w-full border border-[var(--payment-border)] p-2 rounded-md bg-transparent"
              />
              <input
                type="email"
                placeholder="Email"
                value={userData.email}
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

            {/* Pay Button */}
            <button
              className="mt-5 w-full bg-[var(--payment-primary)] text-[var(--payment-primary-text)] py-2 rounded-md font-medium hover:bg-[var(--payment-primary-hover)] transition"
              onClick={handlePayment}
            >
              Pay Now
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
