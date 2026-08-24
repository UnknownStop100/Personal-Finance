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
    "Rent vs. Buy Calculator",
    "Compare the total cost of renting versus buying a home over time."
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
    <div><p class="eyebrow">Housing decision</p><h2>Rent or buy?</h2></div>
    <span class="status-dot">Estimate</span>
  </div>
`;
const fields = document.createElement("div");
fields.className = "field-group";
calculatorCard.appendChild(fields);
maincontent.appendChild(calculatorCard);

const monthlyRent = numberInput(0, 200000, fields, "Monthly rent", 2200, "$", "", calculate);
const rentIncrease = numberInput(0, 20, fields, "Annual rent increase", 3, "", "%", calculate);
const homePrice = numberInput(0, 20000000, fields, "Home price", 450000, "$", "", calculate);
const downPaymentPct = numberInput(0, 100, fields, "Down payment", 20, "", "%", calculate);
const mortgageRate = numberInput(0, 25, fields, "Mortgage rate", 6.5, "", "%", calculate);
const loanTerm = numberInput(1, 40, fields, "Loan term", 30, "", "yrs", calculate);
const propertyTaxRate = numberInput(0, 10, fields, "Property tax rate", 1.1, "", "%", calculate);
const maintenanceRate = numberInput(0, 10, fields, "Annual maintenance", 1, "", "%", calculate);
const appreciationRate = numberInput(0, 15, fields, "Annual home appreciation", 3, "", "%", calculate);
const closingCostPct = numberInput(0, 15, fields, "Closing costs", 3, "", "%", calculate);
const sellingCostPct = numberInput(0, 15, fields, "Selling costs", 6, "", "%", calculate);
const yearsToCompare = numberInput(1, 40, fields, "Years to compare", 10, "", "yrs", calculate);

const resultsSection = document.createElement("section");
resultsSection.className = "results-section";
maincontent.appendChild(resultsSection);

function calculate() {
    const price = homePrice.getNumericValue();
    const downPct = downPaymentPct.getNumericValue() / 100;
    const down = price * downPct;
    const loanAmount = price - down;
    const monthlyRateM = mortgageRate.getNumericValue() / 100 / 12;
    const n = loanTerm.getNumericValue() * 12;

    let payment;
    if (monthlyRateM === 0) {
        payment = n > 0 ? loanAmount / n : 0;
    } else {
        payment =
            (loanAmount * monthlyRateM * Math.pow(1 + monthlyRateM, n)) /
            (Math.pow(1 + monthlyRateM, n) - 1);
    }
    if (!isFinite(payment)) payment = 0;

    const years = yearsToCompare.getNumericValue();
    const closingCosts = price * (closingCostPct.getNumericValue() / 100);

    let rent = monthlyRent.getNumericValue();
    let balance = loanAmount;
    let homeValue = price;
    let totalRentCost = 0;
    let totalBuyCashOutlay = closingCosts + down;

    const rentPoints = [];
    const buyPoints = [];

    for (let year = 1; year <= years; year++) {
        for (let m = 0; m < 12; m++) {
            totalRentCost += rent;
            const interestPortion = balance * monthlyRateM;
            const principalPortion = Math.min(payment - interestPortion, balance);
            balance -= principalPortion;
            totalBuyCashOutlay += payment;
        }
        totalBuyCashOutlay +=
            homeValue * (propertyTaxRate.getNumericValue() / 100) +
            homeValue * (maintenanceRate.getNumericValue() / 100);
        homeValue *= 1 + appreciationRate.getNumericValue() / 100;
        rent *= 1 + rentIncrease.getNumericValue() / 100;

        const sellingCosts = homeValue * (sellingCostPct.getNumericValue() / 100);
        const netBuyCost = totalBuyCashOutlay + sellingCosts - (homeValue - balance);

        rentPoints.push({ x: year, y: totalRentCost });
        buyPoints.push({ x: year, y: Math.max(netBuyCost, 0) });
    }

    const finalRentCost = rentPoints[rentPoints.length - 1].y;
    const finalBuyCost = buyPoints[buyPoints.length - 1].y;
    const buyingWins = finalBuyCost < finalRentCost;

    clearElement(resultsSection);

    resultHero(
        resultsSection,
        buyingWins ? "Buying is cheaper" : "Renting is cheaper",
        fmtCurrency(Math.abs(finalRentCost - finalBuyCost)),
        `Net difference over ${years} years`
    );

    const grid = resultGrid(resultsSection);
    resultStat(grid, "Net cost of renting", fmtCurrency(finalRentCost));
    resultStat(grid, "Net cost of buying", fmtCurrency(finalBuyCost));
    resultStat(grid, "Cash needed to buy", fmtCurrency(down + closingCosts));

    lineChart(
        resultsSection,
        [
            { name: "Net cost of renting", points: rentPoints, color: "var(--muted)" },
            { name: "Net cost of buying", points: buyPoints, color: "var(--accent)" },
        ],
        { xFormatter: (v) => `Yr ${Math.round(v)}` }
    );

    resultNote(
        resultsSection,
        "Net buying cost accounts for equity gained and home appreciation, minus selling costs, so it can go down over time as the mortgage is paid off.",
        "neutral"
    );
}

calculate();

const description = document.createElement("section");
description.className = "description";
description.innerHTML = `
  <p class="eyebrow">About this calculator</p>
  <h2>Compare the cost of renting vs. buying a home</h2>
  <p>This rent vs. buy calculator compares the total net cost of renting against buying a home over a set number of years, factoring in mortgage payments, taxes, maintenance, appreciation, and selling costs.</p>
`;
mainarticle.appendChild(description);

const article = document.createElement("section");
article.className = "article-card";
article.innerHTML = `
  <p class="eyebrow">Rent vs. buy guide</p>
  <h2>How to compare renting and buying</h2>
  <p>Comparing renting and buying isn't just about monthly payment size. Buying builds home equity and can benefit from appreciation, but comes with upfront closing costs, ongoing maintenance, property taxes, and eventual selling costs if you move.</p>
  <h3>Why the comparison changes over time</h3>
  <p>Buying tends to look more expensive in the first few years, when closing costs and low equity dominate, and more favorable the longer you stay, as rent payments accumulate with no equity while mortgage payments build ownership.</p>
  <h3>Key assumptions that drive the answer</h3>
  <p>Home appreciation rate, mortgage interest rate, and how long you plan to stay in the home are usually the biggest factors in whether renting or buying comes out ahead financially.</p>
  <h3>Renting isn't "wasting money"</h3>
  <p>Renting avoids maintenance costs, property taxes, and the risk of a declining home value, and can be the better financial choice for shorter time horizons or uncertain markets.</p>
`;
mainarticle.appendChild(article);
