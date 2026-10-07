// Calculator Carousel module
//
// Usage — drop this under any calculator page:
//
//   import { CalculatorCarousel } from "../Modules/Carousel/script.js";
//
//   const allCalculators = [
//     { name: "Mortgage Payment", url: "/mortgage", icon: "/icons/mortgage.svg", keywords: ["mortgage","home","loan"] },
//     { name: "Rent vs. Buy", url: "/rent-vs-buy", icon: "/icons/rentbuy.svg", keywords: ["mortgage","home","rent"] },
//     // ...every calculator you have, each with its own keyword list
//   ];
//
//   new CalculatorCarousel({
//       parent: document.getElementById("related-calculators"),
//       mode: "keyword",                 // "keyword" or "limit"
//       keywords: ["mortgage", "home"],  // only used when mode === "keyword"
//       limit: 8,                        // max icons shown, applies in both modes
//       visible: 5,                      // icons visible before cycling kicks in
//       excludeUrl: "/mortgage",         // don't link back to the page you're on
//   });

export class FeatureList {
    constructor(options) {
        this.options = options || {};
        this.parent = this.options.parent;
        this.allCalculators = this.options.calculators || [
     { name: "Mortgage Payment", url: "/mortgage", icon: "/icons/mortgage.svg", keywords: ["mortgage","home","loan"] },
     { name: "Rent vs. Buy", url: "/rent-vs-buy", icon: "/icons/rentbuy.svg", keywords: ["mortgage","home","rent"] },
     // ...every calculator you have, each with its own keyword list
   ];
        this.mode = this.options.mode || "limit"; // "keyword" | "limit"
        this.keywords = (this.options.keywords || []).map(k => k.toLowerCase());
        this.limit = this.options.limit || 8;
        this.visible = this.options.visible || 4;
        this.excludeUrl = this.options.excludeUrl || null;

        this.currentIndex = 0;
        //this.items = this._selectItems();
        this._generateHtml();
    }
    _generateHtml(){
let parentDiv = document.createElement("div");
parentDiv.classList.add("featured-parent");
parentDiv.innerHTML = `<div></div><section class="featured-section section">
      <div class="section-heading">
        <div>
          <p class="eyebrow">Other popular tools</p>
          <h2>Related calculators</h2>
        </div>
      </div>

      <div class="featured-track">
        <a class="featured-card" href="calculators/Mortgage Payment Calculator/index.html">
          <div class="card-top">
            <span class="card-icon">$</span>
            <span class="card-arrow">↗</span>
          </div>
          <div>
            <h3>Mortgage Payment Calculator</h3>
            <p>Estimate monthly payments, interest, and total cost.</p>
          </div>
          <span class="card-link">Open calculator →</span>
        </a>

        <a class="featured-card" href="calculators/Compound%20Interest%20Calculator/index.html">
          <div class="card-top">
            <span class="card-icon">↗</span>
            <span class="card-arrow">↗</span>
          </div>
          <div>
            <h3>Compound Interest Calculator</h3>
            <p>See how your money could grow over time.</p>
          </div>
          <span class="card-link">Open calculator →</span>
        </a>

        <a class="featured-card" href="calculators/Retirement%20Nest%20Egg%20Calculator/index.html">
          <div class="card-top">
            <span class="card-icon">◎</span>
            <span class="card-arrow">↗</span>
          </div>
          <div>
            <h3>Retirement Nest Egg Calculator</h3>
            <p>Estimate how much you may need for retirement.</p>
          </div>
          <span class="card-link">Open calculator →</span>
        </a>

        <a class="featured-card" href="calculators/Debt%20Payoff%20Calculator/index.html">
          <div class="card-top">
            <span class="card-icon">−</span>
            <span class="card-arrow">↗</span>
          </div>
          <div>
            <h3>Debt Payoff Calculator</h3>
            <p>Compare snowball vs. avalanche payoff strategies.</p>
          </div>
          <span class="card-link">Open calculator →</span>
        </a>
      </div>
    </section><div></div>`
        this.parent.appendChild(parentDiv);
    }
}