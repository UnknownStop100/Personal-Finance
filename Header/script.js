export function createHeader() {
  const header = document.createElement('header');
    header.classList.add('site-header');
    header.role="banner";
  header.innerHTML = `
    <div class="header-inner">
        <a class="logo" href="/">Finance<span>Aviator</span></a>

        <nav class="main-nav" aria-label="Main navigation" role="navigation">
        <a href="/loans/">Loans</a>
        <a href="/investing/">Investing</a>
        <a href="/retirement/">Retirement</a>
        <a href="/savings/">Savings</a>
        <a href="/debt/">Debt</a>
        <a href="/real estate/">Real Estate</a>
        </nav>
        <a href="/search/?search=">
        <button class="search-button" aria-label="Search calculators">
        <span class="search-icon">⌕</span>
        <span>Search</span>
        </button>
        </a>
    </div>
  `;
  return header;
}
