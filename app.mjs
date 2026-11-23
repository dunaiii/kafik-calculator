import { calculateKafik, parseNumber } from "./calculator.mjs";

const form = document.querySelector("#calculator");
const result = document.querySelector("#results");
const error = document.querySelector("#error");
const fields = {
  salary: document.querySelector("#salary"),
  hours: document.querySelector("#hours"),
  coefficient: document.querySelector("#coefficient"),
};
const numbers = new Intl.NumberFormat("uk-UA", {
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
});

function setValue(id, value) {
  document.getElementById(id).textContent = numbers.format(value);
}

function update() {
  const salary = parseNumber(fields.salary.value);
  const hours = parseNumber(fields.hours.value);
  const coefficient = parseNumber(fields.coefficient.value);

  const invalidField = !Number.isFinite(salary) || salary < 0
    ? "salary"
    : !Number.isFinite(hours) || hours <= 0
    ? "hours"
    : !Number.isFinite(coefficient) || coefficient <= 0
    ? "coefficient"
    : null;

  for (const [name, field] of Object.entries(fields)) {
    field.setAttribute("aria-invalid", String(name === invalidField));
  }

  if (invalidField) {
    error.textContent = {
      salary: "Введи коректну зарплату (нуль або більше).",
      hours: "Години мають бути більшими за нуль.",
      coefficient: "Коефіцієнт має бути більшим за нуль.",
    }[invalidField];
    error.hidden = false;
    result.hidden = true;
    return;
  }

  try {
    const values = calculateKafik(salary, hours, coefficient);
    for (const [id, value] of Object.entries(values)) setValue(id, value);
    error.hidden = true;
    result.hidden = false;
  } catch (err) {
    error.textContent = err.message;
    error.hidden = false;
    result.hidden = true;
  }
}

form.addEventListener("input", update);
form.addEventListener("submit", (event) => {
  event.preventDefault();
  update();
});
form.addEventListener("reset", () => queueMicrotask(update));
update();

if ("serviceWorker" in navigator) {
  window.addEventListener("load", () => {
    navigator.serviceWorker.register("./sw.js").catch((err) => {
      console.warn("Не вдалося зареєструвати офлайн-режим:", err);
    });
  });
}
