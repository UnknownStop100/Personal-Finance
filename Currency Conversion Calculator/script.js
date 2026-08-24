import {createHeader} from '/Header/script.js';
import { titleGenerator } from '../Calculator Title/script.js';
import {createFooter} from '/Footer/script.js';
const body = document.querySelector('body');
const main = document.querySelector('main');
const header = createHeader();
const title = titleGenerator("Fiancial calculator", "Currency Converter","Convert between currencies using current exchange rates.");
const footer = createFooter();
body.prepend(header);
main.prepend(title);
body.appendChild(footer);
const rates = {
    USD: 1,
    EUR: 0.92,
    GBP: 0.78,
    JPY: 147,
    CAD: 1.36,
    AUD: 1.52
};

const symbols = {
    USD: "$",
    EUR: "€",
    GBP: "£",
    JPY: "¥",
    CAD: "C$",
    AUD: "A$"
};

const fromCurrency = document.getElementById("fromCurrency");
const toCurrency = document.getElementById("toCurrency");
const amount = document.getElementById("amount");

function update() {
    const from = fromCurrency.value;
    const to = toCurrency.value;
    const value = Number(amount.value) || 0;

    const rate = rates[to] / rates[from];
    const converted = value * rate;

    document.getElementById("amountSymbol").textContent =
        symbols[from];

    document.getElementById("resultValue").textContent =
        symbols[to] +
        converted.toLocaleString(undefined, {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2
        });

    document.getElementById("resultEquation").textContent =
        `${value.toLocaleString()} ${from} = ` +
        `${converted.toLocaleString(undefined, {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2
        })} ${to}`;

    document.getElementById("rateText").textContent =
        `1 ${from} = ` +
        `${rate.toLocaleString(undefined, {
            minimumFractionDigits: 4,
            maximumFractionDigits: 8
        })} ${to}`;
}


// Swap currencies
document.getElementById("swap").onclick = () => {
    const oldFrom = fromCurrency.value;

    fromCurrency.value = toCurrency.value;
    toCurrency.value = oldFrom;

    update();
};


// Update whenever an input changes
[fromCurrency, toCurrency, amount].forEach(element => {
    element.oninput = update;
    element.onchange = update;
});


// Initial calculation
update();