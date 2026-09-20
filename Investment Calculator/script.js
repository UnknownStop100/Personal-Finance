import { numberInput } from "../Modules/Input/input.js";
import { valueInputs } from "../Modules/Input/input.js";
import { Input } from "../Modules/Input/input.js";
import { createFooter } from "../Footer/script.js";
import { createHeader } from "../Header/script.js";
import { titleGenerator } from "../Calculator Title/script.js";
import { output } from "../Modules/Output/Output/script.js";
import { createPageLayout } from "../Page Layout/script.js";
import {SuperGraph} from "../Modules/Output/Graph/supergraph.js";
const body = document.querySelector('body');
const header = createHeader();
const footer = createFooter();
const title = titleGenerator("Finance calculator", "Investment Calculator", "Plot future investment growth using compound interest and regular contributions.")
const moneyinput = output("Money Input");
const moneyearned = output("Money Earned");
const moneyearnedfinalsegment = output("Money Earned Final Month");
const totalmoney = output("Total Money");
const main = createPageLayout();
body.prepend(title);
body.prepend(header);
body.appendChild(main);
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
const outputarea = document.getElementById("output");
outputarea.appendChild(moneyinput);
outputarea.appendChild(moneyearned);
outputarea.appendChild(moneyearnedfinalsegment);
outputarea.appendChild(totalmoney);
///////////////////////////
//handles inputs
///////////////////////////

let currentSavings = new Input(0, 1000000000, document.getElementById("inputs"), "Current Savings", 0, "$", "", updateCurrentSavings, `<a href="#input-savings">&#x2139</a>`);
document.getElementById("inputs").appendChild(document.createElement("br"));
let contributionFrequency = valueInputs("Contribution Frequency", ["Monthly", "Quarterly", "Yearly"], [12, 4, 1], document.getElementById("inputs"), updateContributionFrequency, `<a href="#input-savings">&#x2139</a>`);
document.getElementById("inputs").appendChild(document.createElement("br"));
document.getElementById("inputs").appendChild(document.createElement("br"));
let contributionAmount = new Input(-1000000, 1000000000, document.getElementById("inputs"), "Contribution Amount", 500, "$", "", updateContributionAmount, `<a href="#input-savings">&#x2139</a>`);
document.getElementById("inputs").appendChild(document.createElement("br"));
let returnOnInvestment = new Input(0, 100, document.getElementById("inputs"), "Return on Investment (ROI)", 8, "", "%", updateReturnOnInvestment, `<a href="#roi-values">&#x2139</a>`);
document.getElementById("inputs").appendChild(document.createElement("br"));
let investmentDuration = new Input(0, 100, document.getElementById("inputs"), "Investment Duration", 20, "", "", updateInvestmentDuration, `<a href="#investment-duration">&#x2139</a>`);
document.getElementById("inputs").appendChild(document.createElement("br"));
//const outputrange = valueInputs("Output Time Frame", ["Lifetime", "Yearly", "Monthly", "Weekly", "Daily"], [4, 3, 2, 1, 0], document.getElementById("inputs"), updateMoneyEarned, ``);
//document.getElementById("inputs").appendChild(document.createElement("br"));
document.getElementById("inputs").appendChild(document.createElement("br"));


let roi = returnOnInvestment.getValue() / 100,
    contributionfrequency = Number(contributionFrequency.value.replaceAll(",", "")),
    contributionamount = contributionAmount.getValue(),
    currentsavings = currentSavings.getValue(),
    investmentduration = investmentDuration.getValue();
const myGraph = new SuperGraph({ divId: 'canvas-div', points: [], graphtitles: ["Total Value", "Contributions", "Total Earnings"], xLabel: 'Years' ,parent: document.getElementById("main-calculator"), stepsize:contributionfrequency, xlabeloffset: 0});

function updateCurrentSavings() {
    currentsavings = currentSavings.getValue();
    drawGraph();
}
function updateContributionFrequency() {
    contributionfrequency = Number(contributionFrequency.value.replaceAll(",", ""));
    drawGraph();
}
function updateContributionAmount() {
    contributionamount = contributionAmount.getValue();
    drawGraph();
}
function updateReturnOnInvestment() {
    roi = returnOnInvestment.getValue() / 100;
    drawGraph();
}
function updateInvestmentDuration() {
    investmentduration = investmentDuration.getValue();
    if (investmentduration === 0) {
        investmentduration = 1;
    }
    drawGraph();
}
///////////////////////////
//handles inputs
///////////////////////////
let actualpoints = function (ROI, iterations, iterationsperyear, initalmoney, iterationcontribution) {
    let points = [];
    for(let i=0;i<(iterations+1);i++){
      points.push([[],[],[]]);
    }
    let price = initalmoney;
    let contribution = initalmoney;
    let iterationroi = (ROI + 1) ** (1 / iterationsperyear);
    points[0][0].push(price);
    points[0][1].push(contribution);
    points[0][2].push(price-contribution);
    for (let i = 0; i < iterations; i++) {
        price *= iterationroi;
        points[i+1][0].push(price);
        points[i+1][1].push(contribution);
        points[i+1][2].push(price-contribution);
        price += iterationcontribution;
        contribution += iterationcontribution;
        points[i+1][0].push(price);
        points[i+1][1].push(contribution);
        points[i+1][2].push(price-contribution);

    }
    return points;
}
let drawGraph=function(){
myGraph.setStepSize(contributionfrequency);
let points=actualpoints(roi, contributionfrequency * investmentduration, contributionfrequency, currentsavings, contributionamount);
myGraph.setPoints(points);
document.getElementById("moneyinput").innerHTML="$"+Math.round((currentsavings+contributionfrequency * investmentduration*contributionamount)).toLocaleString('en-US');
document.getElementById("moneyearned").innerHTML="$"+Math.round((points[points.length-1][0][1]-points[points.length-1][1][1])).toLocaleString('en-US');
switch(contributionfrequency){
    case 12:
    moneyearnedfinalsegment.firstElementChild.innerHTML="Final Month Earnings";
    break;
    case 4:
    moneyearnedfinalsegment.firstElementChild.innerHTML="Final Quarter Earnings";
    break;
    case 1:
    moneyearnedfinalsegment.firstElementChild.innerHTML="Final Year Earnings";
    break;
    default:
    break;
}
document.getElementById("moneyearnedfinalmonth").innerHTML="$"+Math.round(points[points.length-1][0][1]*((roi + 1) ** (1 / contributionfrequency)-1)).toLocaleString('en-US');
document.getElementById("totalmoney").innerHTML="$"+Math.round(points[points.length-1][0][1]).toLocaleString('en-US');
}
drawGraph();
document.getElementById("mainarticle").innerHTML = `
  <h2>How the Investment ROI Calculator Works</h2>
  <p>The <strong>Investment ROI Calculator</strong> is a tool designed to model and visualize the growth of your investments over time based on user-defined inputs. It helps analyze different asset classes such as <em>stocks</em>, <em>bonds</em>, <em>real estate</em>, and <em>money market funds</em> to assist in financial planning.</p>
  
  <h3>Step-by-Step Functionality</h3>
  <ol>
    <li id="input-savings">
      <strong>Input Current Savings and Investment Amounts:</strong>
      Users enter their existing savings and specify regular contributions (monthly, quarterly, or annually) to the investment.
    </li>
    <li id="investment-duration">
      <strong>Define Investment Duration and Time Periods:</strong>
      Set the total investment period, ranging from months to decades, which influences the growth projection.
    </li>
    <li id="roi-values">
      <strong>Set Expected ROI Based on Asset Class:</strong>
      Input an assumed annual rate of return, based on historical or expected performance for different assets:
      <ul>
        <li>Stocks: 8-10%</li>
        <li>Bonds: 3-6%</li>
        <li>Real Estate: 8-12%</li>
        <li>Money Market Funds: 0.5-2%</li>
      </ul>
    </li>
    <li>
      <strong>Calculate Compound Growth and Investment Returns:</strong>
      The calculator models growth using compound interest formulas, considering initial savings, periodic contributions, expected ROI, and investment duration.
    </li>
    <li>
      <strong>Visualization Through Dynamic Graphs:</strong>
      Results are displayed in interactive graphs that show how your investment value evolves over time, including cumulative totals and growth trends.
    </li>
  </ol>

  <h3>Key Features</h3>
  <ul>
    <li>Customizable inputs: savings, contributions, ROI, investment period</li>
    <li>Modeling for multiple asset classes: stocks, bonds, real estate, money market</li>
    <li>Time-based projections from months to decades</li>
    <li>Visual data representation with graphs and charts</li>
  </ul>

  <p>By leveraging principles like compound interest and asset-specific ROI assumptions, this calculator provides realistic projections of your investment growth, helping you make informed financial decisions for the future.</p>
`;