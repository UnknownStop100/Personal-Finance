export function createHeader() {
  const header = document.createElement('header');
    header.classList.add('site-header');
  header.innerHTML = `
    <div class="header-inner">
        <a class="logo" href="../index.html">Calc<span>Pilot</span></a>

        <nav class="main-nav" aria-label="Main navigation">
        <a href="#">Finance</a>
        <a href="#">Construction</a>
        <a href="#">Electrical</a>
        <a href="#">Business</a>
        </nav>

        <button class="search-button" aria-label="Search calculators">
        <span class="search-icon">⌕</span>
        <span>Search</span>
        </button>
    </div>
  `;
  return header;
}
