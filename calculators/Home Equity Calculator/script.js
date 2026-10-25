import { createHeader } from "../../Header/script.js";
import { createFooter } from "../../Footer/script.js";
import { titleGenerator } from "../../Calculator Title/script.js";
import { createPageLayout } from "../../Page Layout/script.js";
import { Input } from "../../Modules/Input/input.js";
import { output } from "../../Modules/Output/Output/script.js";
import { VerticalBar } from "../../Modules/Output/Bar/bar.js";
import { FeatureList } from "../../featurelist/script.js";
import { saveData, loadData } from "../../dataStorage/script.js";

const body = document.querySelector("body");

body.prepend(titleGenerator(
  "Finance calculator",
  "Home Equity Calculator",
  "Estimate your home equity, loan-to-value ratio, and possible borrowing room."
));
body.prepend(createHeader());

const main = createPageLayout();
body.append(main);
body.append(createFooter());

document.getElementById("maincontent").innerHTML = `
  <div id="main-calculator">
    <div id="inputs"><h2>Input Fields:</h2></div>
  </div>
  <div id="output"></div>
`;

const inputs = document.getElementById("inputs");
const outputArea = document.getElementById("output");

const equityOut = output("Estimated Home Equity");
const ltvOut = output("Current Loan-to-Value");
const availableOut = output("Estimated Available Equity");
const totalDebtOut = output("Mortgage and Other Liens");

outputArea.append(equityOut, ltvOut, availableOut, totalDebtOut);

function addBreak() {
  inputs.appendChild(document.createElement("br"));
}

const homeValue = new Input(
  0, 100000000, inputs, "Estimated home value", 450000, "$", "", update
);
addBreak();

const mortgageBalance = new Input(
  0, 100000000, inputs, "Mortgage balance", 280000, "$", "", update
);
addBreak();

const otherLiens = new Input(
  0, 100000000, inputs, "Other liens or home-secured debt", 0, "$", "", update
);
addBreak();

const maxLtv = new Input(
  1, 100, inputs, "Assumed maximum combined LTV", 80, "", "%", update
);
addBreak();

const myBar = new VerticalBar({
  divId: "canvas-div",
  points: [],
  graphtitles: [["Home Value", "Mortgage and Other Liens"]],
  xLabel: "",
  parent: document.getElementById("main-calculator"),
  stepsize: 1,
  xlabeloffset: 0
});

function money(value) {
  return "$" + value.toLocaleString("en-US", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  });
}

function update() {
  draw();
  saveData("HomeEquityCalculator");
}

function draw() {
  const value = homeValue.getValue();
  const totalDebt = mortgageBalance.getValue() + otherLiens.getValue();
  const equity = value - totalDebt;
  const ltv = value > 0 ? (totalDebt / value) * 100 : 0;
  const maximumDebtAtLtv = value * (maxLtv.getValue() / 100);
  const availableEquity = Math.max(maximumDebtAtLtv - totalDebt, 0);

  document.getElementById("estimatedhomeequity").textContent = money(equity);
  document.getElementById("currentloan-to-value").textContent =
    ltv.toFixed(1) + "%";
  document.getElementById("estimatedavailableequity").textContent =
    money(availableEquity);
  document.getElementById("mortgageandotherliens").textContent =
    money(totalDebt);

  myBar.setPoints([[value, totalDebt]]);
}

draw();

new FeatureList({
  parent: document.getElementById("page-layout"),
  mode: "keyword",
  keywords: ["home equity", "mortgage", "home", "loan"],
  limit: 8,
  visible: 4,
  excludeUrl: "/home-equity"
});

document.getElementById("mainarticle").innerHTML = `
  <p class="eyebrow">About this calculator</p>
  <h2>Estimate your home equity</h2>
  <p>Enter your estimated home value and outstanding mortgage or home-secured debt to estimate your equity and current loan-to-value ratio.</p>
  <p class="eyebrow">Home equity guide</p>
  <h2>How home equity is calculated</h2>
  <p>Estimated home equity is the home's estimated market value minus the balances of mortgages and other liens secured by the property.</p>
  <h3>What loan-to-value means</h3>
  <p>Loan-to-value compares the debt secured by a property with its estimated value. Lenders may use combined loan-to-value and other criteria when evaluating applications.</p>
  <h3>Borrowing estimates are not approvals</h3>
  <p>The available-equity figure uses the maximum LTV you enter. Actual eligibility, limits, rates, and fees depend on the lender, property valuation, credit, income, and applicable rules.</p>
`;

loadData("HomeEquityCalculator");