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
    "Car Affordability Calculator",
    "Figure out how much car you can afford based on your take-home pay, down payment, and loan terms."
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

const maxCarPriceOut = output("Max Affordable Car Price");
const maxMonthlyPayment = output("Max Monthly Payment");
const maxLoanAmount = output("Max Loan Amount");
const downPlusTradeIn = output("Down Payment Plus Trade-In");
let outputvalues = document.getElementById("output");
outputvalues.append(maxCarPriceOut);
outputvalues.append(maxMonthlyPayment);
outputvalues.append(maxLoanAmount);
outputvalues.append(downPlusTradeIn);

///////////////////////////
//handles inputs
///////////////////////////

let monthlyIncome = new Input(0, 1000000, inputsContainer, "Monthly take-home pay", 5000, "$", "", updateFields);
inputsContainer.appendChild(document.createElement("br"));
let targetPct = new Input(1, 50, inputsContainer, "Target % of income for car payment", 15, "", "%", updateFields);
inputsContainer.appendChild(document.createElement("br"));
let downPayment = new Input(0, 1000000, inputsContainer, "Down payment", 3000, "$", "", updateFields);
inputsContainer.appendChild(document.createElement("br"));
let tradeIn = new Input(0, 1000000, inputsContainer, "Trade-in value", 0, "$", "", updateFields);
inputsContainer.appendChild(document.createElement("br"));
let loanTermMonths = new Input(12, 96, inputsContainer, "Loan term", 60, "", "mo", updateFields);
inputsContainer.appendChild(document.createElement("br"));
let interestRate = new Input(0, 25, inputsContainer, "Interest rate (APR)", 7, "", "%", updateFields);
inputsContainer.appendChild(document.createElement("br"));

const myGraph = new SuperGraph({
    divId: 'canvas-div',
    points: [],
    graphtitles: ["Remaining Balance", "Principal Paid", "Interest Paid"],
    xLabel: 'Months',
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
    let income = monthlyIncome.getValue();
    let targetpct = targetPct.getValue();
    let maxpayment = income * (targetpct / 100);
    let down = downPayment.getValue();
    let trade = tradeIn.getValue();
    let n = loanTermMonths.getValue();
    let interestrate = interestRate.getValue();
    let monthlyrate = interestrate / 100 / 12;

    let maxloan;
    if (monthlyrate === 0) {
        maxloan = maxpayment * n;
    } else {
        maxloan = (maxpayment * (1 - (1 + monthlyrate) ** -n)) / monthlyrate;
    }
    if (!isFinite(maxloan)) maxloan = 0;

    let maxcarprice = maxloan + down + trade;

    document.getElementById("maxaffordablecarprice").innerHTML = "$" + (Math.round(maxcarprice * 100) / 100).toLocaleString('en-US');
    document.getElementById("maxmonthlypayment").innerHTML = "$" + (Math.round(maxpayment * 100) / 100).toLocaleString('en-US');
    document.getElementById("maxloanamount").innerHTML = "$" + (Math.round(maxloan * 100) / 100).toLocaleString('en-US');
    document.getElementById("downpaymentplustradein").innerHTML = "$" + (Math.round((down + trade) * 100) / 100).toLocaleString('en-US');

    let points = [];
    let balance = maxloan;
    let cumulativeprincipal = 0;
    let cumulativeinterest = 0;
    for (let m = 0; m <= n; m++) {
        points.push([[Math.max(balance, 0)], [cumulativeprincipal], [cumulativeinterest]]);
        if (balance > 0) {
            let interestportion = balance * monthlyrate;
            let principalportion = Math.min(maxpayment - interestportion, balance);
            balance -= principalportion;
            cumulativeprincipal += principalportion;
            cumulativeinterest += interestportion;
        }
    }

    myGraph.setStepSize(1);
    myGraph.setxlabeloffset(0);
    myGraph.setPoints(points);
}
drawGraph();

const mainarticle = document.getElementById("mainarticle");
mainarticle.innerHTML = `
  <p class="eyebrow">About this calculator</p>
  <h2>Figure out how much car you can afford</h2>
  <p>This car affordability calculator estimates the maximum car price you can afford based on a target percentage of your monthly take-home pay, your down payment, trade-in value, and loan terms.</p>
  <p class="eyebrow">Car affordability guide</p>
  <h2>How much of your income should go to a car payment</h2>
  <p>A common budgeting guideline caps total vehicle costs, including payment, insurance, and fuel, at around 15-20% of monthly take-home pay, with the loan payment itself typically well under that.</p>
  <h3>How the max loan amount is calculated</h3>
  <p>Once you set a target monthly payment, the calculator works backward using the loan term and interest rate to find the largest loan amount that keeps payments at or below that target, then adds your down payment and trade-in value to get a max car price.</p>
  <h3>Down payment and trade-in value</h3>
  <p>A larger down payment or trade-in value increases the total price you can afford without raising your monthly payment, since less of the purchase needs to be financed.</p>
  <h3>Loan term trade-offs</h3>
  <p>A longer loan term lowers the monthly payment and raises the max price you can technically afford, but it also means paying more total interest and can leave you owing more than the car is worth for longer.</p>
`;