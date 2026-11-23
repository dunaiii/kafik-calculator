import { calculateKafik, parseNumber } from "./calculator.mjs";

function equals(actual, expected, label) {
  if (Math.abs(actual - expected) > 0.00001) {
    throw new Error(label + ": очікувалось " + expected + ", отримано " + actual);
  }
}

Deno.test("вихідні значення дають коректний результат", () => {
  const result = calculateKafik(5428, 258.5, 1.05);
  equals(result.baseSalary, 5428 / 1.05, "базова зарплата");
  equals(result.baseRate, 5428 / 1.05 / 258.5, "базова ставка");
  equals(result.finalRate, 5428 / 258.5, "ставка з коефіцієнтом");
  equals(result.extraRate, result.finalRate - result.baseRate, "різниця ставки");
  equals(result.extraSalary, 5428 - result.baseSalary, "різниця зарплати");
  equals(result.extraPercent, 5, "відсоток");
});

Deno.test("коефіцієнт 1 не створює доплати", () => {
  const result = calculateKafik(1000, 40, 1);
  equals(result.baseSalary, 1000, "зарплата");
  equals(result.baseRate, 25, "ставка");
  equals(result.extraRate, 0, "різниця");
});

Deno.test("коефіцієнт менший за 1 відображає зменшення", () => {
  const result = calculateKafik(900, 45, 0.9);
  equals(result.baseSalary, 1000, "початкова зарплата");
  equals(result.extraSalary, -100, "зміна зарплати");
  equals(result.extraPercent, -10, "відсоток");
});

Deno.test("нульова зарплата допустима", () => {
  const result = calculateKafik(0, 40, 1.2);
  equals(result.baseRate, 0, "нульова ставка");
});

Deno.test("некоректні дані викликають помилку", () => {
  for (const values of [
    [100, 0, 1.05],
    [100, -1, 1.05],
    [100, 40, 0],
    [100, 40, -2],
    [-100, 40, 1.05],
    [Number.NaN, 40, 1.05],
    [Number.POSITIVE_INFINITY, 40, 1.05],
    [Number.MAX_VALUE, Number.MIN_VALUE, 1],
  ]) {
    let failed = false;
    try {
      calculateKafik(...values);
    } catch (error) {
      if (!(error instanceof RangeError)) throw error;
      failed = true;
    }
    if (!failed) throw new Error("Очікувалась RangeError для " + values);
  }
});

Deno.test("підтримуються коми та пробіли в числах", () => {
  equals(parseNumber("5 428,50"), 5428.5, "зарплата");
  equals(parseNumber("258.5"), 258.5, "години");
  equals(parseNumber("1,05"), 1.05, "коефіцієнт");
  for (const value of ["", "1,2.3", "текст", "-5", "Infinity"]) {
    if (!Number.isNaN(parseNumber(value))) throw new Error("Некоректне число: " + value);
  }
});
