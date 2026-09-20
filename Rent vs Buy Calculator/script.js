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
    "Rent vs. Buy Calculator",
    "Compare the total cost of renting versus buying a home over time."
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

const netCostRenting = output("Net Cost of Renting");
const netCostBuying = output("Net Cost of Buying");
const cashNeededToBuy = output("Cash Needed to Buy");
const cheaperOption = output("Cheaper Option");
let outputvalues = document.getElementById("output");
outputvalues.append(netCostRenting);
outputvalues.append(netCostBuying);
outputvalues.append(cashNeededToBuy);
outputvalues.append(cheaperOption);

///////////////////////////
//handles inputs
///////////////////////////

let monthlyRent = new Input(0, 200000, inputsContainer, "Monthly rent", 2200, "$", "", updateFields);
inputsContainer.appendChild(document.createElement("br"));
let rentIncrease = new Input(0, 20, inputsContainer, "Annual rent increase", 3, "", "%", updateFields);
inputsContainer.appendChild(document.createElement("br"));
let homePrice = new Input(0, 20000000, inputsContainer, "Home price", 450000, "$", "", updateFields);
inputsContainer.appendChild(document.createElement("br"));
let downPaymentPct = new Input(0, 100, inputsContainer, "Down payment", 20, "", "%", updateFields);
inputsContainer.appendChild(document.createElement("br"));
let mortgageRate = new Input(0, 25, inputsContainer, "Mortgage rate", 6.5, "", "%", updateFields);
inputsContainer.appendChild(document.createElement("br"));
let loanTerm = new Input(1, 40, inputsContainer, "Loan term", 30, "", "yrs", updateFields);
inputsContainer.appendChild(document.createElement("br"));
let propertyTaxRate = new Input(0, 10, inputsContainer, "Property tax rate", 1.1, "", "%", updateFields);
inputsContainer.appendChild(document.createElement("br"));
let maintenanceRate = new Input(0, 10, inputsContainer, "Annual maintenance", 1, "", "%", updateFields);
inputsContainer.appendChild(document.createElement("br"));
let appreciationRate = new Input(0, 15, inputsContainer, "Annual home appreciation", 3, "", "%", updateFields);
inputsContainer.appendChild(document.createElement("br"));
let closingCostPct = new Input(0, 15, inputsContainer, "Closing costs", 3, "", "%", updateFields);
inputsContainer.appendChild(document.createElement("br"));
let sellingCostPct = new Input(0, 15, inputsContainer, "Selling costs", 6, "", "%", updateFields);
inputsContainer.appendChild(document.createElement("br"));
let yearsToCompare = new Input(1, 40, inputsContainer, "Years to compare", 10, "", "yrs", updateFields);
inputsContainer.appendChild(document.createElement("br"));

const myGraph = new SuperGraph({
    divId: 'canvas-div',
    points: [],
    graphtitles: ["Net Cost of Buying", "Net Cost of Renting"],
    xLabel: 'Years',
    parent: document.getElementById("main-calculator"),
    stepsize: 1,
    xlabeloffset: 1
});

function updateFields() {
    drawGraph();
}

///////////////////////////
//handles graph point generation
///////////////////////////

function drawGraph() {// Calculate initial home price and loan details
    let price = homePrice.getValue();
    let downpct = downPaymentPct.getValue() / 100;
    let down = price * downpct;
    let loanamount = price - down;
    let monthlyratem = mortgageRate.getValue() / 100 / 12;
    let n = loanTerm.getValue() * 12;

    // Calculate monthly mortgage payment
    let loanprice = loanamount * monthlyratem * Math.pow(1 + monthlyratem, n) /
        (Math.pow(1 + monthlyratem, n) - 1);

    let years = yearsToCompare.getValue();
    let closingcosts = price * (closingCostPct.getValue() / 100);
    let rentincrease = rentIncrease.getValue();
    let propertytaxrate = propertyTaxRate.getValue();
    let maintenancerate = maintenanceRate.getValue();
    let appreciationrate = appreciationRate.getValue();
    let sellingcostpct = sellingCostPct.getValue();

    let rent = monthlyRent.getValue();
    let homevalue = price;

    // Initialize accumulators
    let rentcost = 0;
    let buycost = homevalue * downpct + closingcosts;

    let points = [];

    for (let year = 0; year < years - 1; year++) {
        // Selling cost if you sold at this point in time, based on current home value
        let sellingcosts = homevalue * (sellingcostpct / 100);

        // Store current costs for plotting
        points.push([[buycost + sellingcosts], [rentcost]]);

        // Monthly rent cost
        rentcost += rent * 12;

        // Rent increase for next year
        rent *= 1 + rentincrease / 100;

        // Property tax
        buycost += homevalue * (propertytaxrate / 100);

        // Maintenance
        buycost += homevalue * (maintenancerate / 100);

        // Mortgage payment
        if(year < loanTerm.getValue()) {
            buycost += loanprice * 12;
        }

        // Increase home value
        homevalue *= 1 + appreciationrate / 100;
    }
    let buyingwins = buycost < rentcost;

    document.getElementById("netcostofrenting").innerHTML = "$" + (Math.round(rentcost * 100) / 100).toLocaleString('en-US');
    document.getElementById("netcostofbuying").innerHTML = "$" + (Math.round(buycost * 100) / 100).toLocaleString('en-US');
    document.getElementById("cashneededtobuy").innerHTML = "$" + (Math.round((down + closingcosts) * 100) / 100).toLocaleString('en-US');
    document.getElementById("cheaperoption").innerHTML = buyingwins ? "Buying" : "Renting";

    myGraph.setStepSize(1);
    myGraph.setxlabeloffset(1);
    myGraph.setPoints(points);
}
drawGraph();

const mainarticle = document.getElementById("mainarticle");
mainarticle.innerHTML = `
  <p class="eyebrow">About this calculator</p>
  <h2>Compare the cost of renting vs. buying a home</h2>
  <p>This rent vs. buy calculator compares the total net cost of renting against buying a home over a set number of years, factoring in mortgage payments, taxes, maintenance, appreciation, and selling costs.</p>
  <p class="eyebrow">Rent vs. buy guide</p>
  <h2>How to compare renting and buying</h2>
  <p>Comparing renting and buying isn't just about monthly payment size. Buying builds home equity and can benefit from appreciation, but comes with upfront closing costs, ongoing maintenance, property taxes, and eventual selling costs if you move.</p>
  <h3>Why the comparison changes over time</h3>
  <p>Buying tends to look more expensive in the first few years, when closing costs and low equity dominate, and more favorable the longer you stay, as rent payments accumulate with no equity while mortgage payments build ownership.</p>
  <h3>Key assumptions that drive the answer</h3>
  <p>Home appreciation rate, mortgage interest rate, and how long you plan to stay in the home are usually the biggest factors in whether renting or buying comes out ahead financially.</p>
  <h3>Renting isn't "wasting money"</h3>
  <p>Renting avoids maintenance costs, property taxes, and the risk of a declining home value, and can be the better financial choice for shorter time horizons or uncertain markets.</p>
`;