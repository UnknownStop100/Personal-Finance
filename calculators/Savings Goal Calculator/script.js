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
  "Savings Goal Calculator",
  "Find out how much to save each month to reach your goal and how long it may take."
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

const goalOut = output("Savings Goal");
const savedOut = output("Current Savings");
const remainingOut = output("Amount Remaining");
const timeOut = output("Time to Goal");
outputArea.append(goalOut, savedOut, remainingOut, timeOut);

function addBreak() {
  inputs.appendChild(document.createElement("br"));
}

const goal = new Input(0, 1000000000, inputs, "Savings goal", 20000, "$", "", update);
addBreak();
const current = new Input(0, 1000000000, inputs, "Current savings", 3000, "$", "", update);
addBreak();
const monthly = new Input(0, 10000000, inputs, "Monthly contribution", 500, "$", "", update);
addBreak();
const annualReturn = new Input(0, 50, inputs, "Annual interest/return", 4, "", "%", update);
addBreak();

const graph = new SuperGraph({
  divId: "canvas-div",
  points: [],
  graphtitles: ["Projected Savings", "Goal"],
  xLabel: "Months",
  parent: document.getElementById("main-calculator"),
  stepsize: 12,
  xlabeloffset: 0
});

function update() {
  draw();
  saveData("SavingsGoalCalculator");
}

function draw() {
  const target = goal.getValue();
  const starting = current.getValue();
  const contribution = monthly.getValue();
  const monthlyRate = annualReturn.getValue() / 100 / 12;
  const remaining = Math.max(target - starting, 0);

  let balance = starting;
  let months = 0;
  const points = [[[balance], [target]]];

  while (balance < target && months < 1200 && contribution + balance * monthlyRate > 0) {
    balance = balance * (1 + monthlyRate) + contribution;
    months++;
    points.push([[balance], [target]]);
  }

  const reached = starting >= target || balance >= target;
  const monthlyNeeded = calculateMonthlyContribution(target, starting, monthlyRate, 12 * 50);

  document.getElementById("savingsgoal").textContent =
    "$" + target.toLocaleString("en-US", { maximumFractionDigits: 2 });
  document.getElementById("currentsavings").textContent =
    "$" + starting.toLocaleString("en-US", { maximumFractionDigits: 2 });
  document.getElementById("amountremaining").textContent =
    "$" + remaining.toLocaleString("en-US", { maximumFractionDigits: 2 });
  document.getElementById("timetogoal").textContent =
    reached ? "Goal reached" : months < 1200
      ? `${Math.floor(months / 12)} yr ${months % 12} mo`
      : "Not reached with these inputs";

  graph.setStepSize(12);
  graph.setxlabeloffset(0);
  graph.setPoints(points);
}

function calculateMonthlyContribution(target, starting, monthlyRate, months) {
  if (target <= starting) return 0;
  if (monthlyRate === 0) return (target - starting) / months;

  const growth = (1 + monthlyRate) ** months;
  return Math.max(0, (target - starting * growth) * monthlyRate / (growth - 1));
}

draw();

new FeatureList({
  parent: document.getElementById("page-layout"),
  mode: "keyword",
  keywords: ["savings", "budget", "finance"],
  limit: 8,
  visible: 4,
  excludeUrl: "/savings-goal"
});

document.getElementById("mainarticle").innerHTML = `
  <p class="eyebrow">About this calculator</p>
  <h2>Plan how to reach your savings goal</h2>
  <p>Enter your target, current savings, monthly contribution, and an assumed annual return to estimate how long it may take to reach your goal.</p>
  <p class="eyebrow">Savings goal guide</p>
  <h2>How savings growth is estimated</h2>
  <p>This calculator applies the assumed annual return monthly and adds your contribution at the end of each month. Actual account returns and rates can change.</p>
  <h3>Make your goal manageable</h3>
  <p>Breaking a large goal into a monthly savings target can make it easier to plan. Try different contribution amounts to see how they affect the estimated timeline.</p>
  <h3>About the estimate</h3>
  <p>The projection does not account for taxes, fees, inflation, or changes in your contribution or interest rate.</p>
`;
loadData("SavingsGoalCalculator");