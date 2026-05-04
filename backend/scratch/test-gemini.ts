import "dotenv/config";
import { GoogleGenerativeAI } from "@google/generative-ai";

async function test() {
  const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "");
  try {
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
    const result = await model.generateContent("Oi, isto é um teste.");
    console.log("Success with gemini-1.5-flash:", result.response.text());
  } catch (e: any) {
    console.log("Failed with gemini-1.5-flash:", e.message);
    try {
      const model = genAI.getGenerativeModel({ model: "gemini-pro" });
      const result = await model.generateContent("Oi, isto é um teste.");
      console.log("Success with gemini-pro:", result.response.text());
    } catch (e2: any) {
      console.log("Failed with gemini-pro:", e2.message);
    }
  }
}

test();
