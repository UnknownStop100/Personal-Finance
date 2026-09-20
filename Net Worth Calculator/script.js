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
    "Net Worth Calculator",
    "Add up what you own and what you owe to see your total net worth."
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

function heading(text) {
    const h = document.createElement("p");
    h.className = "field-group-heading";
    inputsContainer.appendChild(h);
    h.textContent = text;
}

const netWorthOut = output("Net Worth");
const totalAssetsOut = output("Total Assets");
const totalLiabilitiesOut = output("Total Liabilities");
let outputvalues = document.getElementById("output");
outputvalues.append(netWorthOut);
outputvalues.append(totalAssetsOut);
outputvalues.append(totalLiabilitiesOut);

///////////////////////////
//handles inputs
///////////////////////////

heading("Assets");
let cash = new Input(0, 100000000, inputsContainer, "Cash & bank accounts", 15000, "$", "", updateFields);
inputsContainer.appendChild(document.createElement("br"));
let investments = new Input(0, 100000000, inputsContainer, "Investment accounts", 25000, "$", "", updateFields);
inputsContainer.appendChild(document.createElement("br"));
let retirement = new Input(0, 100000000, inputsContainer, "Retirement accounts", 60000, "$", "", updateFields);
inputsContainer.appendChild(document.createElement("br"));
let realEstate = new Input(0, 100000000, inputsContainer, "Real estate value", 400000, "$", "", updateFields);
inputsContainer.appendChild(document.createElement("br"));
let vehicles = new Input(0, 10000000, inputsContainer, "Vehicles", 18000, "$", "", updateFields);
inputsContainer.appendChild(document.createElement("br"));
let otherAssets = new Input(0, 100000000, inputsContainer, "Other assets", 0, "$", "", updateFields);
inputsContainer.appendChild(document.createElement("br"));

heading("Liabilities");
let mortgageBalance = new Input(0, 100000000, inputsContainer, "Mortgage balance", 280000, "$", "", updateFields);
inputsContainer.appendChild(document.createElement("br"));
let autoLoans = new Input(0, 10000000, inputsContainer, "Auto loans", 9000, "$", "", updateFields);
inputsContainer.appendChild(document.createElement("br"));
let studentLoans = new Input(0, 10000000, inputsContainer, "Student loans", 12000, "$", "", updateFields);
inputsContainer.appendChild(document.createElement("br"));
let creditCardDebt = new Input(0, 10000000, inputsContainer, "Credit card debt", 2500, "$", "", updateFields);
inputsContainer.appendChild(document.createElement("br"));
let otherLiabilities = new Input(0, 100000000, inputsContainer, "Other liabilities", 0, "$", "", updateFields);
inputsContainer.appendChild(document.createElement("br"));

const myGraph = new SuperGraph({
    divId: 'canvas-div',
    points: [],
    graphtitles: ["Assets", "Liabilities"],
    xLabel: '',
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
    let totalassets =
        cash.getValue() +
        investments.getValue() +
        retirement.getValue() +
        realEstate.getValue() +
        vehicles.getValue() +
        otherAssets.getValue();

    let totalliabilities =
        mortgageBalance.getValue() +
        autoLoans.getValue() +
        studentLoans.getValue() +
        creditCardDebt.getValue() +
        otherLiabilities.getValue();

    let networth = totalassets - totalliabilities;

    document.getElementById("networth").innerHTML = "$" + (Math.round(networth * 100) / 100).toLocaleString('en-US');
    document.getElementById("totalassets").innerHTML = "$" + (Math.round(totalassets * 100) / 100).toLocaleString('en-US');
    document.getElementById("totalliabilities").innerHTML = "$" + (Math.round(totalliabilities * 100) / 100).toLocaleString('en-US');

    // Two flat-line series so assets vs. liabilities are visually comparable
    let points = [
        [[totalassets], [totalliabilities]],
        [[totalassets], [totalliabilities]]
    ];
    myGraph.setStepSize(1);
    myGraph.setPoints(points);
}
drawGraph();

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