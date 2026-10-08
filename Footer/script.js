export function createFooter() {
  const footer = document.createElement('footer');
  footer.classList.add('site-footer');
  footer.innerHTML = `
    <div class="footer-inner">
      <div>
        <a class="logo footer-logo" href="#">Finance<span>Aviator</span></a>
        <p>Simple tools for better decisions.</p>
      </div>

      <div class="footer-links">
        <div>
          <strong>Calculators</strong>
        <a href="/loans/index.html">Loans</a>
        <a href="/investing/index.html">Investing</a>
        <a href="/retirement/index.html">Retirement</a>
        <a href="/savings/index.html">Savings</a>
        <a href="/debt/index.html">Debt</a>
        <a href="/real estate/index.html">Real Estate</a>
        </div>
        <div>
          <strong>Company</strong>
          <a href="/about/index.html">About</a>
          <a href="/contact/index.html">Contact</a>
          <a href="/privacy/index.html">Privacy</a>
          <a href="/terms/index.html">Terms</a>
        </div>
      </div>
    </div>

    <div class="footer-bottom">
      <span>© 2026 FinanceAviator</span>
      <span>All calculations are for informational purposes.</span>
    </div>`;
  return footer;
}
