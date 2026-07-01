import { Car as CarIconLucide, CarFront, Truck, Bus, type LucideIcon } from "lucide-react";
import type { Car } from "@/lib/cars";

const BODY_TYPE_ICON: Record<Car["body_type"], LucideIcon> = {
  Hatchback: CarIconLucide,
  "EV Hatchback": CarIconLucide,
  Sedan: CarFront,
  "EV Sedan": CarFront,
  SUV: Truck,
  "EV SUV": Truck,
  "Coupe SUV": Truck,
  "EV Coupe SUV": Truck,
  MUV: Bus,
};

const FUEL_TYPE_BG: Record<Car["fuel_type"], string> = {
  Petrol: "bg-slate-700/40",
  Diesel: "bg-amber-900/40",
  EV: "bg-emerald-900/40",
  Hybrid: "bg-teal-900/40",
  CNG: "bg-sky-900/40",
};

export function CarIcon({ car }: { car: Car }) {
  const Icon = BODY_TYPE_ICON[car.body_type];
  const bg = FUEL_TYPE_BG[car.fuel_type];

  return (
    <div className={`flex h-14 w-14 shrink-0 items-center justify-center rounded-xl ${bg}`}>
      <Icon size={28} className="text-white" />
    </div>
  );
}
