export function createHeader() {
  const header = document.createElement('header');
    header.classList.add('site-header');
  header.innerHTML = `
    <div class="header-inner">
        <a class="logo" href="/index.html">Finance<span>Aviator</span></a>

        <nav class="main-nav" aria-label="Main navigation">
        <a href="/loans/index.html">Loans</a>
        <a href="/investing/index.html">Investing</a>
        <a href="/retirement/index.html">Retirement</a>
        <a href="/savings/index.html">Savings</a>
        <a href="/debt/index.html">Debt</a>
        <a href="/real estate/index.html">Real Estate</a>
        </nav>

        <button class="search-button" aria-label="Search calculators" style="content-visibility: hidden;">
        <span class="search-icon" style="content-visibility: hidden;">⌕</span>
        <span style="content-visibility: hidden;">Search</span>
        </button>
    </div>
  `;
  return header;
}
