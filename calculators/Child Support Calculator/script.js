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
  "Child Support Estimate Calculator",
  "Explore a simplified income-based illustration. Actual child support is determined by local rules."
));
body.prepend(createHeader());

const main = createPageLayout();
body.append(main);
body.append(createFooter());

document.getElementById("maincontent").innerHTML = `
  <div id="main-calculator">
    <div id="inputs">
      <h2>Illustrative Inputs:</h2>
      <p class="calculator-disclaimer">
        This is not an official child support calculation. Rules vary by location.
      </p>
    </div>
  </div>
  <div id="output"></div>
`;

const inputs = document.getElementById("inputs");
const outputArea = document.getElementById("output");

const payerShareOut = output("Payers Share of Combined Income");
const otherShareOut = output("Other Parents Share of Combined Income");
const illustrativeAmountOut = output("Illustrative Monthly Amount");
const annualAmountOut = output("Illustrative Annual Amount");

outputArea.append(
  payerShareOut,
  otherShareOut,
  illustrativeAmountOut,
  annualAmountOut
);

function addBreak() {
  inputs.appendChild(document.createElement("br"));
}

const payerIncome = new Input(
  0, 10000000, inputs, "Payer's gross monthly income", 5000, "$", "", update
);
addBreak();

const otherIncome = new Input(
  0, 10000000, inputs, "Other parent's gross monthly income", 4000, "$", "", update
);
addBreak();

const estimatedChildCosts = new Input(
  0, 1000000, inputs, "Illustrative monthly child expenses", 1500, "$", "", update
);
addBreak();

const myBar = new VerticalBar({
  divId: "canvas-div",
  points: [],
  graphtitles: [["Payer's Share", "Other Parent's Share"]],
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
  saveData("ChildSupportEstimateCalculator");
}

function draw() {
  const incomeA = payerIncome.getValue();
  const incomeB = otherIncome.getValue();
  const combinedIncome = incomeA + incomeB;
  const childCosts = estimatedChildCosts.getValue();

  const payerShare = combinedIncome > 0 ? incomeA / combinedIncome : 0;
  const otherShare = combinedIncome > 0 ? incomeB / combinedIncome : 0;
  const illustrativeMonthlyAmount = childCosts * payerShare;

  document.getElementById("payersshareofcombinedincome").textContent =    (payerShare * 100).toFixed(1) + "%";
  document.getElementById("otherparentsshareofcombinedincome").textContent =    (otherShare * 100).toFixed(1) + "%";
  document.getElementById("illustrativemonthlyamount").textContent =    money(illustrativeMonthlyAmount);
  document.getElementById("illustrativeannualamount").textContent =    money(illustrativeMonthlyAmount * 12);

  myBar.setPoints([[payerShare * 100, otherShare * 100]]);
}

draw();

new FeatureList({
  parent: document.getElementById("page-layout"),
  mode: "keyword",
  keywords: ["child support", "family", "income"],
  limit: 8,
  visible: 4,
  excludeUrl: "/child-support"
});

document.getElementById("mainarticle").innerHTML = `
  <p class="eyebrow">About this illustration</p>
  <h2>Explore an income-based child support example</h2>
  <p>This tool demonstrates a simple proportional-income calculation using the income and illustrative child expenses you enter. It is not an official child support calculator.</p>
  <p class="eyebrow">Important information</p>
  <h2>Child support rules depend on your location</h2>
  <p>Actual calculations may consider jurisdiction-specific formulas, custody arrangements, number of children, healthcare and childcare costs, other dependents, and other factors.</p>
  <h3>Do not use this as a legal estimate</h3>
  <p>The result is only a mathematical illustration and should not be used to set, change, or enforce a support obligation. Consult the relevant government agency or a qualified local professional for guidance.</p>
`;

loadData("ChildSupportEstimateCalculator");