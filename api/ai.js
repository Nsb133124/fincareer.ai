export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const { input } = req.body;

    if (!input) {
      return res.status(400).json({ error: "No input provided" });
    }

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

    console.log("FULL OPENAI RESPONSE:", data);

    // 👇 handle errors clearly
    if (data.error) {
      return res.status(500).json({
        error: data.error.message || "OpenAI error"
      });
    }

    const result =
      data.output?.[0]?.content?.[0]?.text;

    if (!result) {
      return res.status(500).json({
        error: "No output from AI",
        raw: data
      });
    }

    return res.status(200).json({ result });

  } catch (error) {
    console.error("SERVER ERROR:", error);
    return res.status(500).json({
      error: "Server crashed"
    });
  }
}