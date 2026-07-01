"use client";

import { Suspense, useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Loader2, Trophy } from "lucide-react";
import { cars, type Car } from "@/lib/cars";
import { loadSession, type ShortlistSession } from "@/lib/session";
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
      <main className="flex flex-1 flex-col items-center justify-center gap-4 text-center px-6">
        <p className="text-lg text-zinc-300">Nothing to compare yet.</p>
        <button
          type="button"
          onClick={() => router.push("/results")}
          className="rounded-full bg-amber-500 px-6 py-3 font-semibold text-black hover:bg-amber-400"
        >
          Back to Shortlist
        </button>
      </main>
    );
  }

  if (!loaded) return null;

  const tcoByCarId = new Map((session?.tco ?? []).map((t) => [t.car_id, t]));

  return (
    <main className="flex flex-1 flex-col px-6 py-12">
      <div className="mx-auto w-full max-w-5xl space-y-6">
        <h1 className="text-3xl font-bold text-white">
          Comparing {selectedCars.length} Cars
        </h1>

        {isLoading && (
          <div className="flex items-center gap-3 rounded-xl border border-zinc-800 bg-zinc-900/50 p-6 text-zinc-400">
            <Loader2 size={20} className="animate-spin" />
            Comparing your shortlisted cars...
          </div>
        )}

        {!isLoading && result && (
          <>
            <div className="rounded-2xl border border-amber-500/40 bg-amber-500/10 p-6">
              <p className="flex items-center gap-2 text-lg font-bold text-amber-300">
                <Trophy size={20} />
                Our Pick for You:{" "}
                {carName(
                  selectedCars.find((c) => c.id === result.verdict.top_pick_car_id) ??
                    selectedCars[0]
                )}
              </p>
              <p className="mt-2 text-base text-amber-100">{result.verdict.verdict_line}</p>
            </div>

            <div className="flex flex-wrap gap-3">
              {(Object.keys(CATEGORY_LABELS) as Array<keyof CompareResult["category_winners"]>).map(
                (key) => {
                  const winnerId = result.category_winners[key];
                  const winner = selectedCars.find((c) => c.id === winnerId);
                  return (
                    <div
                      key={key}
                      className="rounded-full border border-zinc-700 bg-zinc-900 px-4 py-2 text-sm text-zinc-300"
                    >
                      <span className="font-semibold text-zinc-200">
                        {CATEGORY_LABELS[key]}:
                      </span>{" "}
                      {winner ? carName(winner) : "—"}
                    </div>
                  );
                }
              )}
            </div>
          </>
        )}

        {!isLoading && !result && (
          <div className="rounded-xl border border-zinc-700 bg-zinc-800/50 p-4 text-sm text-zinc-400">
            AI comparison is temporarily unavailable — showing spec table only.
          </div>
        )}

        <div className="overflow-x-auto rounded-2xl border border-zinc-800">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-zinc-800 bg-zinc-900/70">
                <th className="p-4 text-left font-semibold text-zinc-400">Spec</th>
                {selectedCars.map((car) => (
                  <th key={car.id} className="p-4 text-left font-semibold text-white">
                    {carName(car)}
                    <div className="text-xs font-normal text-zinc-500">{car.variant}</div>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {SPEC_ROWS.map((row) => {
                const values = selectedCars.map((car) =>
                  row.getSortValue(car, tcoByCarId.get(car.id))
                );
                const best = row.higherIsBetter ? Math.max(...values) : Math.min(...values);
                const allTied = values.every((v) => v === values[0]);

                return (
                  <tr key={row.label} className="border-b border-zinc-800/60">
                    <td className="p-4 text-zinc-400">{row.label}</td>
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
                              ? "bg-emerald-500/10 font-semibold text-emerald-400"
                              : "text-zinc-300"
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
          <p className="rounded-xl border border-zinc-800 bg-zinc-900/50 p-4 text-sm text-zinc-300">
            {result.tradeoff_summary}
          </p>
        )}

        <div className="pt-2 text-center">
          <button
            type="button"
            onClick={() => router.push("/results")}
            className="rounded-full border border-zinc-700 px-6 py-3 text-sm font-medium text-zinc-300 hover:border-zinc-500"
          >
            Back to Shortlist
          </button>
        </div>
      </div>
    </main>
  );
}
