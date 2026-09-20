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
    "Mortgage Payment Calculator",
    "Estimate your monthly mortgage payment, including taxes, insurance, and HOA dues."
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

const monthlypayment = output("Monthly Payment");
const monthlyloanpayment = output("Monthly Loan Payment");
const interestcost = output("Full-term Interest Cost");
const fulltermcost = output("Full-term Cost");
let outputvalues = document.getElementById("output");
outputvalues.append(monthlypayment);
outputvalues.append(monthlyloanpayment);
outputvalues.append(interestcost);
outputvalues.append(fulltermcost);

///////////////////////////
//handles inputs
///////////////////////////

let homePrice = new Input(0, 20000000, inputsContainer, "Home price", 400000, "$", "", updateHomePrice);
inputsContainer.appendChild(document.createElement("br"));
let downPayment = new Input(0, 20000000, inputsContainer, "Down payment", 80000, "$", "", updateDownPayment);
inputsContainer.appendChild(document.createElement("br"));
let loanTerm = new Input(1, 40, inputsContainer, "Loan term", 30, "", "yrs", updateLoanTerm);
inputsContainer.appendChild(document.createElement("br"));
let interestRate = new Input(0, 25, inputsContainer, "Interest rate", 6.5, "", "%", updateInterestRate);
inputsContainer.appendChild(document.createElement("br"));
let propertyTax = new Input(0, 200000, inputsContainer, "Annual property tax", 4000, "$", "", updatePropertyTax);
inputsContainer.appendChild(document.createElement("br"));
let homeInsurance = new Input(0, 50000, inputsContainer, "Annual home insurance", 1400, "$", "", updateHomeInsurance);
inputsContainer.appendChild(document.createElement("br"));
let hoaDues = new Input(0, 20000, inputsContainer, "Monthly HOA dues", 0, "$", "", updateHoaDues);
inputsContainer.appendChild(document.createElement("br"));

let homeprice = homePrice.getValue(),
    downpayment = downPayment.getValue(),
    loanterm = loanTerm.getValue(),
    interestrate = interestRate.getValue(),
    propertytax = propertyTax.getValue(),
    homeinsurance = homeInsurance.getValue(),
    hoadues = hoaDues.getValue();

const myGraph = new SuperGraph({
    divId: 'canvas-div',
    points: [],
    graphtitles: ["Remaining Balance", "Total Paid", "Principal Paid", "Interest Paid"],
    xLabel: 'Years',
    parent: document.getElementById("main-calculator"),
    stepsize: 12,
    xlabeloffset: 0
});

function updateHomePrice() { homeprice = homePrice.getValue(); drawGraph(); }
function updateDownPayment() { downpayment = downPayment.getValue(); drawGraph(); }
function updateLoanTerm() { loanterm = loanTerm.getValue(); drawGraph(); }
function updateInterestRate() { interestrate = interestRate.getValue(); drawGraph(); }
function updatePropertyTax() { propertytax = propertyTax.getValue(); drawGraph(); }
function updateHomeInsurance() { homeinsurance = homeInsurance.getValue(); drawGraph(); }
function updateHoaDues() { hoadues = hoaDues.getValue(); drawGraph(); }

///////////////////////////
//handles graph point generation
///////////////////////////

let actualpoints = function (monthlyRate, months, principal, monthlyPayment) {
    let points = [];
    for (let i = 0; i < months + 1; i++) {
        points.push([[], [], [], []]);
    }
    let balance = principal;
    let cumulativeInterest = 0;
    let cumulativePrincipal = downpayment;
    points[0][0].push(balance);
    points[0][1].push(cumulativePrincipal + cumulativeInterest);
    points[0][2].push(cumulativePrincipal);
    points[0][3].push(cumulativeInterest);
    for (let i = 0; i < months; i++) {
        points[i + 1][0].push(balance);
        points[i + 1][1].push(cumulativePrincipal + cumulativeInterest);
        points[i + 1][2].push(cumulativePrincipal);
        points[i + 1][3].push(cumulativeInterest);
        let interestPortion = balance * monthlyRate;
        let principalPortion = monthlyPayment - interestPortion;
        balance -= principalPortion;
        cumulativeInterest += interestPortion;
        cumulativePrincipal += principalPortion;
        points[i + 1][0].push(balance);
        points[i + 1][1].push(cumulativePrincipal + cumulativeInterest);
        points[i + 1][2].push(cumulativePrincipal);
        points[i + 1][3].push(cumulativeInterest);
    }
    return points;
};

let drawGraph = function () {
    let loanprinciple = homeprice - downpayment;
    let monthlyinterestrate = interestrate / 1200;
    let months = loanterm * 12;
    let monthlypropertytax = propertytax / 12;
    let monthlyinsurance = homeinsurance / 12;
    let monthlyloanpaymentvalue =
        (loanprinciple * (monthlyinterestrate * (1 + monthlyinterestrate) ** months)) /
        ((1 + monthlyinterestrate) ** months - 1);

    myGraph.setStepSize(12);
    let points = actualpoints(monthlyinterestrate, months, loanprinciple, monthlyloanpaymentvalue);
    myGraph.setPoints(points);

document.getElementById("monthlypayment").innerHTML =
    "$" + (Math.round((monthlyloanpaymentvalue + monthlyinsurance + monthlypropertytax + hoadues) * 100) / 100).toLocaleString('en-US');
document.getElementById("monthlyloanpayment").innerHTML =
    "$" + (Math.round(monthlyloanpaymentvalue * 100) / 100).toLocaleString('en-US');
document.getElementById("full-terminterestcost").innerHTML =
    "$" + (Math.round((monthlyloanpaymentvalue * months - loanprinciple) * 100) / 100).toLocaleString('en-US');
document.getElementById("full-termcost").innerHTML =
    "$" + (Math.round(((monthlyloanpaymentvalue + monthlyinsurance + monthlypropertytax + hoadues) * months + downpayment) * 100) / 100).toLocaleString('en-US');
};
drawGraph();

const mainarticle = document.getElementById("mainarticle");
mainarticle.innerHTML = `
  <p class="eyebrow">About this calculator</p>
  <h2>Estimate your monthly mortgage payment</h2>
  <p>This mortgage calculator estimates your total monthly housing payment, including principal, interest, property tax, homeowners insurance, and HOA dues, based on your home price, down payment, loan term, and interest rate.</p>
  <p class="eyebrow">Mortgage payment guide</p>
  <h2>How mortgage payments are calculated</h2>
  <p>A fixed-rate mortgage payment is calculated using an amortization formula that spreads the loan amount, plus interest, evenly across every monthly payment for the life of the loan. Early payments are mostly interest; later payments are mostly principal.</p>
  <h3>What's included in PITI</h3>
  <p>Lenders often describe a full mortgage payment as PITI: principal, interest, taxes, and insurance. Many homeowners also pay monthly HOA dues on top of PITI if their property is part of a homeowners association.</p>
  <h3>How your down payment affects your payment</h3>
  <p>A larger down payment reduces the loan amount you need to borrow, which lowers both your monthly principal and interest payment and the total interest you'll pay over the life of the loan.</p>
  <h3>Fixed-rate vs. adjustable-rate</h3>
  <p>This calculator assumes a fixed interest rate for the full loan term. Adjustable-rate mortgages (ARMs) can change after an initial fixed period, which would change your monthly payment.</p>
`;