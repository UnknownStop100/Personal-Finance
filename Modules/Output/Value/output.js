export function numberOutput(parentElement, labelText = "", initialValue = 0, formatter = (value) => Number(value).toLocaleString(undefined, { maximumFractionDigits: 2 })) {
    const wrapper = document.createElement("div");
    wrapper.className = "output-card";

    const label = document.createElement("div");
    label.className = "output-label";
    label.textContent = labelText;

    const value = document.createElement("div");
    value.className = "output-value";
    value.textContent = formatter(initialValue);

    wrapper.appendChild(label);
    wrapper.appendChild(value);
    parentElement.appendChild(wrapper);

    const setValue = (newValue) => {
        value.textContent = formatter(newValue);
        return newValue;
    };

    return {
        element: wrapper,
        label,
        value,
        setValue,
    };
}
