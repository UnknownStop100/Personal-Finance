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
    "Retirement Calculators",
    "Estimate how much you'll need, how much you'll have, and how far inflation will stretch it."
);
const main = createPageLayout();
body.prepend(title);
body.prepend(header);
body.append(main);
body.appendChild(footer);

const mainarticle = document.getElementById("mainarticle");
mainarticle.innerHTML = `
  <p class="eyebrow">About retirement calculators</p>
  <h2>Plan for the years after work</h2>
  <p>Retirement planning comes down to three questions: how much you'll save, how it will grow, and how much it will actually buy when you need it. These calculators cover each one.</p>
`;

let data = Data();
function fetchData() {
 /* try {
    const response = await fetch('/referencedata/something.json');
    data = await response.json();
  }
  catch (error) {
    console.error('Error fetching data:', error);
  }*/

  
document.getElementById("maincontent").innerHTML = `<div id="calc-index"></div>`;


const grid = document.getElementById("calc-index");
grid.className = "calc-index-grid";
for(let i=0;i<data.Calculators.length;i++){
    if(data.Calculators[i].category.includes("retirement")) {
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