import { Router, Request, Response } from "express";
import { GoogleGenerativeAI } from "@google/generative-ai";

const router = Router();
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "");

router.post("/generate", async (req: Request, res: Response) => {
  try {
    const { topic, language = "pt" } = req.body;

    const lang = language === "en" ? "English" : "Portuguese (Portugal)";
    const topicPrompt = topic?.trim()
      ? `focused on the topic: "${topic}"`
      : "covering diverse, innovative sectors";

    const prompt = `You are an expert startup idea generator. Generate exactly 5 unique, actionable startup ideas ${topicPrompt}.

Respond ONLY with a valid JSON array. No markdown, no explanation. Each idea must follow this exact structure:
[
  {
    "id": <unique number>,
    "title": "<short, punchy startup name>",
    "description": "<2-3 sentence description of the business model and value proposition>",
    "category": "<one of: IA, SaaS, E-commerce, Saúde, Finanças, Educação, Sustentabilidade, Marketplace, Produtividade, Entretenimento>",
    "tags": ["<tag1>", "<tag2>", "<tag3>"],
    "details": ["<detailed point 1>", "<detailed point 2>", "<detailed point 3>", "Dica: <one sentence expert advice>"],
    "difficulty": "<Fácil | Médio | Difícil>",
    "potential": "<Alto | Médio | Baixo>",
    "timeToMarket": "<number> meses"
  }
]

Write all text in ${lang}. Make the ideas realistic, specific and market-ready. Avoid generic ideas.`;

    console.log("Generating with topic:", topic);
    const model = genAI.getGenerativeModel({ model: "gemini-flash-latest" });
    const result = await model.generateContent(prompt);
    const text = result.response.text().trim();
    console.log("IA Response received");

    // Extract JSON from the response (strip any markdown code fences if present)
    const jsonMatch = text.match(/\[[\s\S]*\]/);
    if (!jsonMatch) {
      res.status(500).json({ error: "Resposta inválida da IA." });
      return;
    }

    const ideas = JSON.parse(jsonMatch[0]);

    // Ensure unique IDs using timestamp offset
    const now = Date.now();
    const stamped = ideas.map((idea: any, i: number) => ({
      ...idea,
      id: now + i,
    }));

    res.json({ ideas: stamped });
  } catch (error) {
    console.error("Gemini error:", error);
    res.status(500).json({ error: "Erro ao gerar ideias com IA." });
  }
});

export default router;
