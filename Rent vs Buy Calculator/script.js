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
    "Rent vs. Buy Calculator",
    "Compare the total cost of renting versus buying a home over time."
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

const monthlyRent = numberInput(0, 200000, inputs, "Monthly rent", 2200, "$", "", calculate);
const rentIncrease = numberInput(0, 20, inputs, "Annual rent increase", 3, "", "%", calculate);
const homePrice = numberInput(0, 20000000, inputs, "Home price", 450000, "$", "", calculate);
const downPaymentPct = numberInput(0, 100, inputs, "Down payment", 20, "", "%", calculate);
const mortgageRate = numberInput(0, 25, inputs, "Mortgage rate", 6.5, "", "%", calculate);
const loanTerm = numberInput(1, 40, inputs, "Loan term", 30, "", "yrs", calculate);
const propertyTaxRate = numberInput(0, 10, inputs, "Property tax rate", 1.1, "", "%", calculate);
const maintenanceRate = numberInput(0, 10, inputs, "Annual maintenance", 1, "", "%", calculate);
const appreciationRate = numberInput(0, 15, inputs, "Annual home appreciation", 3, "", "%", calculate);
const closingCostPct = numberInput(0, 15, inputs, "Closing costs", 3, "", "%", calculate);
const sellingCostPct = numberInput(0, 15, inputs, "Selling costs", 6, "", "%", calculate);
const yearsToCompare = numberInput(1, 40, inputs, "Years to compare", 10, "", "yrs", calculate);

const netCostRenting = output("Net Cost of Renting");
const netCostBuying = output("Net Cost of Buying");
const cashNeededToBuy = output("Cash Needed to Buy");
const cheaperOption = output("Cheaper Option");
let outputvalues = document.getElementById("output");
outputvalues.append(netCostRenting);
outputvalues.append(netCostBuying);
outputvalues.append(cashNeededToBuy);
outputvalues.append(cheaperOption);

let points = [];
let value = 450000;

const myGraph = new Graph({ divId: 'canvas-div', points: points, xLabel: 'Years', parent: document.getElementById("main-calculator"), stepsize: 1 });

function calculate() {
    let price = Number(homePrice.value.replaceAll(",",""));
    let downpct = Number(downPaymentPct.value.replaceAll(",","")) / 100;
    let down = price * downpct;
    let loanamount = price - down;
    let monthlyratem = Number(mortgageRate.value.replaceAll(",","")) / 100 / 12;
    let n = Number(loanTerm.value.replaceAll(",","")) * 12;

    let payment;
    if (monthlyratem === 0) {
        payment = n > 0 ? loanamount / n : 0;
    } else {
        payment =
            (loanamount * monthlyratem * (1 + monthlyratem) ** n) /
            ((1 + monthlyratem) ** n - 1);
    }
    if (!isFinite(payment)) payment = 0;

    let years = Number(yearsToCompare.value.replaceAll(",",""));
    let closingcosts = price * (Number(closingCostPct.value.replaceAll(",","")) / 100);
    let rentincrease = Number(rentIncrease.value.replaceAll(",",""));
    let propertytaxrate = Number(propertyTaxRate.value.replaceAll(",",""));
    let maintenancerate = Number(maintenanceRate.value.replaceAll(",",""));
    let appreciationrate = Number(appreciationRate.value.replaceAll(",",""));
    let sellingcostpct = Number(sellingCostPct.value.replaceAll(",",""));

    let rent = Number(monthlyRent.value.replaceAll(",",""));
    let balance = loanamount;
    let homevalue = price;
    let totalrentcost = 0;
    let totalbuycashoutlay = closingcosts + down;

    points = [];
    points.push(down + closingcosts);

    let finalrentcost = 0;
    let finalbuycost = 0;

    for (let year = 1; year <= years; year++) {
        for (let m = 0; m < 12; m++) {
            totalrentcost += rent;
            let interestportion = balance * monthlyratem;
            let principalportion = Math.min(payment - interestportion, balance);
            balance -= principalportion;
            totalbuycashoutlay += payment;
        }
        totalbuycashoutlay +=
            homevalue * (propertytaxrate / 100) +
            homevalue * (maintenancerate / 100);
        homevalue *= 1 + appreciationrate / 100;
        rent *= 1 + rentincrease / 100;

        let sellingcosts = homevalue * (sellingcostpct / 100);
        let netbuycost = totalbuycashoutlay + sellingcosts - (homevalue - balance);

        finalrentcost = totalrentcost;
        finalbuycost = Math.max(netbuycost, 0);
        points.push(finalbuycost);
    }

    let buyingwins = finalbuycost < finalrentcost;

    document.getElementById("netcostofrenting").innerHTML = "$" + (Math.round(finalrentcost * 100) / 100).toLocaleString('en-US');
    document.getElementById("netcostofbuying").innerHTML = "$" + (Math.round(finalbuycost * 100) / 100).toLocaleString('en-US');
    document.getElementById("cashneededtobuy").innerHTML = "$" + (Math.round((down + closingcosts) * 100) / 100).toLocaleString('en-US');
    document.getElementById("cheaperoption").innerHTML = buyingwins ? "Buying" : "Renting";

    myGraph.setPoints(points);
    myGraph.setStepSize(1);
}
calculate();

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