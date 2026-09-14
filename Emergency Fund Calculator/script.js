import { createHeader } from "../Header/script.js";
import { createFooter } from "../Footer/script.js";
import { titleGenerator } from "../Calculator Title/script.js";
import { createPageLayout } from "../Page Layout/script.js";
import { numberInput, valueInputs } from "../Modules/Input/input.js";
import { output } from "../Modules/Output/Output/script.js";
import { Graph } from "../Modules/Output/Graph/graph.js";

const body = document.querySelector("body");
const header = createHeader();
const footer = createFooter();
const title = titleGenerator(
    "Finance calculator",
    "Emergency Fund Calculator",
    "Find your emergency fund target and how long it will take to reach it."
);
const main = createPageLayout();
body.prepend(title);
body.prepend(header);
body.append(main);
body.appendChild(footer);

const maincontent = document.getElementById("maincontent");
document.getElementById("maincontent").innerHTML = `<div id="main-calculator">
                <div id="inputs">
                    <h3>Input Fields:</h3>
                    <!--<button id="calculate-btn">Calculate</button>-->
                </div>
            </div>
            <div id="output">
            <!--button id="resolve">recalculate</button>-->
            </div>`;

const inputs = document.getElementById("inputs");

const monthlyExpenses = numberInput(0, 1000000, inputs, "Monthly essential expenses", 3200, "$", "", calculate);
const monthsCoverage = valueInputs(
    "Months of coverage desired",
    ["3 months", "6 months", "9 months", "12 months"],
    [3, 6, 9, 12],
    inputs,
    calculate
);
const currentSavings = numberInput(0, 10000000, inputs, "Current emergency savings", 1000, "$", "", calculate);
const monthlySavings = numberInput(0, 100000, inputs, "Monthly savings toward fund", 300, "$", "", calculate);

const emergencyFundTarget = output("Emergency Fund Target");
const currentProgress = output("Current Progress");
const amountRemaining = output("Amount Remaining");
const timeToReachGoal = output("Time To Reach Goal");
let outputvalues = document.getElementById("output");
outputvalues.append(emergencyFundTarget);
outputvalues.append(currentProgress);
outputvalues.append(amountRemaining);
outputvalues.append(timeToReachGoal);

let points = [];
let value = 1000;

const myGraph = new Graph({ divId: 'canvas-div', points: points, xLabel: 'Months', parent: document.getElementById("main-calculator"), stepsize: 1 });

function calculate() {
    let expenses = Number(monthlyExpenses.value.replaceAll(",",""));
    let months = Number(monthsCoverage.value);
    let target = expenses * months;
    let current = Number(currentSavings.value.replaceAll(",",""));
    let monthly = Number(monthlySavings.value.replaceAll(",",""));
    let gap = Math.max(target - current, 0);
    let monthstogoal = monthly > 0 ? Math.ceil(gap / monthly) : Infinity;

    document.getElementById("emergencyfundtarget").innerHTML = "$" + (Math.round(target * 100) / 100).toLocaleString('en-US');
    document.getElementById("currentprogress").innerHTML = (target > 0 ? Math.min((current / target) * 100, 100).toFixed(0) : 0) + "%";
    document.getElementById("amountremaining").innerHTML = "$" + (Math.round(gap * 100) / 100).toLocaleString('en-US');
    document.getElementById("timetoreachgoal").innerHTML = isFinite(monthstogoal) ? Math.floor(monthstogoal / 12) + " yr " + (monthstogoal % 12) + " mo" : "—";

    points = [];
    if (gap === 0) {
        points.push(current);
    } else if (!isFinite(monthstogoal)) {
        points.push(current);
    } else {
        let balance = current;
        for (let m = 0; m <= monthstogoal; m++) {
            points.push(balance);
            balance += monthly;
        }
    }
    myGraph.setPoints(points);
    myGraph.setStepSize(1);
}
calculate();

const mainarticle = document.getElementById("mainarticle");
mainarticle.innerHTML = `
  <p class="eyebrow">About this calculator</p>
  <h2>Calculate your emergency fund target</h2>
  <p>This emergency fund calculator estimates how much you should save based on your essential monthly expenses and desired months of coverage, and shows how long it will take to reach that goal at your current savings rate.</p>
  <p class="eyebrow">Emergency fund guide</p>
  <h2>How much should you have in an emergency fund</h2>
  <p>An emergency fund is cash set aside to cover essential expenses, like housing, food, utilities, and insurance, if you lose income unexpectedly. Most guidance suggests saving three to six months of essential expenses, with some people targeting up to twelve months for extra security.</p>
  <h3>Why "essential expenses" matters</h3>
  <p>Emergency fund targets are usually based on essential, non-discretionary spending rather than your full monthly budget, since the goal is covering necessities during a temporary income gap, not maintaining your normal lifestyle.</p>
  <h3>Where to keep an emergency fund</h3>
  <p>Emergency savings are typically kept in a liquid, low-risk account, such as a high-yield savings account, so the money is accessible quickly without investment risk when you need it.</p>
  <h3>Building your fund over time</h3>
  <p>Setting a consistent monthly savings amount, even a small one, lets you reach a full emergency fund target gradually while still making progress on other financial goals.</p>
`;