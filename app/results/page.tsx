"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { ChevronDown, Gauge, Users, Cog, X, Star } from "lucide-react";
import { cars } from "@/lib/cars";
import { loadSession, clearSession, type ShortlistSession } from "@/lib/session";
import { CarIcon } from "@/components/CarIcon";

function fitScoreColor(score: number): string {
  if (score > 80) return "bg-green-500/20 text-green-400 border-green-500/30";
  if (score >= 60) return "bg-amber-500/20 text-amber-400 border-amber-500/30";
  return "bg-red-500/20 text-red-400 border-red-500/30";
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
      <main className="flex flex-1 flex-col items-center justify-center gap-4 bg-[#0A0A0F] text-center px-6">
        <p className="text-lg text-[#8B8B9E]">No results found. Let&apos;s start over.</p>
        <button
          type="button"
          onClick={() => router.push("/quiz")}
          className="rounded-xl bg-[#6C63FF] px-6 py-3 font-semibold text-white hover:brightness-110"
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
      <main className="flex flex-1 flex-col bg-[#0A0A0F] px-6 py-12 pb-32">
      <div className="mx-auto w-full max-w-5xl space-y-6">
        <h1 className="text-3xl font-bold text-white">Your Shortlist</h1>

        {upsell.show && showUpsell && (
          <div className="flex items-start justify-between gap-4 rounded-xl border border-amber-800/40 bg-amber-950/40 px-4 py-3 text-amber-200">
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
          <div className="rounded-xl border border-blue-800/40 bg-blue-950/40 px-4 py-3 text-sm text-blue-200">
            We expanded your search slightly to show more options: {relaxation_applied}
          </div>
        )}

        {ai_unavailable && (
          <div className="rounded-xl border border-[#2A2A38] bg-[#1C1C26] px-4 py-3 text-sm text-[#8B8B9E]">
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
                className={`rounded-2xl border p-6 transition-all duration-200 ${
                  isSelected
                    ? "border-[#6C63FF] bg-[#6C63FF08]"
                    : "border-[#2A2A38] bg-[#13131A] hover:border-[#6C63FF40] hover:shadow-lg hover:shadow-[#6C63FF08]"
                }`}
              >
                <div className="flex items-start gap-4">
                  <CarIcon car={car} />
                  <div className="flex-1">
                    <div className="flex flex-wrap items-start justify-between gap-2">
                      <div>
                        <h2 className="text-xl font-bold text-white">
                          {car.make} {car.model}
                        </h2>
                        <p className="text-sm text-[#8B8B9E]">{car.variant}</p>
                      </div>
                      <div className="flex flex-col items-end gap-1">
                        <span
                          className={`rounded-full border px-3 py-1 text-sm font-semibold ${fitScoreColor(
                            entry.fit_score
                          )}`}
                        >
                          Fit Score: {entry.fit_score}
                        </span>
                      </div>
                    </div>

                    <p className="mt-3 text-2xl font-bold text-white">
                      ₹{car.price_lakh_inr} Lakhs
                    </p>

                    {entry.why_this_fits && (
                      <div className="mt-4">
                        <p className="text-xs font-semibold uppercase tracking-widest text-[#55556A]">
                          Why This Fits You
                        </p>
                        <p className="mt-1 text-sm leading-relaxed text-[#8B8B9E]">
                          {entry.why_this_fits}
                        </p>
                      </div>
                    )}
                    {entry.who_should_pick && (
                      <p className="mt-2 text-sm italic text-[#8B8B9E]">
                        {entry.who_should_pick}
                      </p>
                    )}

                    <div className="mt-4 flex flex-wrap gap-2">
                      <span className="flex items-center gap-1 rounded-full bg-[#1C1C26] px-3 py-1 text-xs text-[#8B8B9E]">
                        <Gauge size={14} /> {car.mileage_kmpl} kmpl
                      </span>
                      <span className="flex items-center gap-1 rounded-full bg-[#1C1C26] px-3 py-1 text-xs text-[#8B8B9E]">
                        <Users size={14} /> {car.seating_capacity} seats
                      </span>
                      <span className="flex items-center gap-1 rounded-full bg-[#1C1C26] px-3 py-1 text-xs text-[#8B8B9E]">
                        <Cog size={14} /> {car.transmission}
                      </span>
                      <span className="flex items-center gap-1 rounded-full bg-[#1C1C26] px-3 py-1 text-xs text-[#8B8B9E]">
                        <Star size={14} /> {car.safety_rating}/5
                      </span>
                    </div>

                    {carTco && (
                      <div className="mt-3 grid grid-cols-3 divide-x divide-[#2A2A38] rounded-xl bg-[#0A0A0F] p-3">
                        <div className="text-center">
                          <p className="text-xs uppercase tracking-widest text-[#55556A]">
                            Monthly EMI
                          </p>
                          <p className="mt-1 text-sm font-semibold text-white">
                            {formatInr(carTco.monthly_emi)}
                          </p>
                        </div>
                        <div className="text-center">
                          <p className="text-xs uppercase tracking-widest text-[#55556A]">
                            Fuel/mo
                          </p>
                          <p className="mt-1 text-sm font-semibold text-white">
                            {formatInr(carTco.monthly_fuel)}
                          </p>
                        </div>
                        <div className="text-center">
                          <p className="text-xs uppercase tracking-widest text-[#55556A]">
                            3-yr Total
                          </p>
                          <p className="mt-1 text-sm font-semibold text-white">
                            ₹{(carTco.total_3yr_cost / 100000).toFixed(1)} L
                          </p>
                        </div>
                      </div>
                    )}

                    {(entry.devil_advocate[0] || entry.devil_advocate[1]) && (
                      <div className="mt-4">
                        <button
                          type="button"
                          onClick={() => setExpandedId(isExpanded ? null : car.id)}
                          className="flex items-center gap-1 text-xs font-medium text-amber-400 hover:text-amber-300"
                        >
                          What owners wish they knew
                          <ChevronDown
                            size={14}
                            className={`transition-transform ${isExpanded ? "rotate-180" : ""}`}
                          />
                        </button>
                        {isExpanded && (
                          <ul className="mt-2 space-y-1 rounded-lg border border-amber-900/30 bg-amber-950/20 p-3 text-xs text-amber-200/70">
                            {entry.devil_advocate.filter(Boolean).map((point, i) => (
                              <li key={i}>• {point}</li>
                            ))}
                          </ul>
                        )}
                      </div>
                    )}

                    <label className="mt-4 flex items-center justify-end gap-2 text-xs text-[#8B8B9E]">
                      <input
                        type="checkbox"
                        checked={isSelected}
                        disabled={isDisabled}
                        onChange={() => toggleCompare(car.id)}
                        className="h-4 w-4 accent-[#6C63FF] disabled:cursor-not-allowed"
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
            className="rounded-xl border border-[#2A2A38] px-6 py-3 text-sm font-medium text-[#8B8B9E] hover:text-white hover:border-[#55556A]"
          >
            Start Over
          </button>
        </div>
      </div>

      {selectedIds.length >= 2 && (
        <div className="fixed inset-x-0 bottom-0 flex justify-center border-t border-[#2A2A38] bg-[#13131A]/90 backdrop-blur p-4">
          <button
            type="button"
            onClick={handleCompare}
            className="rounded-xl bg-[#6C63FF] px-8 py-3 font-semibold text-white hover:brightness-110 hover:shadow-lg hover:shadow-[#6C63FF33]"
          >
            Compare {selectedIds.length} Cars →
          </button>
        </div>
      )}
      </main>
    </>
  );
}
