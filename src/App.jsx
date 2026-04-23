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
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ input })
      });

      const data = await res.json();

      if (data.error) {
        setOutput("Error: " + data.error);
      } else {
        setOutput(data.result);
      }

    } catch (error) {
      setOutput("Error: Unable to connect to AI");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div style={{ padding: "20px" }}>
      <h2>LinkedIn Optimizer</h2>

      <textarea
        value={input}
        onChange={(e) => setInput(e.target.value)}
        placeholder="Paste LinkedIn profile"
        style={{ width: "100%", height: "120px" }}
      />

      <button onClick={run}>
        {loading ? "Running..." : "Run AI"}
      </button>

      <div style={{ marginTop: "20px" }}>
        {output}
      </div>
    </div>
  );
}