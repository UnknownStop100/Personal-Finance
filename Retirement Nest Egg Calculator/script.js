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
    "Retirement Nest Egg Calculator",
    "Project your retirement savings and see if they'll cover your desired retirement income."
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
const mainarticle = document.getElementById("mainarticle");

const calculatorCard = document.createElement("section");
calculatorCard.className = "calculator-card";
calculatorCard.innerHTML = `
  <div class="card-heading">
    <div><p class="eyebrow">Retirement planning</p><h2>Project your nest egg</h2></div>
    <span class="status-dot">Estimate</span>
  </div>
`;
let fields=document.getElementById("inputs");

const currentAge = numberInput(18, 90, fields, "Current age", 30, "", "yrs", calculate);
const retireAge = numberInput(19, 95, fields, "Retirement age", 65, "", "yrs", calculate);
const currentSavings = numberInput(0, 100000000, fields, "Current retirement savings", 40000, "$", "", calculate);
const monthlyContribution = numberInput(0, 1000000, fields, "Monthly contribution", 500, "$", "", calculate);
const annualReturn = numberInput(0, 20, fields, "Expected annual return", 7, "", "%", calculate);
const desiredIncome = numberInput(0, 5000000, fields, "Desired annual retirement income", 60000, "$", "", calculate);
const withdrawalRate = numberInput(1, 10, fields, "Safe withdrawal rate", 4, "", "%", calculate);

const outputContainer = document.getElementById("output");

const nestEgg = output("Nest Egg at Retirement");
const totalContributions = output("Total Contributions");
const sustainableIncome = output("Sustainable Annual Income");
const incomeGap = output("Income Gap");
outputContainer.append(nestEgg);
outputContainer.append(totalContributions);
outputContainer.append(sustainableIncome);
outputContainer.append(incomeGap);

let points = [];
let value = 40000;

const myGraph = new Graph({ divId: 'canvas-div', points: points, xLabel: 'Years', parent: document.getElementById("main-calculator"), stepsize: 12 });

function calculate(){
    let currentage = Number(currentAge.value.replaceAll(",",""));
    let retireage = Number(retireAge.value.replaceAll(",",""));
    let currentsavings = Number(currentSavings.value.replaceAll(",",""));
    let monthlycontribution = Number(monthlyContribution.value.replaceAll(",",""));
    let annualreturn = Number(annualReturn.value.replaceAll(",",""));
    let desiredincome = Number(desiredIncome.value.replaceAll(",",""));
    let withdrawalrate = Number(withdrawalRate.value.replaceAll(",",""));

    let yearstoretirement = retireage - currentage;
    let months = yearstoretirement * 12;
    let monthlyreturnrate = annualreturn / 1200;

    let nestegg = currentsavings * (1 + monthlyreturnrate) ** months
        + monthlycontribution * (((1 + monthlyreturnrate) ** months - 1) / monthlyreturnrate);
    let totalcontributions = currentsavings + monthlycontribution * months;
    let sustainableincome = nestegg * (withdrawalrate / 100);
    let incomegap = sustainableincome - desiredincome;

    document.getElementById("nesteggatretirement").innerHTML = "$" + (Math.round(nestegg * 100) / 100).toLocaleString('en-US');
    document.getElementById("totalcontributions").innerHTML = "$" + (Math.round(totalcontributions * 100) / 100).toLocaleString('en-US');
    document.getElementById("sustainableannualincome").innerHTML = "$" + (Math.round(sustainableincome * 100) / 100).toLocaleString('en-US');
    document.getElementById("incomegap").innerHTML = (incomegap >= 0 ? "+$" : "-$") + (Math.round(Math.abs(incomegap) * 100) / 100).toLocaleString('en-US');

    points = [];
    value = currentsavings;
    for (let i = 0; i < months; i++) {
        points.push(value);
        value *= (1 + monthlyreturnrate);
        points.push(value);
        value += monthlycontribution;
    }
    points.push(value);
    myGraph.setPoints(points);
    myGraph.setStepSize(12);
}
calculate();

const article = document.createElement("section");
article.className = "article-card";
article.innerHTML = `
  <p class="eyebrow">Retirement savings guide</p>
  <h2>How to estimate your retirement nest egg</h2>
  <p>A retirement nest egg is the total savings and investments you'll rely on for income once you stop working. Estimating it means projecting your current balance and future contributions forward using an assumed rate of investment return.</p>
  <h3>The safe withdrawal rate</h3>
  <p>A safe withdrawal rate is the percentage of your retirement savings you can withdraw each year with a low risk of running out of money over a typical retirement. A commonly cited starting point is 4%, though the right rate depends on your time horizon and risk tolerance.</p>
  <h3>Why time in the market matters</h3>
  <p>Retirement contributions made earlier have more years to compound, so starting even small monthly contributions early can have an outsized effect on your final balance compared to saving more later.</p>
  <h3>Closing a retirement savings gap</h3>
  <p>If your projected sustainable income falls short of your goal, the main levers are increasing monthly contributions, working and saving for additional years, or adjusting your target retirement income.</p>
`;
mainarticle.appendChild(article);