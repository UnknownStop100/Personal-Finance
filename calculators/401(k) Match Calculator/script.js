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
  "401(k) Match Calculator",
  "Estimate your employer match and total annual retirement contributions."
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

const employeeOut = output("Your Annual Contribution");
const employerOut = output("Estimated Employer Match");
const totalOut = output("Total Annual Contribution");
const matchRateOut = output("Employer Match as Percent of Salary");

outputArea.append(employeeOut, employerOut, totalOut, matchRateOut);

function addBreak() {
  inputs.appendChild(document.createElement("br"));
}

const salary = new Input(
  0, 100000000, inputs, "Annual salary", 80000, "$", "", update
);
addBreak();

const employeePercent = new Input(
  0, 100, inputs, "Your contribution (% of salary)", 6, "", "%", update
);
addBreak();

const employerMatchPercent = new Input(
  0, 100, inputs, "Employer match rate (% of your contribution)", 50, "", "%", update
);
addBreak();

const matchLimitPercent = new Input(
  0, 100, inputs, "Employer matches contributions up to (% of salary)", 6, "", "%", update
);
addBreak();

const myBar = new VerticalBar({
  divId: "canvas-div",
  points: [],
  graphtitles: [["Employee Contribution", "Employer Match"]],
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
  saveData("401kMatchCalculator");
}

function draw() {
  const annualSalary = salary.getValue();
  const employeeRate = employeePercent.getValue() / 100;
  const matchRate = employerMatchPercent.getValue() / 100;
  const matchLimit = matchLimitPercent.getValue() / 100;

  const employeeContribution = annualSalary * employeeRate;
  const eligibleContribution = annualSalary * Math.min(employeeRate, matchLimit);
  const employerContribution = eligibleContribution * matchRate;
  const totalContribution = employeeContribution + employerContribution;
  const employerAsSalaryPercent = annualSalary > 0
    ? employerContribution / annualSalary * 100
    : 0;

  document.getElementById("yourannualcontribution").textContent =
    money(employeeContribution);
  document.getElementById("estimatedemployermatch").textContent =
    money(employerContribution);
  document.getElementById("totalannualcontribution").textContent =
    money(totalContribution);
  document.getElementById("employermatchaspercentofsalary").textContent =
    employerAsSalaryPercent.toFixed(2) + "%";

  myBar.setPoints([[employeeContribution, employerContribution]]);
}

draw();

new FeatureList({
  parent: document.getElementById("page-layout"),
  mode: "keyword",
  keywords: ["401k", "retirement", "employer match", "savings"],
  limit: 8,
  visible: 4,
  excludeUrl: "/401k-match"
});

document.getElementById("mainarticle").innerHTML = `
  <p class="eyebrow">About this calculator</p>
  <h2>Estimate your 401(k) employer match</h2>
  <p>Enter your salary, contribution percentage, and a simplified employer match formula to estimate annual employee and employer contributions.</p>
  <p class="eyebrow">401(k) match guide</p>
  <h2>How an employer match works</h2>
  <p>Some employers contribute to a workplace retirement plan based on how much an employee contributes. Match formulas and eligible compensation vary by plan.</p>
  <h3>Contribute enough to receive the full match</h3>
  <p>If your plan offers a match, check its summary plan description to understand the contribution level needed to receive the full amount.</p>
  <h3>Check plan rules</h3>
  <p>This estimate excludes annual contribution limits, catch-up contributions, vesting schedules, payroll timing, eligible compensation rules, and plan-specific match formulas. Review your plan documents for exact terms.</p>
`;

loadData("401kMatchCalculator");