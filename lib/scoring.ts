import { Car } from './cars';

export type QuizAnswers = {
  budget_min: number;
  budget_max: number;
  primary_use: 'city' | 'highway' | 'family' | 'first_car';
  body_type_pref: Car['body_type'] | 'no_preference';
  seating_needed: 4 | 5 | 7;
  fuel_pref: Car['fuel_type'] | 'no_preference';
  extra_notes: string;
};

export type ScoredCar = {
  car: Car;
  score: number;
};

export type ScoringResult = {
  candidates: ScoredCar[];
  relaxation_applied?: string;
};

function priceScore(car: Car, budgetMin: number, budgetMax: number): number {
  const price = car.price_lakh_inr;
  if (price >= budgetMin && price <= budgetMax) return 30;
  if (price < budgetMin) return 0;
  const overshoot = price - budgetMax;
  const maxOvershoot = budgetMax * 0.15;
  if (overshoot > maxOvershoot) return 0;
  return 30 * (1 - overshoot / maxOvershoot);
}

function bodyTypeScore(car: Car, pref: QuizAnswers['body_type_pref']): number {
  if (pref === 'no_preference') return 20;
  return car.body_type === pref ? 20 : 0;
}

function seatingScore(car: Car, needed: QuizAnswers['seating_needed']): number {
  return car.seating_capacity >= needed ? 20 : 0;
}

function fuelScore(car: Car, pref: QuizAnswers['fuel_pref']): number {
  if (pref === 'no_preference') return 15;
  return car.fuel_type === pref ? 15 : 0;
}

function safetyScore(car: Car): number {
  return (car.safety_rating / 5) * 15;
}

function scoreCar(car: Car, answers: QuizAnswers): number {
  return (
    priceScore(car, answers.budget_min, answers.budget_max) +
    bodyTypeScore(car, answers.body_type_pref) +
    seatingScore(car, answers.seating_needed) +
    fuelScore(car, answers.fuel_pref) +
    safetyScore(car)
  );
}

function rankTop8(cars: Car[], answers: QuizAnswers): ScoredCar[] {
  return cars
    .map((car) => ({ car, score: scoreCar(car, answers) }))
    .sort((a, b) => b.score - a.score)
    .slice(0, 8);
}

function countQualifying(cars: Car[], answers: QuizAnswers): number {
  const maxPrice = answers.budget_max * 1.15;
  return cars.filter((car) => {
    const priceOk = car.price_lakh_inr >= answers.budget_min && car.price_lakh_inr <= maxPrice;
    const bodyOk =
      answers.body_type_pref === 'no_preference' || car.body_type === answers.body_type_pref;
    const seatingOk = car.seating_capacity >= answers.seating_needed;
    const fuelOk = answers.fuel_pref === 'no_preference' || car.fuel_type === answers.fuel_pref;
    return priceOk && bodyOk && seatingOk && fuelOk;
  }).length;
}

export function scoreCars(cars: Car[], answers: QuizAnswers): ScoringResult {
  if (countQualifying(cars, answers) >= 5) {
    return { candidates: rankTop8(cars, answers) };
  }

  const noFuelAnswers: QuizAnswers = { ...answers, fuel_pref: 'no_preference' };
  if (countQualifying(cars, noFuelAnswers) >= 5) {
    return {
      candidates: rankTop8(cars, noFuelAnswers),
      relaxation_applied: 'removed your fuel preference filter',
    };
  }

  const expandedBudgetAnswers: QuizAnswers = {
    ...noFuelAnswers,
    budget_max: answers.budget_max * 1.1,
  };
  return {
    candidates: rankTop8(cars, expandedBudgetAnswers),
    relaxation_applied: 'removed your fuel preference filter and expanded your budget by 10%',
  };
}
