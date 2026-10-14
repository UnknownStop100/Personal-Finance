import { createHeader } from "../Header/script.js";
import { createFooter } from "../Footer/script.js";
import { titleGenerator } from "../Calculator Title/script.js";
import { createPageLayout } from "../Page Layout/script.js";

const body = document.querySelector("body");
const header = createHeader();
const footer = createFooter();
const title = titleGenerator(
    "Finance calculator",
    "Savings Calculators",
    "Build a safety net, watch your savings grow, and see where you stand."
);
const main = createPageLayout();
body.prepend(title);
body.prepend(header);
body.append(main);
body.appendChild(footer);

const savingsCalculators = [
    {
        name: "Emergency Fund",
        url: "/calculators/emergency fund calculator/index.html",
        description: "Find your emergency fund target and how long it will take to reach it.",
    },
    {
        name: "Compound Interest",
        url: "/calculators/compound interest calculator/index.html",
        description: "See how a lump sum plus regular contributions grows over time with compound interest.",
    },
    {
        name: "Net Worth",
        url: "/calculators/net worth calculator/index.html",
        description: "Add up what you own and what you owe to see your total net worth.",
    },
    {
        name: "Inflation Impact",
        url: "/calculators/inflation impact calculator/index.html",
        description: "See how inflation erodes the value of cash sitting in savings over time.",
    },
];

document.getElementById("maincontent").innerHTML = `<div id="calc-index"></div>`;

const grid = document.getElementById("calc-index");
grid.className = "calc-index-grid";

savingsCalculators.forEach((calc) => {
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
  <p class="eyebrow">About savings calculators</p>
  <h2>Know what you have and what it's becoming</h2>
  <p>Savings work best with a target and a timeline. These calculators help you set an emergency fund goal, project how regular deposits compound, and track your overall net worth.</p>
`;