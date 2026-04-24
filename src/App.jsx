import { useState, useEffect } from "react";

export default function App() {
  const [input, setInput] = useState("");
  const [output, setOutput] = useState("");
  const [loading, setLoading] = useState(false);
  const [isPaid, setIsPaid] = useState(false);

  useEffect(() => {
    if (localStorage.getItem("paid") === "true") {
      setIsPaid(true);
    }
  }, []);

  async function runAI() {
    if (!isPaid) return alert("Unlock access first");
    if (!input.trim()) return alert("Paste profile");

    setLoading(true);
    setOutput("Processing...");

    try {
      const res = await fetch("/api/ai", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ input })
      });

      const data = await res.json();
      setOutput(res.ok ? data.result : "Error: " + data.error);
    } catch {
      setOutput("Connection error");
    } finally {
      setLoading(false);
    }
  }

  async function handlePayment() {
    const res = await fetch("/api/create-order", { method: "POST" });
    const data = await res.json();

    const options = {
      key: import.meta.env.VITE_RAZORPAY_KEY,
      amount: data.amount,
      currency: "INR",
      order_id: data.id,
      handler: async function (response) {
        const verify = await fetch("/api/verify-payment", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(response)
        });

        const result = await verify.json();

        if (result.success) {
          localStorage.setItem("paid", "true");
          setIsPaid(true);
          alert("Access unlocked!");
        }
      }
    };

    new window.Razorpay(options).open();
  }

  return (
    <div style={{
      fontFamily: "Inter, sans-serif",
      background: "#0B0B0D",
      color: "#EAEAEA"
    }}>

      {/* HERO */}
      <section style={{
        textAlign: "center",
        padding: "120px 20px"
      }}>
        <h1 style={{ fontSize: "60px" }}>
          Land your <span style={{ color: "#C9A84C" }}>interview</span><br />
          in 5 steps.
        </h1>

        <p style={{ color: "#aaa", marginTop: "20px" }}>
          A complete system — not just a tool
        </p>

        {!isPaid && (
          <button onClick={handlePayment} style={{
            marginTop: "25px",
            padding: "14px 32px",
            background: "#C9A84C",
            borderRadius: "8px",
            border: "none",
            fontWeight: "600"
          }}>
            Unlock Full System – ₹99
          </button>
        )}
      </section>

      {/* 🔥 5 STEP SYSTEM (MAIN SELLING SECTION) */}
      <section style={{
        maxWidth: "1100px",
        margin: "auto",
        padding: "80px 20px"
      }}>
        <h2 style={{
          textAlign: "center",
          fontSize: "36px",
          marginBottom: "60px"
        }}>
          What you get inside
        </h2>

        <div style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))",
          gap: "24px"
        }}>
          {[
            {
              icon: "🔍",
              title: "LinkedIn Optimizer",
              desc: "Turn your profile into a recruiter magnet"
            },
            {
              icon: "📄",
              title: "Resume Fix",
              desc: "ATS-friendly, recruiter-approved resume"
            },
            {
              icon: "🎯",
              title: "Smart Targeting",
              desc: "Apply only where you have real chances"
            },
            {
              icon: "💬",
              title: "Cold Outreach Scripts",
              desc: "DM recruiters and actually get replies"
            },
            {
              icon: "🔥",
              title: "Interview Answers",
              desc: "Answer like top 1% candidates"
            }
          ].map((step, i) => (
            <div key={i} style={{
              padding: "28px",
              borderRadius: "16px",
              background: "linear-gradient(145deg, rgba(255,255,255,0.04), rgba(255,255,255,0.02))",
              border: "1px solid rgba(255,255,255,0.08)",
              transition: "0.3s"
            }}
            onMouseEnter={e => {
              e.currentTarget.style.transform = "translateY(-8px)";
              e.currentTarget.style.borderColor = "#C9A84C";
            }}
            onMouseLeave={e => {
              e.currentTarget.style.transform = "translateY(0)";
              e.currentTarget.style.borderColor = "rgba(255,255,255,0.08)";
            }}
            >
              <div style={{ fontSize: "28px" }}>{step.icon}</div>

              <h3 style={{ marginTop: "15px" }}>
                {step.title}
              </h3>

              <p style={{ color: "#aaa", marginTop: "10px" }}>
                {step.desc}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* BEFORE AFTER */}
      <section style={{
        maxWidth: "900px",
        margin: "auto",
        padding: "60px 20px"
      }}>
        <h2 style={{ textAlign: "center" }}>Before vs After</h2>

        <div style={{
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          gap: "20px",
          marginTop: "30px"
        }}>
          <div style={{ background: "#111", padding: "20px", borderRadius: "10px" }}>
            ❌ Generic profile
          </div>

          <div style={{ background: "#111", padding: "20px", borderRadius: "10px" }}>
            ✅ Recruiter-ready profile
          </div>
        </div>
      </section>

      {/* TESTIMONIALS */}
      <section style={{
        padding: "60px 20px",
        maxWidth: "900px",
        margin: "auto"
      }}>
        <h2 style={{ textAlign: "center" }}>What users say</h2>

        <div style={{
          marginTop: "30px",
          display: "grid",
          gap: "20px"
        }}>
          <div style={{ background: "#111", padding: "20px", borderRadius: "10px" }}>
            ⭐⭐⭐⭐⭐ Got interview calls in 2 weeks!
          </div>

          <div style={{ background: "#111", padding: "20px", borderRadius: "10px" }}>
            ⭐⭐⭐⭐⭐ Best ₹99 I spent
          </div>
        </div>
      </section>

      {/* TOOL */}
      <section style={{
        maxWidth: "800px",
        margin: "auto",
        padding: "60px 20px"
      }}>
        <h2>Try it now</h2>

        <textarea
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Paste LinkedIn profile..."
          style={{
            width: "100%",
            height: "140px",
            padding: "12px",
            background: "#111",
            border: "1px solid #222",
            borderRadius: "8px",
            color: "#fff"
          }}
        />

        <br /><br />

        <button onClick={runAI} style={{
          padding: "10px 20px",
          background: "#C9A84C",
          borderRadius: "6px",
          border: "none"
        }}>
          {loading ? "Running..." : "Run AI"}
        </button>

        <div style={{
          marginTop: "20px",
          background: "#111",
          padding: "15px",
          borderRadius: "8px"
        }}>
          {output}
        </div>
      </section>

    </div>
  );
}