import { createHeader } from "/Header/script.js";
import { createFooter } from "/Footer/script.js";
import { titleGenerator } from "../Calculator Title/script.js";
import { createPageLayout } from "../Page Layout/script.js";
import { numberInput, valueInputs } from "../Modules/Input/input.js";
import {
    resultHero,
    resultGrid,
    resultStat,
    resultNote,
    barChart,
    clearElement,
    fmtCurrency,
} from "../Modules/Output/output.js";

const body = document.querySelector("body");
const header = createHeader();
const footer = createFooter();
const title = titleGenerator(
    "Finance calculator",
    "Emergency Fund Calculator",
    "Find your emergency fund target and how long it will take to reach it."
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
    <div><p class="eyebrow">Financial safety net</p><h2>Set your target</h2></div>
    <span class="status-dot">Estimate</span>
  </div>
`;
const fields = document.createElement("div");
fields.className = "field-group";
calculatorCard.appendChild(fields);
maincontent.appendChild(calculatorCard);

const monthlyExpenses = numberInput(0, 1000000, fields, "Monthly essential expenses", 3200, "$", "", calculate);
const monthsCoverage = valueInputs(
    "Months of coverage desired",
    ["3 months", "6 months", "9 months", "12 months"],
    [3, 6, 9, 12],
    fields,
    calculate
);
const currentSavings = numberInput(0, 10000000, fields, "Current emergency savings", 1000, "$", "", calculate);
const monthlySavings = numberInput(0, 100000, fields, "Monthly savings toward fund", 300, "$", "", calculate);

const resultsSection = document.createElement("section");
resultsSection.className = "results-section";
maincontent.appendChild(resultsSection);

function calculate() {
    const expenses = monthlyExpenses.getNumericValue();
    const months = Number(monthsCoverage.value);
    const target = expenses * months;
    const current = currentSavings.getNumericValue();
    const monthly = monthlySavings.getNumericValue();
    const gap = Math.max(target - current, 0);
    const monthsToGoal = monthly > 0 ? Math.ceil(gap / monthly) : Infinity;

    clearElement(resultsSection);

    resultHero(
        resultsSection,
        "Emergency fund target",
        fmtCurrency(target),
        `${months} months of essential expenses`
    );

    const grid = resultGrid(resultsSection);
    resultStat(grid, "Current progress", `${target > 0 ? Math.min((current / target) * 100, 100).toFixed(0) : 0}%`);
    resultStat(grid, "Amount remaining", fmtCurrency(gap));
    resultStat(
        grid,
        "Time to reach goal",
        isFinite(monthsToGoal) ? `${Math.floor(monthsToGoal / 12)} yr ${monthsToGoal % 12} mo` : "—"
    );

    barChart(
        resultsSection,
        [
            { label: "Current savings", value: current, color: "var(--muted)" },
            { label: "Target", value: target, color: "var(--accent)" },
        ],
        {}
    );

    if (gap === 0) {
        resultNote(resultsSection, "You've already reached your emergency fund target. Nice work.", "good");
    } else if (!isFinite(monthsToGoal)) {
        resultNote(resultsSection, "Add a monthly savings amount to see how long it will take to reach your goal.", "neutral");
    } else {
        resultNote(
            resultsSection,
            `Saving ${fmtCurrency(monthly)}/month, you'll reach your target in about ${monthsToGoal} months.`,
            "neutral"
        );
    }
}

calculate();

const description = document.createElement("section");
description.className = "description";
description.innerHTML = `
  <p class="eyebrow">About this calculator</p>
  <h2>Calculate your emergency fund target</h2>
  <p>This emergency fund calculator estimates how much you should save based on your essential monthly expenses and desired months of coverage, and shows how long it will take to reach that goal at your current savings rate.</p>
`;
mainarticle.appendChild(description);

const article = document.createElement("section");
article.className = "article-card";
article.innerHTML = `
  <p class="eyebrow">Emergency fund guide</p>
  <h2>How much should you have in an emergency fund</h2>
  <p>An emergency fund is cash set aside to cover essential expenses, like housing, food, utilities, and insurance, if you lose income unexpectedly. Most guidance suggests saving three to six months of essential expenses, with some people targeting up to twelve months for extra security.</p>
  <h3>Why "essential expenses" matters</h3>
  <p>Emergency fund targets are usually based on essential, non-discretionary spending rather than your full monthly budget, since the goal is covering necessities during a temporary income gap, not maintaining your normal lifestyle.</p>
  <h3>Where to keep an emergency fund</h3>
  <p>Emergency savings are typically kept in a liquid, low-risk account, such as a high-yield savings account, so the money is accessible quickly without investment risk when you need it.</p>
  <h3>Building your fund over time</h3>
  <p>Setting a consistent monthly savings amount, even a small one, lets you reach a full emergency fund target gradually while still making progress on other financial goals.</p>
`;
mainarticle.appendChild(article);
