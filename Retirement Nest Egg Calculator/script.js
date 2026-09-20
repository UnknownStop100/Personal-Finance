import { createHeader } from "../Header/script.js";
import { createFooter } from "../Footer/script.js";
import { titleGenerator } from "../Calculator Title/script.js";
import { createPageLayout } from "../Page Layout/script.js";
import { Input } from "../Modules/Input/input.js";
import { output } from "../Modules/Output/Output/script.js";
import { SuperGraph } from "../Modules/Output/Graph/supergraph.js";

const body = document.querySelector("body");
const header = createHeader();
const footer = createFooter();
const title = titleGenerator(
    "Finance calculator",
    "Retirement Nest Egg Calculator",
    "Project your retirement savings and see if they'll cover your desired retirement income."
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

const nestEgg = output("Nest Egg at Retirement");
const totalContributions = output("Total Contributions");
const sustainableIncome = output("Sustainable Annual Income");
const incomeGap = output("Income Gap");
const outputContainer = document.getElementById("output");
outputContainer.append(nestEgg);
outputContainer.append(totalContributions);
outputContainer.append(sustainableIncome);
outputContainer.append(incomeGap);

///////////////////////////
//handles inputs
///////////////////////////

let currentAge = new Input(18, 90, inputsContainer, "Current age", 30, "", "yrs", updateFields);
inputsContainer.appendChild(document.createElement("br"));
let retireAge = new Input(19, 95, inputsContainer, "Retirement age", 65, "", "yrs", updateFields);
inputsContainer.appendChild(document.createElement("br"));
let currentSavings = new Input(0, 100000000, inputsContainer, "Current retirement savings", 40000, "$", "", updateFields);
inputsContainer.appendChild(document.createElement("br"));
let monthlyContribution = new Input(0, 1000000, inputsContainer, "Monthly contribution", 500, "$", "", updateFields);
inputsContainer.appendChild(document.createElement("br"));
let annualReturn = new Input(0, 20, inputsContainer, "Expected annual return", 7, "", "%", updateFields);
inputsContainer.appendChild(document.createElement("br"));
let desiredIncome = new Input(0, 5000000, inputsContainer, "Desired annual retirement income", 60000, "$", "", updateFields);
inputsContainer.appendChild(document.createElement("br"));
let withdrawalRate = new Input(1, 10, inputsContainer, "Safe withdrawal rate", 4, "", "%", updateFields);
inputsContainer.appendChild(document.createElement("br"));

const myGraph = new SuperGraph({
    divId: 'canvas-div',
    points: [],
    graphtitles: ["Nest Egg Balance", "Total Contributions", "Investment Growth"],
    xLabel: 'Years',
    parent: document.getElementById("main-calculator"),
    stepsize: 12,
    xlabeloffset: currentAge.getValue()
});

function updateFields() {
    drawGraph();
}

///////////////////////////
//handles graph point generation
///////////////////////////

let actualpoints = function (monthlyRate, months, startingBalance, monthlyContrib) {
    let points = [];
    for (let i = 0; i < months + 1; i++) {
        points.push([[], [], []]);
    }
    let balance = startingBalance;
    let contributed = startingBalance;
    points[0][0].push(balance);
    points[0][1].push(contributed);
    points[0][2].push(balance - contributed);
    for (let i = 0; i < months; i++) {
        points[i + 1][0].push(balance);
        points[i + 1][1].push(contributed);
        points[i + 1][2].push(balance - contributed);
        balance *= (1 + monthlyRate);
        balance += monthlyContrib;
        contributed += monthlyContrib;
        points[i + 1][0].push(balance);
        points[i + 1][1].push(contributed);
        points[i + 1][2].push(balance - contributed);
    }
    return points;
};

function drawGraph() {
    let currentage = currentAge.getValue();
    let retireage = retireAge.getValue();
    let currentsavings = currentSavings.getValue();
    let monthlycontribution = monthlyContribution.getValue();
    let annualreturn = annualReturn.getValue();
    let desiredincome = desiredIncome.getValue();
    let withdrawalrate = withdrawalRate.getValue();
    myGraph.setxlabeloffset(currentage);

    let yearstoretirement = retireage - currentage;
    let months = yearstoretirement * 12;
    let monthlyreturnrate = annualreturn / 1200;

    let nestegg = currentsavings * (1 + monthlyreturnrate) ** months
        + monthlycontribution * (((1 + monthlyreturnrate) ** months - 1) / monthlyreturnrate);
    let totalcontributions = currentsavings + monthlycontribution * months;
    let sustainableincome = nestegg * (withdrawalrate / 100);
    let incomegap = sustainableincome - desiredincome;

    document.getElementById("nesteggatretirement").innerHTML = "$" + (Math.round(nestegg * 100) / 100).toLocaleString('en-US');
    document.getElementById("totalcontributions").innerHTML = "$" + (Math.round(totalcontributions * 100) / 100).toLocaleString('en-US');
    document.getElementById("sustainableannualincome").innerHTML = "$" + (Math.round(sustainableincome * 100) / 100).toLocaleString('en-US');
    document.getElementById("incomegap").innerHTML = (incomegap >= 0 ? "+$" : "-$") + (Math.round(Math.abs(incomegap) * 100) / 100).toLocaleString('en-US');

    myGraph.setStepSize(12);
    let points = actualpoints(monthlyreturnrate, months, currentsavings, monthlycontribution);
    myGraph.setPoints(points);
}
drawGraph();

const mainarticle = document.getElementById("mainarticle");
mainarticle.innerHTML = `
  <p class="eyebrow">Retirement savings guide</p>
  <h2>How to estimate your retirement nest egg</h2>
  <p>A retirement nest egg is the total savings and investments you'll rely on for income once you stop working. Estimating it means projecting your current balance and future contributions forward using an assumed rate of investment return.</p>
  <h3>The safe withdrawal rate</h3>
  <p>A safe withdrawal rate is the percentage of your retirement savings you can withdraw each year with a low risk of running out of money over a typical retirement. A commonly cited starting point is 4%, though the right rate depends on your time horizon and risk tolerance.</p>
  <h3>Why time in the market matters</h3>
  <p>Retirement contributions made earlier have more years to compound, so starting even small monthly contributions early can have an outsized effect on your final balance compared to saving more later.</p>
  <h3>Closing a retirement savings gap</h3>
  <p>If your projected sustainable income falls short of your goal, the main levers are increasing monthly contributions, working and saving for additional years, or adjusting your target retirement income.</p>
`;