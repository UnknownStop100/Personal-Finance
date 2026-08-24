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
    lineChart,
    clearElement,
    fmtCurrency,
} from "../Modules/Output/output.js";

const body = document.querySelector("body");
const header = createHeader();
const footer = createFooter();
const title = titleGenerator(
    "Finance calculator",
    "Debt Payoff Calculator",
    "Compare the snowball (smallest balance first) and avalanche (highest rate first) methods to see which gets you debt-free faster and cheaper."
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
    <div><p class="eyebrow">Debt freedom</p><h2>Snowball vs. avalanche</h2></div>
    <span class="status-dot">Estimate</span>
  </div>
`;
const fields = document.createElement("div");
fields.className = "field-group";
calculatorCard.appendChild(fields);
maincontent.appendChild(calculatorCard);

const debtInputs = [1, 2, 3, 4].map((i) => {
    const heading = document.createElement("p");
    heading.className = "field-group-heading";
    heading.textContent = `Debt ${i}`;
    fields.appendChild(heading);
    return {
        balance: numberInput(0, 1000000, fields, `Balance`, i === 1 ? 4000 : 0, "$", "", calculate),
        rate: numberInput(0, 40, fields, `Interest rate (APR)`, i === 1 ? 22 : 0, "", "%", calculate),
        minPayment: numberInput(0, 100000, fields, `Minimum payment`, i === 1 ? 100 : 0, "$", "", calculate),
    };
});

const extraPayment = numberInput(0, 100000, fields, "Extra monthly payment toward debt", 200, "$", "", calculate);

const resultsSection = document.createElement("section");
resultsSection.className = "results-section";
maincontent.appendChild(resultsSection);

function simulate(debts, extra, strategy) {
    let working = debts.map((d) => ({ ...d }));
    let month = 0;
    let totalInterest = 0;
    const balancePoints = [{ x: 0, y: working.reduce((s, d) => s + d.balance, 0) }];

    while (working.some((d) => d.balance > 0.005) && month < 1200) {
        month++;
        let extraAvailable = extra;

        working.forEach((d) => {
            if (d.balance <= 0) return;
            const interest = (d.balance * (d.rate / 100)) / 12;
            totalInterest += interest;
            d.balance += interest;
            const pay = Math.min(d.minPayment, d.balance);
            d.balance -= pay;
        });

        const order = [...working]
            .filter((d) => d.balance > 0.005)
            .sort((a, b) =>
                strategy === "snowball" ? a.balance - b.balance : b.rate - a.rate
            );

        for (const d of order) {
            if (extraAvailable <= 0) break;
            const pay = Math.min(extraAvailable, d.balance);
            d.balance -= pay;
            extraAvailable -= pay;
        }

        if (month % 3 === 0 || working.every((d) => d.balance <= 0.005)) {
            balancePoints.push({
                x: month / 12,
                y: Math.max(working.reduce((s, d) => s + d.balance, 0), 0),
            });
        }
    }

    return { months: month, totalInterest, balancePoints };
}

function calculate() {
    const debts = debtInputs
        .map((d) => ({
            balance: d.balance.getNumericValue(),
            rate: d.rate.getNumericValue(),
            minPayment: d.minPayment.getNumericValue(),
        }))
        .filter((d) => d.balance > 0);

    const extra = extraPayment.getNumericValue();

    clearElement(resultsSection);

    if (debts.length === 0) {
        resultNote(resultsSection, "Enter at least one debt balance to see a payoff comparison.", "neutral");
        return;
    }

    const snowball = simulate(debts, extra, "snowball");
    const avalanche = simulate(debts, extra, "avalanche");
    const totalStartingBalance = debts.reduce((s, d) => s + d.balance, 0);

    const faster = snowball.months <= avalanche.months ? "snowball" : "avalanche";
    const cheaper = snowball.totalInterest <= avalanche.totalInterest ? "snowball" : "avalanche";

    resultHero(
        resultsSection,
        "Total debt",
        fmtCurrency(totalStartingBalance),
        `Across ${debts.length} debt${debts.length > 1 ? "s" : ""}`
    );

    const grid = resultGrid(resultsSection);
    resultStat(grid, "Debt-free in (snowball)", `${Math.floor(snowball.months / 12)} yr ${snowball.months % 12} mo`);
    resultStat(grid, "Debt-free in (avalanche)", `${Math.floor(avalanche.months / 12)} yr ${avalanche.months % 12} mo`);

    const card = resultCard(resultsSection, "Snowball vs. avalanche");
    resultRow(card, "Snowball — total interest paid", fmtCurrency(snowball.totalInterest));
    resultRow(card, "Avalanche — total interest paid", fmtCurrency(avalanche.totalInterest));
    resultRow(
        card,
        "Avalanche saves you",
        fmtCurrency(Math.abs(snowball.totalInterest - avalanche.totalInterest)),
        true
    );

    lineChart(
        resultsSection,
        [
            { name: "Snowball balance", points: snowball.balancePoints, color: "var(--accent)" },
            { name: "Avalanche balance", points: avalanche.balancePoints, color: "var(--muted)" },
        ],
        { xFormatter: (v) => `Yr ${v.toFixed(1)}` }
    );

    resultNote(
        resultsSection,
        `Avalanche (highest interest rate first) is mathematically ${cheaper === "avalanche" ? "cheaper" : "not cheaper here"}. Snowball (smallest balance first) can be ${faster === "snowball" ? "faster to your first payoff and easier to stick with" : "motivating even when it isn't fastest"} psychologically.`,
        "neutral"
    );
}

calculate();

const description = document.createElement("section");
description.className = "description";
description.innerHTML = `
  <p class="eyebrow">About this calculator</p>
  <h2>Compare debt snowball vs. debt avalanche</h2>
  <p>This debt payoff calculator simulates paying down up to four debts using the snowball method (smallest balance first) and the avalanche method (highest interest rate first), so you can see which gets you debt-free faster and which saves more in interest.</p>
`;
mainarticle.appendChild(description);

const article = document.createElement("section");
article.className = "article-card";
article.innerHTML = `
  <p class="eyebrow">Debt payoff guide</p>
  <h2>Debt snowball vs. debt avalanche method</h2>
  <p>Both strategies pay the minimum on every debt, then direct any extra payment toward one target debt at a time. They differ only in which debt gets that extra payment first.</p>
  <h3>The debt snowball method</h3>
  <p>The snowball method targets the smallest balance first, regardless of interest rate. Paying off a full balance quickly can build momentum and motivation, which helps some people stick with a payoff plan.</p>
  <h3>The debt avalanche method</h3>
  <p>The avalanche method targets the highest interest rate first. Because it eliminates the most expensive debt fastest, it typically results in less total interest paid over the full payoff period.</p>
  <h3>Which method should you choose</h3>
  <p>Avalanche usually saves more money mathematically, while snowball can be easier to stay motivated with. Many people choose based on which approach they're more likely to stick with consistently.</p>
`;
mainarticle.appendChild(article);
