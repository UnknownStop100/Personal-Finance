import { numberInput } from "../../Modules/Input/input.js";
import { valueInputs } from "../../Modules/Input/input.js";
import { Input } from "../../Modules/Input/input.js";
import { createFooter } from "../../Footer/script.js";
import { createHeader } from "../../Header/script.js";
import { titleGenerator } from "../../Calculator Title/script.js";
import { output } from "../../Modules/Output/Output/script.js";
import { createPageLayout } from "/Page Layout/script.js";
import {SuperGraph} from "/Modules/Output/Graph/supergraph.js";
import { FeatureList } from "/featurelist/script.js";
import { saveData, loadData } from "../../dataStorage/script.js";
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
                    <h2>Input Fields:</h2>
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
    saveData("InvestmentCalculator");
}
function updateContributionFrequency() {
    contributionfrequency = Number(contributionFrequency.value.replaceAll(",", ""));
    drawGraph();
    saveData("InvestmentCalculator");
}
function updateContributionAmount() {
    contributionamount = contributionAmount.getValue();
    drawGraph();
    saveData("InvestmentCalculator");
}
function updateReturnOnInvestment() {
    roi = returnOnInvestment.getValue() / 100;
    drawGraph();
    saveData("InvestmentCalculator");
}
function updateInvestmentDuration() {
    investmentduration = investmentDuration.getValue();
    if (investmentduration === 0) {
        investmentduration = 1;
    }
    drawGraph();
    saveData("InvestmentCalculator");
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

new FeatureList({
       parent: document.getElementById("page-layout"),
       mode: "keyword",                 // "keyword" or "limit"
       keywords: ["mortgage", "home"],  // only used when mode === "keyword"
       limit: 8,                        // max icons shown, applies in both modes
       visible: 4,                      // icons visible before cycling kicks in
       excludeUrl: "/mortgage",         // don't link back to the page you're on
   });


document.getElementById("mainarticle").innerHTML = `
  <h2>Compound Interest: The Magic of Growing Money</h2>

  <p>Compound interest is one of the most powerful tools for building wealth. It allows you to use money you already have to generate even more money over time.</p>

  <p>There are two fundamental ways to increase your income:</p>

  <ol>
    <li><strong>Increase the value of your time:</strong> Earn more money for every hour you work.</li>
    <li><strong>Separate income from time:</strong> Make your money work for you, generating additional income without requiring more hours of work.</li>
  </ol>

  <p>Compound interest falls into the second category. As your investment grows, its earnings generate additional earnings, creating a snowball effect over time.</p>

  <p>This calculator helps you understand how much your money could grow and what it could accomplish for you.</p>

  <h3>Understanding Your Investment</h3>

  <p>To calculate your potential returns, you'll need to provide five pieces of information:</p>

  <ul>
    <li>How much money you have available to invest today.</li>
    <li>How much you plan to contribute over time.</li>
    <li>How frequently you plan to contribute.</li>
    <li>Your expected annual rate of return (ROI).</li>
    <li>How long you plan to leave your money invested.</li>
  </ul>

  <h3>1. Starting Balance</h3>

  <p>Enter the amount of money you currently have available to invest. This is your initial investment, not an amount you expect to have in the future.</p>

  <h3>2. Contribution Frequency</h3>

  <p>Choose how often you plan to add money to your investment:</p>

  <ul>
    <li><strong>Monthly:</strong> Once every month.</li>
    <li><strong>Quarterly:</strong> Once every three months.</li>
    <li><strong>Yearly:</strong> Once every year.</li>
  </ul>

  <h3>3. Contribution Amount</h3>

  <p>Enter how much you plan to invest during each contribution period. For example, if you selected monthly contributions, enter how much you can invest each month. If you're making a one-time investment, enter $0.</p>

  <h3>4. Return on Investment (ROI)</h3>

  <p>ROI represents your expected annual investment growth as a percentage. Different investments have different potential returns and risks. Here are some illustrative annual return ranges:</p>

  <table>
    <thead>
      <tr>
        <th>Investment Type</th>
        <th>Annual Return</th>
      </tr>
    </thead>
    <tbody>
      <tr><td>Real Estate</td><td>8–12%</td></tr>
      <tr><td>Bonds</td><td>3–6%</td></tr>
      <tr><td>Money Market Funds</td><td>0.5–3%</td></tr>
      <tr><td>Stocks</td><td>8–10%</td></tr>
    </tbody>
  </table>

  <p><strong>Important:</strong> These are general examples, not guaranteed returns. Actual performance varies with market conditions, fees, expenses, and investment selection. Investments can lose value, and some may limit access to your money. Always consider the risks before investing.</p>

  <h3>5. Investment Period</h3>

  <p>Enter how many years you plan to keep your money invested. Time is one of the most important factors in compound growth because your investment has more opportunities to generate earnings on both your original balance and accumulated returns.</p>

  <h3>Understanding Your Results</h3>

  <p>The calculator generates a graph showing how your investment could grow over time. Move your mouse across the graph to explore:</p>

  <ul>
    <li><strong>Total Value:</strong> The projected value of your investment.</li>
    <li><strong>Contributions:</strong> The total amount of money you've invested.</li>
    <li><strong>Total Earnings:</strong> The growth generated by your investment.</li>
  </ul>

  <p>The difference between your contributions and total value demonstrates the power of compound growth.</p>

  <h3>How the Calculator Works</h3>

  <p>The calculator converts your annual return into a periodic rate based on your selected contribution frequency:</p>

  <ul>
    <li><strong>Monthly:</strong> 12 periods per year.</li>
    <li><strong>Quarterly:</strong> 4 periods per year.</li>
    <li><strong>Yearly:</strong> 1 period per year.</li>
  </ul>

  <p>The periodic rate is calculated using:</p>

  <p>r<sub>p</sub> = (1 + r)<sup>1/n</sup> - 1</p>

  <p>Where <strong>r</strong> is the annual return, <strong>n</strong> is the number of periods per year, and <strong>r<sub>p</sub></strong> is the periodic return.</p>

  <p>For each period, the calculator:</p>

  <ol>
    <li>Starts with the current investment balance.</li>
    <li>Adds any scheduled contribution.</li>
    <li>Applies the periodic investment return.</li>
    <li>Records the resulting balance.</li>
    <li>Repeats until the investment period is complete.</li>
  </ol>

  <p><strong>Contribution timing:</strong> Your starting balance already includes your initial investment, so no additional contribution is added during the first period. Beginning with the second period, each new contribution is added at the start, allowing it to participate in that period's growth.</p>

  <p>This process allows your original investment, additional contributions, and accumulated earnings to grow together through compound interest.</p>
`;

loadData("InvestmentCalculator");