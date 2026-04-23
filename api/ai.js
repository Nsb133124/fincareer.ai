export default async function handler(req, res) {
  // Allow CORS preflight
  if (req.method === "OPTIONS") {
    return res.status(200).end();
  }

  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const { input } = req.body;

    const response = await fetch("https://api.openai.com/v1/responses", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${process.env.OPENAI_API_KEY}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        model: "gpt-4o-mini",
        input: `Optimize this LinkedIn profile:\n\n${input}`
      })
    });

    const data = await response.json();

    const result =
      data.output?.[0]?.content?.[0]?.text || "AI response failed";

    return res.status(200).json({ result });

  } catch (error) {
    return res.status(500).json({ error: "Server error" });
  }
}