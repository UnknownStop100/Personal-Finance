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
  "Debt-to-Income Ratio Calculator",
  "Calculate the share of your gross monthly income that goes toward monthly debt payments."
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

const dtiOut = output("Debt-to-Income Ratio");
const monthlyDebtOut = output("Total Monthly Debt Payments");
const grossIncomeOut = output("Gross Monthly Income");
const remainingIncomeOut = output("Income After Debt Payments");

outputArea.append(dtiOut, monthlyDebtOut, grossIncomeOut, remainingIncomeOut);

function addBreak() {
  inputs.appendChild(document.createElement("br"));
}

const monthlyIncome = new Input(
  0, 10000000, inputs, "Gross monthly income", 7000, "$", "", update
);
addBreak();

const housing = new Input(
  0, 10000000, inputs, "Monthly housing payment", 1800, "$", "", update
);
addBreak();

const otherDebt = new Input(
  0, 10000000, inputs, "Other monthly debt payments", 600, "$", "", update
);
addBreak();

const myBar = new VerticalBar({
  divId: "canvas-div",
  points: [],
  graphtitles: [["Monthly Debt Payments", "Gross Monthly Income"]],
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
  saveData("DebtToIncomeRatioCalculator");
}

function draw() {
  const income = monthlyIncome.getValue();
  const debt = housing.getValue() + otherDebt.getValue();
  const ratio = income > 0 ? (debt / income) * 100 : 0;

  document.getElementById("debt-to-incomeratio").textContent =
    ratio.toFixed(1) + "%";
  document.getElementById("totalmonthlydebtpayments").textContent =
    money(debt);
  document.getElementById("grossmonthlyincome").textContent =
    money(income);
  document.getElementById("incomeafterdebtpayments").textContent =
    money(income - debt);

  myBar.setPoints([[debt, income]]);
}

draw();

new FeatureList({
  parent: document.getElementById("page-layout"),
  mode: "keyword",
  keywords: ["debt", "income", "loan"],
  limit: 8,
  visible: 4,
  excludeUrl: "/debt-to-income"
});

document.getElementById("mainarticle").innerHTML = `
  <p class="eyebrow">About this calculator</p>
  <h2>Calculate your debt-to-income ratio</h2>
  <p>This calculator estimates your debt-to-income ratio by dividing your monthly debt payments by your gross monthly income.</p>
  <p class="eyebrow">DTI guide</p>
  <h2>What your DTI ratio means</h2>
  <p>Lenders may use debt-to-income ratio as one factor when reviewing loan applications. Their definitions and qualifying limits vary by lender and loan type.</p>
  <h3>What to include</h3>
  <p>Include recurring monthly debt obligations and housing payments. This simple estimate does not determine loan eligibility and may not include every item a lender considers.</p>
  <h3>Gross income, not take-home pay</h3>
  <p>DTI is commonly calculated using gross income before taxes and deductions. This differs from a household budget, which may be better planned using take-home pay.</p>
`;

loadData("DebtToIncomeRatioCalculator");