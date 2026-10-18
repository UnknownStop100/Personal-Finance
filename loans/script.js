import { createHeader } from "../Header/script.js";
import { createFooter } from "../Footer/script.js";
import { titleGenerator } from "../Calculator Title/script.js";
import { createPageLayout } from "../Page Layout/script.js";


const body = document.querySelector("body");
const header = createHeader();
const footer = createFooter();
const title = titleGenerator(
    "Finance calculator",
    "Loan Calculators",
    "Everything related to borrowing: mortgages, auto loans, amortization schedules, and paying off debt."
);
const main = createPageLayout();
body.prepend(title);
body.prepend(header);
body.append(main);
body.appendChild(footer);
const mainarticle = document.getElementById("mainarticle");
mainarticle.innerHTML = `
  <p class="eyebrow">About loan calculators</p>
  <h2>Everything related to borrowing money</h2>
  <p>Whether you're buying a home, financing a car, or paying down existing debt, these calculators help you understand what you'll actually pay, how long it will take, and what your options are.</p>
`;
let data = {};
async function fetchData() {
  try {
    const response = await fetch('/referencedata/something.json');
    data = await response.json();
  }
  catch (error) {
    console.error('Error fetching data:', error);
  }

  
document.getElementById("maincontent").innerHTML = `<div id="calc-index"></div>`;


const grid = document.getElementById("calc-index");
grid.className = "calc-index-grid";
for(let i=0;i<data.Calculators.length;i++){
    if(data.Calculators[i].category.includes("loans")) {
        let element=`
        <a class="calc-index-card" href=${data.Calculators[i].link}>
            <div class="calc-index-icon">
                ${data.Calculators[i].name[0].toUpperCase()}
            </div>
            <h3 class="calc-index-name">${data.Calculators[i].name}</h3>
            <p class="calc-index-desc">${data.Calculators[i].description}</p>
        </a>`;
        grid.innerHTML+=element;
    }
}
}
fetchData();