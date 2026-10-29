import { createHeader } from '/Header/script.js';
import { createFooter } from '/Footer/script.js';
import { Data } from '/referencedata/data.js';
// Fetch data and populate the calculator grid
let data = Data();
function fetchData(category = '') {
/*  try {
    const response = await fetch('/referencedata/something.json');
    data = await response.json();
  }
  catch (error) {
    console.error('Error fetching data:', error);
  }*/


  let calcgrid = document.getElementById("calculator-grid");
  calcgrid.innerHTML = ''; // Clear existing content
  for (let i = 0; i < (data.Calculators.length>20?20:data.Calculators.length); i++) {
    if (data.Calculators[i].category.includes(category)|| category === '') {
      let element = `<a class="calculator-card" href=${data.Calculators[i].link} data-category="real-estate">
          <span class="mini-icon">${data.Calculators[i].keysymbol}</span>
          <div>
            <h3>${data.Calculators[i].name}</h3>
            <p>${data.Calculators[i].description}</p>
          </div>
          <span class="grid-arrow">→</span>
        </a>`
      calcgrid.innerHTML += element;
    }
  }
}
fetchData('');






const body = document.querySelector('body');
body.prepend(createHeader());
body.appendChild(createFooter());


initCategoryFilter();

function initCategoryFilter() {
  const buttons = document.querySelectorAll('.category');
  const cards = document.querySelectorAll('.calculator-card');
  if (!buttons.length) return;

  buttons.forEach((button) => {
    button.addEventListener('click', () => {
      buttons.forEach((b) => b.classList.remove('active'));
      button.classList.add('active');
      fetchData(button.dataset.filter);
    });
  });
}

/*initSearch();
initCarousel();
initSearchShortcut();

function initSearch() {
  const input = document.querySelector('.search-box input');
  if (!input) return;

  input.addEventListener('input', () => {
    const query = input.value.trim().toLowerCase();
    document.querySelectorAll('.calculator-card, .featured-card').forEach((card) => {
      const title = card.querySelector('h3')?.textContent.toLowerCase() || '';
      const desc = card.querySelector('p')?.textContent.toLowerCase() || '';
      const matches = !query || title.includes(query) || desc.includes(query);
      card.style.display = matches ? '' : 'none';
    });
  });
}


function initCarousel() {
  const track = document.querySelector('.featured-track');
  const prevButton = document.querySelector('[aria-label="Previous calculators"]');
  const nextButton = document.querySelector('[aria-label="Next calculators"]');
  if (!track || !prevButton || !nextButton) return;

  const scrollByCard = (direction) => {
    const card = track.querySelector('.featured-card');
    const amount = (card?.offsetWidth || 280) + 16; // card width + column gap
    track.scrollBy({ left: amount * direction, behavior: 'smooth' });
  };
}

// Makes the "⌘ K" hint already shown in the search box actually do something.
function initSearchShortcut() {
  const input = document.querySelector('.search-box input');
  if (!input) return;

  window.addEventListener('keydown', (e) => {
    const isShortcut = (e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k';
    if (isShortcut) {
      e.preventDefault();
      input.focus();
    }
  });
}*/