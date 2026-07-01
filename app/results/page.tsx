"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { ChevronDown, Gauge, Users, Cog, ShieldCheck, X } from "lucide-react";
import { cars } from "@/lib/cars";
import { loadSession, clearSession, type ShortlistSession } from "@/lib/session";
import { CarIcon } from "@/components/CarIcon";

function fitScoreColor(score: number): string {
  if (score > 80) return "bg-emerald-500/20 text-emerald-400 border-emerald-500/40";
  if (score >= 60) return "bg-amber-500/20 text-amber-400 border-amber-500/40";
  return "bg-red-500/20 text-red-400 border-red-500/40";
}

function formatInr(amount: number): string {
  return `₹${amount.toLocaleString("en-IN")}`;
}

export default function ResultsPage() {
  const router = useRouter();
  const [session, setSession] = useState<ShortlistSession | null>(null);
  const [loaded, setLoaded] = useState(false);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [showUpsell, setShowUpsell] = useState(true);

  useEffect(() => {
    // localStorage is only available client-side, so the session must be read post-mount.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setSession(loadSession());
    setLoaded(true);
  }, []);

  if (loaded && !session) {
    return (
      <main className="flex flex-1 flex-col items-center justify-center gap-4 text-center px-6">
        <p className="text-lg text-zinc-300">No results found. Let&apos;s start over.</p>
        <button
          type="button"
          onClick={() => router.push("/quiz")}
          className="rounded-full bg-amber-500 px-6 py-3 font-semibold text-black hover:bg-amber-400"
        >
          Take the quiz
        </button>
      </main>
    );
  }

  if (!session) return null;

  const { shortlist, tco, relaxation_applied, ai_unavailable } = session;
  const upsell = shortlist.upsell_nudge;

  function toggleCompare(carId: string) {
    setSelectedIds((prev) => {
      if (prev.includes(carId)) return prev.filter((id) => id !== carId);
      if (prev.length >= 3) return prev;
      return [...prev, carId];
    });
  }

  function handleStartOver() {
    clearSession();
    router.push("/");
  }

  function handleCompare() {
    router.push(`/compare?ids=${selectedIds.join(",")}`);
  }

  return (
    <main className="flex flex-1 flex-col px-6 py-12 pb-32">
      <div className="mx-auto w-full max-w-5xl space-y-6">
        <h1 className="text-3xl font-bold text-white">Your Shortlist</h1>

        {upsell.show && showUpsell && (
          <div className="flex items-start justify-between gap-4 rounded-xl border border-amber-500/40 bg-amber-500/10 p-4 text-amber-200">
            <p className="text-sm">
              Spending ₹{upsell.extra_lakhs}L more unlocks {upsell.to_car} — {upsell.reason}
            </p>
            <button
              type="button"
              onClick={() => setShowUpsell(false)}
              className="shrink-0 text-amber-300 hover:text-amber-100"
              aria-label="Dismiss"
            >
              <X size={16} />
            </button>
          </div>
        )}

        {relaxation_applied && (
          <div className="rounded-xl border border-blue-500/40 bg-blue-500/10 p-4 text-sm text-blue-200">
            We expanded your search slightly to show more options: {relaxation_applied}
          </div>
        )}

        {ai_unavailable && (
          <div className="rounded-xl border border-zinc-700 bg-zinc-800/50 p-4 text-sm text-zinc-400">
            AI explanations are temporarily unavailable — showing ranked results
          </div>
        )}

        <div className="space-y-5">
          {shortlist.shortlist.map((entry) => {
            const car = cars.find((c) => c.id === entry.car_id);
            const carTco = tco.find((t) => t.car_id === entry.car_id);
            if (!car) return null;

            const isSelected = selectedIds.includes(car.id);
            const isDisabled = !isSelected && selectedIds.length >= 3;
            const isExpanded = expandedId === car.id;

            return (
              <div
                key={car.id}
                className="rounded-2xl border border-zinc-800 bg-zinc-900/50 p-5"
              >
                <div className="flex items-start gap-4">
                  <CarIcon car={car} />
                  <div className="flex-1">
                    <div className="flex flex-wrap items-start justify-between gap-2">
                      <div>
                        <h2 className="text-xl font-bold text-white">
                          {car.make} {car.model}
                        </h2>
                        <p className="text-sm text-zinc-500">{car.variant}</p>
                      </div>
                      <div className="flex flex-col items-end gap-1">
                        <span className="text-lg font-semibold text-white">
                          ₹{car.price_lakh_inr} Lakhs
                        </span>
                        <span
                          className={`rounded-full border px-3 py-1 text-xs font-semibold ${fitScoreColor(
                            entry.fit_score
                          )}`}
                        >
                          Fit Score: {entry.fit_score}
                        </span>
                      </div>
                    </div>

                    {entry.why_this_fits && (
                      <p className="mt-3 text-sm text-zinc-300">{entry.why_this_fits}</p>
                    )}
                    {entry.who_should_pick && (
                      <p className="mt-2 text-sm italic text-zinc-400">
                        {entry.who_should_pick}
                      </p>
                    )}

                    {carTco && (
                      <div className="mt-4 flex flex-wrap gap-4 rounded-xl bg-zinc-950/60 p-3 text-sm text-zinc-300">
                        <span>Monthly EMI: {formatInr(carTco.monthly_emi)}</span>
                        <span>Fuel/mo: {formatInr(carTco.monthly_fuel)}</span>
                        <span>3-yr Total: ₹{(carTco.total_3yr_cost / 100000).toFixed(1)} L</span>
                      </div>
                    )}

                    <div className="mt-4 flex flex-wrap gap-5 text-sm text-zinc-400">
                      <span className="flex items-center gap-1">
                        <Gauge size={16} /> {car.mileage_kmpl} kmpl
                      </span>
                      <span className="flex items-center gap-1">
                        <Users size={16} /> {car.seating_capacity} seats
                      </span>
                      <span className="flex items-center gap-1">
                        <Cog size={16} /> {car.transmission}
                      </span>
                      <span className="flex items-center gap-1">
                        <ShieldCheck size={16} /> {car.safety_rating}/5
                      </span>
                    </div>

                    {(entry.devil_advocate[0] || entry.devil_advocate[1]) && (
                      <div className="mt-4">
                        <button
                          type="button"
                          onClick={() => setExpandedId(isExpanded ? null : car.id)}
                          className="flex items-center gap-1 text-sm font-medium text-amber-500/80 hover:text-amber-400"
                        >
                          What owners wish they knew
                          <ChevronDown
                            size={16}
                            className={`transition-transform ${isExpanded ? "rotate-180" : ""}`}
                          />
                        </button>
                        {isExpanded && (
                          <ul className="mt-2 space-y-1 rounded-xl border border-amber-900/40 bg-amber-950/20 p-3 text-sm text-amber-300/90">
                            {entry.devil_advocate.filter(Boolean).map((point, i) => (
                              <li key={i}>• {point}</li>
                            ))}
                          </ul>
                        )}
                      </div>
                    )}

                    <label className="mt-4 flex items-center gap-2 text-sm text-zinc-400">
                      <input
                        type="checkbox"
                        checked={isSelected}
                        disabled={isDisabled}
                        onChange={() => toggleCompare(car.id)}
                        className="h-4 w-4 accent-amber-500 disabled:cursor-not-allowed"
                      />
                      Add to Compare
                    </label>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        <div className="pt-4 text-center">
          <button
            type="button"
            onClick={handleStartOver}
            className="rounded-full border border-zinc-700 px-6 py-3 text-sm font-medium text-zinc-300 hover:border-zinc-500"
          >
            Start Over
          </button>
        </div>
      </div>

      {selectedIds.length >= 2 && (
        <div className="fixed inset-x-0 bottom-0 flex justify-center border-t border-zinc-800 bg-zinc-950/95 p-4">
          <button
            type="button"
            onClick={handleCompare}
            className="rounded-full bg-amber-500 px-8 py-3 font-semibold text-black hover:bg-amber-400"
          >
            Compare {selectedIds.length} Cars →
          </button>
        </div>
      )}
    </main>
  );
}
