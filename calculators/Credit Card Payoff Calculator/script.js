import { createHeader } from "../../Header/script.js";
import { createFooter } from "../../Footer/script.js";
import { titleGenerator } from "../../Calculator Title/script.js";
import { createPageLayout } from "../../Page Layout/script.js";
import { Input } from "../../Modules/Input/input.js";
import { output } from "../../Modules/Output/Output/script.js";
import { SuperGraph } from "../../Modules/Output/Graph/supergraph.js";
import { FeatureList } from "../../featurelist/script.js";
import { saveData, loadData } from "../../dataStorage/script.js";

const body = document.querySelector("body");
body.prepend(titleGenerator(
  "Finance calculator",
  "Credit Card Payoff Calculator",
  "Estimate how long it will take to pay off your credit card and how much interest you’ll pay."
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

const balanceOut = output("Starting Balance");
const payoffTimeOut = output("Payoff Time");
const interestOut = output("Total Interest");
const totalPaidOut = output("Total Paid");
outputArea.append(balanceOut, payoffTimeOut, interestOut, totalPaidOut);

function addBreak() {
  inputs.appendChild(document.createElement("br"));
}

const balance = new Input(0, 10000000, inputs, "Credit card balance", 5000, "$", "", update);
addBreak();
const apr = new Input(0, 100, inputs, "Interest rate (APR)", 22, "", "%", update);
addBreak();
const payment = new Input(0, 1000000, inputs, "Monthly payment", 200, "$", "", update);
addBreak();

const graph = new SuperGraph({
  divId: "canvas-div",
  points: [],
  graphtitles: ["Remaining Balance"],
  xLabel: "Months",
  parent: document.getElementById("main-calculator"),
  stepsize: 12,
  xlabeloffset: 0
});

function update() {
  draw();
  saveData("CreditCardPayoffCalculator");
}

function draw() {
  const startingBalance = balance.getValue();
  const monthlyRate = apr.getValue() / 100 / 12;
  const monthlyPayment = payment.getValue();

  let remaining = startingBalance;
  let totalInterest = 0;
  let months = 0;
  const points = [[[remaining]]];

  if (remaining > 0 && monthlyPayment > 0) {
    while (remaining > 0.005 && months < 1200) {
      const interest = remaining * monthlyRate;
      if (monthlyPayment <= interest) break;

      totalInterest += interest;
      remaining = Math.max(0, remaining + interest - monthlyPayment);
      months++;
      points.push([[remaining]]);
    }
  }

  const canPayOff = startingBalance === 0 || (monthlyPayment > 0 && remaining <= 0.005);
  document.getElementById("startingbalance").textContent =
    "$" + startingBalance.toLocaleString("en-US", { maximumFractionDigits: 2 });
  document.getElementById("payofftime").textContent =
    startingBalance === 0 ? "0 months" : canPayOff
      ? `${Math.floor(months / 12)} yr ${months % 12} mo`
      : "Payment too low";
  document.getElementById("totalinterest").textContent =
    "$" + totalInterest.toLocaleString("en-US", { maximumFractionDigits: 2 });
  document.getElementById("totalpaid").textContent =
    "$" + (startingBalance + totalInterest).toLocaleString("en-US", { maximumFractionDigits: 2 });

  graph.setStepSize(12);
  graph.setxlabeloffset(0);
  graph.setPoints(points);
}

draw();

new FeatureList({
  parent: document.getElementById("page-layout"),
  mode: "keyword",
  keywords: ["credit card", "debt", "finance"],
  limit: 8,
  visible: 4,
  excludeUrl: "/credit-card-payoff"
});

document.getElementById("mainarticle").innerHTML = `
  <p class="eyebrow">About this calculator</p>
  <h2>Estimate your credit card payoff time</h2>
  <p>Enter your balance, APR, and monthly payment to estimate how long payoff may take and the interest you could pay.</p>
  <p class="eyebrow">Credit card payoff guide</p>
  <h2>How credit card payoff is estimated</h2>
  <p>Each month, interest is added to the remaining balance before your payment is applied. The estimate assumes the APR and monthly payment stay constant.</p>
  <h3>Why minimum payments can take so long</h3>
  <p>When payments are only slightly larger than monthly interest, the balance falls slowly and total interest can grow substantially.</p>
  <h3>Try a larger payment</h3>
  <p>Increasing your monthly payment generally reduces both payoff time and interest. This estimate does not include fees, new purchases, or changing rates.</p>
`;
loadData("CreditCardPayoffCalculator");