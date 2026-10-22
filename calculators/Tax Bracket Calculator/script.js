import { createHeader } from "../../Header/script.js";
import { createFooter } from "../../Footer/script.js";
import { titleGenerator } from "../../Calculator Title/script.js";
import { createPageLayout } from "../../Page Layout/script.js";
import { Input, valueInputs } from "../../Modules/Input/input.js";
import { output } from "../../Modules/Output/Output/script.js";
import { VerticalBar } from "../../Modules/Output/Bar/bar.js";
import { FeatureList } from "../../featurelist/script.js";
import { saveData, loadData } from "../../dataStorage/script.js";

const body = document.querySelector("body");

body.prepend(titleGenerator(
  "Finance calculator",
  "Tax Bracket Calculator",
  "Estimate your U.S. federal income tax and effective tax rate."
));
body.prepend(createHeader());

const main = createPageLayout();
body.append(main);
body.append(createFooter());

document.getElementById("maincontent").innerHTML = `
  <div id="main-calculator">
    <div id="inputs"><h3>Input Fields:</h3></div>
  </div>
  <div id="output"></div>
`;

const inputs = document.getElementById("inputs");
const outputArea = document.getElementById("output");

const estimatedTaxOut = output("Estimated Federal Income Tax");
const afterTaxIncomeOut = output("Income After Estimated Tax");
const effectiveRateOut = output("Effective Tax Rate");
const marginalRateOut = output("Marginal Tax Rate");

outputArea.append(
  estimatedTaxOut,
  afterTaxIncomeOut,
  effectiveRateOut,
  marginalRateOut
);

const income = new Input(
  0, 100000000, inputs, "Annual taxable income", 75000, "$", "", update
);
inputs.appendChild(document.createElement("br"));

const filingStatus = valueInputs(
  "Filing status",
  ["Single", "Married filing jointly", "Married filing separately", "Head of household"],
  ["single", "joint", "separate", "head"],
  inputs,
  update
);
inputs.appendChild(document.createElement("br"));

const TAX_BRACKETS_2025 = {
  single: [
    [11925, 0.10], [48350, 0.12], [103350, 0.22],
    [197300, 0.24], [250525, 0.32], [626350, 0.35],
    [Infinity, 0.37]
  ],
  joint: [
    [23850, 0.10], [96700, 0.12], [206700, 0.22],
    [394600, 0.24], [501050, 0.32], [751600, 0.35],
    [Infinity, 0.37]
  ],
  separate: [
    [11925, 0.10], [48350, 0.12], [103350, 0.22],
    [197300, 0.24], [250525, 0.32], [375800, 0.35],
    [Infinity, 0.37]
  ],
  head: [
    [17000, 0.10], [64850, 0.12], [103350, 0.22],
    [197300, 0.24], [250500, 0.32], [626350, 0.35],
    [Infinity, 0.37]
  ]
};

const myBar = new VerticalBar({
  divId: "canvas-div",
  points: [],
  graphtitles: [["Estimated Federal Tax", "Income After Tax"]],
  xLabel: "",
  parent: document.getElementById("main-calculator"),
  stepsize: 1,
  xlabeloffset: 0
});

function formatMoney(value) {
  return "$" + value.toLocaleString("en-US", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  });
}

function calculateTax(taxableIncome, status) {
  const brackets = TAX_BRACKETS_2025[status];
  let tax = 0;
  let lowerLimit = 0;
  let marginalRate = 0;

  for (const [upperLimit, rate] of brackets) {
    if (taxableIncome <= lowerLimit) break;

    const taxableInBracket = Math.min(taxableIncome, upperLimit) - lowerLimit;
    tax += taxableInBracket * rate;

    if (taxableIncome > lowerLimit) {
      marginalRate = rate;
    }

    if (taxableIncome <= upperLimit) break;
    lowerLimit = upperLimit;
  }

  return { tax, marginalRate };
}

function update() {
  draw();
  saveData("TaxBracketCalculator");
}

function draw() {
  const taxableIncome = income.getValue();
  const status = filingStatus.value;
  const { tax, marginalRate } = calculateTax(taxableIncome, status);
  const afterTaxIncome = taxableIncome - tax;
  const effectiveRate = taxableIncome > 0 ? tax / taxableIncome : 0;

  document.getElementById("estimatedfederalincometax").textContent =
    formatMoney(tax);
  document.getElementById("incomeafterestimatedtax").textContent =
    formatMoney(afterTaxIncome);
  document.getElementById("effectivetaxrate").textContent =
    (effectiveRate * 100).toFixed(2) + "%";
  document.getElementById("marginaltaxrate").textContent =
    (marginalRate * 100).toFixed(0) + "%";

  myBar.setPoints([[tax, afterTaxIncome]]);
}

draw();

new FeatureList({
  parent: document.getElementById("page-layout"),
  mode: "keyword",
  keywords: ["tax", "income", "finance"],
  limit: 8,
  visible: 4,
  excludeUrl: "/tax-bracket"
});

document.getElementById("mainarticle").innerHTML = `
  <p class="eyebrow">About this calculator</p>
  <h2>Estimate your federal income tax bracket</h2>
  <p>This calculator estimates U.S. federal income tax on taxable income using the 2025 ordinary income tax brackets and your filing status.</p>
  <p class="eyebrow">Tax bracket guide</p>
  <h2>How progressive tax brackets work</h2>
  <p>Federal income tax brackets are progressive: different portions of taxable income are taxed at different rates. Reaching a higher bracket does not mean all your income is taxed at that higher rate.</p>
  <h3>Marginal and effective tax rates</h3>
  <p>Your marginal rate is the rate applied to your next taxable dollar. Your effective rate is estimated tax divided by taxable income.</p>
  <h3>Important limitations</h3>
  <p>This estimate does not account for deductions, tax credits, payroll taxes, state or local taxes, or special tax rules. Tax brackets can change each year. Verify the applicable tax-year rules before relying on an estimate.</p>
`;

loadData("TaxBracketCalculator");