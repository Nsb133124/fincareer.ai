import { useEffect, useState } from "react";

export default function App() {
  const [mode, setMode] = useState("linkedin");
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
      alert(
        mode === "linkedin"
          ? "Paste your LinkedIn profile"
          : "Paste your Resume summary"
      );
      return;
    }

    setLoading(true);
    setOutput(
      mode === "linkedin"
        ? "Crafting elite LinkedIn positioning..."
        : "Crafting elite resume positioning..."
    );

    try {
      const res = await fetch("/api/ai", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          input: `[MODE: ${mode.toUpperCase()}]\n${input}`
        })
      });

      const data = await res.json();

      if (!res.ok) {
        setOutput(`Error: ${data.error}`);
      } else {
        setOutput(data.result);
      }
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
        description: "Unlock Elite Access",
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
      title: "Executive LinkedIn Optimization",
      desc: "Turn your profile into recruiter magnet copy."
    },
    {
      icon: "📄",
      title: "Resume Positioning Upgrade",
      desc: "Sharper positioning that gets shortlisted."
    },
    {
      icon: "🎯",
      title: "Career Narrative Clarity",
      desc: "Clearly communicate your professional value."
    },
    {
      icon: "💬",
      title: "Recruiter Outreach Messaging",
      desc: "Stronger professional communication."
    },
    {
      icon: "🚀",
      title: "Interview Positioning",
      desc: "Show up like a high-value candidate."
    }
  ];

  return (
    <div
      style={{
        minHeight: "100vh",
        background:
          "radial-gradient(circle at top right, rgba(212,175,55,.16), transparent 30%), radial-gradient(circle at top left, rgba(212,175,55,.08), transparent 25%), #050505",
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
            borderRadius: "999px",
            background: "rgba(255,255,255,.04)",
            border: "1px solid rgba(255,255,255,.08)",
            backdropFilter: "blur(14px)",
            color: "#d5d5d5",
            fontSize: "14px"
          }}
        >
          Built for Finance Professionals
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
            padding: "8px 18px",
            borderRadius: "999px",
            background: "rgba(212,175,55,.10)",
            color: "#D4AF37",
            border: "1px solid rgba(212,175,55,.22)",
            marginBottom: "26px",
            fontSize: "14px"
          }}
        >
          Elite Career Positioning Engine
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
          Make recruiters
          <br />
          <span style={{ color: "#D4AF37" }}>notice you instantly</span>
        </h1>

        <p
          style={{
            maxWidth: "780px",
            margin: "28px auto",
            color: "#b6b6b6",
            fontSize: "20px",
            lineHeight: 1.7
          }}
        >
          Premium LinkedIn and Resume optimization built for ambitious finance
          professionals targeting global roles.
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

      {/* FEATURES */}
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
                backdropFilter: "blur(20px)"
              }}
            >
              <div style={{ fontSize: "34px" }}>{card.icon}</div>
              <h3
                style={{
                  marginTop: "18px",
                  color: "#D4AF37",
                  fontSize: "22px"
                }}
              >
                {card.title}
              </h3>
              <p
                style={{
                  color: "#c4c4c4",
                  lineHeight: 1.8
                }}
              >
                {card.desc}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* TOOL */}
      <section
        style={{
          maxWidth: "920px",
          margin: "80px auto",
          padding: "20px"
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
            Optimize Your Profile
          </h2>

          {/* MODE SELECTOR */}
          <div
            style={{
              display: "flex",
              gap: "14px",
              marginBottom: "20px"
            }}
          >
            <button
              onClick={() => setMode("linkedin")}
              style={{
                flex: 1,
                padding: "14px",
                borderRadius: "14px",
                border: "none",
                cursor: "pointer",
                fontWeight: 700,
                background:
                  mode === "linkedin"
                    ? "linear-gradient(135deg,#B8860B 0%, #D4AF37 100%)"
                    : "rgba(255,255,255,.05)",
                color: mode === "linkedin" ? "#000" : "#fff"
              }}
            >
              🔍 LinkedIn Mode
            </button>

            <button
              onClick={() => setMode("resume")}
              style={{
                flex: 1,
                padding: "14px",
                borderRadius: "14px",
                border: "none",
                cursor: "pointer",
                fontWeight: 700,
                background:
                  mode === "resume"
                    ? "linear-gradient(135deg,#B8860B 0%, #D4AF37 100%)"
                    : "rgba(255,255,255,.05)",
                color: mode === "resume" ? "#000" : "#fff"
              }}
            >
              📄 Resume Mode
            </button>
          </div>

          <textarea
            placeholder={
              mode === "linkedin"
                ? "Paste your LinkedIn profile..."
                : "Paste your resume summary..."
            }
            value={input}
            onChange={(e) => setInput(e.target.value)}
            style={{
              width: "100%",
              height: "180px",
              padding: "18px",
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
              padding: "14px 28px",
              borderRadius: "12px",
              border: "none",
              cursor: "pointer",
              fontWeight: 700,
              background:
                "linear-gradient(135deg,#B8860B 0%, #D4AF37 40%, #F3D37A 100%)"
            }}
          >
            {loading ? "Crafting..." : "Generate Elite Output"}
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