import { NextResponse } from "next/server";
import { cars } from "@/lib/cars";
import type { QuizAnswers } from "@/lib/scoring";
import { generateComparison } from "@/lib/gemini";

export async function POST(request: Request) {
  const body = (await request.json()) as {
    car_ids: string[];
    quiz_answers: QuizAnswers;
  };

  const selectedCars = body.car_ids
    .map((id) => cars.find((c) => c.id === id))
    .filter((c): c is (typeof cars)[number] => c !== undefined);

  try {
    const result = await generateComparison(selectedCars, body.quiz_answers);
    return NextResponse.json(result);
  } catch {
    return NextResponse.json(null);
  }
}
