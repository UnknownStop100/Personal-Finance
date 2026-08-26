export function numberInput(
    min,
    max,
    parentelement,
    labeltext = "",
    initialvalue = 0,
    prefix = "",
    suffix = "",
    runfunction = () => {},
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
    input.inputMode = "decimal";

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
        let thesup=document.createElement('sup');
        thesup.innerHTML=help;
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

        if (value === "" || value === ".") {
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
    };


    // Input event
    input.addEventListener("input", () => {

        let value = getNumericValue();

        if (value > max) {
            value = max;
            input.value =
                Number(max).toLocaleString("en-US");
        }

        if (value < min && input.value !== "") {
            // Don't immediately force min while typing
            // because it makes editing difficult.
        }

        formatInput();

        runfunction();
    });


    // Allow other modules/calculators to get the numeric value
    input.getNumericValue = getNumericValue;


    return input;
}

export function valueInputs(labeltext, inputvalues, outputvalues, parentelement, runfunction = () => {}, help="") {
    const label = document.createElement("label");
    const select = document.createElement("select");
    label.for = labeltext.toLowerCase().replaceAll(" ", "-") + "-label";
    select.id = labeltext.toLowerCase().replaceAll(" ", "-") + "-select";
    select.className = "select";
    label.innerHTML = labeltext;
    let thesup=document.createElement("sup");
    thesup.innerHTML=help;
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