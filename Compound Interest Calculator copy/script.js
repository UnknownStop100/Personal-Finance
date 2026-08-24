import { createHeader } from "/Header/script.js";
import { createFooter } from "/Footer/script.js";
import { titleGenerator } from "../Calculator Title/script.js";
import { createPageLayout } from "../Page Layout/script.js";
import { numberInput, valueInputs } from "../Modules/Input/input.js";
import {
    resultHero,
    resultGrid,
    resultStat,
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
    "Compound Interest Calculator",
    "See how a lump sum plus regular contributions grows over time with compound interest."
);
const main = createPageLayout();
body.prepend(title);
body.prepend(header);
body.append(main);
body.appendChild(footer);

const maincontent = document.getElementById("maincontent");
const mainarticle = document.getElementById("mainarticle");

// Calculator card
const calculatorCard = document.createElement("section");
calculatorCard.className = "calculator-card";
calculatorCard.innerHTML = `
  <div class="card-heading">
    <div><p class="eyebrow">Investment growth</p><h2>Compound interest</h2></div>
    <span class="status-dot">Estimate</span>
  </div>
`;
const fields = document.createElement("div");
fields.className = "field-group";
calculatorCard.appendChild(fields);
maincontent.appendChild(calculatorCard);

const principal = numberInput(0, 100000000, fields, "Initial amount", 10000, "$", "", calculate);
const monthlyContribution = numberInput(0, 1000000, fields, "Monthly contribution", 200, "$", "", calculate);
const rate = numberInput(0, 30, fields, "Annual interest rate", 7, "", "%", calculate);
const years = numberInput(1, 60, fields, "Years to grow", 25, "", "yrs", calculate);
const frequency = valueInputs(
    "Compounding frequency",
    ["Annually", "Monthly", "Daily"],
    [1, 12, 365],
    fields,
    calculate
);

// Results section
const resultsSection = document.createElement("section");
resultsSection.className = "results-section";
maincontent.appendChild(resultsSection);

function calculate() {
    const P = principal.getNumericValue();
    const monthly = monthlyContribution.getNumericValue();
    const annualRate = rate.getNumericValue() / 100;
    const n = Number(frequency.value);
    const t = years.getNumericValue();

    const totalPeriods = Math.round(n * t);
    const periodRate = annualRate / n;
    const periodContribution = (monthly * 12) / n;

    let balance = P;
    const yearlyPoints = [{ x: 0, y: balance }];
    const contribPoints = [{ x: 0, y: P }];
    let totalContributed = P;

    for (let period = 1; period <= totalPeriods; period++) {
        balance = balance * (1 + periodRate) + periodContribution;
        totalContributed += periodContribution;
        if (period % n === 0 || period === totalPeriods) {
            const yearMark = period / n;
            yearlyPoints.push({ x: yearMark, y: balance });
            contribPoints.push({ x: yearMark, y: totalContributed });
        }
    }

    const finalBalance = balance;
    const totalInterest = finalBalance - totalContributed;

    clearElement(resultsSection);

    resultHero(
        resultsSection,
        "Future value",
        fmtCurrency(finalBalance),
        `After ${t} years at ${rate.getNumericValue()}% annual interest`
    );

    const grid = resultGrid(resultsSection);
    resultStat(grid, "Total contributed", fmtCurrency(totalContributed));
    resultStat(grid, "Total interest earned", fmtCurrency(totalInterest));
    resultStat(grid, "Interest as % of balance", `${((totalInterest / finalBalance) * 100).toFixed(1)}%`);

    lineChart(
        resultsSection,
        [
            { name: "Balance", points: yearlyPoints, color: "var(--accent)" },
            { name: "Total contributed", points: contribPoints, color: "var(--muted)" },
        ],
        { xFormatter: (v) => `Yr ${Math.round(v)}` }
    );

    resultNote(
        resultsSection,
        "This is an estimate. Actual investment returns vary and are never guaranteed.",
        "neutral"
    );
}

calculate();

// SEO article content
const description = document.createElement("section");
description.className = "description";
description.innerHTML = `
  <p class="eyebrow">About this calculator</p>
  <h2>Calculate compound interest on savings and investments</h2>
  <p>This compound interest calculator projects how an initial deposit and ongoing monthly contributions grow over time, based on your annual interest rate and compounding frequency.</p>
`;
mainarticle.appendChild(description);

const article = document.createElement("section");
article.className = "article-card";
article.innerHTML = `
  <p class="eyebrow">Compound interest guide</p>
  <h2>How compound interest works</h2>
  <p>Compound interest is interest calculated on both your original principal and the interest that has already accumulated. Unlike simple interest, which only grows the principal, compounding means your balance earns "interest on interest," so growth accelerates the longer money stays invested.</p>
  <h3>The compound interest formula</h3>
  <p>The standard formula is A = P(1 + r/n)^(nt), where P is the principal, r is the annual interest rate, n is the number of times interest compounds per year, and t is the number of years. When you add regular monthly contributions, each deposit also compounds for the remainder of the time horizon.</p>
  <h3>Why compounding frequency matters</h3>
  <p>Interest that compounds daily grows slightly faster than interest that compounds monthly or annually, because each compounding period adds a small amount of interest that itself starts earning interest sooner.</p>
  <h3>Why starting early matters</h3>
  <p>Because compound growth accelerates over time, money invested early has more compounding periods to benefit from, which is why long time horizons often matter more than a higher starting balance.</p>
`;
mainarticle.appendChild(article);
