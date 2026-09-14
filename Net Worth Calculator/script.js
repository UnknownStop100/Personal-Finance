import { createHeader } from "../Header/script.js";
import { createFooter } from "../Footer/script.js";
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
    "Net Worth Calculator",
    "Add up what you own and what you owe to see your total net worth."
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

function heading(text) {
    const h = document.createElement("p");
    h.className = "field-group-heading";
    h.textContent = text;
    inputs.appendChild(h);
}

heading("Assets");
const cash = numberInput(0, 100000000, inputs, "Cash & bank accounts", 15000, "$", "", calculate);
const investments = numberInput(0, 100000000, inputs, "Investment accounts", 25000, "$", "", calculate);
const retirement = numberInput(0, 100000000, inputs, "Retirement accounts", 60000, "$", "", calculate);
const realEstate = numberInput(0, 100000000, inputs, "Real estate value", 400000, "$", "", calculate);
const vehicles = numberInput(0, 10000000, inputs, "Vehicles", 18000, "$", "", calculate);
const otherAssets = numberInput(0, 100000000, inputs, "Other assets", 0, "$", "", calculate);

heading("Liabilities");
const mortgageBalance = numberInput(0, 100000000, inputs, "Mortgage balance", 280000, "$", "", calculate);
const autoLoans = numberInput(0, 10000000, inputs, "Auto loans", 9000, "$", "", calculate);
const studentLoans = numberInput(0, 10000000, inputs, "Student loans", 12000, "$", "", calculate);
const creditCardDebt = numberInput(0, 10000000, inputs, "Credit card debt", 2500, "$", "", calculate);
const otherLiabilities = numberInput(0, 100000000, inputs, "Other liabilities", 0, "$", "", calculate);

const netWorthOut = output("Net Worth");
const totalAssetsOut = output("Total Assets");
const totalLiabilitiesOut = output("Total Liabilities");
let outputvalues = document.getElementById("output");
outputvalues.append(netWorthOut);
outputvalues.append(totalAssetsOut);
outputvalues.append(totalLiabilitiesOut);

let points = [];
let value = 0;

const myGraph = new Graph({ divId: 'canvas-div', points: points, xLabel: '', parent: document.getElementById("main-calculator"), stepsize: 1 });

function calculate() {
    let totalassets =
        Number(cash.value.replaceAll(",","")) +
        Number(investments.value.replaceAll(",","")) +
        Number(retirement.value.replaceAll(",","")) +
        Number(realEstate.value.replaceAll(",","")) +
        Number(vehicles.value.replaceAll(",","")) +
        Number(otherAssets.value.replaceAll(",",""));

    let totalliabilities =
        Number(mortgageBalance.value.replaceAll(",","")) +
        Number(autoLoans.value.replaceAll(",","")) +
        Number(studentLoans.value.replaceAll(",","")) +
        Number(creditCardDebt.value.replaceAll(",","")) +
        Number(otherLiabilities.value.replaceAll(",",""));

    let networth = totalassets - totalliabilities;

    document.getElementById("networth").innerHTML = "$" + (Math.round(networth * 100) / 100).toLocaleString('en-US');
    document.getElementById("totalassets").innerHTML = "$" + (Math.round(totalassets * 100) / 100).toLocaleString('en-US');
    document.getElementById("totalliabilities").innerHTML = "$" + (Math.round(totalliabilities * 100) / 100).toLocaleString('en-US');

    points = [totalliabilities, totalassets];
    myGraph.setPoints(points);
    myGraph.setStepSize(1);
}
calculate();

const mainarticle = document.getElementById("mainarticle");
mainarticle.innerHTML = `
  <p class="eyebrow">About this calculator</p>
  <h2>Calculate your total net worth</h2>
  <p>This net worth calculator adds up your assets, like cash, investments, retirement accounts, real estate, and vehicles, and subtracts your liabilities, like mortgages, loans, and credit card debt, to give you a single net worth figure.</p>
  <p class="eyebrow">Net worth guide</p>
  <h2>How net worth is calculated</h2>
  <p>Net worth is calculated as total assets minus total liabilities. Assets are everything you own that has monetary value, while liabilities are everything you owe.</p>
  <h3>What counts as an asset</h3>
  <p>Common assets include cash and bank balances, brokerage and investment accounts, retirement accounts like a 401(k) or IRA, the market value of real estate, and vehicles.</p>
  <h3>What counts as a liability</h3>
  <p>Common liabilities include mortgage balances, auto loans, student loans, credit card balances, and any other outstanding debt.</p>
  <h3>Why tracking net worth over time matters</h3>
  <p>A single net worth snapshot is useful, but tracking it monthly or yearly shows whether your overall financial position is improving, which can matter more than any one account balance.</p>
`;