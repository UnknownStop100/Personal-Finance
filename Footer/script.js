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
          <a href="#">Loans</a>
          <a href="#">Investing</a>
          <a href="#">Retirement</a>
          <a href="#">Savings</a>
          <a href="#">Debt</a>
          <a href="#">Real Estate</a>
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
