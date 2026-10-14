import { createHeader } from "../Header/script.js";
import { createFooter } from "../Footer/script.js";
import { titleGenerator } from "../Calculator Title/script.js";
import { createPageLayout } from "../Page Layout/script.js";

const body = document.querySelector("body");
const header = createHeader();
const footer = createFooter();
const title = titleGenerator(
    "Finance calculator",
    "Investing Calculators",
    "Project how your money grows: compound interest, investment returns, retirement savings, and the effect of inflation."
);
const main = createPageLayout();
body.prepend(title);
body.prepend(header);
body.append(main);
body.appendChild(footer);

const investingCalculators = [
    {
        tag: "GROWTH",
        name: "Investment Calculator",
        url: "/calculators/investment calculator/index.html",
        description: "Plot future investment growth using compound interest and regular contributions.",
    },
    {
        tag: "GROWTH",
        name: "Compound Interest",
        url: "/calculators/compound interest calculator/index.html",
        description: "See how a lump sum plus regular contributions grows over time with compound interest.",
    },
    {
        tag: "RETIREMENT",
        name: "Retirement Nest Egg",
        url: "/calculators/retirement nest egg calculator/index.html",
        description: "Project your retirement savings and see if they'll cover your desired retirement income.",
    },
    {
        tag: "PLANNING",
        name: "Inflation Impact",
        url: "/calculators/inflation impact calculator/index.html",
        description: "See how inflation erodes purchasing power over time and what today's money will really be worth.",
    },
];

const ledger = document.createElement("div");
ledger.className = "loan-ledger";
document.getElementById("maincontent").appendChild(ledger);

investingCalculators.forEach(({ tag, name, url, description }) => {
    const row = document.createElement("a");
    row.className = "ledger-row";
    row.href = encodeURI(url);
    row.innerHTML = `
        <span class="ledger-tag">${tag}</span>
        <span class="ledger-name">${name}</span>
        <span class="ledger-desc">${description}</span>
    `;
    ledger.appendChild(row);
});

document.getElementById("mainarticle").innerHTML = `
  <p class="eyebrow">About investing calculators</p>
  <h2>Plan how your money grows</h2>
  <p>Whether you're investing a lump sum, contributing monthly, or saving for retirement, these calculators show what your money could be worth over time and how much of that growth inflation will take back.</p>
`;