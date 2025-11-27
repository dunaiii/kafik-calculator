// У script.js

document.addEventListener('DOMContentLoaded', () => {
    const calcButton = document.querySelector('button');
    calcButton.addEventListener('click', calc);
});

function calc() {
    const zpElement = document.getElementById("zp");
    const hoursElement = document.getElementById("hours");
    const kofElement = document.getElementById("kof");
    const resultElement = document.getElementById("result");

    let zp = parseFloat(zpElement.value);
    let hours = parseFloat(hoursElement.value);
    let kof = parseFloat(kofElement.value);

    // ВАЛІДАЦІЯ ТА ОБРОБКА ПОМИЛОК
    if (isNaN(zp) || isNaN(hours) || isNaN(kof) || hours <= 0) {
        resultElement.innerHTML = `<p style="color: red;"><b>Помилка:</b> Будь ласка, введіть коректні числові значення. Години повинні бути > 0.</p>`;
        return;
    }

    // ЛОГІКА
    let zp_chyst = zp / kof;
    let k_baz = zp_chyst / hours;
    let k_zag = zp / hours;
    let delta_k = k_zag - k_baz;

    resultElement.innerHTML = `
      <p><b>Зарплата без коефіцієнта:</b> ${zp_chyst.toFixed(2)}</p>
      <p><b>Базовий кафік:</b> ${k_baz.toFixed(2)}</p>
      <p><b>Кафік з допом:</b> ${k_zag.toFixed(2)}</p>
      <p><b>Ефект допа:</b> ${delta_k.toFixed(2)}</p>
    `;

}
if (isNaN(zp) || isNaN(hours) || isNaN(kof) || hours <= 0 || kof <= 0) {
    // ... вивід помилки
    return;
}
