import { GoogleGenAI } from "@google/genai";
import type { Car } from "./cars";
import type { QuizAnswers } from "./scoring";

export type ShortlistResult = {
  shortlist: Array<{
    car_id: string;
    fit_score: number;
    why_this_fits: string;
    who_should_pick: string;
    devil_advocate: [string, string];
  }>;
  upsell_nudge: {
    show: boolean;
    extra_lakhs: number;
    from_car: string;
    to_car: string;
    reason: string;
  };
};

export type CompareResult = {
  tradeoff_summary: string;
  category_winners: {
    best_value: string;
    best_mileage: string;
    best_safety: string;
    best_for_family: string;
  };
  verdict: {
    top_pick_car_id: string;
    verdict_line: string;
  };
};

export class GeminiParseError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "GeminiParseError";
  }
}

const MODEL = "gemini-2.5-flash";

const SYSTEM_PROMPT =
  "You are a trusted Indian car buying advisor. You know these cars well. " +
  "Always respond with valid JSON only — no markdown, no preamble. " +
  "Be direct, specific, and honest. Mention real-world tradeoffs.";

function getClient(): GoogleGenAI {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) throw new Error("GEMINI_API_KEY is not set");
  return new GoogleGenAI({ apiKey });
}

function stripMarkdownFences(text: string): string {
  return text
    .trim()
    .replace(/^```(?:json)?\s*/i, "")
    .replace(/```\s*$/i, "")
    .trim();
}

function parseJsonResponse<T>(text: string | undefined): T {
  if (!text) throw new GeminiParseError("Empty response from Gemini");
  const cleaned = stripMarkdownFences(text);
  try {
    return JSON.parse(cleaned) as T;
  } catch {
    throw new GeminiParseError("Failed to parse Gemini response as JSON");
  }
}

function describeAnswers(answers: QuizAnswers): string {
  return [
    `Budget: ₹${answers.budget_min}L to ₹${answers.budget_max}L`,
    `Primary use: ${answers.primary_use}`,
    `Body type preference: ${answers.body_type_pref}`,
    `Seating needed: ${answers.seating_needed}`,
    `Fuel preference: ${answers.fuel_pref}`,
    answers.extra_notes ? `Additional notes: ${answers.extra_notes}` : null,
  ]
    .filter(Boolean)
    .join("\n");
}

function describeCar(car: Car): string {
  return `${car.id}: ${car.make} ${car.model} ${car.variant}, ₹${car.price_lakh_inr}L, ${car.body_type}, ${car.fuel_type}, ${car.transmission}, ${car.mileage_kmpl} kmpl, ${car.seating_capacity} seats, safety ${car.safety_rating}/5, features: ${car.key_features.join(", ")}`;
}

export async function generateShortlist(
  candidates: Car[],
  answers: QuizAnswers
): Promise<ShortlistResult> {
  const ai = getClient();

  const prompt = `Buyer's quiz answers:
${describeAnswers(answers)}

Candidate cars:
${candidates.map(describeCar).join("\n")}

Pick the best 5 cars from the candidates above for this buyer. Return ONLY this exact JSON shape, with car_id matching the ids given above:
{
  "shortlist": [
    {
      "car_id": string,
      "fit_score": number (0-100),
      "why_this_fits": string (2-3 sentences anchored to the buyer's quiz answers),
      "who_should_pick": string ("Pick this if you..." one liner),
      "devil_advocate": [string, string] (exactly 2 real owner complaint points)
    }
  ],
  "upsell_nudge": {
    "show": boolean,
    "extra_lakhs": number,
    "from_car": string,
    "to_car": string,
    "reason": string
  }
}
The shortlist array must contain exactly 5 entries, ranked best first. Set upsell_nudge.show to true only if a modest budget increase from one of the shortlisted cars unlocks a meaningfully better car from the candidates; otherwise set show to false. For upsell_nudge.from_car and upsell_nudge.to_car, use the human-readable "Make Model" name (e.g. "Tata Punch"), never the car_id.`;

  const response = await ai.models.generateContent({
    model: MODEL,
    contents: prompt,
    config: {
      systemInstruction: SYSTEM_PROMPT,
      responseMimeType: "application/json",
    },
  });

  const result = parseJsonResponse<ShortlistResult>(response.text);
  result.upsell_nudge.from_car = resolveCarLabel(candidates, result.upsell_nudge.from_car);
  result.upsell_nudge.to_car = resolveCarLabel(candidates, result.upsell_nudge.to_car);
  return result;
}

function resolveCarLabel(candidates: Car[], label: string): string {
  const match = candidates.find((c) => c.id === label);
  return match ? `${match.make} ${match.model}` : label;
}

export async function generateComparison(
  cars: Car[],
  answers: QuizAnswers
): Promise<CompareResult> {
  const ai = getClient();

  const prompt = `Buyer's quiz answers:
${describeAnswers(answers)}

Cars the buyer is comparing:
${cars.map(describeCar).join("\n")}

Compare these cars for this buyer. Return ONLY this exact JSON shape, with car ids matching the ids given above:
{
  "tradeoff_summary": string (2-3 sentences comparing the cars),
  "category_winners": {
    "best_value": string (car_id),
    "best_mileage": string (car_id),
    "best_safety": string (car_id),
    "best_for_family": string (car_id)
  },
  "verdict": {
    "top_pick_car_id": string,
    "verdict_line": string ("Our pick for you: [Car] because...")
  }
}`;

  const response = await ai.models.generateContent({
    model: MODEL,
    contents: prompt,
    config: {
      systemInstruction: SYSTEM_PROMPT,
      responseMimeType: "application/json",
    },
  });

  return parseJsonResponse<CompareResult>(response.text);
}
