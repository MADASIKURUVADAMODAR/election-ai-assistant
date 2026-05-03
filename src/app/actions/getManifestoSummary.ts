"use server";

import { GoogleGenerativeAI } from "@google/generative-ai";

export type ManifestoSummaryResult = {
  summary: string[];
  error?: string;
};

export async function getManifestoSummary(candidateName: string, party: string, baseManifesto: string): Promise<ManifestoSummaryResult> {
  // If API key is missing, return a simulated summary using the fallback logic.
  if (!process.env.GEMINI_API_KEY) {
    console.warn("No GEMINI_API_KEY found. Falling back to mock summary.");
    await new Promise((resolve) => setTimeout(resolve, 1500)); // simulate network delay

    // Split base manifesto into sentences roughly
    const sentences = baseManifesto.split('. ').filter(s => s.trim().length > 0);
    const mockSummary = sentences.slice(0, 3).map(s => {
      return `[Goal] Enhance City -> [Action] ${s.trim()} -> [Proposed Result] Improved Quality of Life`;
    });

    return {
      summary: mockSummary.length > 0 ? mockSummary : ["[Goal] General Development -> [Action] Implement progressive policies -> [Proposed Result] Better city"]
    };
  }

  try {
    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

    const systemInstruction = `
      Act as a neutral political analyst. Summarize this candidate’s top 3 priorities based on their public statements.
      Use clear, unbiased language. 
      You MUST strictly format EACH of the 3 priorities as exactly:
      "[Goal] -> [Action] -> [Proposed Result]"
      
      Return ONLY a JSON array of strings containing exactly 3 formatted priorities. Do not include markdown code blocks (like \`\`\`json) or any other text. 
      Example format:
      [
        "Traffic Reduction -> Build 5 new metro lines -> Decrease commute times by 20%",
        "Green Energy -> Subsidize solar panels -> Achieve 50% renewable energy by 2030"
      ]
    `;

    const prompt = `Candidate Name: ${candidateName}\nParty: ${party}\nPublic Statements / Manifesto Context: ${baseManifesto}`;

    const result = await model.generateContent({
      contents: [{ role: "user", parts: [{ text: prompt }] }],
      systemInstruction,
      generationConfig: {
        temperature: 0.2, // Low temperature for more factual, structured output
        responseMimeType: "application/json",
      }
    });

    const text = result.response.text();
    let parsed: string[];
    
    try {
      parsed = JSON.parse(text);
      if (!Array.isArray(parsed)) {
        throw new Error("Response is not an array");
      }
    } catch (parseError) {
      console.error("Failed to parse Gemini response as JSON:", text, parseError);
      return { summary: [], error: "Failed to parse the AI summary." };
    }

    return {
      summary: parsed.slice(0, 3)
    };

  } catch (error) {
    console.error("Error generating manifesto summary:", error);
    return {
      summary: [],
      error: "An error occurred while generating the manifesto summary."
    };
  }
}
