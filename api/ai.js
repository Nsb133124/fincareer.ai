export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Use POST" });
  }

  try {
    const { input } = req.body;

    if (!input) {
      return res.status(400).json({ error: "Missing input" });
    }

    if (!process.env.ANTHROPIC_API_KEY) {
      return res.status(500).json({ error: "Missing Anthropic API key" });
    }

    const prompt = `
You are an elite executive branding strategist for finance professionals.

Rewrite the profile into a LinkedIn summary that feels sharp, premium, credible, and instantly impressive.

RULES:
- Maximum 90 words
- No fluff
- No clichés
- No generic corporate buzzwords
- No fake motivational closing lines
- Make it sound like a real high performer
- Keep geography/domain specificity (UAE, GCC, LATAM, North America, SSC, AP, etc.)
- Highlight numbers aggressively
- Make it concise and punchy
- Output must feel powerful enough to copy-paste immediately

FORMAT:

HEADLINE:
[specific, metric-driven headline]

SUMMARY:
[one sharp opening line]

✔ [achievement]
✔ [achievement]
✔ [achievement]
✔ [achievement]

[skills/tools line]

[availability / market focus line]

INPUT:
${input}
`;

    const response = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": process.env.ANTHROPIC_API_KEY,
        "anthropic-version": "2023-06-01",
      },
      body: JSON.stringify({
        model: "claude-sonnet-4-20250514",
        max_tokens: 1024,
        messages: [
          {
            role: "user",
            content: prompt,
          },
        ],
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      console.error("ANTHROPIC ERROR:", data);
      return res.status(500).json({
        error: data.error?.message || "Anthropic API failed",
      });
    }

    const result = data?.content?.[0]?.text || "No response generated";

    return res.status(200).json({ result });

  } catch (error) {
    console.error("AI ERROR:", error);
    return res.status(500).json({
      error: error.message || "Server crashed",
    });
  }
}