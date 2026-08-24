import { createHeader } from "/Header/script.js";
import { createFooter } from "/Footer/script.js";
import { titleGenerator } from "../Calculator Title/script.js";
import { createPageLayout } from "../Page Layout/script.js";
import { numberInput } from "../Modules/Input/input.js";
import {
    resultHero,
    resultGrid,
    resultStat,
    resultCard,
    resultRow,
    resultNote,
    clearElement,
    fmtCurrency,
} from "../Modules/Output/output.js";

const body = document.querySelector("body");
const header = createHeader();
const footer = createFooter();
const title = titleGenerator(
    "Finance calculator",
    "Car Affordability Calculator",
    "Figure out how much car you can afford based on your take-home pay, down payment, and loan terms."
);
const main = createPageLayout();
body.prepend(title);
body.prepend(header);
body.append(main);
body.appendChild(footer);

const maincontent = document.getElementById("maincontent");
const mainarticle = document.getElementById("mainarticle");

const calculatorCard = document.createElement("section");
calculatorCard.className = "calculator-card";
calculatorCard.innerHTML = `
  <div class="card-heading">
    <div><p class="eyebrow">Auto financing</p><h2>How much car can you afford?</h2></div>
    <span class="status-dot">Estimate</span>
  </div>
`;
const fields = document.createElement("div");
fields.className = "field-group";
calculatorCard.appendChild(fields);
maincontent.appendChild(calculatorCard);

const monthlyIncome = numberInput(0, 1000000, fields, "Monthly take-home pay", 5000, "$", "", calculate);
const targetPct = numberInput(1, 50, fields, "Target % of income for car payment", 15, "", "%", calculate);
const downPayment = numberInput(0, 1000000, fields, "Down payment", 3000, "$", "", calculate);
const tradeIn = numberInput(0, 1000000, fields, "Trade-in value", 0, "$", "", calculate);
const loanTermMonths = numberInput(12, 96, fields, "Loan term", 60, "", "mo", calculate);
const interestRate = numberInput(0, 25, fields, "Interest rate (APR)", 7, "", "%", calculate);

const resultsSection = document.createElement("section");
resultsSection.className = "results-section";
maincontent.appendChild(resultsSection);

function calculate() {
    const income = monthlyIncome.getNumericValue();
    const maxPayment = income * (targetPct.getNumericValue() / 100);
    const down = downPayment.getNumericValue();
    const trade = tradeIn.getNumericValue();
    const n = loanTermMonths.getNumericValue();
    const monthlyRate = interestRate.getNumericValue() / 100 / 12;

    let maxLoan;
    if (monthlyRate === 0) {
        maxLoan = maxPayment * n;
    } else {
        maxLoan = (maxPayment * (1 - Math.pow(1 + monthlyRate, -n))) / monthlyRate;
    }
    if (!isFinite(maxLoan)) maxLoan = 0;

    const maxCarPrice = maxLoan + down + trade;

    clearElement(resultsSection);

    resultHero(
        resultsSection,
        "Max affordable car price",
        fmtCurrency(maxCarPrice),
        `Keeping payments at ${fmtCurrency(maxPayment)}/month`
    );

    const grid = resultGrid(resultsSection);
    resultStat(grid, "Max monthly payment", fmtCurrency(maxPayment));
    resultStat(grid, "Max loan amount", fmtCurrency(maxLoan));
    resultStat(grid, "Down payment + trade-in", fmtCurrency(down + trade));

    const card = resultCard(resultsSection, "How this breaks down");
    resultRow(card, "Down payment", fmtCurrency(down));
    resultRow(card, "Trade-in value", fmtCurrency(trade));
    resultRow(card, "Financed amount", fmtCurrency(maxLoan));
    resultRow(card, "Max car price", fmtCurrency(maxCarPrice), true);

    resultNote(
        resultsSection,
        "Many lenders also apply a total 'debt-to-income' cap across all your loans, so your real limit could be lower depending on other debts.",
        "neutral"
    );
}

calculate();

const description = document.createElement("section");
description.className = "description";
description.innerHTML = `
  <p class="eyebrow">About this calculator</p>
  <h2>Figure out how much car you can afford</h2>
  <p>This car affordability calculator estimates the maximum car price you can afford based on a target percentage of your monthly take-home pay, your down payment, trade-in value, and loan terms.</p>
`;
mainarticle.appendChild(description);

const article = document.createElement("section");
article.className = "article-card";
article.innerHTML = `
  <p class="eyebrow">Car affordability guide</p>
  <h2>How much of your income should go to a car payment</h2>
  <p>A common budgeting guideline caps total vehicle costs, including payment, insurance, and fuel, at around 15-20% of monthly take-home pay, with the loan payment itself typically well under that.</p>
  <h3>How the max loan amount is calculated</h3>
  <p>Once you set a target monthly payment, the calculator works backward using the loan term and interest rate to find the largest loan amount that keeps payments at or below that target, then adds your down payment and trade-in value to get a max car price.</p>
  <h3>Down payment and trade-in value</h3>
  <p>A larger down payment or trade-in value increases the total price you can afford without raising your monthly payment, since less of the purchase needs to be financed.</p>
  <h3>Loan term trade-offs</h3>
  <p>A longer loan term lowers the monthly payment and raises the max price you can technically afford, but it also means paying more total interest and can leave you owing more than the car is worth for longer.</p>
`;
mainarticle.appendChild(article);
