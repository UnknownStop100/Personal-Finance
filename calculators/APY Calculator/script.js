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
  "APY Calculator",
  "Convert an annual interest rate and compounding frequency into an estimated annual percentage yield."
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

const apyOut = output("Annual Percentage Yield");
const interestOut = output("Estimated Annual Interest");
const endingBalanceOut = output("Balance After One Year");
const effectiveRateOut = output("Effective Annual Rate");

outputArea.append(apyOut, interestOut, endingBalanceOut, effectiveRateOut);

function addBreak() {
  inputs.appendChild(document.createElement("br"));
}

const deposit = new Input(
  0, 100000000, inputs, "Starting deposit", 10000, "$", "", update
);
addBreak();

const annualRate = new Input(
  0, 100, inputs, "Nominal annual interest rate", 4.5, "", "%", update
);
addBreak();

const frequency = valueInputs(
  "Compounding frequency",
  ["Annually", "Semiannually", "Quarterly", "Monthly", "Daily"],
  [1, 2, 4, 12, 365],
  inputs,
  update
);
addBreak();

const myBar = new VerticalBar({
  divId: "canvas-div",
  points: [],
  graphtitles: [["Starting Deposit", "Balance After One Year"]],
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
  saveData("APYCalculator");
}

function draw() {
  const principal = deposit.getValue();
  const rate = annualRate.getValue() / 100;
  const periods = Number(frequency.value);

  const apy = (1 + rate / periods) ** periods - 1;
  const endingBalance = principal * (1 + apy);
  const interest = endingBalance - principal;

  document.getElementById("annualpercentageyield").textContent =
    (apy * 100).toFixed(3) + "%";
  document.getElementById("estimatedannualinterest").textContent =
    money(interest);
  document.getElementById("balanceafteroneyear").textContent =
    money(endingBalance);
  document.getElementById("effectiveannualrate").textContent =
    (apy * 100).toFixed(3) + "%";

  myBar.setPoints([[principal, endingBalance]]);
}

draw();

new FeatureList({
  parent: document.getElementById("page-layout"),
  mode: "keyword",
  keywords: ["APY", "interest", "savings", "bank"],
  limit: 8,
  visible: 4,
  excludeUrl: "/apy"
});

document.getElementById("mainarticle").innerHTML = `
  <p class="eyebrow">About this calculator</p>
  <h2>Estimate annual percentage yield</h2>
  <p>Enter a nominal annual interest rate and compounding frequency to estimate APY and the interest earned on a starting deposit over one year.</p>
  <p class="eyebrow">APY guide</p>
  <h2>How compounding affects APY</h2>
  <p>With a positive nominal rate, more frequent compounding generally produces a higher effective annual yield. This calculator assumes the rate stays constant and interest remains in the account.</p>
  <h3>Estimate versus disclosed APY</h3>
  <p>Financial institutions may calculate and disclose APY under applicable regulations and account-specific terms. This simple estimate does not account for fees, deposits, withdrawals, promotional rates, or changing rates.</p>
`;

loadData("APYCalculator");