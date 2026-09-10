import { createHeader } from "/Header/script.js";
import { createFooter } from "/Footer/script.js";
import { titleGenerator } from "../Calculator Title/script.js";
import { createPageLayout } from "../Page Layout/script.js";
import { numberInput } from "../Modules/Input/input.js";
import { output } from "../Modules/Output/Output/script.js";
import {Graph} from "../Modules/Output/Graph/graph.js";

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

const homePrice = numberInput(0, 20000000, inputs, "Home price", 400000, "$", "", calculate);
const downPayment = numberInput(0, 20000000, inputs, "Down payment", 80000, "$", "", calculate);
const loanTerm = numberInput(1, 40, inputs, "Loan term", 30, "", "yrs", calculate);
const interestRate = numberInput(0, 25, inputs, "Interest rate", 6.5, "", "%", calculate);
const propertyTax = numberInput(0, 200000, inputs, "Annual property tax", 4000, "$", "", calculate);
const homeInsurance = numberInput(0, 50000, inputs, "Annual home insurance", 1400, "$", "", calculate);
const hoaDues = numberInput(0, 20000, inputs, "Monthly HOA dues", 0, "$", "", calculate);


const monthlypayment = output("Monthly Payment");
const monthlyloanpayment = output("Monthly Loan Payment");
const interestcost = output("Full-term Interest Cost");
const fulltermcost = output("Full-term Cost");
let outputvalues=document.getElementById("output");
    outputvalues.append(monthlypayment);
    outputvalues.append(monthlyloanpayment);
    outputvalues.append(interestcost);
    outputvalues.append(fulltermcost);

    
    let points=[];
    let value=320000;

const myGraph = new Graph({ divId: 'canvas-div', points: points, xLabel: 'Years' ,parent: document.getElementById("main-calculator"), stepsize:12});
function calculate(){
    let homeprice=Number(homePrice.value.replaceAll(",",""));
    let downpayment=Number(downPayment.value.replaceAll(",",""));
    let loanterm=Number(loanTerm.value.replaceAll(",",""));
    let interestrate=Number(interestRate.value.replaceAll(",",""));
    let propertytax=Number(propertyTax.value.replaceAll(",",""));
    let homeinsurance=Number(homeInsurance.value.replaceAll(",",""));
    let hoadues=Number(hoaDues.value.replaceAll(",",""));
    let loanprinciple=(homeprice-downpayment);
    let monthlyinterestrate=(interestrate/1200);
    let months=loanterm*12;
    let monthlypropertytax=propertytax/12;
    let monthlyinsurance=homeinsurance/12;
    let monthlypayment=loanprinciple*(monthlyinterestrate*(1+monthlyinterestrate)**months)/((1+monthlyinterestrate)**months-1);
    document.getElementById("monthlypayment").innerHTML="$"+(Math.round((monthlypayment+monthlyinsurance+monthlypropertytax)*100)/100).toLocaleString('en-US');
    document.getElementById("monthlyloanpayment").innerHTML="$"+(Math.round(monthlypayment*100)/100).toLocaleString('en-US');
    document.getElementById("full-terminterestcost").innerHTML="$"+(Math.round((monthlypayment*months-loanprinciple)*100)/100).toLocaleString('en-US');
    document.getElementById("full-termcost").innerHTML="$"+(Math.round(((monthlypayment+monthlyinsurance+monthlypropertytax)*months+downpayment)*100)/100).toLocaleString('en-US');

    
    points=[];
    value=loanprinciple;
    for(let i=0;i<loanterm*12;i++){
    points.push(value);
    value*=(1+monthlyinterestrate);
    points.push(value);
    value-=monthlypayment;
    }
    points.push(value);
    myGraph.setPoints(points);
    myGraph.setStepSize(12);
}
calculate();

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
