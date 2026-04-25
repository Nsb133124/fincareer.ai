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
You are a top 1% LinkedIn profile strategist for finance professionals.

Your job is NOT to rewrite.
Your job is to POSITION the candidate like a high-value hire.

STRICT RULES:
1. Keep total output under 120–150 words
2. NO long paragraphs
3. Use short lines and bullet points
4. Make it highly scannable
5. Start with a strong hook
6. Highlight metrics (%, $, time saved, volume handled)
7. Remove generic phrases
8. Sound human, not AI
9. Focus on outcomes
10. Make it premium and powerful

OUTPUT FORMAT:

--- HEADLINE ---
[1 powerful headline]

--- SUMMARY ---
[1 short hook line]

✔ [achievement]  
✔ [achievement]  
✔ [achievement]  
✔ [achievement]  

[tools / skills line]

[closing line]

INPUT PROFILE:
${input}
`;

    const response = await fetch("https://api.openai.com/v1/chat/completions", {
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
        temperature: 0.7
      })
    });

    const data = await response.json();

    if (!response.ok) {
      console.error("OPENAI ERROR:", data);

      return res.status(500).json({
        error: data.error?.message || "OpenAI failed"
      });
    }

    const result = data.choices?.[0]?.message?.content || "No response";

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