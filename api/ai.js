export default async function handler(req, res) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  if (req.method === "OPTIONS") {
    return res.status(200).end();
  }

  if (req.method !== "POST") {
    return res.status(200).json({ message: "Use POST" });
  }

  try {
    const { input } = req.body;

    if (!input) {
      return res.status(400).json({ error: "Input missing" });
    }

    const response = await fetch("https://api.openai.com/v1/responses", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        model: "gpt-4.1-mini", // ✅ CHANGE MODEL (IMPORTANT)
        input: `Optimize this LinkedIn profile:\n\n${input}`
      })
    });

    const data = await response.json();

    console.log("FULL OPENAI RESPONSE:", data);

    // ✅ HANDLE OPENAI ERRORS FIRST
    if (data.error) {
      return res.status(500).json({
        error: data.error.message
      });
    }

    // ✅ SAFE OUTPUT EXTRACTION
    let result = "";

    if (data.output_text) {
      result = data.output_text;
    } else if (data.output?.[0]?.content?.[0]?.text) {
      result = data.output[0].content[0].text;
    } else {
      return res.status(500).json({
        error: "No valid AI output",
        raw: data
      });
    }

    return res.status(200).json({ result });

  } catch (err) {
    console.error("SERVER ERROR:", err);
    return res.status(500).json({
      error: "Server crashed"
    });
  }
}