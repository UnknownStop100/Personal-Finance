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
    "Inflation Impact Calculator",
    "See how inflation erodes purchasing power over time, and what today's money will really be worth."
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

const currentAmount = numberInput(0, 1000000000, inputs, "Amount today", 10000, "$", "", calculate);
const inflationRate = numberInput(0, 30, inputs, "Annual inflation rate", 3, "", "%", calculate);
const years = numberInput(1, 60, inputs, "Years from now", 20, "", "yrs", calculate);

const purchasingPowerFuture = output("Purchasing Power In The Future");
const purchasingPowerLostOut = output("Purchasing Power Lost");
const percentLostOut = output("Percent Lost");
const amountToMatchToday = output("Amount Needed To Match Today");
let outputvalues = document.getElementById("output");
outputvalues.append(purchasingPowerFuture);
outputvalues.append(purchasingPowerLostOut);
outputvalues.append(percentLostOut);
outputvalues.append(amountToMatchToday);

let points = [];
let value = 10000;

const myGraph = new Graph({ divId: 'canvas-div', points: points, xLabel: 'Years', parent: document.getElementById("main-calculator"), stepsize: 1 });

function calculate() {
    let amount = Number(currentAmount.value.replaceAll(",",""));
    let rate = Number(inflationRate.value.replaceAll(",","")) / 100;
    let t = Number(years.value.replaceAll(",",""));

    let futureequivalent = amount / (1 + rate) ** t;
    let purchasingpowerlost = amount - futureequivalent;
    let percentlost = amount > 0 ? (purchasingpowerlost / amount) * 100 : 0;
    let amounttomatchtoday = amount * (1 + rate) ** t;

    document.getElementById("purchasingpowerinthefuture").innerHTML = "$" + (Math.round(futureequivalent * 100) / 100).toLocaleString('en-US');
    document.getElementById("purchasingpowerlost").innerHTML = "$" + (Math.round(purchasingpowerlost * 100) / 100).toLocaleString('en-US');
    document.getElementById("percentlost").innerHTML = percentlost.toFixed(1) + "%";
    document.getElementById("amountneededtomatchtoday").innerHTML = "$" + (Math.round(amounttomatchtoday * 100) / 100).toLocaleString('en-US');

    points = [];
    for (let year = 0; year <= t; year++) {
        points.push(amount / (1 + rate) ** year);
    }
    myGraph.setPoints(points);
    myGraph.setStepSize(1);
}
calculate();

const mainarticle = document.getElementById("mainarticle");
mainarticle.innerHTML = `
  <p class="eyebrow">About this calculator</p>
  <h2>Calculate the impact of inflation on your money</h2>
  <p>This inflation calculator shows how much purchasing power a given amount of money loses over time at a chosen annual inflation rate, and what amount you'd need in the future to match today's buying power.</p>
  <p class="eyebrow">Inflation guide</p>
  <h2>How inflation affects purchasing power</h2>
  <p>Inflation is the rate at which prices for goods and services rise over time, which reduces how much a fixed amount of money can buy in the future compared to today.</p>
  <h3>Real vs. nominal value</h3>
  <p>Nominal value is the face amount of money, while real value adjusts for inflation to reflect actual purchasing power. A dollar amount that stays the same in nominal terms still loses real value every year inflation is positive.</p>
  <h3>Why inflation matters for savings and planning</h3>
  <p>Cash sitting in a low-interest account can lose purchasing power over time if its interest rate is lower than the inflation rate, which is why long-term financial goals like retirement often need to account for inflation-adjusted returns.</p>
  <h3>Historical inflation context</h3>
  <p>Inflation rates vary by year and country; this calculator lets you test different assumed rates to see how sensitive your long-term purchasing power is to higher or lower inflation.</p>
`;