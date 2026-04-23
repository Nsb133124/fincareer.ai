export default async function handler(req, res) {
  // ✅ Allow CORS + preflight
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  // ✅ Handle OPTIONS (preflight)
  if (req.method === "OPTIONS") {
    return res.status(200).end();
  }

  // ✅ Allow POST only
  if (req.method !== "POST") {
    return res.status(200).json({ message: "API is working (use POST)" });
  }

  try {
    const { input } = req.body;

    const response = await fetch("https://api.openai.com/v1/responses", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        model: "gpt-4o-mini",
        input: `Optimize this LinkedIn profile:\n\n${input}`
      })
    });

    const data = await response.json();

    console.log("OPENAI:", data);

    const result =
      data.output?.[0]?.content?.[0]?.text || "No response";

    return res.status(200).json({ result });

  } catch (error) {
    console.error("ERROR:", error);
    return res.status(500).json({ error: "Server error" });
  }
}