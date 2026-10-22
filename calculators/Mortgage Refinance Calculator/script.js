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
  "Mortgage Refinance Calculator",
  "Compare estimated monthly payments and interest for your current mortgage and a refinance."
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

const currentPaymentOut = output("Current Monthly Payment");
const refinancePaymentOut = output("New Monthly Payment");
const monthlySavingsOut = output("Monthly Payment Difference");
const interestDifferenceOut = output("Interest Difference");

outputArea.append(
  currentPaymentOut,
  refinancePaymentOut,
  monthlySavingsOut,
  interestDifferenceOut
);

function addBreak() {
  inputs.appendChild(document.createElement("br"));
}

const balance = new Input(
  0, 20000000, inputs, "Current mortgage balance", 300000, "$", "", update
);
addBreak();

const currentRate = new Input(
  0, 25, inputs, "Current interest rate", 7, "", "%", update
);
addBreak();

const currentYears = new Input(
  1, 40, inputs, "Remaining current loan term", 25, "", "yrs", update
);
addBreak();

const refinanceRate = new Input(
  0, 25, inputs, "New refinance interest rate", 6, "", "%", update
);
addBreak();

const refinanceYears = new Input(
  1, 40, inputs, "New refinance loan term", 30, "", "yrs", update
);
addBreak();

const myGraph = new SuperGraph({
  divId: "canvas-div",
  points: [],
  graphtitles: ["Current Mortgage Balance", "Refinance Balance"],
  xLabel: "Years",
  parent: document.getElementById("main-calculator"),
  stepsize: 12,
  xlabeloffset: 0
});

function monthlyPayment(principal, annualRate, years) {
  const months = years * 12;
  const rate = annualRate / 100 / 12;

  if (principal <= 0 || months <= 0) return 0;
  if (rate === 0) return principal / months;

  const factor = (1 + rate) ** months;
  return principal * rate * factor / (factor - 1);
}

function balancePoints(principal, annualRate, years, payment) {
  const months = years * 12;
  const monthlyRate = annualRate / 100 / 12;
  const points = [];

  let remaining = principal;

  for (let month = 0; month <= months; month++) {
    points.push([[remaining], []]);

    if (month < months) {
      const interest = remaining * monthlyRate;
      remaining = Math.max(0, remaining - (payment - interest));
    }
  }

  return points;
}

function money(value) {
  return "$" + value.toLocaleString("en-US", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  });
}

function update() {
  draw();
  saveData("MortgageRefinanceCalculator");
}

function draw() {
  const principal = balance.getValue();
  const currentYearsValue = currentYears.getValue();
  const refinanceYearsValue = refinanceYears.getValue();
  const oldRate = currentRate.getValue();
  const newRate = refinanceRate.getValue();

  const oldPayment = monthlyPayment(principal, oldRate, currentYearsValue);
  const newPayment = monthlyPayment(principal, newRate, refinanceYearsValue);

  const oldTotalInterest = oldPayment * currentYearsValue * 12 - principal;
  const newTotalInterest = newPayment * refinanceYearsValue * 12 - principal;
  const monthlyDifference = oldPayment - newPayment;
  const interestDifference = oldTotalInterest - newTotalInterest;

  document.getElementById("currentmonthlypayment").textContent = money(oldPayment);
  document.getElementById("newmonthlypayment").textContent = money(newPayment);
  document.getElementById("monthlypaymentdifference").textContent =
    (monthlyDifference >= 0 ? "Save " : "Pay ") + money(Math.abs(monthlyDifference));
  document.getElementById("interestdifference").textContent =
    (interestDifference >= 0 ? "Save " : "Pay ") + money(Math.abs(interestDifference));

  const currentPoints = balancePoints(
    principal, oldRate, currentYearsValue, oldPayment
  );
  const refinancePoints = balancePoints(
    principal, newRate, refinanceYearsValue, newPayment
  );
  const maxMonths = Math.max(currentPoints.length, refinancePoints.length);
  const points = [];

  for (let month = 0; month < maxMonths; month++) {
    points.push([
      [currentPoints[month]?.[0]?.[0] ?? 0],
      [refinancePoints[month]?.[0]?.[0] ?? 0]
    ]);
  }

  myGraph.setStepSize(12);
  myGraph.setPoints(points);
}

draw();

new FeatureList({
  parent: document.getElementById("page-layout"),
  mode: "keyword",
  keywords: ["mortgage", "refinance", "home", "loan"],
  limit: 8,
  visible: 4,
  excludeUrl: "/mortgage-refinance"
});

document.getElementById("mainarticle").innerHTML = `
  <p class="eyebrow">About this calculator</p>
  <h2>Estimate mortgage refinance payments</h2>
  <p>Compare estimated principal-and-interest payments for your current mortgage and a new refinance loan using the balance, rates, and terms you enter.</p>
  <p class="eyebrow">Refinance guide</p>
  <h2>Look beyond the monthly payment</h2>
  <p>A lower payment may come from a lower rate, a longer repayment term, or both. A longer term can lower monthly payments while increasing the time spent repaying the loan.</p>
  <h3>Closing costs and break-even time</h3>
  <p>This simplified calculator excludes refinance closing costs, so it does not calculate a break-even date. Include fees and other costs when comparing real offers.</p>
  <h3>Estimate limitations</h3>
  <p>Results assume a fixed rate and unchanged loan balance at the start of each scenario. They exclude taxes, insurance, mortgage insurance, fees, and lender-specific terms.</p>
`;

loadData("MortgageRefinanceCalculator");