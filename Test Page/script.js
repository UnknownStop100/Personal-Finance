import { numberInput } from "../Modules/Input/input.js";
import { valueInputs } from "../Modules/Input/input.js";
import { createFooter } from "../Footer/script.js";
import { createHeader } from "../Header/script.js";
import { titleGenerator } from "../Calculator Title/script.js";
import { createPageLayout } from "../Page Layout/script.js";
const body = document.querySelector('body');
const header = createHeader();
const footer = createFooter();
const title = titleGenerator("Finance calculator", "Investment Calculator", "Plot future investment growth using compound interest and regular contributions.");
const main = createPageLayout();
body.prepend(title);
body.prepend(header);
body.append(main);
body.appendChild(footer);
const maincontent=document.getElementById("maincontent");
const value1=numberInput(0,1000000000,maincontent,"Dollars",0,"$","");
const value2=numberInput(0,4000000000,maincontent,"Quarters",0,"  ","");
const value3=numberInput(0,10000000000,maincontent,"Dimes",0,"  ","");
const value4=numberInput(0,20000000000,maincontent,"Nickels",0,"  ","");
const value5=numberInput(0,100000000000,maincontent,"Pennies",0,"¢","");
 const formatInput = (value) => {
            value=value+"";
            value.replace(/,/g, "")
            .replace(/[^\d.]/g, "");

        // Prevent multiple decimal points
        const decimalIndex = value.indexOf(".");

        if (decimalIndex !== -1) {
            value =
                value.substring(0, decimalIndex + 1) +
                value
                    .substring(decimalIndex + 1)
                    .replace(/\./g, "");
        }

        if (value === "" || value === ".") {
            value = value;
            return value;
        }

        const parts = value.split(".");

        const wholeNumber =
            Number(parts[0]).toLocaleString("en-US");

        if (parts.length > 1) {
            value =
                wholeNumber + "." + parts[1];
        } else {
            value = wholeNumber;
        }
        return value;
    };
function solvedollars() {
    const dollars = Number(value1.value.replaceAll(",","")) || 0;

    // work in integer cents to avoid floating point drift
    let cents = Math.round(dollars * 100);

    const quarters = Math.round(cents / 25);

    const dimes = Math.round(cents / 10);

    const nickels = Math.round(cents / 5);

    const pennies = cents; // whatever's left is pennies

    value2.value = formatInput(quarters);
    value3.value = formatInput(dimes);
    value4.value = formatInput(nickels);
    value5.value = formatInput(pennies);
}

value1.addEventListener("input", solvedollars);
value1.addEventListener("change", solvedollars);
const mainarticle=document.getElementById("mainarticle");
mainarticle.append(`hello`);