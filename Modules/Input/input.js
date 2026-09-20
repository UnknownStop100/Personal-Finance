export class Input {
    constructor(min, max, parentelement, labeltext = "", initialvalue = 0, prefix = "", suffix = "", runfunction = () => { }, help = "") {
        this.min = min;
        this.max = max;
        this.parentelement = parentelement;
        this.labeltext = labeltext;
        this.initialvalue = initialvalue;
        this.prefix = prefix;
        this.suffix = suffix;
        this.runfunction = runfunction;
        this.help = help;
        this._CreateInput();
    }

    _CreateInput() {
        // Create DOM elements
        this.label = document.createElement("label");
        const inputdiv = document.createElement("div");
        this.input = document.createElement("input"); // Store as class property
        const inputprefix = document.createElement("div");
        const inputsuffix = document.createElement("div");

        // Helper functions
        const measureText = (text) => {
            if (!text) return 0;
            const helper = document.createElement("span");
            helper.style.position = "absolute";
            helper.style.visibility = "hidden";
            helper.style.whiteSpace = "nowrap";
            helper.style.font = window.getComputedStyle(this.input).font;
            helper.textContent = text;
            document.body.appendChild(helper);
            const width = helper.offsetWidth;
            helper.remove();
            return width;
        };

        const getPadding = (text) => {
            if (!text) return 12;
            const buffer = 18;
            return Math.max(12, measureText(text) + buffer);
        };

        // Set IDs and classes
        this.label.id = "input-label";
        this.input.id = this.labeltext.toLowerCase().replaceAll(" ", "-") + "-input";

        this.input.className = "input";
        inputdiv.id = "input-div";
        inputprefix.id = "input-prefix";
        inputsuffix.id = "input-suffix";

        // Prefix / suffix styling
        inputprefix.style.font = "inherit";
        inputsuffix.style.font = "inherit";
        inputprefix.style.color = "inherit";
        inputsuffix.style.color = "inherit";

        // Use text instead of number so commas can be displayed
        this.input.type = "text";
        this.input.inputMode = "text";

        // Set initial value formatted
        this.input.value = Number(this.initialvalue).toLocaleString("en-US");
        this.input.style.font = "inherit";

        // Set padding
        this.input.style.paddingLeft = `${getPadding(this.prefix)}px`;
        this.input.style.paddingRight = `${getPadding(this.suffix)}px`;
        this.input.style.boxSizing = "border-box";

        // Prefix / suffix text
        inputprefix.textContent = this.prefix;
        inputsuffix.textContent = this.suffix;

        this.label.htmlFor = this.input.id;

        // Label with help
        if (this.labeltext) {
            let thesup = document.createElement('sup');
            thesup.innerHTML = this.help;
            this.label.innerHTML = this.labeltext;
            this.label.appendChild(thesup);
            this.parentelement.appendChild(this.label);
        }

        // Build input container
        inputdiv.appendChild(inputprefix);
        inputdiv.appendChild(this.input);
        inputdiv.appendChild(inputsuffix);
        this.parentelement.appendChild(inputdiv);

        // Utility to get numeric value
        this.getNumericValue = () => {
            return Number(this.input.value.replace(/,/g, ""));
        };

        // Format input with commas, preserve cursor
        this.formatInput = () => {
            // Save cursor position
            const cursorPosition = this.input.selectionStart;

            // Count how many digits are before the cursor in unformatted string
            const unformattedValue = this.input.value
                .slice(0, cursorPosition)
                .replace(/,/g, "")
                .replace(/[^\d.-]/g, "");

            // Count the number of digits before cursor
            const digitsBeforeCursor = unformattedValue.length;

            // Format the value
            let value = this.input.value
                .replace(/,/g, "")
                .replace(/[^\d.-]/g, "");

            // Prevent multiple decimals
            const decimalIndex = value.indexOf(".");
            if (decimalIndex !== -1) {
                value = value.substring(0, decimalIndex + 1) +
                    value.substring(decimalIndex + 1).replace(/\./g, "");
            }

            if (value === "" || value === "." || value === "-") {
                this.input.value = value;
            } else {
                const parts = value.split(".");
                const wholeNumber = Number(parts[0]).toLocaleString("en-US");
                this.input.value = parts.length > 1 ? wholeNumber + "." + parts[1] : wholeNumber;
            }

            // Now, find the position in the formatted string
            let count = 0;
            let newCursorPos = 0;
            for (let i = 0; i < this.input.value.length; i++) {
                if (/\d/.test(this.input.value[i])) {
                    count++;
                }
                if (count >= digitsBeforeCursor) {
                    newCursorPos = i + 1;
                    break;
                }
            }

            // Set the cursor position
            this.input.setSelectionRange(newCursorPos, newCursorPos);
        };

        // Event listener
        this.input.addEventListener("input", () => {
            // Save cursor position before formatting
            const cursorPosition = this.input.selectionStart;

            let value = this.getNumericValue();

            if (value > this.max) {
                value = this.max;
                this.input.value = Number(this.max).toLocaleString("en-US");
            }
            if (value < this.min && (this.input.value !== "" && this.input.value !== "-")) {
                // Optional: enforce min
                // this.input.value = Number(this.min).toLocaleString("en-US");
            }

            // Format with commas and adjust cursor
            this.formatInput();

            // Call runfunction if value is within bounds
            if (value >= this.min && value <= this.max) {
                this.runfunction();
            }
        });
    }

    getValue() {
        return Number(this.input.value.replace(/,/g, ""));
    }
}
export function numberInput(
    min,
    max,
    parentelement,
    labeltext = "",
    initialvalue = 0,
    prefix = "",
    suffix = "",
    runfunction = () => { },
    help = ""
) {
    const label = document.createElement("label");
    const inputdiv = document.createElement("div");
    const input = document.createElement("input");
    const inputprefix = document.createElement("div");
    const inputsuffix = document.createElement("div");

    const measureText = (text) => {
        if (!text) return 0;

        const helper = document.createElement("span");

        helper.style.position = "absolute";
        helper.style.visibility = "hidden";
        helper.style.whiteSpace = "nowrap";
        helper.style.font = window.getComputedStyle(input).font;

        helper.textContent = text;

        document.body.appendChild(helper);

        const width = helper.offsetWidth;

        helper.remove();

        return width;
    };

    const getPadding = (text) => {
        if (!text) return 12;

        const buffer = 18;

        return Math.max(
            12,
            measureText(text) + buffer
        );
    };

    // IDs
    label.id = "input-label";

    input.id =
        labeltext
            .toLowerCase()
            .replaceAll(" ", "-") + "-input";

    input.className = "input";

    inputdiv.id = "input-div";
    inputprefix.id = "input-prefix";
    inputsuffix.id = "input-suffix";

    // Prefix / suffix styling
    inputprefix.style.font = "inherit";
    inputsuffix.style.font = "inherit";

    inputprefix.style.color = "inherit";
    inputsuffix.style.color = "inherit";

    // Use text instead of number so commas can be displayed
    input.type = "text";
    input.inputMode = "text";

    // Format initial value
    input.value = Number(initialvalue).toLocaleString("en-US");

    input.style.font = "inherit";

    input.style.paddingLeft =
        `${getPadding(prefix)}px`;

    input.style.paddingRight =
        `${getPadding(suffix)}px`;

    input.style.boxSizing = "border-box";

    inputprefix.textContent = prefix;
    inputsuffix.textContent = suffix;

    label.htmlFor = input.id;

    // Label
    if (labeltext) {
        let thesup = document.createElement('sup');
        thesup.innerHTML = help;
        label.innerHTML = labeltext;
        label.appendChild(thesup);
        parentelement.appendChild(label);
    }

    // Build input
    inputdiv.appendChild(inputprefix);
    inputdiv.appendChild(input);
    inputdiv.appendChild(inputsuffix);

    parentelement.appendChild(inputdiv);


    // Convert displayed value into a real number
    const getNumericValue = () => {
        return Number(
            input.value.replace(/,/g, "")
        );
    };


    // Format the number with commas
    const formatInput = () => {
        const selectionStart = input.selectionStart;
        const selectionEnd = input.selectionEnd;

        let value = input.value
            .replace(/,/g, "")
            .replace(/[^\d.-]/g, "");

        // Prevent multiple decimal points
        const decimalIndex = value.indexOf(".");

        if (decimalIndex !== -1) {
            value =
                value.substring(0, decimalIndex + 1) +
                value
                    .substring(decimalIndex + 1)
                    .replace(/\./g, "");
        }

        if (value === "" || value === "." || value === "-") {
            input.value = value;
            return;
        }

        const parts = value.split(".");

        const wholeNumber =
            Number(parts[0]).toLocaleString("en-US");

        if (parts.length > 1) {
            input.value =
                wholeNumber + "." + parts[1];
        } else {
            input.value = wholeNumber;
        }



        // Calculate the new cursor position
        const newLength = input.value.length;
        const oldLength = input.value.length;

        // Adjust cursor position based on formatting
        const diff = newLength - oldLength;

        // Attempt to set cursor back to previous position
        // Note: This simple approach may need refinement for complex formatting
        const newPosition = Math.min(selectionStart + diff, input.value.length);
        input.setSelectionRange(newPosition, newPosition);
    };


    // Input event
    input.addEventListener("input", () => {

        let value = getNumericValue();

        if (value > max) {
            value = max;
            input.value =
                Number(max).toLocaleString("en-US");
        }

        if (value < min && (input.value !== "" || input.value !== "-")) {
            // Don't immediately force min while typing
            // because it makes editing difficult.
            //input.value=Number(min).toLocaleString("en-US");
        }

        formatInput();

        if (value >= min && value <= max) {
            runfunction();
        }
        if (value < min && (input.value !== "" || input.value !== "-")) {
            //Write a display so it says it needs to be above the minimum
        }
    });


    // Allow other modules/calculators to get the numeric value
    input.getNumericValue = getNumericValue;


    return input;
}

export function valueInputs(labeltext, inputvalues, outputvalues, parentelement, runfunction = () => { }, help = "") {
    const label = document.createElement("label");
    const select = document.createElement("select");
    label.for = labeltext.toLowerCase().replaceAll(" ", "-") + "-label";
    select.id = labeltext.toLowerCase().replaceAll(" ", "-") + "-select";
    select.className = "select";
    label.innerHTML = labeltext;
    let thesup = document.createElement("sup");
    thesup.innerHTML = help;
    label.appendChild(thesup);

    for (let i = 0; i < inputvalues.length; i++) {
        const option = document.createElement("option");
        option.value = outputvalues[i];
        option.textContent = inputvalues[i];
        select.appendChild(option);
    }

    parentelement.appendChild(label);
    parentelement.appendChild(document.createElement("br"));
    parentelement.appendChild(select);

    select.addEventListener("change", () => {
        runfunction();
    });

    return select;
}