import { createHeader } from "../Header/script.js";
import { createFooter } from "../Footer/script.js";
import { titleGenerator } from "../Calculator Title/script.js";
import { createPageLayout } from "../Page Layout/script.js";

const body = document.querySelector("body");
const header = createHeader();
const footer = createFooter();
const title = titleGenerator(
    "Finance calculator",
    "Debt Calculators",
    "Pay down what you owe faster, and see exactly where each payment goes."
);
const main = createPageLayout();
body.prepend(title);
body.prepend(header);
body.append(main);
body.appendChild(footer);

const debtCalculators = [
    {
        name: "Debt Payoff",
        url: "/calculators/debt payoff calculator/index.html",
        description: "Compare the snowball and avalanche methods to get debt-free faster and cheaper.",
    },
    {
        name: "Loan Amortization",
        url: "/calculators/loan amortization schedule/index.html",
        description: "See exactly how each payment splits between principal and interest, and what extra payments save.",
    },
    {
        name: "Car Affordability",
        url: "/calculators/car affordability calculator/index.html",
        description: "Figure out how much car you can afford before taking on a new loan.",
    },
    {
        name: "Net Worth",
        url: "/calculators/net worth calculator/index.html",
        description: "Add up what you own and what you owe to see where your debt fits in the bigger picture.",
    },
];

document.getElementById("maincontent").innerHTML = `<div id="calc-index"></div>`;

const grid = document.getElementById("calc-index");
grid.className = "calc-index-grid";

debtCalculators.forEach((calc) => {
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
  <p class="eyebrow">About debt calculators</p>
  <h2>Get out from under it</h2>
  <p>Paying off debt is a math problem with a motivation problem attached. These calculators show how different strategies change your payoff date and total interest, so you can pick the one you'll stick with.</p>
`;