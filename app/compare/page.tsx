"use client";

import { Suspense, useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Loader2, Trophy } from "lucide-react";
import { cars, type Car } from "@/lib/cars";
import { loadSession, clearSession, type ShortlistSession } from "@/lib/session";
import type { CompareResult } from "@/lib/gemini";
import type { TCOResult } from "@/lib/tco";

type SpecRow = {
  label: string;
  getValue: (car: Car, tco?: TCOResult) => string;
  getSortValue: (car: Car, tco?: TCOResult) => number;
  higherIsBetter: boolean;
  comparable: boolean;
};

const SPEC_ROWS: SpecRow[] = [
  {
    label: "Price",
    getValue: (car) => `₹${car.price_lakh_inr} L`,
    getSortValue: (car) => car.price_lakh_inr,
    higherIsBetter: false,
    comparable: true,
  },
  {
    label: "Body Type",
    getValue: (car) => car.body_type,
    getSortValue: () => 0,
    higherIsBetter: true,
    comparable: false,
  },
  {
    label: "Fuel",
    getValue: (car) => car.fuel_type,
    getSortValue: () => 0,
    higherIsBetter: true,
    comparable: false,
  },
  {
    label: "Transmission",
    getValue: (car) => car.transmission,
    getSortValue: () => 0,
    higherIsBetter: true,
    comparable: false,
  },
  {
    label: "Mileage",
    getValue: (car) => `${car.mileage_kmpl} kmpl`,
    getSortValue: (car) => car.mileage_kmpl,
    higherIsBetter: true,
    comparable: true,
  },
  {
    label: "Seating",
    getValue: (car) => `${car.seating_capacity} seats`,
    getSortValue: (car) => car.seating_capacity,
    higherIsBetter: true,
    comparable: true,
  },
  {
    label: "Safety Rating",
    getValue: (car) => `${car.safety_rating}/5`,
    getSortValue: (car) => car.safety_rating,
    higherIsBetter: true,
    comparable: true,
  },
  {
    label: "Monthly EMI",
    getValue: (_car, tco) => (tco ? `₹${tco.monthly_emi.toLocaleString("en-IN")}` : "—"),
    getSortValue: (_car, tco) => tco?.monthly_emi ?? Infinity,
    higherIsBetter: false,
    comparable: true,
  },
  {
    label: "Fuel/mo",
    getValue: (_car, tco) => (tco ? `₹${tco.monthly_fuel.toLocaleString("en-IN")}` : "—"),
    getSortValue: (_car, tco) => tco?.monthly_fuel ?? Infinity,
    higherIsBetter: false,
    comparable: true,
  },
  {
    label: "3-yr TCO",
    getValue: (_car, tco) => (tco ? `₹${(tco.total_3yr_cost / 100000).toFixed(1)} L` : "—"),
    getSortValue: (_car, tco) => tco?.total_3yr_cost ?? Infinity,
    higherIsBetter: false,
    comparable: true,
  },
];

const CATEGORY_LABELS: Record<keyof CompareResult["category_winners"], string> = {
  best_value: "Best Value",
  best_mileage: "Best Mileage",
  best_safety: "Best Safety",
  best_for_family: "Best for Family",
};

const CATEGORY_STYLES: Record<keyof CompareResult["category_winners"], string> = {
  best_value: "border-violet-500/40 text-violet-300",
  best_mileage: "border-blue-500/40 text-blue-300",
  best_safety: "border-green-500/40 text-green-300",
  best_for_family: "border-amber-500/40 text-amber-300",
};

function carName(car: Car): string {
  return `${car.make} ${car.model}`;
}

export default function ComparePage() {
  return (
    <Suspense fallback={null}>
      <CompareContent />
    </Suspense>
  );
}

function CompareContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [session, setSession] = useState<ShortlistSession | null>(null);
  const [selectedCars, setSelectedCars] = useState<Car[]>([]);
  const [result, setResult] = useState<CompareResult | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    const ids = (searchParams.get("ids") ?? "").split(",").filter(Boolean);
    const matched = ids
      .map((id) => cars.find((c) => c.id === id))
      .filter((c): c is Car => c !== undefined);

    // searchParams/localStorage are only readable client-side, so this must run post-mount.
    /* eslint-disable react-hooks/set-state-in-effect */
    setSelectedCars(matched);
    setSession(loadSession());
    setLoaded(true);
    /* eslint-enable react-hooks/set-state-in-effect */
  }, [searchParams]);

  useEffect(() => {
    if (!loaded || !session || selectedCars.length < 2) {
      return;
    }

    let cancelled = false;
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setIsLoading(true);

    fetch("/api/compare", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        car_ids: selectedCars.map((c) => c.id),
        quiz_answers: session.quiz_answers,
      }),
    })
      .then((res) => res.json())
      .then((data: CompareResult | null) => {
        if (!cancelled) setResult(data);
      })
      .catch(() => {
        if (!cancelled) setResult(null);
      })
      .finally(() => {
        if (!cancelled) setIsLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [loaded, session, selectedCars]);

  if (loaded && (!session || selectedCars.length < 2)) {
    return (
      <main className="flex flex-1 flex-col items-center justify-center gap-4 bg-[#0A0A0F] text-center px-6">
        <p className="text-lg text-[#8B8B9E]">Nothing to compare yet.</p>
        <button
          type="button"
          onClick={() => router.push("/results")}
          className="rounded-xl bg-[#6C63FF] px-6 py-3 font-semibold text-white hover:brightness-110"
        >
          Back to Shortlist
        </button>
      </main>
    );
  }

  if (!loaded) return null;

  const tcoByCarId = new Map((session?.tco ?? []).map((t) => [t.car_id, t]));

  function handleStartOver() {
    clearSession();
    router.push("/");
  }

  return (
    <>
      <header className="sticky top-0 z-10 flex items-center justify-between border-b border-[#2A2A38] bg-[#0A0A0F]/80 px-6 py-4 backdrop-blur">
        <span className="font-bold text-white">ShortlistAI</span>
        <button
          type="button"
          onClick={handleStartOver}
          className="text-sm text-[#8B8B9E] hover:text-white"
        >
          Start Over
        </button>
      </header>
      <main className="flex flex-1 flex-col bg-[#0A0A0F] px-6 py-12">
      <div className="mx-auto w-full max-w-5xl space-y-6">
        <h1 className="text-3xl font-bold text-white">
          Comparing {selectedCars.length} Cars
        </h1>

        {isLoading && (
          <div className="flex items-center gap-3 rounded-xl border border-[#2A2A38] bg-[#13131A] p-6 text-[#8B8B9E]">
            <Loader2 size={20} className="animate-spin text-[#6C63FF]" />
            Comparing your shortlisted cars...
          </div>
        )}

        {!isLoading && result && (
          <>
            <div className="rounded-2xl border border-[#6C63FF40] bg-gradient-to-r from-[#6C63FF20] to-[#13131A] p-6">
              <p className="text-xs font-semibold uppercase tracking-widest text-[#6C63FF]">
                Our Pick for You
              </p>
              <p className="mt-2 flex items-center gap-2 text-2xl font-bold text-white">
                <Trophy size={20} className="text-[#6C63FF]" />
                {carName(
                  selectedCars.find((c) => c.id === result.verdict.top_pick_car_id) ??
                    selectedCars[0]
                )}
              </p>
              <p className="mt-2 text-[#8B8B9E]">{result.verdict.verdict_line}</p>
            </div>

            <div className="flex flex-wrap gap-3">
              {(Object.keys(CATEGORY_LABELS) as Array<keyof CompareResult["category_winners"]>).map(
                (key) => {
                  const winnerId = result.category_winners[key];
                  const winner = selectedCars.find((c) => c.id === winnerId);
                  return (
                    <div
                      key={key}
                      className={`rounded-full border px-4 py-1.5 text-sm ${CATEGORY_STYLES[key]}`}
                    >
                      <span className="font-semibold">{CATEGORY_LABELS[key]}:</span>{" "}
                      {winner ? carName(winner) : "—"}
                    </div>
                  );
                }
              )}
            </div>
          </>
        )}

        {!isLoading && !result && (
          <div className="rounded-xl border border-[#2A2A38] bg-[#1C1C26] p-4 text-sm text-[#8B8B9E]">
            AI comparison is temporarily unavailable — showing spec table only.
          </div>
        )}

        <div className="overflow-x-auto rounded-xl border border-[#2A2A38]">
          <table className="w-full divide-y divide-[#2A2A38] text-sm">
            <thead>
              <tr className="bg-[#1C1C26]">
                <th className="p-4 text-left text-xs font-semibold uppercase tracking-wide text-[#8B8B9E]">
                  Spec
                </th>
                {selectedCars.map((car) => (
                  <th
                    key={car.id}
                    className="p-4 text-left text-xs font-semibold uppercase tracking-wide text-[#8B8B9E]"
                  >
                    <span className="block text-sm font-semibold text-white normal-case tracking-normal">
                      {carName(car)}
                    </span>
                    <span className="font-normal normal-case tracking-normal text-[#55556A]">
                      {car.variant}
                    </span>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-[#2A2A38]">
              {SPEC_ROWS.map((row, rowIndex) => {
                const values = selectedCars.map((car) =>
                  row.getSortValue(car, tcoByCarId.get(car.id))
                );
                const best = row.higherIsBetter ? Math.max(...values) : Math.min(...values);
                const allTied = values.every((v) => v === values[0]);

                return (
                  <tr
                    key={row.label}
                    className={rowIndex % 2 === 0 ? "bg-[#13131A]" : "bg-[#0A0A0F]"}
                  >
                    <td className="p-4 text-[#8B8B9E]">{row.label}</td>
                    {selectedCars.map((car, i) => {
                      const tco = tcoByCarId.get(car.id);
                      const isWinner =
                        row.comparable &&
                        !allTied &&
                        values[i] === best &&
                        Number.isFinite(values[i]);
                      return (
                        <td
                          key={car.id}
                          className={`p-4 ${
                            isWinner
                              ? "bg-green-500/10 font-semibold text-green-400"
                              : "text-[#F1F1F3]"
                          }`}
                        >
                          {row.getValue(car, tco)}
                        </td>
                      );
                    })}
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {!isLoading && result && (
          <div className="rounded-2xl border border-[#2A2A38] bg-[#13131A] p-6">
            <p className="text-xs font-semibold uppercase tracking-widest text-[#55556A]">
              AI Tradeoff Analysis
            </p>
            <p className="mt-2 text-sm leading-relaxed text-[#8B8B9E]">
              {result.tradeoff_summary}
            </p>
          </div>
        )}

        <div className="pt-2 text-center">
          <button
            type="button"
            onClick={() => router.push("/results")}
            className="rounded-xl border border-[#2A2A38] px-6 py-3 text-sm font-medium text-[#8B8B9E] hover:text-white hover:border-[#55556A]"
          >
            Back to Shortlist
          </button>
        </div>
      </div>
      </main>
    </>
  );
}
