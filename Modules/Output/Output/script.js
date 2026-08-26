export function output(title){
    
    const outputdiv = document.createElement("div");
    const outputtitle = document.createElement("div");
    const output = document.createElement("div");
    outputdiv.className="divoutput";
    outputtitle.className="titleoutput";
    outputtitle.innerHTML=title;
    output.className="valueoutput";
    title=title.toLowerCase().replace(/\s/g, "");
    output.id=title;
    outputdiv.append(outputtitle);
    outputdiv.append(output);
    return outputdiv;
}
export function formatInput (value) {
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
            return value;
        }

        const parts = value.split(".");

        const wholeNumber =
            Number(parts[0]).toLocaleString("en-US");

        if (parts.length > 1) {
            return    wholeNumber + "." + parts[1];
        } else {
            return wholeNumber;
        }
    };