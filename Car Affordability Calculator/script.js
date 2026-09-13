import { createHeader } from "/Header/script.js";
import { createFooter } from "/Footer/script.js";
import { titleGenerator } from "../Calculator Title/script.js";
import { createPageLayout } from "../Page Layout/script.js";
import { numberInput } from "../Modules/Input/input.js";
import { output } from "../Modules/Output/Output/script.js";
import { Graph } from "../Modules/Output/Graph/graph.js";

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

const monthlyIncome = numberInput(0, 1000000, inputs, "Monthly take-home pay", 5000, "$", "", calculate);
const targetPct = numberInput(1, 50, inputs, "Target % of income for car payment", 15, "", "%", calculate);
const downPayment = numberInput(0, 1000000, inputs, "Down payment", 3000, "$", "", calculate);
const tradeIn = numberInput(0, 1000000, inputs, "Trade-in value", 0, "$", "", calculate);
const loanTermMonths = numberInput(12, 96, inputs, "Loan term", 60, "", "mo", calculate);
const interestRate = numberInput(0, 25, inputs, "Interest rate (APR)", 7, "", "%", calculate);

const maxCarPriceOut = output("Max Affordable Car Price");
const maxMonthlyPayment = output("Max Monthly Payment");
const maxLoanAmount = output("Max Loan Amount");
const downPlusTradeIn = output("Down Payment Plus Trade-In");
let outputvalues = document.getElementById("output");
outputvalues.append(maxCarPriceOut);
outputvalues.append(maxMonthlyPayment);
outputvalues.append(maxLoanAmount);
outputvalues.append(downPlusTradeIn);

let points = [];
let value = 0;

const myGraph = new Graph({ divId: 'canvas-div', points: points, xLabel: 'Months', parent: document.getElementById("main-calculator"), stepsize: 1 });

function calculate() {
    let income = Number(monthlyIncome.value.replaceAll(",",""));
    let targetpct = Number(targetPct.value.replaceAll(",",""));
    let maxpayment = income * (targetpct / 100);
    let down = Number(downPayment.value.replaceAll(",",""));
    let trade = Number(tradeIn.value.replaceAll(",",""));
    let n = Number(loanTermMonths.value.replaceAll(",",""));
    let interestrate = Number(interestRate.value.replaceAll(",",""));
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

    points = [];
    let balance = maxloan;
    for (let m = 0; m <= n; m++) {
        points.push(Math.max(balance, 0));
        let interestportion = balance * monthlyrate;
        let principalportion = Math.min(maxpayment - interestportion, balance);
        balance -= principalportion;
    }
    myGraph.setPoints(points);
    myGraph.setStepSize(1);
}
calculate();

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