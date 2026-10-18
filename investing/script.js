import { createHeader } from "../Header/script.js";
import { createFooter } from "../Footer/script.js";
import { titleGenerator } from "../Calculator Title/script.js";
import { createPageLayout } from "../Page Layout/script.js";

const body = document.querySelector("body");
const header = createHeader();
const footer = createFooter();
const title = titleGenerator(
    "Finance calculator",
    "Investing Calculators",
    "Project how your money grows: compound interest, investment returns, retirement savings, and the effect of inflation."
);
const main = createPageLayout();
body.prepend(title);
body.prepend(header);
body.append(main);
body.appendChild(footer);
const mainarticle = document.getElementById("mainarticle");
document.getElementById("mainarticle").innerHTML = `
  <p class="eyebrow">About investing calculators</p>
  <h2>Plan how your money grows</h2>
  <p>Whether you're investing a lump sum, contributing monthly, or saving for retirement, these calculators show what your money could be worth over time and how much of that growth inflation will take back.</p>
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
    if(data.Calculators[i].category.includes("investments")) {
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