import { createHeader } from "/Header/script.js";
import { createFooter } from "/Footer/script.js";
import { titleGenerator } from "../Calculator Title/script.js";
import { createPageLayout } from "../Page Layout/script.js";
import { numberInput } from "../Modules/Input/input.js";
import {
    resultHero,
    resultGrid,
    resultStat,
    resultCard,
    resultRow,
    resultNote,
    barChart,
    clearElement,
    fmtCurrency,
} from "../Modules/Output/output.js";

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
const mainarticle = document.getElementById("mainarticle");

const calculatorCard = document.createElement("section");
calculatorCard.className = "calculator-card";
calculatorCard.innerHTML = `
  <div class="card-heading">
    <div><p class="eyebrow">Home financing</p><h2>Estimate your payment</h2></div>
    <span class="status-dot">Estimate</span>
  </div>
`;
const fields = document.createElement("div");
fields.className = "field-group";
calculatorCard.appendChild(fields);
maincontent.appendChild(calculatorCard);

const homePrice = numberInput(0, 20000000, fields, "Home price", 400000, "$", "", calculate);
const downPayment = numberInput(0, 20000000, fields, "Down payment", 80000, "$", "", calculate);
const loanTerm = numberInput(1, 40, fields, "Loan term", 30, "", "yrs", calculate);
const interestRate = numberInput(0, 25, fields, "Interest rate", 6.5, "", "%", calculate);
const propertyTax = numberInput(0, 200000, fields, "Annual property tax", 4000, "$", "", calculate);
const homeInsurance = numberInput(0, 50000, fields, "Annual home insurance", 1400, "$", "", calculate);
const hoa = numberInput(0, 20000, fields, "Monthly HOA dues", 0, "$", "", calculate);

const resultsSection = document.createElement("section");
resultsSection.className = "results-section";
maincontent.appendChild(resultsSection);

function calculate() {
    const price = homePrice.getNumericValue();
    const down = Math.min(downPayment.getNumericValue(), price);
    const loanAmount = Math.max(price - down, 0);
    const n = loanTerm.getNumericValue() * 12;
    const monthlyRate = interestRate.getNumericValue() / 100 / 12;

    let principalAndInterest;
    if (monthlyRate === 0) {
        principalAndInterest = n > 0 ? loanAmount / n : 0;
    } else {
        principalAndInterest =
            (loanAmount * monthlyRate * Math.pow(1 + monthlyRate, n)) /
            (Math.pow(1 + monthlyRate, n) - 1);
    }
    if (!isFinite(principalAndInterest)) principalAndInterest = 0;

    const monthlyTax = propertyTax.getNumericValue() / 12;
    const monthlyInsurance = homeInsurance.getNumericValue() / 12;
    const monthlyHoa = hoa.getNumericValue();

    const totalMonthly = principalAndInterest + monthlyTax + monthlyInsurance + monthlyHoa;
    const totalPaidOverLoan = principalAndInterest * n;
    const totalInterest = totalPaidOverLoan - loanAmount;

    clearElement(resultsSection);

    resultHero(
        resultsSection,
        "Estimated monthly payment",
        fmtCurrency(totalMonthly),
        "Principal, interest, taxes, insurance & HOA"
    );

    const grid = resultGrid(resultsSection);
    resultStat(grid, "Loan amount", fmtCurrency(loanAmount));
    resultStat(grid, "Down payment %", `${price > 0 ? ((down / price) * 100).toFixed(1) : 0}%`);
    resultStat(grid, "Total interest paid", fmtCurrency(totalInterest));

    const card = resultCard(resultsSection, "Monthly payment breakdown");
    resultRow(card, "Principal & interest", fmtCurrency(principalAndInterest));
    resultRow(card, "Property tax", fmtCurrency(monthlyTax));
    resultRow(card, "Home insurance", fmtCurrency(monthlyInsurance));
    resultRow(card, "HOA dues", fmtCurrency(monthlyHoa));
    resultRow(card, "Total monthly payment", fmtCurrency(totalMonthly), true);

    barChart(
        resultsSection,
        [
            { label: "Loan amount", value: loanAmount, color: "var(--accent)" },
            { label: "Total interest", value: Math.max(totalInterest, 0), color: "var(--muted)" },
        ],
        {}
    );

    resultNote(
        resultsSection,
        "Estimate only. Actual payments depend on your lender, credit, and local tax rates.",
        "neutral"
    );
}

calculate();

const description = document.createElement("section");
description.className = "description";
description.innerHTML = `
  <p class="eyebrow">About this calculator</p>
  <h2>Estimate your monthly mortgage payment</h2>
  <p>This mortgage calculator estimates your total monthly housing payment, including principal, interest, property tax, homeowners insurance, and HOA dues, based on your home price, down payment, loan term, and interest rate.</p>
`;
mainarticle.appendChild(description);

const article = document.createElement("section");
article.className = "article-card";
article.innerHTML = `
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
mainarticle.appendChild(article);
