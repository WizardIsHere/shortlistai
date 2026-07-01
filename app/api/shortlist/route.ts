import { NextResponse } from "next/server";
import { cars } from "@/lib/cars";
import { scoreCars, type QuizAnswers } from "@/lib/scoring";
import { calcTCO } from "@/lib/tco";
import { generateShortlist } from "@/lib/gemini";

export async function POST(request: Request) {
  const answers = (await request.json()) as QuizAnswers;

  const { candidates, relaxation_applied } = scoreCars(cars, answers);
  const top8 = candidates.map((c) => c.car);

  try {
    const shortlist = await generateShortlist(top8, answers);
    const tco = shortlist.shortlist
      .map((entry) => top8.find((car) => car.id === entry.car_id))
      .filter((car): car is (typeof top8)[number] => car !== undefined)
      .map((car) => calcTCO(car));

    return NextResponse.json({
      shortlist,
      tco,
      relaxation_applied,
    });
  } catch {
    const top5 = candidates.slice(0, 5);
    const fallbackShortlist = {
      shortlist: top5.map(({ car, score }) => ({
        car_id: car.id,
        fit_score: Math.round(score),
        why_this_fits: "",
        who_should_pick: "",
        devil_advocate: ["", ""] as [string, string],
      })),
      upsell_nudge: {
        show: false,
        extra_lakhs: 0,
        from_car: "",
        to_car: "",
        reason: "",
      },
    };
    const tco = top5.map(({ car }) => calcTCO(car));

    return NextResponse.json({
      shortlist: fallbackShortlist,
      tco,
      relaxation_applied,
      ai_unavailable: true,
    });
  }
}
