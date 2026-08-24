import { numberInput, valueInputs } from "../Modules/Input/input.js";
import { createFooter } from "../Footer/script.js";
import { createHeader } from "../Header/script.js";
import { titleGenerator } from "../Calculator Title/script.js";
import { createPageLayout } from "../Page Layout/script.js";
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

const principal = numberInput(0, 100000000, maincontent, "Initial amount", 10000, "$", "", calculate);
const monthlyContribution = numberInput(0, 1000000, maincontent, "Monthly contribution", 200, "$", "", calculate);
const rate = numberInput(0, 30, maincontent, "Annual interest rate", 7, "", "%", calculate);
const years = numberInput(1, 60, maincontent, "Years to grow", 25, "", "yrs", calculate);
const frequency = valueInputs(
    "Compounding frequency",
    ["Annually", "Monthly", "Daily"],
    [1, 12, 365],
    maincontent,
    calculate
);

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

    clearElement(mainarticle);

    resultHero(
        mainarticle,
        "Future value",
        fmtCurrency(finalBalance),
        `After ${t} years at ${rate.getNumericValue()}% annual interest`
    );

    const grid = resultGrid(mainarticle);
    resultStat(grid, "Total contributed", fmtCurrency(totalContributed));
    resultStat(grid, "Total interest earned", fmtCurrency(totalInterest));
    resultStat(grid, "Interest as % of balance", `${((totalInterest / finalBalance) * 100).toFixed(1)}%`);

    lineChart(
        mainarticle,
        [
            { name: "Balance", points: yearlyPoints, color: "var(--accent)" },
            { name: "Total contributed", points: contribPoints, color: "var(--muted)" },
        ],
        { xFormatter: (v) => `Yr ${Math.round(v)}` }
    );

    resultNote(
        mainarticle,
        "This is an estimate. Actual investment returns vary and are never guaranteed.",
        "neutral"
    );
}

calculate();
