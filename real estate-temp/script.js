import { createHeader } from "../Header/script.js";
import { createFooter } from "../Footer/script.js";
import { titleGenerator } from "../Calculator Title/script.js";
import { createPageLayout } from "../Page Layout/script.js";

const body = document.querySelector("body");
const header = createHeader();
const footer = createFooter();
const title = titleGenerator(
    "Finance calculator",
    "Real Estate Calculators",
    "Compare renting and buying, estimate your monthly payment, and see how your mortgage pays down."
);
const main = createPageLayout();
body.prepend(title);
body.prepend(header);
body.append(main);
body.appendChild(footer);

const realEstateCalculators = [
    {
        name: "Mortgage Payment",
        url: "/calculators/mortgage payment calculator/index.html",
        description: "Estimate your monthly mortgage payment, including taxes, insurance, and HOA dues.",
    },
    {
        name: "Rent vs. Buy",
        url: "/calculators/rent vs buy calculator/index.html",
        description: "Compare the total cost of renting versus buying a home over time.",
    },
    {
        name: "Loan Amortization",
        url: "/calculators/loan amortization schedule/index.html",
        description: "See how each mortgage payment splits between principal and interest over the life of the loan.",
    },
];

document.getElementById("maincontent").innerHTML = `<div id="calc-index"></div>`;

const grid = document.getElementById("calc-index");
grid.className = "calc-index-grid";

realEstateCalculators.forEach((calc) => {
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
  <p class="eyebrow">About real estate calculators</p>
  <h2>Run the numbers before you sign</h2>
  <p>A home is usually the biggest purchase you'll make. These calculators help you estimate the true monthly cost, decide whether buying beats renting for your timeline, and see how the loan pays down.</p>
`;