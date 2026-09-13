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
    "Loan Amortization Schedule",
    "See exactly how each payment splits between principal and interest over the life of your loan."
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

const loanAmount = numberInput(0, 20000000, inputs, "Loan amount", 300000, "$", "", calculate);
const interestRate = numberInput(0, 25, inputs, "Interest rate", 6.5, "", "%", calculate);
const loanTerm = numberInput(1, 40, inputs, "Loan term", 30, "", "yrs", calculate);
const extraPayment = numberInput(0, 100000, inputs, "Extra monthly payment", 0, "$", "", calculate);

const monthlyPayment = output("Monthly Payment");
const payoffTime = output("Payoff Time");
const totalInterestPaid = output("Total Interest Paid");
const totalPaid = output("Total Paid");
let outputvalues = document.getElementById("output");
outputvalues.append(monthlyPayment);
outputvalues.append(payoffTime);
outputvalues.append(totalInterestPaid);
outputvalues.append(totalPaid);

let points = [];
let value = 300000;

const myGraph = new Graph({ divId: 'canvas-div', points: points, xLabel: 'Years', parent: document.getElementById("main-calculator"), stepsize: 12 });

function calculate() {
    let loanamount = Number(loanAmount.value.replaceAll(",",""));
    let interestrate = Number(interestRate.value.replaceAll(",",""));
    let loanterm = Number(loanTerm.value.replaceAll(",",""));
    let extrapayment = Number(extraPayment.value.replaceAll(",",""));

    let principal = loanamount;
    let monthlyrate = interestrate / 100 / 12;
    let n = loanterm * 12;

    let basepayment;
    if (monthlyrate === 0) {
        basepayment = n > 0 ? principal / n : 0;
    } else {
        basepayment =
            (principal * monthlyrate * (1 + monthlyrate) ** n) /
            ((1 + monthlyrate) ** n - 1);
    }
    if (!isFinite(basepayment)) basepayment = 0;

    let balance = principal;
    let totalinterest = 0;
    let month = 0;

    points = [];
    points.push(balance);

    while (balance > 0.005 && month < 1200) {
        month++;
        let interestportion = balance * monthlyrate;
        let principalportion = basepayment - interestportion + extrapayment;
        if (principalportion > balance) principalportion = balance;
        balance -= principalportion;
        totalinterest += interestportion;

        if (month % 12 === 0 || balance <= 0.005) {
            points.push(Math.max(balance, 0));
        }
    }

    let payoffmonths = month;
    let monthlypaymentdisplay = basepayment + extrapayment;

    document.getElementById("monthlypayment").innerHTML = "$" + (Math.round(monthlypaymentdisplay * 100) / 100).toLocaleString('en-US');
    document.getElementById("payofftime").innerHTML = Math.floor(payoffmonths / 12) + " yr " + (payoffmonths % 12) + " mo";
    document.getElementById("totalinterestpaid").innerHTML = "$" + (Math.round(totalinterest * 100) / 100).toLocaleString('en-US');
    document.getElementById("totalpaid").innerHTML = "$" + (Math.round((principal + totalinterest) * 100) / 100).toLocaleString('en-US');

    myGraph.setPoints(points);
    myGraph.setStepSize(1);
}
calculate();

const mainarticle = document.getElementById("mainarticle");
mainarticle.innerHTML = `
  <p class="eyebrow">About this calculator</p>
  <h2>Build a full loan amortization schedule</h2>
  <p>This amortization calculator breaks down every year of a loan's life into principal paid, interest paid, and remaining balance, so you can see exactly how your loan pays down over time.</p>
  <p class="eyebrow">Amortization guide</p>
  <h2>How loan amortization works</h2>
  <p>Amortization is the process of paying off a loan through regular, fixed payments over time. Each payment covers that period's interest first, with the remainder reducing the principal balance.</p>
  <h3>Why early payments are mostly interest</h3>
  <p>Early in a loan, the balance is highest, so interest charges make up a larger share of each payment. As the balance shrinks, more of each payment goes toward principal, which is why amortization schedules show accelerating principal paydown near the end of a loan.</p>
  <h3>The effect of extra payments</h3>
  <p>Extra payments applied directly to principal reduce the balance interest is calculated on for every remaining period, which shortens the loan term and lowers total interest paid, sometimes significantly over a 15- or 30-year loan.</p>
  <h3>Amortization schedules for different loan types</h3>
  <p>This same amortization logic applies to mortgages, auto loans, personal loans, and student loans, anywhere a fixed-rate loan is repaid in equal periodic installments.</p>
`;