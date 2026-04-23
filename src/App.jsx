import { useState } from "react";

export default function App() {
  // ✅ DEBUG (check in browser console)
  console.log("Razorpay Key:", import.meta.env.VITE_RAZORPAY_KEY);

  const [input, setInput] = useState("");
  const [output, setOutput] = useState("");
  const [loading, setLoading] = useState(false);
  const [isPaid, setIsPaid] = useState(false);

  // 🚀 AI FUNCTION
  async function runAI() {
    if (!isPaid) {
      alert("Please upgrade to use AI");
      return;
    }

    if (!input.trim()) {
      alert("Paste your profile first");
      return;
    }

    setLoading(true);
    setOutput("Processing...");

    try {
      const res = await fetch("/api/ai", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ input })
      });

      const data = await res.json();

      if (!res.ok) {
        setOutput("Error: " + (data.error || "Something went wrong"));
      } else {
        setOutput(data.result || "No response received");
      }

    } catch (err) {
      console.error(err);
      setOutput("Error connecting to AI");
    } finally {
      setLoading(false);
    }
  }

  // 🚀 PAYMENT FUNCTION
  async function handlePayment() {
    try {
      const res = await fetch("/api/create-order", {
        method: "POST"
      });

      const data = await res.json();

      const options = {
        key: import.meta.env.VITE_RAZORPAY_KEY, // 🔥 KEY USED HERE
        amount: data.amount,
        currency: "INR",
        name: "FinCareer AI",
        description: "Unlock Pro Access",
        order_id: data.id,

        handler: function () {
          alert("Payment successful!");
          setIsPaid(true);
        },

        prefill: {
          name: "User",
          email: "test@example.com"
        },

        theme: {
          color: "#007bff"
        }
      };

      const rzp = new window.Razorpay(options);
      rzp.open();

    } catch (error) {
      console.error("Payment error:", error);
      alert("Payment failed");
    }
  }

  return (
    <div style={{ fontFamily: "Arial", padding: "20px", maxWidth: "700px", margin: "auto" }}>
      
      {/* HERO */}
      <h1>🚀 FinCareer AI</h1>
      <p>Land Finance Jobs Faster using AI</p>

      <h3>🔥 What you get:</h3>
      <ul>
        <li>LinkedIn Optimizer</li>
        <li>Resume Optimizer (coming)</li>
        <li>Cold Email Generator</li>
      </ul>

      <h2>💰 Price: ₹99</h2>

      {!isPaid && (
        <button
          onClick={handlePayment}
          style={{
            padding: "10px 20px",
            backgroundColor: "green",
            color: "white",
            border: "none",
            borderRadius: "6px",
            cursor: "pointer"
          }}
        >
          Upgrade to Pro
        </button>
      )}

      <hr />

      {/* TOOL */}
      <h2>LinkedIn Optimizer</h2>

      <textarea
        placeholder="Paste LinkedIn profile"
        value={input}
        onChange={(e) => setInput(e.target.value)}
        style={{
          width: "100%",
          height: "120px",
          padding: "10px",
          borderRadius: "6px",
          border: "1px solid #ccc"
        }}
      />

      <br /><br />

      <button
        onClick={runAI}
        style={{
          padding: "10px 20px",
          backgroundColor: "#007bff",
          color: "white",
          border: "none",
          borderRadius: "6px",
          cursor: "pointer"
        }}
      >
        {loading ? "Running..." : "Run AI"}
      </button>

      <div
        style={{
          marginTop: "20px",
          whiteSpace: "pre-wrap",
          background: "#f5f5f5",
          padding: "15px",
          borderRadius: "6px"
        }}
      >
        {output}
      </div>
    </div>
  );
}