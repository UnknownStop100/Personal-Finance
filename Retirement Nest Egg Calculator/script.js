import { createHeader } from "/Header/script.js";
import { createFooter } from "/Footer/script.js";
import { titleGenerator } from "../Calculator Title/script.js";
import { createPageLayout } from "../Page Layout/script.js";
import { numberInput } from "../Modules/Input/input.js";
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
    "Retirement Nest Egg Calculator",
    "Project your retirement savings and see if they'll cover your desired retirement income."
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
    <div><p class="eyebrow">Retirement planning</p><h2>Project your nest egg</h2></div>
    <span class="status-dot">Estimate</span>
  </div>
`;
const fields = document.createElement("div");
fields.className = "field-group";
calculatorCard.appendChild(fields);
maincontent.appendChild(calculatorCard);

const currentAge = numberInput(18, 90, fields, "Current age", 30, "", "yrs", calculate);
const retireAge = numberInput(19, 95, fields, "Retirement age", 65, "", "yrs", calculate);
const currentSavings = numberInput(0, 100000000, fields, "Current retirement savings", 40000, "$", "", calculate);
const monthlyContribution = numberInput(0, 1000000, fields, "Monthly contribution", 500, "$", "", calculate);
const annualReturn = numberInput(0, 20, fields, "Expected annual return", 7, "", "%", calculate);
const desiredIncome = numberInput(0, 5000000, fields, "Desired annual retirement income", 60000, "$", "", calculate);
const withdrawalRate = numberInput(1, 10, fields, "Safe withdrawal rate", 4, "", "%", calculate);

const resultsSection = document.createElement("section");
resultsSection.className = "results-section";
maincontent.appendChild(resultsSection);

function calculate() {
    const age = currentAge.getNumericValue();
    const retAge = Math.max(retireAge.getNumericValue(), age + 1);
    const yearsToGrow = retAge - age;
    const start = currentSavings.getNumericValue();
    const monthly = monthlyContribution.getNumericValue();
    const rate = annualReturn.getNumericValue() / 100;
    const income = desiredIncome.getNumericValue();
    const swr = withdrawalRate.getNumericValue() / 100;

    const monthlyRate = rate / 12;
    let balance = start;
    const points = [{ x: age, y: balance }];

    for (let year = 1; year <= yearsToGrow; year++) {
        for (let m = 0; m < 12; m++) {
            balance = balance * (1 + monthlyRate) + monthly;
        }
        points.push({ x: age + year, y: balance });
    }

    const nestEgg = balance;
    const sustainableIncome = nestEgg * swr;
    const gap = income - sustainableIncome;
    const meetsGoal = sustainableIncome >= income;

    clearElement(resultsSection);

    resultHero(
        resultsSection,
        "Projected nest egg at retirement",
        fmtCurrency(nestEgg),
        `At age ${retAge}, after ${yearsToGrow} years of growth`
    );

    const grid = resultGrid(resultsSection);
    resultStat(grid, "Sustainable annual income", fmtCurrency(sustainableIncome));
    resultStat(grid, `${meetsGoal ? "Surplus" : "Shortfall"} vs. goal`, fmtCurrency(Math.abs(gap)));
    resultStat(grid, "Total contributed", fmtCurrency(monthly * 12 * yearsToGrow + start));

    lineChart(resultsSection, [{ name: "Projected balance", points, color: "var(--accent)" }], {
        xFormatter: (v) => `Age ${Math.round(v)}`,
    });

    resultNote(
        resultsSection,
        meetsGoal
            ? `On this path, your savings could support your ${fmtCurrency(income)} annual income goal using a ${withdrawalRate.getNumericValue()}% withdrawal rate.`
            : `At this rate you'd fall short of your ${fmtCurrency(income)} goal by about ${fmtCurrency(gap)}/yr. Consider saving more or working longer.`,
        meetsGoal ? "good" : "warning"
    );
}

calculate();

const description = document.createElement("section");
description.className = "description";
description.innerHTML = `
  <p class="eyebrow">About this calculator</p>
  <h2>Project your retirement nest egg</h2>
  <p>This retirement calculator projects how your current savings and monthly contributions could grow by retirement age, and compares the sustainable income it could generate against your retirement income goal.</p>
`;
mainarticle.appendChild(description);

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
