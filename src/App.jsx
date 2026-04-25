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
    if (!isPaid) {
      alert("Unlock FinCareer Elite first");
      return;
    }

    if (!input.trim()) {
      alert("Paste your LinkedIn profile");
      return;
    }

    setLoading(true);
    setOutput("Crafting elite positioning...");

    try {
      const res = await fetch("/api/ai", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ input })
      });

      const data = await res.json();
      setOutput(res.ok ? data.result : `Error: ${data.error}`);
    } catch {
      setOutput("Connection error");
    } finally {
      setLoading(false);
    }
  }

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
        order_id: data.id,
        name: "FinCareer Elite",
        description: "Unlock Elite Career Positioning",

        handler: async function (response) {
          const verify = await fetch("/api/verify-payment", {
            method: "POST",
            headers: {
              "Content-Type": "application/json"
            },
            body: JSON.stringify(response)
          });

          const result = await verify.json();

          if (result.success) {
            localStorage.setItem("paid", "true");
            setIsPaid(true);
            alert("Welcome to FinCareer Elite ⚡");
          } else {
            alert("Payment verification failed");
          }
        }
      };

      new window.Razorpay(options).open();
    } catch (err) {
      console.error(err);
      alert("Payment failed");
    }
  }

  const cards = [
    {
      icon: "🔍",
      title: "LinkedIn Positioning",
      desc: "Convert your profile into recruiter magnet copy."
    },
    {
      icon: "📄",
      title: "Resume Upgrade",
      desc: "Professional positioning that gets shortlisted."
    },
    {
      icon: "🎯",
      title: "Smart Targeting",
      desc: "Apply only where your profile has edge."
    },
    {
      icon: "💬",
      title: "Outreach Scripts",
      desc: "Message recruiters with confidence."
    },
    {
      icon: "🚀",
      title: "Interview Presence",
      desc: "Show up like a high-value hire."
    }
  ];

  return (
    <div
      style={{
        minHeight: "100vh",
        background:
          "radial-gradient(circle at top right, rgba(201,168,76,.18), transparent 30%), radial-gradient(circle at top left, rgba(201,168,76,.08), transparent 25%), #060606",
        color: "#fff",
        fontFamily: "Inter, sans-serif"
      }}
    >
      {/* NAV */}
      <div
        style={{
          maxWidth: "1200px",
          margin: "auto",
          padding: "28px 20px",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center"
        }}
      >
        <div
          style={{
            fontSize: "24px",
            fontWeight: "700",
            color: "#D4AF37"
          }}
        >
          ⚡ FinCareer Elite
        </div>

        <div
          style={{
            padding: "10px 18px",
            border: "1px solid rgba(255,255,255,.08)",
            borderRadius: "999px",
            background: "rgba(255,255,255,.03)",
            backdropFilter: "blur(12px)",
            fontSize: "14px",
            color: "#d7d7d7"
          }}
        >
          Trusted by Finance Professionals
        </div>
      </div>

      {/* HERO */}
      <section
        style={{
          maxWidth: "1200px",
          margin: "auto",
          padding: "80px 20px 40px",
          textAlign: "center"
        }}
      >
        <div
          style={{
            display: "inline-block",
            padding: "8px 16px",
            borderRadius: "999px",
            background: "rgba(212,175,55,.12)",
            color: "#D4AF37",
            border: "1px solid rgba(212,175,55,.25)",
            marginBottom: "30px",
            fontSize: "14px"
          }}
        >
          Elite Career Positioning System
        </div>

        <h1
          style={{
            fontSize: "72px",
            lineHeight: 1.05,
            margin: 0,
            fontWeight: 800,
            letterSpacing: "-2px"
          }}
        >
          Become the
          <br />
          <span style={{ color: "#D4AF37" }}>candidate recruiters chase</span>
        </h1>

        <p
          style={{
            maxWidth: "760px",
            margin: "28px auto",
            color: "#b8b8b8",
            fontSize: "20px",
            lineHeight: 1.7
          }}
        >
          LinkedIn positioning, executive branding, smart outreach, and career
          acceleration — built specifically for ambitious finance professionals.
        </p>

        {!isPaid ? (
          <button
            onClick={handlePayment}
            style={{
              padding: "18px 34px",
              borderRadius: "14px",
              border: "none",
              cursor: "pointer",
              fontSize: "18px",
              fontWeight: 700,
              background:
                "linear-gradient(135deg,#B8860B 0%, #D4AF37 40%, #F3D37A 100%)",
              boxShadow: "0 20px 60px rgba(212,175,55,.25)"
            }}
          >
            Unlock Elite Access — ₹99
          </button>
        ) : (
          <div
            style={{
              color: "#6CFF9D",
              fontWeight: 600,
              fontSize: "18px"
            }}
          >
            ✓ Elite Access Unlocked
          </div>
        )}
      </section>

      {/* 5 STEPS */}
      <section
        style={{
          maxWidth: "1200px",
          margin: "40px auto",
          padding: "20px"
        }}
      >
        <h2
          style={{
            textAlign: "center",
            fontSize: "42px",
            marginBottom: "50px"
          }}
        >
          Everything you unlock
        </h2>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit,minmax(240px,1fr))",
            gap: "24px"
          }}
        >
          {cards.map((card, i) => (
            <div
              key={i}
              style={{
                padding: "28px",
                borderRadius: "24px",
                background: "rgba(255,255,255,.04)",
                border: "1px solid rgba(255,255,255,.08)",
                backdropFilter: "blur(20px)",
                boxShadow: "0 10px 40px rgba(0,0,0,.35)"
              }}
            >
              <div style={{ fontSize: "34px" }}>{card.icon}</div>

              <h3
                style={{
                  marginTop: "18px",
                  fontSize: "22px",
                  color: "#D4AF37"
                }}
              >
                {card.title}
              </h3>

              <p
                style={{
                  color: "#c3c3c3",
                  lineHeight: 1.8
                }}
              >
                {card.desc}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* BEFORE AFTER */}
      <section
        style={{
          maxWidth: "1100px",
          margin: "80px auto",
          padding: "20px"
        }}
      >
        <h2
          style={{
            textAlign: "center",
            fontSize: "42px",
            marginBottom: "40px"
          }}
        >
          Before vs After
        </h2>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: "24px"
          }}
        >
          <div
            style={{
              padding: "28px",
              borderRadius: "24px",
              background: "rgba(255,255,255,.03)",
              border: "1px solid rgba(255,255,255,.08)"
            }}
          >
            <h3 style={{ color: "#ff6f6f" }}>Before</h3>
            <p style={{ color: "#aaa", lineHeight: 1.8 }}>
              Generic profile. Weak positioning. No recruiter pull. Gets ignored.
            </p>
          </div>

          <div
            style={{
              padding: "28px",
              borderRadius: "24px",
              background: "rgba(212,175,55,.08)",
              border: "1px solid rgba(212,175,55,.2)"
            }}
          >
            <h3 style={{ color: "#D4AF37" }}>After</h3>
            <p style={{ lineHeight: 1.8 }}>
              Sharp positioning. Premium profile. Recruiter-ready narrative.
              Stronger interview conversion.
            </p>
          </div>
        </div>
      </section>

      {/* TOOL */}
      <section
        style={{
          maxWidth: "900px",
          margin: "auto",
          padding: "40px 20px 120px"
        }}
      >
        <div
          style={{
            padding: "30px",
            borderRadius: "28px",
            background: "rgba(255,255,255,.04)",
            border: "1px solid rgba(255,255,255,.08)",
            backdropFilter: "blur(20px)"
          }}
        >
          <h2
            style={{
              fontSize: "34px",
              marginTop: 0
            }}
          >
            Try FinCareer Elite
          </h2>

          <textarea
            placeholder="Paste your LinkedIn profile..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            style={{
              width: "100%",
              height: "180px",
              padding: "18px",
              marginTop: "10px",
              borderRadius: "18px",
              border: "1px solid rgba(255,255,255,.08)",
              background: "rgba(0,0,0,.25)",
              color: "#fff",
              fontSize: "15px",
              outline: "none",
              boxSizing: "border-box"
            }}
          />

          <button
            onClick={runAI}
            style={{
              marginTop: "20px",
              padding: "14px 26px",
              borderRadius: "12px",
              border: "none",
              cursor: "pointer",
              fontWeight: 700,
              background:
                "linear-gradient(135deg,#B8860B 0%, #D4AF37 40%, #F3D37A 100%)"
            }}
          >
            {loading ? "Crafting..." : "Generate Elite Profile"}
          </button>

          <div
            style={{
              marginTop: "24px",
              padding: "24px",
              borderRadius: "18px",
              background: "rgba(0,0,0,.25)",
              border: "1px solid rgba(255,255,255,.06)",
              color: "#ddd",
              whiteSpace: "pre-wrap",
              lineHeight: 1.8
            }}
          >
            {output || "Your elite output will appear here..."}
          </div>
        </div>
      </section>
    </div>
  );
}