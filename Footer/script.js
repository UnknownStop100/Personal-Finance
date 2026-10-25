export function createFooter() {
  const footer = document.createElement('footer');
  footer.classList.add('site-footer');
  footer.role="contentinfo";
  footer.innerHTML = `
    <div class="footer-inner">
      <div>
        <a class="logo footer-logo" href="/">Finance<span>Aviator</span></a>
        <p>Simple tools for better decisions.</p>
      </div>

      <div class="footer-links">
        <div>
          <strong>Calculators</strong>
        <a href="/loans/">Loans</a>
        <a href="/investing/">Investing</a>
        <a href="/retirement/">Retirement</a>
        <a href="/savings/">Savings</a>
        <a href="/debt/">Debt</a>
        <a href="/real estate/">Real Estate</a>
        </div>
        <div>
          <strong>Company</strong>
          <a href="/about/">About</a>
          <a href="/contact/">Contact</a>
          <a href="/privacy/">Privacy</a>
          <a href="/terms/">Terms</a>
        </div>
      </div>
    </div>

    <div class="footer-bottom">
      <span>© 2026 FinanceAviator</span>
      <span>All calculations are for informational purposes.</span>
    </div>`;
  return footer;
}
