const display = document.getElementById("display");
const buttons = document.querySelectorAll(".buttons button");

let currentValue = "0";

function updateDisplay() {
    display.textContent = currentValue;
}

function calculate(expression) {
    const sanitized = expression.replace(/×/g, "*").replace(/÷/g, "/");

    if (!/^[\d.+\-*/\s]+$/.test(sanitized)) {
        return "Error";
    }

    try {
        const result = Function('"use strict"; return (' + sanitized + ")")();
        if (!Number.isFinite(result)) {
            return "Error";
        }
        return String(Math.round(result * 1e10) / 1e10);
    } catch {
        return "Error";
    }
}

buttons.forEach(function (btn) {
    btn.addEventListener("click", function () {
        const value = btn.getAttribute("data-value");
        const action = btn.getAttribute("data-action");

        if (currentValue === "Error") {
            currentValue = "0";
        }

        if (value) {
            if (currentValue === "0" && value !== ".") {
                currentValue = value;
            } else {
                currentValue += value;
            }
        }

        if (action === "clear") {
            currentValue = "0";
        }

        if (action === "back") {
            currentValue = currentValue.length > 1
                ? currentValue.slice(0, -1)
                : "0";
        }

        if (action === "equals") {
            currentValue = calculate(currentValue);
        }

        updateDisplay();
    });
});

updateDisplay();
