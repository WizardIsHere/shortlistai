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

const FUEL_TYPE_GRADIENT: Record<Car["fuel_type"], string> = {
  Petrol: "from-slate-500 to-blue-800",
  Diesel: "from-amber-500 to-amber-800",
  EV: "from-emerald-500 to-emerald-800",
  Hybrid: "from-teal-500 to-teal-800",
  CNG: "from-sky-500 to-sky-800",
};

export function CarIcon({ car }: { car: Car }) {
  const Icon = BODY_TYPE_ICON[car.body_type];
  const gradient = FUEL_TYPE_GRADIENT[car.fuel_type];

  return (
    <div
      className={`flex h-14 w-14 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br ${gradient}`}
    >
      <Icon size={28} className="text-white" />
    </div>
  );
}
