import Link from "next/link";
import { ArrowRight } from "lucide-react";

export default function Home() {
  return (
    <main className="relative flex flex-1 flex-col items-center justify-center overflow-hidden bg-[#0A0A0F] text-center px-6">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_center,_#6C63FF15_0%,_transparent_70%)]" />

      <div className="relative">
        <h1 className="max-w-3xl text-4xl sm:text-6xl font-bold tracking-tight text-white">
          Find your perfect car.
          <br />
          <span className="text-[#6C63FF]">In 3 minutes. No confusion.</span>
        </h1>
        <p className="mt-6 max-w-md mx-auto text-lg text-[#8B8B9E]">
          Tell us what matters. We&apos;ll shortlist the right cars for you.
        </p>
        <Link
          href="/quiz"
          className="mt-10 inline-flex items-center gap-2 rounded-xl bg-[#6C63FF] px-8 py-4 text-lg font-semibold text-white transition hover:brightness-110 hover:shadow-lg hover:shadow-[#6C63FF33]"
        >
          Find My Car
          <ArrowRight size={20} />
        </Link>

        <div className="mt-14 flex flex-wrap items-center justify-center gap-3">
          {["70+ Cars", "Indian Market", "AI-Powered"].map((label) => (
            <span
              key={label}
              className="rounded-full border border-[#2A2A38] px-4 py-1 text-sm text-[#8B8B9E]"
            >
              {label}
            </span>
          ))}
        </div>
      </div>
    </main>
  );
}
