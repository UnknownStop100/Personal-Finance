import { createHeader } from "../Header/script.js";
import { createFooter } from "../Footer/script.js";
import { titleGenerator } from "../Calculator Title/script.js";
import { createPageLayout } from "../Page Layout/script.js";

const body = document.querySelector("body");
const header = createHeader();
const footer = createFooter();
const title = titleGenerator(
    "Finance calculator",
    "Retirement Calculators",
    "Estimate how much you'll need, how much you'll have, and how far inflation will stretch it."
);
const main = createPageLayout();
body.prepend(title);
body.prepend(header);
body.append(main);
body.appendChild(footer);

const retirementCalculators = [
    {
        name: "Retirement Nest Egg",
        url: "/calculators/retirement nest egg calculator/index.html",
        description: "Project your retirement savings and see if they'll cover your desired retirement income.",
    },
    {
        name: "Investment Calculator",
        url: "/calculators/investment calculator/index.html",
        description: "Plot future investment growth using compound interest and regular contributions.",
    },
    {
        name: "Compound Interest",
        url: "/calculators/compound interest calculator/index.html",
        description: "See how a lump sum plus regular contributions grows over time with compound interest.",
    },
    {
        name: "Inflation Impact",
        url: "/calculators/inflation impact calculator/index.html",
        description: "See how inflation erodes purchasing power and what today's money will really be worth.",
    },
];

document.getElementById("maincontent").innerHTML = `<div id="calc-index"></div>`;

const grid = document.getElementById("calc-index");
grid.className = "calc-index-grid";

retirementCalculators.forEach((calc) => {
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
mainarticle.innerHTML = `
  <p class="eyebrow">About retirement calculators</p>
  <h2>Plan for the years after work</h2>
  <p>Retirement planning comes down to three questions: how much you'll save, how it will grow, and how much it will actually buy when you need it. These calculators cover each one.</p>
`;