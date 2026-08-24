import { createHeader } from "/Header/script.js";
import { createFooter } from "/Footer/script.js";
import { titleGenerator } from "../Calculator Title/script.js";
import { createPageLayout } from "../Page Layout/script.js";
import { numberInput } from "../Modules/Input/input.js";
import {
    resultHero,
    resultGrid,
    resultStat,
    resultNote,
    lineChart,
    clearElement,
    fmtCurrency,
} from "../Modules/Output/output.js";

const body = document.querySelector("body");
const header = createHeader();
const footer = createFooter();
const title = titleGenerator(
    "Finance calculator",
    "Inflation Impact Calculator",
    "See how inflation erodes purchasing power over time, and what today's money will really be worth."
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
    <div><p class="eyebrow">Purchasing power</p><h2>See inflation's impact</h2></div>
    <span class="status-dot">Estimate</span>
  </div>
`;
const fields = document.createElement("div");
fields.className = "field-group";
calculatorCard.appendChild(fields);
maincontent.appendChild(calculatorCard);

const currentAmount = numberInput(0, 1000000000, fields, "Amount today", 10000, "$", "", calculate);
const inflationRate = numberInput(0, 30, fields, "Annual inflation rate", 3, "", "%", calculate);
const years = numberInput(1, 60, fields, "Years from now", 20, "", "yrs", calculate);

const resultsSection = document.createElement("section");
resultsSection.className = "results-section";
maincontent.appendChild(resultsSection);

function calculate() {
    const amount = currentAmount.getNumericValue();
    const rate = inflationRate.getNumericValue() / 100;
    const t = years.getNumericValue();

    const futureEquivalent = amount / Math.pow(1 + rate, t);
    const purchasingPowerLost = amount - futureEquivalent;
    const percentLost = amount > 0 ? (purchasingPowerLost / amount) * 100 : 0;

    const points = [];
    const nominalPoints = [];
    for (let year = 0; year <= t; year++) {
        points.push({ x: year, y: amount / Math.pow(1 + rate, year) });
        nominalPoints.push({ x: year, y: amount });
    }

    clearElement(resultsSection);

    resultHero(
        resultsSection,
        "Purchasing power in the future",
        fmtCurrency(futureEquivalent),
        `What today's ${fmtCurrency(amount)} will feel like in ${t} years at ${inflationRate.getNumericValue()}% inflation`
    );

    const grid = resultGrid(resultsSection);
    resultStat(grid, "Purchasing power lost", fmtCurrency(purchasingPowerLost));
    resultStat(grid, "Percent lost", `${percentLost.toFixed(1)}%`);
    resultStat(grid, "To match today's power, you'd need", fmtCurrency(amount * Math.pow(1 + rate, t)));

    lineChart(
        resultsSection,
        [
            { name: "Real purchasing power", points, color: "var(--accent)" },
            { name: "Nominal amount", points: nominalPoints, color: "var(--muted)" },
        ],
        { xFormatter: (v) => `Yr ${Math.round(v)}` }
    );

    resultNote(
        resultsSection,
        "This shows the effect of inflation alone — it doesn't account for any interest or investment growth on the amount.",
        "neutral"
    );
}

calculate();

const description = document.createElement("section");
description.className = "description";
description.innerHTML = `
  <p class="eyebrow">About this calculator</p>
  <h2>Calculate the impact of inflation on your money</h2>
  <p>This inflation calculator shows how much purchasing power a given amount of money loses over time at a chosen annual inflation rate, and what amount you'd need in the future to match today's buying power.</p>
`;
mainarticle.appendChild(description);

const article = document.createElement("section");
article.className = "article-card";
article.innerHTML = `
  <p class="eyebrow">Inflation guide</p>
  <h2>How inflation affects purchasing power</h2>
  <p>Inflation is the rate at which prices for goods and services rise over time, which reduces how much a fixed amount of money can buy in the future compared to today.</p>
  <h3>Real vs. nominal value</h3>
  <p>Nominal value is the face amount of money, while real value adjusts for inflation to reflect actual purchasing power. A dollar amount that stays the same in nominal terms still loses real value every year inflation is positive.</p>
  <h3>Why inflation matters for savings and planning</h3>
  <p>Cash sitting in a low-interest account can lose purchasing power over time if its interest rate is lower than the inflation rate, which is why long-term financial goals like retirement often need to account for inflation-adjusted returns.</p>
  <h3>Historical inflation context</h3>
  <p>Inflation rates vary by year and country; this calculator lets you test different assumed rates to see how sensitive your long-term purchasing power is to higher or lower inflation.</p>
`;
mainarticle.appendChild(article);
