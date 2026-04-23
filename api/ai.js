export default async function handler(req, res) {
  // ✅ CORS (important for browser requests)
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  // ✅ Handle preflight
  if (req.method === "OPTIONS") {
    return res.status(200).end();
  }

  // ✅ Only allow POST
  if (req.method !== "POST") {
    return res.status(200).json({ message: "API is working. Use POST." });
  }

  try {
    const { input } = req.body;

    if (!input || input.trim() === "") {
      return res.status(400).json({ error: "Input is required" });
    }

    // 🔥 Call OpenAI
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

    // 🔍 Debug log (visible in Vercel logs)
    console.log("OPENAI RESPONSE:", JSON.stringify(data, null, 2));

    // ✅ Handle all possible response formats
    let result = "";

    if (data.output_text) {
      result = data.output_text;
    } else if (data.output?.[0]?.content?.[0]?.text) {
      result = data.output[0].content[0].text;
    } else {
      return res.status(500).json({
        error: "Unexpected AI response format",
        raw: data
      });
    }

    return res.status(200).json({ result });

  } catch (error) {
    console.error("SERVER ERROR:", error);

    return res.status(500).json({
      error: "Server error while processing AI request"
    });
  }
}