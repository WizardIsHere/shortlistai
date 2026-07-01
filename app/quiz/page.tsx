"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
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
import { saveSession, clearSession } from "@/lib/session";

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

const LOADING_MESSAGES = [
  "Finding your best matches...",
  "Politely asking dealers to stop upselling sunroofs...",
  "Cross-checking legroom with your patience...",
  "Ruling out cars your neighbor would judge...",
  "Negotiating fuel economy with reality...",
  "Making sure the AC actually works...",
  "Asking the AI to be brutally honest...",
  "Double-checking boot space for future IKEA runs...",
  "Almost there — polishing your shortlist...",
];

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
      ? "border-emerald-500 bg-emerald-900/30 text-emerald-400"
      : "border-[#2A2A38] bg-[#13131A] text-[#8B8B9E] hover:bg-[#1C1C26] hover:border-emerald-500/50",
    teal: selected
      ? "border-teal-500 bg-teal-900/30 text-teal-400"
      : "border-[#2A2A38] bg-[#13131A] text-[#8B8B9E] hover:bg-[#1C1C26] hover:border-teal-500/50",
  };
  const defaultClasses = selected
    ? "border-[#6C63FF] bg-[#6C63FF15] text-white"
    : "border-[#2A2A38] bg-[#13131A] text-[#8B8B9E] hover:bg-[#1C1C26]";

  return (
    <button
      type="button"
      onClick={onClick}
      className={`flex flex-col items-center gap-2 rounded-xl border p-4 transition-all duration-150 ${
        accent ? accentClasses[accent] : defaultClasses
      }`}
    >
      <Icon size={28} />
      <span className="text-sm font-medium">{label}</span>
    </button>
  );
}

function QuestionLabel({ children }: { children: React.ReactNode }) {
  return (
    <h2 className="mb-4 text-xs font-semibold uppercase tracking-widest text-[#8B8B9E]">
      {children}
    </h2>
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
  const [loadingMessageIndex, setLoadingMessageIndex] = useState(0);

  useEffect(() => {
    if (!isSubmitting) return;
    const interval = setInterval(() => {
      setLoadingMessageIndex((i) => (i + 1) % LOADING_MESSAGES.length);
    }, 2500);
    return () => clearInterval(interval);
  }, [isSubmitting]);

  const answeredCount = [primaryUse, bodyTypePref, seatingNeeded, fuelPref].filter(
    (v) => v !== null
  ).length;
  const isComplete = answeredCount === 4;

  async function handleSubmit() {
    if (!isComplete || primaryUse === null || bodyTypePref === null || seatingNeeded === null || fuelPref === null) return;
    setIsSubmitting(true);
    setError(null);
    setLoadingMessageIndex(0);

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
      <main className="flex flex-1 flex-col items-center bg-[#0A0A0F] px-6 py-16">
      <div className="w-full max-w-2xl space-y-14">
        <div className="flex items-center justify-center gap-2">
          {Array.from({ length: 4 }).map((_, i) => (
            <span
              key={i}
              className={`h-1.5 w-1.5 rounded-full ${
                i < answeredCount ? "bg-[#6C63FF]" : "bg-[#2A2A38]"
              }`}
            />
          ))}
        </div>

        <h1 className="text-3xl font-bold text-white text-center">
          Tell us about your ideal car
        </h1>

        <section>
          <QuestionLabel>Your Budget (₹ in Lakhs)</QuestionLabel>
          <div className="relative h-2 rounded-full bg-[#2A2A38]">
            <div
              className="absolute h-2 rounded-full bg-[#6C63FF]"
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
          <p className="mt-6 text-center text-2xl font-bold text-white">
            ₹{budgetMin}L – ₹{budgetMax}L
          </p>
        </section>

        <section>
          <QuestionLabel>How will you mainly use the car?</QuestionLabel>
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
          <QuestionLabel>Which body type appeals to you?</QuestionLabel>
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
          <QuestionLabel>How many seats do you need?</QuestionLabel>
          <div className="grid grid-cols-3 gap-3">
            {SEATING_OPTIONS.map((opt) => (
              <button
                key={opt.value}
                type="button"
                onClick={() => setSeatingNeeded(opt.value)}
                className={`rounded-xl border p-4 text-sm font-medium transition-all duration-150 ${
                  seatingNeeded === opt.value
                    ? "border-[#6C63FF] bg-[#6C63FF15] text-white"
                    : "border-[#2A2A38] bg-[#13131A] text-[#8B8B9E] hover:bg-[#1C1C26]"
                }`}
              >
                {opt.label}
              </button>
            ))}
          </div>
        </section>

        <section>
          <QuestionLabel>Fuel preference?</QuestionLabel>
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
          <QuestionLabel>
            Anything else we should know? <span className="text-[#55556A]">(optional)</span>
          </QuestionLabel>
          <textarea
            value={extraNotes}
            onChange={(e) => setExtraNotes(e.target.value)}
            placeholder="e.g. I need good ground clearance, or I drive on bad roads"
            rows={3}
            className="w-full rounded-xl border border-[#2A2A38] bg-[#13131A] p-4 text-sm text-[#F1F1F3] placeholder-[#55556A] focus:border-[#6C63FF] focus:outline-none"
          />
        </section>

        {error && <p className="text-center text-sm text-red-400">{error}</p>}

        <button
          type="button"
          disabled={!isComplete || isSubmitting}
          onClick={handleSubmit}
          className="w-full rounded-xl bg-[#6C63FF] px-8 py-4 text-lg font-semibold text-white transition hover:brightness-110 hover:shadow-lg hover:shadow-[#6C63FF33] disabled:cursor-not-allowed disabled:bg-[#2A2A38] disabled:text-[#55556A] disabled:hover:brightness-100 disabled:hover:shadow-none"
        >
          Find My Cars →
        </button>

        {isSubmitting && (
          <div className="flex items-center justify-center gap-2 text-sm text-[#8B8B9E]">
            <Loader2 size={16} className="animate-spin text-[#6C63FF]" />
            {LOADING_MESSAGES[loadingMessageIndex]}
          </div>
        )}
      </div>
      </main>
    </>
  );
}
