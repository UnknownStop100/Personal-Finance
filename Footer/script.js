export function createFooter() {
  const footer = document.createElement('footer');
  footer.classList.add('site-footer');
  footer.innerHTML = `
    <div class="footer-inner">
      <div>
        <a class="logo footer-logo" href="#">Calc<span>Pilot</span></a>
        <p>Simple tools for better decisions.</p>
      </div>

      <div class="footer-links">
        <div>
          <strong>Calculators</strong>
          <a href="#">Finance</a>
          <a href="#">Construction</a>
          <a href="#">Electrical</a>
          <a href="#">Business</a>
        </div>
        <div>
          <strong>Company</strong>
          <a href="/about/index.html">About</a>
          <a href="/contact/index.html">Contact</a>
          <a href="/privacy/index.html">Privacy</a>
          <a href="#">Terms</a>
        </div>
      </div>
    </div>

    <div class="footer-bottom">
      <span>© 2026 CalcPilot</span>
      <span>All calculations are for informational purposes.</span>
    </div>`;
  return footer;
}
