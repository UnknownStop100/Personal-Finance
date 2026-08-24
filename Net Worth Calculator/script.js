import { createHeader } from "/Header/script.js";
import { createFooter } from "/Footer/script.js";
import { titleGenerator } from "../Calculator Title/script.js";
import { createPageLayout } from "../Page Layout/script.js";
import { numberInput } from "../Modules/Input/input.js";
import {
    resultHero,
    resultCard,
    resultRow,
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
    "Net Worth Calculator",
    "Add up what you own and what you owe to see your total net worth."
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
    <div><p class="eyebrow">Financial snapshot</p><h2>Add up your net worth</h2></div>
    <span class="status-dot">Estimate</span>
  </div>
`;
const fields = document.createElement("div");
fields.className = "field-group";
calculatorCard.appendChild(fields);
maincontent.appendChild(calculatorCard);

function heading(text) {
    const h = document.createElement("p");
    h.className = "field-group-heading";
    h.textContent = text;
    fields.appendChild(h);
}

heading("Assets");
const cash = numberInput(0, 100000000, fields, "Cash & bank accounts", 15000, "$", "", calculate);
const investments = numberInput(0, 100000000, fields, "Investment accounts", 25000, "$", "", calculate);
const retirement = numberInput(0, 100000000, fields, "Retirement accounts", 60000, "$", "", calculate);
const realEstate = numberInput(0, 100000000, fields, "Real estate value", 400000, "$", "", calculate);
const vehicles = numberInput(0, 10000000, fields, "Vehicles", 18000, "$", "", calculate);
const otherAssets = numberInput(0, 100000000, fields, "Other assets", 0, "$", "", calculate);

heading("Liabilities");
const mortgageBalance = numberInput(0, 100000000, fields, "Mortgage balance", 280000, "$", "", calculate);
const autoLoans = numberInput(0, 10000000, fields, "Auto loans", 9000, "$", "", calculate);
const studentLoans = numberInput(0, 10000000, fields, "Student loans", 12000, "$", "", calculate);
const creditCardDebt = numberInput(0, 10000000, fields, "Credit card debt", 2500, "$", "", calculate);
const otherLiabilities = numberInput(0, 100000000, fields, "Other liabilities", 0, "$", "", calculate);

const resultsSection = document.createElement("section");
resultsSection.className = "results-section";
maincontent.appendChild(resultsSection);

function calculate() {
    const assetItems = [
        ["Cash & bank accounts", cash.getNumericValue()],
        ["Investment accounts", investments.getNumericValue()],
        ["Retirement accounts", retirement.getNumericValue()],
        ["Real estate value", realEstate.getNumericValue()],
        ["Vehicles", vehicles.getNumericValue()],
        ["Other assets", otherAssets.getNumericValue()],
    ];
    const liabilityItems = [
        ["Mortgage balance", mortgageBalance.getNumericValue()],
        ["Auto loans", autoLoans.getNumericValue()],
        ["Student loans", studentLoans.getNumericValue()],
        ["Credit card debt", creditCardDebt.getNumericValue()],
        ["Other liabilities", otherLiabilities.getNumericValue()],
    ];

    const totalAssets = assetItems.reduce((s, [, v]) => s + v, 0);
    const totalLiabilities = liabilityItems.reduce((s, [, v]) => s + v, 0);
    const netWorth = totalAssets - totalLiabilities;

    clearElement(resultsSection);

    resultHero(
        resultsSection,
        "Net worth",
        fmtCurrency(netWorth),
        `${fmtCurrency(totalAssets)} in assets minus ${fmtCurrency(totalLiabilities)} in liabilities`
    );

    const assetCard = resultCard(resultsSection, "Assets");
    assetItems.forEach(([label, value]) => resultRow(assetCard, label, fmtCurrency(value)));
    resultRow(assetCard, "Total assets", fmtCurrency(totalAssets), true);

    const liabilityCard = resultCard(resultsSection, "Liabilities");
    liabilityItems.forEach(([label, value]) => resultRow(liabilityCard, label, fmtCurrency(value)));
    resultRow(liabilityCard, "Total liabilities", fmtCurrency(totalLiabilities), true);

    barChart(
        resultsSection,
        [
            { label: "Assets", value: totalAssets, color: "var(--accent)" },
            { label: "Liabilities", value: totalLiabilities, color: "var(--muted)" },
        ],
        {}
    );

    resultNote(
        resultsSection,
        netWorth >= 0
            ? "Your assets currently outweigh your liabilities."
            : "Your liabilities currently outweigh your assets — that's common with a mortgage or student loans and tends to improve over time.",
        netWorth >= 0 ? "good" : "neutral"
    );
}

calculate();

const description = document.createElement("section");
description.className = "description";
description.innerHTML = `
  <p class="eyebrow">About this calculator</p>
  <h2>Calculate your total net worth</h2>
  <p>This net worth calculator adds up your assets, like cash, investments, retirement accounts, real estate, and vehicles, and subtracts your liabilities, like mortgages, loans, and credit card debt, to give you a single net worth figure.</p>
`;
mainarticle.appendChild(description);

const article = document.createElement("section");
article.className = "article-card";
article.innerHTML = `
  <p class="eyebrow">Net worth guide</p>
  <h2>How net worth is calculated</h2>
  <p>Net worth is calculated as total assets minus total liabilities. Assets are everything you own that has monetary value, while liabilities are everything you owe.</p>
  <h3>What counts as an asset</h3>
  <p>Common assets include cash and bank balances, brokerage and investment accounts, retirement accounts like a 401(k) or IRA, the market value of real estate, and vehicles.</p>
  <h3>What counts as a liability</h3>
  <p>Common liabilities include mortgage balances, auto loans, student loans, credit card balances, and any other outstanding debt.</p>
  <h3>Why tracking net worth over time matters</h3>
  <p>A single net worth snapshot is useful, but tracking it monthly or yearly shows whether your overall financial position is improving, which can matter more than any one account balance.</p>
`;
mainarticle.appendChild(article);
