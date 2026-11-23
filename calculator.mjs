/** Parse a non-negative decimal written with either a comma or a dot. */
export function parseNumber(value) {
  const normalized = String(value).trim().replace(/[\s\u00a0\u202f]/g, "");
  if (!/^\d+(?:[.,]\d+)?$/.test(normalized)) return Number.NaN;
  return Number(normalized.replace(",", "."));
}

/** All results are expressed in the same currency/unit as the input salary. */
export function calculateKafik(salary, hours, coefficient) {
  if (!Number.isFinite(salary) || salary < 0) {
    throw new RangeError("Зарплата має бути невід’ємним числом.");
  }
  if (!Number.isFinite(hours) || hours <= 0) {
    throw new RangeError("Кількість годин має бути більшою за нуль.");
  }
  if (!Number.isFinite(coefficient) || coefficient <= 0) {
    throw new RangeError("Коефіцієнт має бути більшим за нуль.");
  }

  const baseSalary = salary / coefficient;
  const baseRate = baseSalary / hours;
  const finalRate = salary / hours;
  const extraRate = finalRate - baseRate;
  const extraSalary = salary - baseSalary;
  const extraPercent = (coefficient - 1) * 100;
  const result = { baseSalary, baseRate, finalRate, extraRate, extraSalary, extraPercent };

  if (Object.values(result).some((value) => !Number.isFinite(value))) {
    throw new RangeError("Числа занадто великі або малі для розрахунку.");
  }
  return result;
}
