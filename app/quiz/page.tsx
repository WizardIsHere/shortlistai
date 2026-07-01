"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import {
  MapPin,
  Navigation,
  Users,
  Star,
  Car,
  CarFront,
  Truck,
  Bus,
  Sparkles,
  Fuel,
  Zap,
  Leaf,
  Loader2,
} from "lucide-react";
import type { QuizAnswers } from "@/lib/scoring";
import type { Car as CarType } from "@/lib/cars";
import { saveSession } from "@/lib/session";

type PrimaryUse = QuizAnswers["primary_use"];
type BodyTypePref = QuizAnswers["body_type_pref"];
type FuelPref = QuizAnswers["fuel_pref"];
type SeatingNeeded = QuizAnswers["seating_needed"];

const PRIMARY_USE_OPTIONS: { value: PrimaryUse; label: string; icon: typeof MapPin }[] = [
  { value: "city", label: "City Commute", icon: MapPin },
  { value: "highway", label: "Highway Trips", icon: Navigation },
  { value: "family", label: "Family & Road Trips", icon: Users },
  { value: "first_car", label: "First Car", icon: Star },
];

const BODY_TYPE_OPTIONS: { value: BodyTypePref; label: string; icon: typeof Car }[] = [
  { value: "Hatchback", label: "Hatchback", icon: Car },
  { value: "Sedan", label: "Sedan", icon: CarFront },
  { value: "SUV", label: "SUV", icon: Truck },
  { value: "MUV", label: "MUV", icon: Bus },
  { value: "no_preference", label: "No Preference", icon: Sparkles },
];

const SEATING_OPTIONS: { value: SeatingNeeded; label: string }[] = [
  { value: 4, label: "4 seats" },
  { value: 5, label: "5 seats" },
  { value: 7, label: "7+ seats" },
];

const FUEL_OPTIONS: {
  value: FuelPref;
  label: string;
  icon: typeof Fuel;
  accent?: string;
}[] = [
  { value: "Petrol", label: "Petrol", icon: Fuel },
  { value: "Diesel", label: "Diesel", icon: Fuel },
  { value: "EV", label: "EV", icon: Zap, accent: "emerald" },
  { value: "Hybrid", label: "Hybrid", icon: Leaf, accent: "teal" },
  { value: "no_preference", label: "No Preference", icon: Sparkles },
];

const MIN_BUDGET = 3;
const MAX_BUDGET = 70;

function OptionCard({
  selected,
  label,
  icon: Icon,
  accent,
  onClick,
}: {
  selected: boolean;
  label: string;
  icon: typeof Car;
  accent?: string;
  onClick: () => void;
}) {
  const accentClasses: Record<string, string> = {
    emerald: selected
      ? "border-emerald-500 bg-emerald-500/10 text-emerald-400"
      : "border-zinc-700 text-zinc-300 hover:border-emerald-500/50",
    teal: selected
      ? "border-teal-500 bg-teal-500/10 text-teal-400"
      : "border-zinc-700 text-zinc-300 hover:border-teal-500/50",
  };
  const defaultClasses = selected
    ? "border-amber-500 bg-amber-500/10 text-amber-400"
    : "border-zinc-700 text-zinc-300 hover:border-zinc-500";

  return (
    <button
      type="button"
      onClick={onClick}
      className={`flex flex-col items-center gap-2 rounded-xl border p-4 transition-colors ${
        accent ? accentClasses[accent] : defaultClasses
      }`}
    >
      <Icon size={28} />
      <span className="text-sm font-medium">{label}</span>
    </button>
  );
}

export default function QuizPage() {
  const router = useRouter();
  const [budgetMin, setBudgetMin] = useState(5);
  const [budgetMax, setBudgetMax] = useState(15);
  const [primaryUse, setPrimaryUse] = useState<PrimaryUse | null>(null);
  const [bodyTypePref, setBodyTypePref] = useState<BodyTypePref | null>(null);
  const [seatingNeeded, setSeatingNeeded] = useState<SeatingNeeded | null>(null);
  const [fuelPref, setFuelPref] = useState<FuelPref | null>(null);
  const [extraNotes, setExtraNotes] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const isComplete =
    primaryUse !== null && bodyTypePref !== null && seatingNeeded !== null && fuelPref !== null;

  async function handleSubmit() {
    if (!isComplete) return;
    setIsSubmitting(true);
    setError(null);

    const answers: QuizAnswers = {
      budget_min: budgetMin,
      budget_max: budgetMax,
      primary_use: primaryUse,
      body_type_pref: bodyTypePref as CarType["body_type"] | "no_preference",
      seating_needed: seatingNeeded,
      fuel_pref: fuelPref,
      extra_notes: extraNotes,
    };

    try {
      const res = await fetch("/api/shortlist", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(answers),
      });
      if (!res.ok) throw new Error("Request failed");
      const data = await res.json();

      saveSession({
        quiz_answers: answers,
        shortlist: data.shortlist,
        tco: data.tco,
        relaxation_applied: data.relaxation_applied,
        ai_unavailable: data.ai_unavailable,
        timestamp: Date.now(),
      });

      router.push("/results");
    } catch {
      setError("Something went wrong. Please try again.");
      setIsSubmitting(false);
    }
  }

  if (isSubmitting) {
    return (
      <main className="flex flex-1 flex-col items-center justify-center gap-4 text-center">
        <Loader2 size={40} className="animate-spin text-amber-500" />
        <p className="text-lg text-zinc-300">Finding your best matches...</p>
      </main>
    );
  }

  return (
    <main className="flex flex-1 flex-col items-center px-6 py-16">
      <div className="w-full max-w-2xl space-y-14">
        <h1 className="text-3xl font-bold text-white">Tell us about your ideal car</h1>

        <section>
          <h2 className="mb-4 text-lg font-semibold text-zinc-200">
            1. What&apos;s your budget? (₹ in Lakhs)
          </h2>
          <div className="relative h-2 rounded-full bg-zinc-800">
            <div
              className="absolute h-2 rounded-full bg-amber-500"
              style={{
                left: `${((budgetMin - MIN_BUDGET) / (MAX_BUDGET - MIN_BUDGET)) * 100}%`,
                right: `${100 - ((budgetMax - MIN_BUDGET) / (MAX_BUDGET - MIN_BUDGET)) * 100}%`,
              }}
            />
            <input
              type="range"
              min={MIN_BUDGET}
              max={MAX_BUDGET}
              value={budgetMin}
              onChange={(e) => setBudgetMin(Math.min(Number(e.target.value), budgetMax))}
              className="absolute top-0 h-2 w-full"
            />
            <input
              type="range"
              min={MIN_BUDGET}
              max={MAX_BUDGET}
              value={budgetMax}
              onChange={(e) => setBudgetMax(Math.max(Number(e.target.value), budgetMin))}
              className="absolute top-0 h-2 w-full"
            />
          </div>
          <p className="mt-6 text-center text-2xl font-bold text-amber-400">
            ₹{budgetMin}L – ₹{budgetMax}L
          </p>
        </section>

        <section>
          <h2 className="mb-4 text-lg font-semibold text-zinc-200">
            2. How will you mainly use the car?
          </h2>
          <div className="grid grid-cols-2 gap-3">
            {PRIMARY_USE_OPTIONS.map((opt) => (
              <OptionCard
                key={opt.value}
                selected={primaryUse === opt.value}
                label={opt.label}
                icon={opt.icon}
                onClick={() => setPrimaryUse(opt.value)}
              />
            ))}
          </div>
        </section>

        <section>
          <h2 className="mb-4 text-lg font-semibold text-zinc-200">
            3. Which body type appeals to you?
          </h2>
          <div className="grid grid-cols-3 gap-3">
            {BODY_TYPE_OPTIONS.map((opt) => (
              <OptionCard
                key={opt.value}
                selected={bodyTypePref === opt.value}
                label={opt.label}
                icon={opt.icon}
                onClick={() => setBodyTypePref(opt.value)}
              />
            ))}
          </div>
        </section>

        <section>
          <h2 className="mb-4 text-lg font-semibold text-zinc-200">
            4. How many seats do you need?
          </h2>
          <div className="grid grid-cols-3 gap-3">
            {SEATING_OPTIONS.map((opt) => (
              <button
                key={opt.value}
                type="button"
                onClick={() => setSeatingNeeded(opt.value)}
                className={`rounded-xl border p-4 text-sm font-medium transition-colors ${
                  seatingNeeded === opt.value
                    ? "border-amber-500 bg-amber-500/10 text-amber-400"
                    : "border-zinc-700 text-zinc-300 hover:border-zinc-500"
                }`}
              >
                {opt.label}
              </button>
            ))}
          </div>
        </section>

        <section>
          <h2 className="mb-4 text-lg font-semibold text-zinc-200">5. Fuel preference?</h2>
          <div className="grid grid-cols-3 gap-3">
            {FUEL_OPTIONS.map((opt) => (
              <OptionCard
                key={opt.value}
                selected={fuelPref === opt.value}
                label={opt.label}
                icon={opt.icon}
                accent={opt.accent}
                onClick={() => setFuelPref(opt.value)}
              />
            ))}
          </div>
        </section>

        <section>
          <h2 className="mb-4 text-lg font-semibold text-zinc-200">
            6. Anything else we should know? <span className="text-zinc-500">(optional)</span>
          </h2>
          <textarea
            value={extraNotes}
            onChange={(e) => setExtraNotes(e.target.value)}
            placeholder="e.g. I need good ground clearance, or I drive on bad roads"
            rows={3}
            className="w-full rounded-xl border border-zinc-700 bg-zinc-900 p-4 text-sm text-zinc-200 placeholder-zinc-500 focus:border-amber-500 focus:outline-none"
          />
        </section>

        {error && <p className="text-center text-sm text-red-400">{error}</p>}

        <button
          type="button"
          disabled={!isComplete}
          onClick={handleSubmit}
          className="w-full rounded-full bg-amber-500 px-8 py-4 text-lg font-semibold text-black transition-colors hover:bg-amber-400 disabled:cursor-not-allowed disabled:bg-zinc-700 disabled:text-zinc-400"
        >
          Find My Cars →
        </button>
      </div>
    </main>
  );
}
