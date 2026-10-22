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
  "Salary to Hourly Calculator",
  "Convert an annual salary into estimated hourly, weekly, and monthly gross pay."
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

const hourlyOut = output("Hourly Pay");
const weeklyOut = output("Weekly Pay");
const monthlyOut = output("Monthly Pay");
const biweeklyOut = output("Biweekly Pay");

outputArea.append(hourlyOut, weeklyOut, monthlyOut, biweeklyOut);

const annualSalary = new Input(
  0, 100000000, inputs, "Annual salary", 65000, "$", "", update
);
inputs.appendChild(document.createElement("br"));

const hoursPerWeek = new Input(
  1, 168, inputs, "Hours worked per week", 40, "", "hrs", update
);
inputs.appendChild(document.createElement("br"));

const weeksPerYear = new Input(
  1, 52, inputs, "Paid weeks per year", 52, "", "weeks", update
);
inputs.appendChild(document.createElement("br"));

const myBar = new VerticalBar({
  divId: "canvas-div",
  points: [],
  graphtitles: [["Hourly Pay", "Weekly Pay", "Biweekly Pay", "Monthly Pay"]],
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

function update() {
  draw();
  saveData("SalaryToHourlyCalculator");
}

function draw() {
  const salary = annualSalary.getValue();
  const hours = hoursPerWeek.getValue();
  const weeks = weeksPerYear.getValue();

  const totalHours = hours * weeks;
  const hourly = totalHours > 0 ? salary / totalHours : 0;
  const weekly = weeks > 0 ? salary / weeks : 0;
  const monthly = salary / 12;
  const biweekly = salary / 26;

  document.getElementById("hourlypay").textContent = formatMoney(hourly);
  document.getElementById("weeklypay").textContent = formatMoney(weekly);
  document.getElementById("monthlypay").textContent = formatMoney(monthly);
  document.getElementById("biweeklypay").textContent = formatMoney(biweekly);

  myBar.setPoints([[hourly, weekly, biweekly, monthly]]);
}

draw();

new FeatureList({
  parent: document.getElementById("page-layout"),
  mode: "keyword",
  keywords: ["salary", "hourly", "income"],
  limit: 8,
  visible: 4,
  excludeUrl: "/salary-to-hourly"
});

document.getElementById("mainarticle").innerHTML = `
  <p class="eyebrow">About this calculator</p>
  <h2>Convert salary to an hourly rate</h2>
  <p>Enter your annual salary, work hours per week, and paid weeks per year to estimate equivalent gross hourly, weekly, monthly, and biweekly pay.</p>
  <p class="eyebrow">Salary conversion guide</p>
  <h2>How salary is converted to hourly pay</h2>
  <p>The hourly estimate divides annual salary by the number of hours worked in a year. The default assumes 40 hours per week and 52 paid weeks per year.</p>
  <h3>Gross pay versus take-home pay</h3>
  <p>These results are gross estimates before income taxes, payroll deductions, benefits, unpaid leave, or other adjustments. Actual paychecks may differ.</p>
  <h3>Adjust the work schedule</h3>
  <p>Change weekly hours or paid weeks to model part-time schedules or unpaid time off. This calculator does not add overtime pay, bonuses, or commissions.</p>
`;

loadData("SalaryToHourlyCalculator");