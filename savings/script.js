import { createHeader } from "../Header/script.js";
import { createFooter } from "../Footer/script.js";
import { titleGenerator } from "../Calculator Title/script.js";
import { createPageLayout } from "../Page Layout/script.js";

const body = document.querySelector("body");
const header = createHeader();
const footer = createFooter();
const title = titleGenerator(
    "Finance calculator",
    "Savings Calculators",
    "Build a safety net, watch your savings grow, and see where you stand."
);
const main = createPageLayout();
body.prepend(title);
body.prepend(header);
body.append(main);
body.appendChild(footer);
const mainarticle = document.getElementById("mainarticle");
mainarticle.innerHTML = `
  <p class="eyebrow">About savings calculators</p>
  <h2>Know what you have and what it's becoming</h2>
  <p>Savings work best with a target and a timeline. These calculators help you set an emergency fund goal, project how regular deposits compound, and track your overall net worth.</p>
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
    if(data.Calculators[i].category.includes("savings")) {
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