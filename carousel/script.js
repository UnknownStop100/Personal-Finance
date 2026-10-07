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

export class CalculatorCarousel {
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
        //create a div to hold new elements
        let parentDiv = document.createElement("div");
        parentDiv.classList.add("carousel-parent");
        let leftdiv = document.createElement("div");
        leftdiv.classList.add("carousel-left");
        let rightdiv = document.createElement("div");
        rightdiv.classList.add("carousel-right");
        let carouselContainer = document.createElement("div");
        carouselContainer.classList.add("calculator-carousel");
        carouselContainer.id = "calculator-carousel";
        //add the number of visible items to the carouselContainer class
        for (let i = 0; i < this.visible; i++) {
            let item = document.createElement("div");
            item.classList.add("carousel-item");
            item.id = `carousel-item-${i}`;
            let image = document.createElement("div");
            let title = document.createElement("div");
            let description = document.createElement("div");
            let linkwelcome = document.createElement("div");
            linkwelcome.innerHTML = `Open calculator →`;
            item.appendChild(image);
            item.appendChild(title);
            item.appendChild(description);
            item.appendChild(linkwelcome);
            carouselContainer.appendChild(item);
        }
        parentDiv.appendChild(leftdiv);
        parentDiv.appendChild(carouselContainer);
        parentDiv.appendChild(rightdiv);
        this.parent.appendChild(parentDiv);
    }
}