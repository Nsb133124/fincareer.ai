import { useState } from "react";

export default function App() {
  const [input, setInput] = useState("");
  const [output, setOutput] = useState("");
  const [loading, setLoading] = useState(false);

  async function run() {
    if (!input.trim()) {
      alert("Paste your profile first");
      return;
    }

    setLoading(true);
    setOutput("Processing...");

    try {
      const res = await fetch("/api/ai", {
        method: "POST", // ✅ IMPORTANT
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

    } catch (error) {
      console.error(error);
      setOutput("Error: Unable to connect to AI");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div style={{ padding: "30px", fontFamily: "Arial, sans-serif" }}>
      <h2>🚀 LinkedIn Optimizer</h2>

      <textarea
        placeholder="Paste your LinkedIn profile (headline, about, experience)"
        value={input}
        onChange={(e) => setInput(e.target.value)}
        style={{
          width: "100%",
          height: "150px",
          padding: "10px",
          marginTop: "10px",
          marginBottom: "10px",
          borderRadius: "6px",
          border: "1px solid #ccc"
        }}
      />

      <button
        onClick={run}
        disabled={loading}
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
          padding: "15px",
          background: "#f5f5f5",
          borderRadius: "6px",
          whiteSpace: "pre-wrap"
        }}
      >
        {output}
      </div>
    </div>
  );
}