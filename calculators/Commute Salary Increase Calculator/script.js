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
  "Commute Salary Increase",
  "Find out if a higher-paying job is still worth it after the extra gas and vehicle costs of a longer commute."
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

// Output ids are the label in lowercase with the spaces removed,
// e.g. "Difference After Commute Costs" -> "differenceaftercommutecosts"
const differenceOut = output("Current Salary after Expenses");
const salaryDifferenceOut = output("Current Gas Expense");
const extraCostOut = output("Current Vehicle Expense");
const currentHourlyIncome = output("Current Hourly Pay");
const newCostOut = output("New Salary after Expenses");
const currentNetOut = output("New Gas Expense");
const newNetOut = output("New Vehicle Expense");
const newHourlyIncome = output("New Hourly Pay");
const currentCostOut = output("Breakeven New Salary");
const breakEvenOut = output("Salary Difference");

outputArea.append(
  differenceOut,
  salaryDifferenceOut,
  extraCostOut,
  currentHourlyIncome,
  newCostOut,
  currentNetOut,
  newNetOut,
  newHourlyIncome,
  currentCostOut,
  breakEvenOut
);

function addBreak() {
  inputs.appendChild(document.createElement("br"));
}

const currentSalary = new Input(
  0, 100000000, inputs, "Current annual salary", 60000, "$", "", update
);
addBreak();

const newSalary = new Input(
  0, 100000000, inputs, "New annual salary", 68000, "$", "", update
);
addBreak();

const currentHours = new Input(
  0, 100000000, inputs, "Current Hours a Week", 40, "", "hours", update
);
addBreak();

const newHours = new Input(
  0, 100000000, inputs, "New Hours a Week", 40, "", "hours", update
);
addBreak();
const currentDistance = new Input(
  0, 1000, inputs, "Current job distance one way", 8, "", "mi", update
);
addBreak();

const newDistance = new Input(
  0, 1000, inputs, "New job distance one way", 25, "", "mi", update
);
addBreak();

const commuteDays = new Input(
  0, 366, inputs, "Current Commute days per year", 240, "", "days", update
);
addBreak();

const newCommuteDays = new Input(
  0, 366, inputs, "New Commute days per year", 240, "", "days", update
);
addBreak();
const mpg = new Input(
  1, 500, inputs, "Vehicle fuel economy", 26, "", "mpg", update
);
addBreak();

const gasPrice = new Input(
  0, 100, inputs, "Gas price per gallon", 3.5, "$", "", update
);
addBreak();

const vehicleCostPerMile = new Input(
  0, 20, inputs, "Vehicle expense per mile excluding gas", 0.15, "$", "", update
);
addBreak();

// Two bars: the raise on paper vs. the raise once commute costs are taken out
const myBar = new VerticalBar({
  divId: "canvas-div",
  points: [],
  graphtitles: [["Salary After Expenses", "Gas Expenses", "Vehicle Expenses"], ["New Salary After Expenses", "New Gas Expenses", "New Vehicle Expenses"]],
  xLabel: "",
  parent: document.getElementById("main-calculator"),
  stepsize: 1,
  xlabeloffset: 0
});

function money(value) {
  const sign = value < 0 ? "-" : "";
  return sign + "$" + Math.abs(value).toLocaleString("en-US", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  });
}

function update() {
  draw();
  saveData("CommuteSalaryIncreaseCalculator");
}


function draw() {
  const salaryCurrent = currentSalary.getValue();
  const salaryNew = newSalary.getValue();
  const hoursCurrent = currentHours.getValue();
  const hoursNew = newHours.getValue();
  const distanceCurrent = currentDistance.getValue();
  const distanceNew = newDistance.getValue();
  const currentCommuteDays = commuteDays.getValue();
  const commuteDaysNew = newCommuteDays.getValue();
  const milesPerGallon = mpg.getValue();
  const priceGas = gasPrice.getValue();
  const mileVehicleCost = vehicleCostPerMile.getValue();
  const curgascost=currentCommuteDays*distanceCurrent*2/milesPerGallon*priceGas;
  const newgascost=commuteDaysNew*distanceNew*2/milesPerGallon*priceGas;
  const curvehiclecost=currentCommuteDays*distanceCurrent*2*mileVehicleCost;
  const newvehiclecost=commuteDaysNew*distanceNew*2*mileVehicleCost;
  const currentsalarywoexpenses=salaryCurrent-curgascost-curvehiclecost;
  const newsalarywoexpenses=salaryNew-newgascost-newvehiclecost;
  document.getElementById("currentsalaryafterexpenses").textContent=money(currentsalarywoexpenses);
  document.getElementById("currentgasexpense").textContent=money(curgascost);
  document.getElementById("currentvehicleexpense").textContent=money(curvehiclecost);
  document.getElementById("currenthourlypay").textContent=money(currentsalarywoexpenses/hoursCurrent/52.143);
  document.getElementById("newsalaryafterexpenses").textContent=money(newsalarywoexpenses);
  document.getElementById("newgasexpense").textContent=money(newgascost);
  document.getElementById("newvehicleexpense").textContent=money(newvehiclecost);
  document.getElementById("newhourlypay").textContent=money(newsalarywoexpenses/hoursNew/52.143);
  document.getElementById("breakevennewsalary").textContent=money(newgascost+newvehiclecost+salaryCurrent-curgascost-curvehiclecost);
  document.getElementById("salarydifference").textContent=money(newsalarywoexpenses-currentsalarywoexpenses);
  myBar.setPoints([[currentsalarywoexpenses, curgascost, curvehiclecost],[newsalarywoexpenses,newgascost,newvehiclecost]]);
}

draw();

new FeatureList({
  parent: document.getElementById("page-layout"),
  mode: "keyword",
  keywords: ["commute", "salary", "gas", "vehicle"],
  limit: 8,
  visible: 4,
  excludeUrl: "/commute-salary-increase"
});

document.getElementById("mainarticle").innerHTML = `
  <p class="eyebrow">About this calculator</p>
  <h2>Is a higher salary worth a longer commute?</h2>
  <p>This calculator compares your current job with a new job. It subtracts the yearly gas and vehicle costs of each commute from each salary, so you can see how much of the raise you would actually keep. It will also take and show if you will have a higher hourly wage including the driving.</p>
  <p class="eyebrow">Commute cost guide</p>
  <h2>How to calculate the real cost of a longer commute</h2>
  <p>A new salary can look better on paper than it is in practice. A longer drive adds fuel, maintenance, tires, drive time, and depreciation costs that come out of the same money.</p>
  <h3>Step 1: Find the weekly work hours</h3>
  <p>Take the time you are at work, then add the time for your commute both ways.</p>
  <h3>Step 2: Find the yearly commute miles</h3>
  <p>Double the one-way distance to get the round trip, then multiply by the number of days you commute each year. Remote or hybrid days lower the total.</p>
  <h3>Step 3: Calculate gas cost from your mpg</h3>
  <p>Divide the yearly miles by your vehicle's miles per gallon to get the gallons used, then multiply by the price per gallon.</p>
  <h3>Step 4: Add your vehicle expense per mile</h3>
  <p>Each mile also wears down tires, brakes, and other parts and adds to depreciation. Enter your own cost per mile for these items, not including gas, which is calculated separately.</p>
  <h3>Step 5: Look at the results</h3>
  <p>This will subtract each job's commute cost from its salary. The difference between those two results is what the new job is really worth. The break-even salary is the new pay needed to match your current job after commute costs.</p>
  <h3>What this estimate leaves out</h3>
  <p>The figures use gross salary, so taxes will reduce both the raise and the commute comparison. They also leave out, tolls, parking, benefits, and bonuses, which can change the answer.</p>
`;

loadData("CommuteSalaryIncreaseCalculator");