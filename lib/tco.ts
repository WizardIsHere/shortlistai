import { Car } from './cars';

export type TCOResult = {
  car_id: string;
  monthly_emi: number;
  monthly_fuel: number;
  annual_insurance_yr1: number;
  annual_maintenance: number;
  total_3yr_cost: number;
};

const LOAN_PCT = 0.8;
const ANNUAL_RATE = 0.09;
const TENURE_MONTHS = 60;
const MONTHLY_KM = 1200;

const FUEL_PRICE_PER_LITRE: Record<'Petrol' | 'Diesel' | 'Hybrid', number> = {
  Petrol: 105,
  Diesel: 90,
  Hybrid: 70,
};

const MAINTENANCE_BY_FUEL: Record<Car['fuel_type'], number> = {
  Petrol: 8000,
  Diesel: 10000,
  EV: 4000,
  Hybrid: 6000,
  CNG: 7000,
};

function calcEMI(principal: number): number {
  const r = ANNUAL_RATE / 12;
  const n = TENURE_MONTHS;
  return (principal * r * Math.pow(1 + r, n)) / (Math.pow(1 + r, n) - 1);
}

function calcMonthlyFuel(car: Car): number {
  if (car.fuel_type === 'EV') {
    return 2 * MONTHLY_KM;
  }
  if (car.fuel_type === 'CNG') {
    return 0;
  }
  const pricePerLitre = FUEL_PRICE_PER_LITRE[car.fuel_type];
  return (pricePerLitre / car.mileage_kmpl) * MONTHLY_KM;
}

export function calcTCO(car: Car): TCOResult {
  const priceInr = car.price_lakh_inr * 100000;
  const loan = priceInr * LOAN_PCT;
  const monthlyEmi = calcEMI(loan);
  const monthlyFuel = calcMonthlyFuel(car);
  const insuranceYr1 = priceInr * 0.03;
  const insuranceYr2Plus = priceInr * 0.015;
  const annualMaintenance = MAINTENANCE_BY_FUEL[car.fuel_type];

  const total3yr =
    monthlyEmi * 36 +
    monthlyFuel * 36 +
    (insuranceYr1 + insuranceYr2Plus + insuranceYr2Plus) +
    annualMaintenance * 3;

  return {
    car_id: car.id,
    monthly_emi: Math.round(monthlyEmi),
    monthly_fuel: Math.round(monthlyFuel),
    annual_insurance_yr1: Math.round(insuranceYr1),
    annual_maintenance: annualMaintenance,
    total_3yr_cost: Math.round(total3yr),
  };
}

export function calcTCOForCars(cars: Car[]): TCOResult[] {
  return cars.map(calcTCO);
}
