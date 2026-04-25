export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(200).json({ message: "Use POST" });
  }

  try {
    const { input } = req.body;

    if (!input) {
      return res.status(400).json({
        error: "Missing input"
      });
    }

    if (!process.env.OPENAI_API_KEY) {
      return res.status(500).json({
        error: "Missing OpenAI API key"
      });
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

    const response = await fetch(
      "https://api.openai.com/v1/chat/completions",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${process.env.OPENAI_API_KEY}`
        },
        body: JSON.stringify({
          model: "gpt-4o-mini",
          messages: [
            {
              role: "user",
              content: prompt
            }
          ],
          temperature: 0.6
        })
      }
    );

    const data = await response.json();

    if (!response.ok) {
      console.error("OPENAI ERROR:", data);

      return res.status(500).json({
        error: data.error?.message || "OpenAI failed"
      });
    }

    const result =
      data?.choices?.[0]?.message?.content || "No response generated";

    return res.status(200).json({
      result
    });

  } catch (error) {
    console.error("AI ERROR:", error);

    return res.status(500).json({
      error: error.message || "Server crashed"
    });
  }
}