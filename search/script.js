import { createHeader } from "../Header/script.js";
import { createFooter } from "../Footer/script.js";
import { titleGenerator } from "../Calculator Title/script.js";
import { createPageLayout } from "../Page Layout/script.js";
import { Data } from "../referencedata/data.js";

const body = document.querySelector("body");
const header = createHeader();
const footer = createFooter();
let b=document.createElement("form");
b.className="search-box";
b.action="/search/index.html";
b.method="GET";
let a=`<button type="submit" class="search-submit-btn" aria-label="Submit search">⌕</button>
          <input type="search" name="search" id="global-search" placeholder="Search calculators..." aria-label="Search calculators">
          <kbd class="shortcut-badge" style="visibility: hidden">⌘ K</kbd>`;
b.innerHTML=a;
let c=document.createElement("div");
c.className="search-bar";
c.append(b);
const main = createPageLayout();
body.prepend(c);
body.prepend(header);
body.append(main);
body.appendChild(footer);
const mainarticle = document.getElementById("mainarticle");
mainarticle.innerHTML = `
  <p class="eyebrow">About search results</p>
  <h2>Find what you need and where it is</h2>
  <p>Looking for a specific calculator? Use this search to instantly look up financial resources across our entire library to help keep your goals on track.</p>
`;


let data = Data();
function fetchData(search="") {
  /*try {
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
  let wholestring=""
  let table=search.split(" ");
  let found=false;
    for(let j=0;j<table.length;j++){
      if(data.Calculators[i].keywords.includes(table[j])){
        found=true;
      }
    }
    if(found) {
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

document.addEventListener('DOMContentLoaded', () => {
  const urlParams = new URLSearchParams(window.location.search);
  const searchQuery = urlParams.get('search');
  const searchInput = document.getElementById('global-search');
  searchInput.value=searchQuery;
fetchData(searchQuery.toLowerCase());
});

