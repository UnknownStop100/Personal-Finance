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
    "Debt Payoff Calculator",
    "Compare the snowball (smallest balance first) and avalanche (highest rate first) methods to see which gets you debt-free faster and cheaper."
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

const debtInputs = [1, 2, 3, 4].map((i) => {
    const heading = document.createElement("p");
    heading.className = "field-group-heading";
    heading.textContent = `Debt ${i}`;
    inputs.appendChild(heading);
    return {
        balance: numberInput(0, 1000000, inputs, "Balance", i === 1 ? 4000 : 0, "$", "", calculate),
        rate: numberInput(0, 40, inputs, "Interest rate (APR)", i === 1 ? 22 : 0, "", "%", calculate),
        minPayment: numberInput(0, 100000, inputs, "Minimum payment", i === 1 ? 100 : 0, "$", "", calculate),
    };
});

const extraPayment = numberInput(0, 100000, inputs, "Extra monthly payment toward debt", 200, "$", "", calculate);

const totalDebt = output("Total Debt");
const snowballPayoffTime = output("Snowball Payoff Time");
const avalanchePayoffTime = output("Avalanche Payoff Time");
const interestSaved = output("Avalanche Interest Savings");
let outputvalues = document.getElementById("output");
outputvalues.append(totalDebt);
outputvalues.append(snowballPayoffTime);
outputvalues.append(avalanchePayoffTime);
outputvalues.append(interestSaved);

let points = [];
let value = 4000;

const myGraph = new Graph({ divId: 'canvas-div', points: points, xLabel: 'Years', parent: document.getElementById("main-calculator"), stepsize: 12 });

function simulate(debts, extra, strategy) {
    let working = debts.map((d) => ({ ...d }));
    let month = 0;
    let totalInterest = 0;
    const balancePoints = [working.reduce((s, d) => s + d.balance, 0)];

    while (working.some((d) => d.balance > 0.005) && month < 1200) {
        month++;
        let extraAvailable = extra;

        working.forEach((d) => {
            if (d.balance <= 0) return;
            const interest = (d.balance * (d.rate / 100)) / 12;
            totalInterest += interest;
            d.balance += interest;
            const pay = Math.min(d.minPayment, d.balance);
            d.balance -= pay;
        });

        const order = [...working]
            .filter((d) => d.balance > 0.005)
            .sort((a, b) =>
                strategy === "snowball" ? a.balance - b.balance : b.rate - a.rate
            );

        for (const d of order) {
            if (extraAvailable <= 0) break;
            const pay = Math.min(extraAvailable, d.balance);
            d.balance -= pay;
            extraAvailable -= pay;
        }

        if (month % 12 === 0 || working.every((d) => d.balance <= 0.005)) {
            balancePoints.push(Math.max(working.reduce((s, d) => s + d.balance, 0), 0));
        }
    }

    return { months: month, totalInterest, balancePoints };
}

function calculate() {
    let debts = debtInputs
        .map((d) => ({
            balance: Number(d.balance.value.replaceAll(",","")),
            rate: Number(d.rate.value.replaceAll(",","")),
            minPayment: Number(d.minPayment.value.replaceAll(",","")),
        }))
        .filter((d) => d.balance > 0);

    let extra = Number(extraPayment.value.replaceAll(",",""));

    if (debts.length === 0) {
        document.getElementById("totaldebt").innerHTML = "$0";
        document.getElementById("snowballpayofftime").innerHTML = "—";
        document.getElementById("avalanchepayofftime").innerHTML = "—";
        document.getElementById("avalancheinterestsavings").innerHTML = "$0";
        myGraph.setPoints([0]);
        myGraph.setStepSize(1);
        return;
    }

    const snowball = simulate(debts, extra, "snowball");
    const avalanche = simulate(debts, extra, "avalanche");
    const totalStartingBalance = debts.reduce((s, d) => s + d.balance, 0);
    const interestsavings = snowball.totalInterest - avalanche.totalInterest;

    document.getElementById("totaldebt").innerHTML = "$" + (Math.round(totalStartingBalance * 100) / 100).toLocaleString('en-US');
    document.getElementById("snowballpayofftime").innerHTML = Math.floor(snowball.months / 12) + " yr " + (snowball.months % 12) + " mo";
    document.getElementById("avalanchepayofftime").innerHTML = Math.floor(avalanche.months / 12) + " yr " + (avalanche.months % 12) + " mo";
    document.getElementById("avalancheinterestsavings").innerHTML = (interestsavings >= 0 ? "$" : "-$") + (Math.round(Math.abs(interestsavings) * 100) / 100).toLocaleString('en-US');

    myGraph.setPoints(avalanche.balancePoints);
    myGraph.setStepSize(1);
}
calculate();

const mainarticle = document.getElementById("mainarticle");
mainarticle.innerHTML = `
  <p class="eyebrow">About this calculator</p>
  <h2>Compare debt snowball vs. debt avalanche</h2>
  <p>This debt payoff calculator simulates paying down up to four debts using the snowball method (smallest balance first) and the avalanche method (highest interest rate first), so you can see which gets you debt-free faster and which saves more in interest.</p>
  <p class="eyebrow">Debt payoff guide</p>
  <h2>Debt snowball vs. debt avalanche method</h2>
  <p>Both strategies pay the minimum on every debt, then direct any extra payment toward one target debt at a time. They differ only in which debt gets that extra payment first.</p>
  <h3>The debt snowball method</h3>
  <p>The snowball method targets the smallest balance first, regardless of interest rate. Paying off a full balance quickly can build momentum and motivation, which helps some people stick with a payoff plan.</p>
  <h3>The debt avalanche method</h3>
  <p>The avalanche method targets the highest interest rate first. Because it eliminates the most expensive debt fastest, it typically results in less total interest paid over the full payoff period.</p>
  <h3>Which method should you choose</h3>
  <p>Avalanche usually saves more money mathematically, while snowball can be easier to stay motivated with. Many people choose based on which approach they're more likely to stick with consistently.</p>
`;