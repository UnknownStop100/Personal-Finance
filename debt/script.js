import { createHeader } from "../Header/script.js";
import { createFooter } from "../Footer/script.js";
import { titleGenerator } from "../Calculator Title/script.js";
import { createPageLayout } from "../Page Layout/script.js";
import { Data } from "../referencedata/data.js";
const body = document.querySelector("body");
const header = createHeader();
const footer = createFooter();
const title = titleGenerator(
    "Finance calculator",
    "Debt Calculators",
    "Pay down what you owe faster, and see exactly where each payment goes."
);
const main = createPageLayout();
body.prepend(title);
body.prepend(header);
body.append(main);
body.appendChild(footer);
const mainarticle = document.getElementById("mainarticle");
mainarticle.innerHTML = `
  <p class="eyebrow">About debt calculators</p>
  <h2>Get out from under it</h2>
  <p>Paying off debt is a math problem with a motivation problem attached. These calculators show how different strategies change your payoff date and total interest, so you can pick the one you'll stick with.</p>
`;


let data = Data();
function fetchData() {
/*  try {
    const response = await fetch('/referencedata/something.json');
    data = await response.json();
  }
  catch (error) {
    console.error('Error fetching data:', error);
  }
*/
  
document.getElementById("maincontent").innerHTML = `<div id="calc-index"></div>`;


const grid = document.getElementById("calc-index");
grid.className = "calc-index-grid";
for(let i=0;i<data.Calculators.length;i++){
    if(data.Calculators[i].category.includes("debt")) {
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