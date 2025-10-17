import React from "react";

export default function PayUCheckout() {
  const PAYU_BASE_URL = "https://secure.payu.in/_payment"; // use https://test.payu.in/_payment for sandbox

  const handlePayment = async () => {
    const txnid = "txn_" + new Date().getTime();
    const amount = "100"; // amount in INR
    const productinfo = "Image Credits 100";
    const firstname = "John";
    const email = "john@example.com";

    // 1. Call your serverless function to get hash
    const res = await fetch("/api/generateHash", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ txnid, amount, productinfo, firstname, email }),
    });

    const data = await res.json();

    if (data.error) {
      alert("Error generating hash");
      return;
    }

    // 2. Create a hidden form and submit to PayU
    const form = document.createElement("form");
    form.action = PAYU_BASE_URL;
    form.method = "POST";

    const fields = {
      key: data.key,
      txnid: data.txnid,
      amount: data.amount,
      productinfo: data.productinfo,
      firstname: data.firstname,
      email: data.email,
      phone: "9999999999",
      surl: "https://yourdomain.com/payment/success",  // your success redirect
      furl: "https://yourdomain.com/payment/failure",  // your failure redirect
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
  };

  return (
    <div>
      <button onClick={handlePayment}>Buy 100 Credits (₹100)</button>
    </div>
  );
}
