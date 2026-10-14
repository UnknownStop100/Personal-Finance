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
        url: "/calculators/Investment Calculator/index.html",
        description: "Plot future investment growth using compound interest and regular contributions.",
    },
    {
        tag: "GROWTH",
        name: "Compound Interest",
        url: "/calculators/Investment Calculator/index.html",
        description: "See how a lump sum plus regular contributions grows over time with compound interest.",
    },
    {
        tag: "RETIREMENT",
        name: "Retirement Nest Egg",
        url: "/calculators/Retirement Nest Egg Calculator/index.html",
        description: "Project your retirement savings and see if they'll cover your desired retirement income.",
    },
    {
        tag: "PLANNING",
        name: "Inflation Impact",
        url: "/calculators/Inflation Impact Calculator/index.html",
        description: "See how inflation erodes purchasing power over time and what today's money will really be worth.",
    },
];
document.getElementById("maincontent").innerHTML = `<div id="calc-index"></div>`;

const grid = document.getElementById("calc-index");
grid.className = "calc-index-grid";

investingCalculators.forEach((calc) => {
    const card = document.createElement("a");
    card.className = "calc-index-card";
    card.href = calc.url;

    const icon = document.createElement("div");
    icon.className = "calc-index-icon";
    icon.textContent = calc.name.charAt(0).toUpperCase();

    const name = document.createElement("h3");
    name.className = "calc-index-name";
    name.textContent = calc.name;

    const desc = document.createElement("p");
    desc.className = "calc-index-desc";
    desc.textContent = calc.description;

    card.appendChild(icon);
    card.appendChild(name);
    card.appendChild(desc);
    grid.appendChild(card);
});

const mainarticle = document.getElementById("mainarticle");
document.getElementById("mainarticle").innerHTML = `
  <p class="eyebrow">About investing calculators</p>
  <h2>Plan how your money grows</h2>
  <p>Whether you're investing a lump sum, contributing monthly, or saving for retirement, these calculators show what your money could be worth over time and how much of that growth inflation will take back.</p>
`;