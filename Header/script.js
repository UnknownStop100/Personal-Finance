export function createHeader() {
  const header = document.createElement('header');
    header.classList.add('site-header');
  header.innerHTML = `
    <div class="header-inner">
        <a class="logo" href="../index.html">Finance<span>Aviator</span></a>

        <nav class="main-nav" aria-label="Main navigation">
        <a href="#">Loans</a>
        <a href="#">Investing</a>
        <a href="#">Retirement</a>
        <a href="#">Savings</a>
        <a href="#">Debt</a>
        <a href="#">Real Estate</a>
        </nav>

        <button class="search-button" aria-label="Search calculators">
        <span class="search-icon">⌕</span>
        <span>Search</span>
        </button>
    </div>
  `;
  return header;
}
