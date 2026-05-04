import "dotenv/config";

async function listModels() {
  const apiKey = process.env.GEMINI_API_KEY;
  const url = `https://generativelanguage.googleapis.com/v1beta/models?key=${apiKey}`;
  
  try {
    const res = await fetch(url);
    const data: any = await res.json();
    const flashModels = data.models.filter((m: any) => m.name.includes("flash"));
    console.log("Flash Models:", JSON.stringify(flashModels.map((m: any) => m.name), null, 2));
  } catch (e: any) {
    console.log("Error:", e.message);
  }
}

listModels();
