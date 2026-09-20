import { createHeader } from "../Header/script.js";
import { createFooter } from "../Footer/script.js";
import { titleGenerator } from "../Calculator Title/script.js";
import { createPageLayout } from "../Page Layout/script.js";
import { Input, valueInputs } from "../Modules/Input/input.js";
import { output } from "../Modules/Output/Output/script.js";
import { SuperGraph } from "../Modules/Output/Graph/supergraph.js";

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

document.getElementById("maincontent").innerHTML = `<div id="main-calculator">
                <div id="inputs">
                    <h3>Input Fields:</h3>
                    <!--<button id="calculate-btn">Calculate</button>-->
                </div>
            </div>
            <div id="output">
            <!--button id="resolve">recalculate</button>-->
            </div>`;

const inputsContainer = document.getElementById("inputs");

const futureValue = output("Future Value");
const totalContributed = output("Total Contributed");
const totalInterestEarned = output("Total Interest Earned");
const interestPercentOfBalance = output("Interest As Percent Of Balance");
let outputvalues = document.getElementById("output");
outputvalues.append(futureValue);
outputvalues.append(totalContributed);
outputvalues.append(totalInterestEarned);
outputvalues.append(interestPercentOfBalance);

///////////////////////////
//handles inputs
///////////////////////////

let principal = new Input(0, 100000000, inputsContainer, "Initial amount", 10000, "$", "", updateFields);
inputsContainer.appendChild(document.createElement("br"));
let monthlyContribution = new Input(0, 1000000, inputsContainer, "Monthly contribution", 200, "$", "", updateFields);
inputsContainer.appendChild(document.createElement("br"));
let rate = new Input(0, 30, inputsContainer, "Annual interest rate", 7, "", "%", updateFields);
inputsContainer.appendChild(document.createElement("br"));
let years = new Input(1, 60, inputsContainer, "Years to grow", 25, "", "yrs", updateFields);
inputsContainer.appendChild(document.createElement("br"));
let frequency = valueInputs(
    "Compounding frequency",
    ["Annually", "Monthly", "Daily"],
    [1, 12, 365],
    inputsContainer,
    updateFields
);
inputsContainer.appendChild(document.createElement("br"));

const myGraph = new SuperGraph({
    divId: 'canvas-div',
    points: [],
    graphtitles: ["Balance", "Total Contributed"],
    xLabel: 'Years',
    parent: document.getElementById("main-calculator"),
    stepsize: 1,
    xlabeloffset: 0
});

function updateFields() {
    drawGraph();
}

///////////////////////////
//handles graph point generation
///////////////////////////

function drawGraph() {
    let P = principal.getValue();
    let monthly = monthlyContribution.getValue();
    let annualrate = rate.getValue() / 100;
    let n = Number(frequency.value);
    let t = years.getValue();

    let totalperiods = Math.round(n * t);
    let periodrate = annualrate / n;
    let periodcontribution = (monthly * 12) / n;

    let balance = P;
    let totalcontributed = P;

    let points = [];
    points.push([[balance], [totalcontributed]]);

    for (let period = 1; period <= totalperiods; period++) {
        balance = balance * (1 + periodrate) + periodcontribution;
        totalcontributed += periodcontribution;
        if (period % n === 0 || period === totalperiods) {
            points.push([[balance], [totalcontributed]]);
        }
    }

    let finalbalance = balance;
    let totalinterest = finalbalance - totalcontributed;

    document.getElementById("futurevalue").innerHTML = "$" + (Math.round(finalbalance * 100) / 100).toLocaleString('en-US');
    document.getElementById("totalcontributed").innerHTML = "$" + (Math.round(totalcontributed * 100) / 100).toLocaleString('en-US');
    document.getElementById("totalinterestearned").innerHTML = "$" + (Math.round(totalinterest * 100) / 100).toLocaleString('en-US');
    document.getElementById("interestaspercentofbalance").innerHTML = ((totalinterest / finalbalance) * 100).toFixed(1) + "%";

    myGraph.setStepSize(1);
    myGraph.setxlabeloffset(0);
    myGraph.setPoints(points);
}
drawGraph();