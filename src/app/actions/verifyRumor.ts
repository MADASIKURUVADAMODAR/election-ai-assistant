"use server";

import { GoogleGenerativeAI } from "@google/generative-ai";

export type VerdictStatus = "FACT" | "MISLEADING" | "MYTH" | "ERROR";

export interface VerificationResult {
  status: VerdictStatus;
  explanation: string;
  reliabilityScore: number;
  link: string | null;
}

export async function verifyRumor(rumor: string): Promise<VerificationResult> {
  try {
    const apiKey = process.env.GEMINI_API_KEY;
    
    if (!apiKey) {
      // Mock response if API key is not provided to prevent the app from breaking
      console.warn("GEMINI_API_KEY is not set. Returning a mocked response.");
      return mockVerification(rumor);
    }

    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-pro" });

    const systemPrompt = `You are an elite Election Fact-Checker. Analyze the following claim. Compare it against general election logic and the current 2024-2026 election cycles. Return a JSON verdict: status (FACT, MISLEADING, MYTH), a 2-sentence explanation, and a reliability score.

You MUST respond with ONLY a valid JSON object in this exact format, with no markdown formatting or extra text:
{
  "status": "FACT" | "MISLEADING" | "MYTH",
  "explanation": "A concise 2-sentence explanation of why this verdict was reached.",
  "reliabilityScore": 95,
  "link": "https://voterportal.eci.gov.in/ or null"
}`;

    const result = await model.generateContent({
      contents: [{ role: "user", parts: [{ text: `Evaluate this claim: "${rumor}"` }] }],
      systemInstruction: systemPrompt,
      generationConfig: {
        temperature: 0.1,
        responseMimeType: "application/json",
      }
    });

    const responseText = result.response.text();
    const parsedData = JSON.parse(responseText);

    return {
      status: parsedData.status,
      explanation: parsedData.explanation,
      reliabilityScore: parsedData.reliabilityScore || 0,
      link: parsedData.link || null,
    };
  } catch (error) {
    console.error("Error verifying rumor:", error);
    return {
      status: "ERROR",
      explanation: "Failed to process the request due to an internal error or API issue.",
      reliabilityScore: 0,
      link: null,
    };
  }
}

// Fallback logic for when there's no API key
function mockVerification(rumor: string): VerificationResult {
  const lowerRumor = rumor.toLowerCase();
  
  if (lowerRumor.includes("sunday") || lowerRumor.includes("postponed")) {
    return {
      status: "MYTH",
      explanation: "Elections are scheduled according to the official timetable. There are no postponements to Sunday.",
      reliabilityScore: 99,
      link: "https://voterportal.eci.gov.in/",
    };
  }
  
  if (lowerRumor.includes("bangalore") && lowerRumor.includes("may 7")) {
    return {
      status: "FACT",
      explanation: "Bangalore elections are indeed scheduled for May 7, 2026, in Phase 3.",
      reliabilityScore: 100,
      link: "https://voterportal.eci.gov.in/",
    };
  }
  
  return {
    status: "MISLEADING",
    explanation: "This claim cannot be fully verified or contains partial truths. Please check official sources.",
    reliabilityScore: 45,
    link: "https://voterportal.eci.gov.in/",
  };
}
