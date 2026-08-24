import { createHeader } from "/Header/script.js";
import { createFooter } from "/Footer/script.js";
import { titleGenerator } from "../Calculator Title/script.js";
import { createPageLayout } from "../Page Layout/script.js";
import { numberInput } from "../Modules/Input/input.js";
import {
    resultHero,
    resultGrid,
    resultStat,
    resultTable,
    resultNote,
    lineChart,
    clearElement,
    fmtCurrency,
} from "../Modules/Output/output.js";

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
const mainarticle = document.getElementById("mainarticle");

const calculatorCard = document.createElement("section");
calculatorCard.className = "calculator-card";
calculatorCard.innerHTML = `
  <div class="card-heading">
    <div><p class="eyebrow">Loan repayment</p><h2>Build your schedule</h2></div>
    <span class="status-dot">Estimate</span>
  </div>
`;
const fields = document.createElement("div");
fields.className = "field-group";
calculatorCard.appendChild(fields);
maincontent.appendChild(calculatorCard);

const loanAmount = numberInput(0, 20000000, fields, "Loan amount", 300000, "$", "", calculate);
const interestRate = numberInput(0, 25, fields, "Interest rate", 6.5, "", "%", calculate);
const loanTerm = numberInput(1, 40, fields, "Loan term", 30, "", "yrs", calculate);
const extraPayment = numberInput(0, 100000, fields, "Extra monthly payment", 0, "$", "", calculate);

const resultsSection = document.createElement("section");
resultsSection.className = "results-section";
maincontent.appendChild(resultsSection);

function calculate() {
    const principal = loanAmount.getNumericValue();
    const monthlyRate = interestRate.getNumericValue() / 100 / 12;
    const n = loanTerm.getNumericValue() * 12;
    const extra = extraPayment.getNumericValue();

    let basePayment;
    if (monthlyRate === 0) {
        basePayment = n > 0 ? principal / n : 0;
    } else {
        basePayment =
            (principal * monthlyRate * Math.pow(1 + monthlyRate, n)) /
            (Math.pow(1 + monthlyRate, n) - 1);
    }
    if (!isFinite(basePayment)) basePayment = 0;

    let balance = principal;
    let totalInterest = 0;
    let month = 0;
    const yearlyPoints = [{ x: 0, y: balance }];
    const rows = [];

    while (balance > 0.005 && month < 1200) {
        month++;
        const interestPortion = balance * monthlyRate;
        let principalPortion = basePayment - interestPortion + extra;
        if (principalPortion > balance) principalPortion = balance;
        balance -= principalPortion;
        totalInterest += interestPortion;

        if (month % 12 === 0 || balance <= 0.005) {
            rows.push([
                `Year ${Math.ceil(month / 12)}`,
                fmtCurrency(interestPortion + principalPortion),
                fmtCurrency(interestPortion),
                fmtCurrency(principalPortion),
                fmtCurrency(Math.max(balance, 0)),
            ]);
            yearlyPoints.push({ x: month / 12, y: Math.max(balance, 0) });
        }
    }

    const payoffMonths = month;
    const monthlyPaymentDisplay = basePayment + extra;

    clearElement(resultsSection);

    resultHero(
        resultsSection,
        "Monthly payment",
        fmtCurrency(monthlyPaymentDisplay),
        extra > 0 ? `Includes ${fmtCurrency(extra)} extra toward principal` : "Principal & interest"
    );

    const grid = resultGrid(resultsSection);
    resultStat(grid, "Payoff time", `${Math.floor(payoffMonths / 12)} yr ${payoffMonths % 12} mo`);
    resultStat(grid, "Total interest paid", fmtCurrency(totalInterest));
    resultStat(grid, "Total paid", fmtCurrency(principal + totalInterest));

    lineChart(resultsSection, [{ name: "Remaining balance", points: yearlyPoints, color: "var(--accent)" }], {
        xFormatter: (v) => `Yr ${Math.round(v)}`,
    });

    resultTable(
        resultsSection,
        ["Year", "Paid this year", "Interest", "Principal", "Remaining balance"],
        rows
    );

    if (extra > 0) {
        resultNote(
            resultsSection,
            `Paying ${fmtCurrency(extra)} extra each month pays off the loan faster and reduces total interest.`,
            "good"
        );
    } else {
        resultNote(resultsSection, "Try adding an extra monthly payment to see how much interest you could save.", "neutral");
    }
}

calculate();

const description = document.createElement("section");
description.className = "description";
description.innerHTML = `
  <p class="eyebrow">About this calculator</p>
  <h2>Build a full loan amortization schedule</h2>
  <p>This amortization calculator breaks down every year of a loan's life into principal paid, interest paid, and remaining balance, so you can see exactly how your loan pays down over time.</p>
`;
mainarticle.appendChild(description);

const article = document.createElement("section");
article.className = "article-card";
article.innerHTML = `
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
mainarticle.appendChild(article);
