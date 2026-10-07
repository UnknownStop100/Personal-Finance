import { createHeader } from "../Header/script.js";
import { createFooter } from "../Footer/script.js";
import { titleGenerator } from "../Calculator Title/script.js";
import { createPageLayout } from "../Page Layout/script.js";

const body = document.querySelector("body");
const header = createHeader();
const footer = createFooter();
const title = titleGenerator(
    "Finance calculator",
    "Loan Calculators",
    "Everything related to borrowing: mortgages, auto loans, amortization schedules, and paying off debt."
);
const main = createPageLayout();
body.prepend(title);
body.prepend(header);
body.append(main);
body.appendChild(footer);

const loanCalculators = [
    {
        name: "Mortgage Payment",
        url: "/calculators/mortgage payment calculator/index.html",
        description: "Estimate your monthly mortgage payment, including taxes, insurance, and HOA dues.",
    },
    {
        name: "Loan Amortization",
        url: "/calculators/loan amortization schedule/index.html",
        description: "See exactly how each payment splits between principal and interest over the life of your loan.",
    },
    {
        name: "Car Affordability",
        url: "/calculators/car affordability calculator/index.html",
        description: "Figure out how much car you can afford based on your take-home pay and loan terms.",
    },
    {
        name: "Debt Payoff",
        url: "/calculators/debt payoff calculator/index.html",
        description: "Compare the snowball and avalanche methods to get debt-free faster and cheaper.",
    },
    {
        name: "Rent vs. Buy",
        url: "/calculators/rent vs buy calculator/index.html",
        description: "Compare the total cost of renting versus buying a home over time.",
    },
];

document.getElementById("maincontent").innerHTML = `<div id="calc-index"></div>`;

const grid = document.getElementById("calc-index");
grid.className = "calc-index-grid";

loanCalculators.forEach((calc) => {
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
  <p class="eyebrow">About loan calculators</p>
  <h2>Everything related to borrowing money</h2>
  <p>Whether you're buying a home, financing a car, or paying down existing debt, these calculators help you understand what you'll actually pay, how long it will take, and what your options are.</p>
`;