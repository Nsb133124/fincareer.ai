import { useState, useEffect } from "react";

export default function App() {
  const [input, setInput] = useState("");
  const [output, setOutput] = useState("");
  const [loading, setLoading] = useState(false);
  const [isPaid, setIsPaid] = useState(false);

  // ✅ Persist payment
  useEffect(() => {
    const paid = localStorage.getItem("paid");
    if (paid === "true") setIsPaid(true);
  }, []);

  // 🚀 AI CALL
  async function runAI() {
    if (!isPaid) {
      alert("Please unlock access first");
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
        setOutput("Error: " + data.error);
      } else {
        setOutput(data.result);
      }

    } catch (err) {
      setOutput("Error connecting to AI");
    } finally {
      setLoading(false);
    }
  }

  // 💰 PAYMENT
  async function handlePayment() {
    try {
      const res = await fetch("/api/create-order", {
        method: "POST"
      });

      const data = await res.json();

      const options = {
        key: import.meta.env.VITE_RAZORPAY_KEY,
        amount: data.amount,
        currency: "INR",
        name: "FinCareer AI",
        description: "Unlock Full Access",
        order_id: data.id,
        handler: function () {
          alert("Payment successful!");
          localStorage.setItem("paid", "true");
          setIsPaid(true);
        }
      };

      const rzp = new window.Razorpay(options);
      rzp.open();

    } catch (err) {
      alert("Payment failed");
    }
  }

  return (
    <div style={{ fontFamily: "Arial", background: "#0E0C08", color: "#F5F0E8" }}>
      
      {/* HERO */}
      <section style={{ padding: "80px 20px", textAlign: "center" }}>
        <h1 style={{ fontSize: "42px" }}>
          Land your <span style={{ color: "#C9A84C" }}>interview</span> in 5 steps
        </h1>

        <p style={{ color: "#aaa", marginTop: "10px" }}>
          AI-powered system for Finance professionals (GCC / UAE / SSC roles)
        </p>

        {!isPaid && (
          <button
            onClick={handlePayment}
            style={{
              marginTop: "20px",
              padding: "12px 24px",
              background: "#C9A84C",
              border: "none",
              cursor: "pointer"
            }}
          >
            🔓 Unlock Full Access – ₹99
          </button>
        )}

        {isPaid && (
          <p style={{ color: "#4CAF50", marginTop: "20px" }}>
            ✅ Access Unlocked
          </p>
        )}
      </section>

      {/* TOOL */}
      <section style={{ padding: "40px 20px", maxWidth: "800px", margin: "auto" }}>
        <h2>LinkedIn Optimizer</h2>

        <textarea
          placeholder="Paste your LinkedIn profile..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
          style={{
            width: "100%",
            height: "120px",
            marginTop: "10px",
            padding: "10px"
          }}
        />

        <br /><br />

        <button
          onClick={runAI}
          style={{
            padding: "10px 20px",
            background: "#1C1914",
            color: "#fff",
            border: "1px solid #444",
            cursor: "pointer"
          }}
        >
          {loading ? "Running..." : "Run AI"}
        </button>

        <div style={{ marginTop: "20px", whiteSpace: "pre-wrap" }}>
          {output}
        </div>
      </section>

    </div>
  );
}