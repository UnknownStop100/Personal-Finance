import { createHeader } from '/Header/script.js';
import { createFooter } from '/Footer/script.js';

const body = document.querySelector('body');
body.prepend(createHeader());
body.appendChild(createFooter());

initSearch();
initCategoryFilter();
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

function initCategoryFilter() {
  const buttons = document.querySelectorAll('.category');
  const cards = document.querySelectorAll('.calculator-card');
  if (!buttons.length) return;

  buttons.forEach((button) => {
    button.addEventListener('click', () => {
      buttons.forEach((b) => b.classList.remove('active'));
      button.classList.add('active');

      const filter = button.dataset.filter;
      cards.forEach((card) => {
        const show = filter === 'all' || card.dataset.category === filter;
        card.style.display = show ? '' : 'none';
      });
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

  prevButton.addEventListener('click', () => scrollByCard(-1));
  nextButton.addEventListener('click', () => scrollByCard(1));
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
}