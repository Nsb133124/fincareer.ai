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
You are an elite LinkedIn branding strategist.

Rewrite the profile so it feels premium, sharp, and recruiter-attractive.

STRICT RULES:
- NEVER invent facts
- NEVER invent percentages
- NEVER invent savings, counts, or metrics
- ONLY use metrics explicitly mentioned in the input
- If no metrics exist, strengthen wording WITHOUT numbers
- No fluff
- No clichés
- No generic buzzwords
- Maximum 90 words
- Make it concise and powerful
- Make it sound human, not AI-written

FORMAT:

HEADLINE:
[specific professional positioning]

SUMMARY:
[one sharp opening line]

✔ [achievement from input]
✔ [achievement from input]
✔ [achievement from input]
✔ [achievement from input]

[skills line]

[market focus / availability]

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
          temperature: 0.4
        })
      }
    );

    const data = await response.json();

    if (!response.ok) {
      return res.status(500).json({
        error: data.error?.message || "OpenAI failed"
      });
    }

    return res.status(200).json({
      result: data.choices?.[0]?.message?.content || "No response"
    });

  } catch (error) {
    return res.status(500).json({
      error: error.message || "Server crashed"
    });
  }
}