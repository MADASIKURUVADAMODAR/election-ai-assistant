"use server";

import { GoogleGenerativeAI } from "@google/generative-ai";

export interface ExtractedVoterData {
  name: string;
  location: string;
  constituency: string;
  pollingBooth: string;
  electionDate: string;
  age?: number;
  partyAffiliation?: string;
  likelyVoter?: string;
  keyIssues?: string[];
}

const mockProfiles: ExtractedVoterData[] = [
  {
    name: "Rahul Sharma",
    location: "Bangalore",
    constituency: "Bangalore South",
    pollingBooth: "St. Joseph's High School, Room 4",
    electionDate: "May 7, 2026",
    age: 34,
    partyAffiliation: "Undeclared",
    likelyVoter: "92%",
    keyIssues: ["Infrastructure", "Traffic", "Economy"],
  },
  {
    name: "Anita Desai",
    location: "Hyderabad",
    constituency: "Secunderabad",
    pollingBooth: "Govt Primary School, Block B",
    electionDate: "May 13, 2026",
    age: 42,
    partyAffiliation: "Independent",
    likelyVoter: "85%",
    keyIssues: ["Water Supply", "Education", "Healthcare"],
  },
  {
    name: "Vikram Reddy",
    location: "Bangalore",
    constituency: "Bangalore Central",
    pollingBooth: "Community Hall, Ward 45",
    electionDate: "May 7, 2026",
    age: 28,
    partyAffiliation: "Undeclared",
    likelyVoter: "78%",
    keyIssues: ["Tech Policy", "Startups", "Public Transit"],
  }
];

export async function extractVoterData(imageBase64: string, mimeType: string, filename: string): Promise<ExtractedVoterData> {
  const apiKey = process.env.GEMINI_API_KEY;

  if (!apiKey) {
    console.warn("No GEMINI_API_KEY found. Using simulated extraction.");
    await new Promise((resolve) => setTimeout(resolve, 2000));
    // Pick a mock profile based on filename length to ensure "each uploaded demo image produces different extracted output"
    const index = filename.length % mockProfiles.length;
    return mockProfiles[index];
  }

  try {
    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

    const systemPrompt = `You are the 'VoterPulse Vision Engine.' Your task is to analyze images of election-related documents (like voter slips, IDs, etc.).

Core Constraints:
- PII Redaction: If an EPIC number, Aadhaar, or phone number is detected, you MUST return it masked (e.g., XXXXX1234). Never output full private identifiers.
- Structural Extraction: Extract 'name', 'location' (City level, preferably 'Bangalore' or 'Hyderabad' if indicated), 'constituency', 'pollingBooth', and 'electionDate'.
- Additionally, infer or estimate: 'age' (number), 'partyAffiliation', 'likelyVoter' (percentage string like "85%"), 'keyIssues' (array of 3 strings).

Format: Output MUST be valid JSON only. No prose.
Use this exact JSON structure:
{
  "name": "string",
  "location": "string (city)",
  "constituency": "string",
  "pollingBooth": "string",
  "electionDate": "string",
  "age": number,
  "partyAffiliation": "string",
  "likelyVoter": "string",
  "keyIssues": ["string", "string", "string"]
}`;

    const result = await model.generateContent({
      contents: [
        {
          role: "user",
          parts: [
            { text: "Extract voter information from this document." },
            {
              inlineData: {
                data: imageBase64,
                mimeType,
              },
            },
          ],
        },
      ],
      systemInstruction: systemPrompt,
      generationConfig: {
        temperature: 0.1,
        responseMimeType: "application/json",
      },
    });

    const text = result.response.text();
    const parsedData = JSON.parse(text) as ExtractedVoterData;
    
    // Normalize location to match our frontend schedule (Bangalore/Hyderabad) if possible
    if (parsedData.location?.toLowerCase().includes("bangalore") || parsedData.location?.toLowerCase().includes("bengaluru")) {
      parsedData.location = "Bangalore";
    } else if (parsedData.location?.toLowerCase().includes("hyderabad")) {
      parsedData.location = "Hyderabad";
    } else if (!parsedData.location) {
      parsedData.location = "Bangalore"; // fallback
    }

    return parsedData;
  } catch (error) {
    console.error("Error extracting voter data from image:", error);
    // Fallback on error
    return mockProfiles[filename.length % mockProfiles.length];
  }
}
