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
    "Compound Interest Calculator",
    "See how a lump sum plus regular contributions grows over time with compound interest."
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

const principal = numberInput(0, 100000000, inputs, "Initial amount", 10000, "$", "", calculate);
const monthlyContribution = numberInput(0, 1000000, inputs, "Monthly contribution", 200, "$", "", calculate);
const rate = numberInput(0, 30, inputs, "Annual interest rate", 7, "", "%", calculate);
const years = numberInput(1, 60, inputs, "Years to grow", 25, "", "yrs", calculate);
const frequency = valueInputs(
    "Compounding frequency",
    ["Annually", "Monthly", "Daily"],
    [1, 12, 365],
    inputs,
    calculate
);

const futureValue = output("Future Value");
const totalContributed = output("Total Contributed");
const totalInterestEarned = output("Total Interest Earned");
const interestPercentOfBalance = output("Interest As Percent Of Balance");
let outputvalues = document.getElementById("output");
outputvalues.append(futureValue);
outputvalues.append(totalContributed);
outputvalues.append(totalInterestEarned);
outputvalues.append(interestPercentOfBalance);

let points = [];
let value = 10000;

const myGraph = new Graph({ divId: 'canvas-div', points: points, xLabel: 'Years', parent: document.getElementById("main-calculator"), stepsize: 1 });

function calculate() {
    let P = Number(principal.value.replaceAll(",",""));
    let monthly = Number(monthlyContribution.value.replaceAll(",",""));
    let annualrate = Number(rate.value.replaceAll(",","")) / 100;
    let n = Number(frequency.value);
    let t = Number(years.value.replaceAll(",",""));

    let totalperiods = Math.round(n * t);
    let periodrate = annualrate / n;
    let periodcontribution = (monthly * 12) / n;

    let balance = P;
    let totalcontributed = P;

    points = [];
    points.push(balance);

    for (let period = 1; period <= totalperiods; period++) {
        balance = balance * (1 + periodrate) + periodcontribution;
        totalcontributed += periodcontribution;
        if (period % n === 0 || period === totalperiods) {
            points.push(balance);
        }
    }

    let finalbalance = balance;
    let totalinterest = finalbalance - totalcontributed;

    document.getElementById("futurevalue").innerHTML = "$" + (Math.round(finalbalance * 100) / 100).toLocaleString('en-US');
    document.getElementById("totalcontributed").innerHTML = "$" + (Math.round(totalcontributed * 100) / 100).toLocaleString('en-US');
    document.getElementById("totalinterestearned").innerHTML = "$" + (Math.round(totalinterest * 100) / 100).toLocaleString('en-US');
    document.getElementById("interestaspercentofbalance").innerHTML = ((totalinterest / finalbalance) * 100).toFixed(1) + "%";

    myGraph.setPoints(points);
    myGraph.setStepSize(1);
}
calculate();